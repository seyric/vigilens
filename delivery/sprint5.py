"""Vigilens - Sprint 5 data delivery layer.

This module prepares the reusable, backend-ready, GIS-ready, AI-ready, and
Neo4j-ready datasets required by the final data sprint.
"""

from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
import csv
import json
import math
import re
from typing import Any

from sqlalchemy import func
from sqlalchemy.orm import Session

from config.settings import PROJECT_ROOT
from database.models import (
    Crime,
    CrimeCategory,
    CrimeEvidence,
    CrimeOfficer,
    CrimeSuspect,
    CrimeVehicle,
    CrimeVictim,
    CrimeWeapon,
    District,
    Evidence,
    FIR,
    Officer,
    PoliceStation,
    Suspect,
    SuspectAssociate,
    Vehicle,
    Victim,
    Weapon,
)
from database.queries import QueryService


ACTIVE_STATUSES = {"registered", "open", "pending", "in progress", "under investigation"}
SOLVED_STATUSES = {"closed", "solved", "final report", "charge sheet filed", "disposed"}
ARRESTED_STATUSES = {"arrested", "in custody", "detained"}


@dataclass(slots=True)
class Sprint5ExportBundle:
    """A named export produced by the delivery layer."""

    name: str
    path: Path
    row_count: int
    format: str


class Sprint5DataDeliveryLayer:
    """Prepare final-prototype delivery datasets for every downstream module."""

    def __init__(self, session: Session, output_dir: str | Path = "reports/sprint5") -> None:
        self.session = session
        self.query_service = QueryService(session)
        output_path = Path(output_dir)
        self.output_dir = output_path if output_path.is_absolute() else PROJECT_ROOT / output_path
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def build(self) -> dict[str, Any]:
        """Build the full sprint 5 delivery manifest in memory."""

        dashboard = self.dashboard_analytics_datasets()
        district = self.district_analytics()
        gis = self.gis_data_layer()
        trends = self.crime_trend_engine()
        neo4j = self.neo4j_export_layer()
        ai = self.ai_ready_data_layer()
        backend = self.backend_ready_outputs()
        optimization = self.query_optimization_assets()

        return {
            "dashboard": dashboard,
            "district": district,
            "gis": gis,
            "trends": trends,
            "neo4j": neo4j,
            "ai": ai,
            "backend": backend,
            "optimization": optimization,
        }

    def write_all(self) -> list[Sprint5ExportBundle]:
        """Write the full sprint 5 package to disk."""

        manifest = self.build()
        bundles: list[Sprint5ExportBundle] = []

        bundles.extend(
            self._write_named_json_bundle("dashboard_analytics", manifest["dashboard"], "dashboard_analytics.json")
        )
        bundles.extend(self._write_named_csv_bundle("district_analytics", manifest["district"], "district_analytics.csv"))
        bundles.extend(self._write_named_json_bundle("gis_layer", manifest["gis"], "gis_layer.json"))
        bundles.extend(self._write_named_json_bundle("trend_engine", manifest["trends"], "trend_engine.json"))
        bundles.extend(self._write_neo4j_bundles(manifest["neo4j"]))
        bundles.extend(self._write_named_json_bundle("ai_ready_data", manifest["ai"], "ai_ready_data.json"))
        bundles.extend(self._write_named_json_bundle("backend_ready_outputs", manifest["backend"], "backend_ready_outputs.json"))
        bundles.extend(self._write_named_json_bundle("query_optimizations", manifest["optimization"], "query_optimizations.json"))
        bundles.append(self._write_markdown_report(manifest))

        return bundles

    def dashboard_analytics_datasets(self) -> dict[str, Any]:
        """Dashboard-ready aggregate datasets."""

        total_crimes = self._count(Crime)
        total_firs = self._count(FIR)
        active_cases = self._count_firs_by_status(ACTIVE_STATUSES)
        solved_cases = self._count_firs_by_status(SOLVED_STATUSES)
        pending_cases = self._count_firs_by_status({"pending", "registered", "under investigation"})

        arrest_rate = self._arrest_rate()
        district_rows = self._district_metric_rows()
        high_risk_districts = sorted(district_rows, key=lambda row: row["risk_score"], reverse=True)[:5]

        return {
            "summary": {
                "total_crimes": total_crimes,
                "total_firs": total_firs,
                "active_cases": active_cases,
                "solved_cases": solved_cases,
                "pending_cases": pending_cases,
                "arrest_rate": arrest_rate,
                "high_risk_districts": [row["district_name"] for row in high_risk_districts],
                "crime_growth_rate": self._crime_growth_rate(),
            },
            "crime_category_distribution": self.query_service.crimes_by_category(),
            "monthly_crime_trends": self.query_service.monthly_crime_statistics(),
            "yearly_crime_trends": self._yearly_crime_trends(),
            "top_crime_districts": self.query_service.crimes_by_district()[:10],
            "crime_growth_by_month": self._monthly_growth_series(),
            "officer_workload": self.query_service.officer_workload(),
            "fir_registration_trends": self._monthly_fir_trends(),
        }

    def district_analytics(self) -> list[dict[str, Any]]:
        """District-level analytics for every district in the database."""

        district_rows = self._district_metric_rows()
        category_rows = self._district_category_rows()
        categories_by_district: dict[str, list[str]] = defaultdict(list)
        for row in category_rows:
            categories_by_district[row["district_name"]].append(row["category_name"])

        for row in district_rows:
            row["crime_categories"] = categories_by_district.get(row["district_name"], [])
        return district_rows

    def gis_data_layer(self) -> dict[str, Any]:
        """GIS-ready datasets, including GeoJSON exports and marker layers."""

        station_rows = self._station_rows()
        crime_rows = self._crime_location_rows()
        district_rows = self._district_boundary_rows()

        return {
            "heatmap_data": self._heatmap_data(station_rows, crime_rows),
            "crime_coordinates": crime_rows,
            "district_boundaries": district_rows,
            "police_station_coordinates": station_rows,
            "timeline_coordinates": self._timeline_coordinates(crime_rows),
            "cluster_datasets": self._cluster_datasets(crime_rows),
            "geojson_exports": {
                "district_boundaries": self._district_feature_collection(district_rows),
                "station_markers": self._station_feature_collection(station_rows),
                "crime_markers": self._crime_feature_collection(crime_rows),
            },
            "marker_datasets": {
                "station_markers": station_rows,
                "crime_markers": crime_rows,
            },
        }

    def crime_trend_engine(self) -> dict[str, Any]:
        """Reusable temporal and comparative crime trend outputs."""

        monthly = self.query_service.monthly_crime_statistics()
        yearly = self._yearly_crime_trends()
        category = self.query_service.crimes_by_category()
        district = self.query_service.crimes_by_district()

        return {
            "monthly_trends": monthly,
            "yearly_trends": yearly,
            "crime_categories": category,
            "district_comparisons": district,
            "officer_performance": self.query_service.officer_workload(),
            "crime_frequency": self._crime_frequency_series(monthly),
            "seasonal_crime_analysis": self._seasonal_analysis(),
        }

    def neo4j_export_layer(self) -> dict[str, Any]:
        """Graph-ready node and relationship exports for Neo4j import."""

        nodes = self._neo4j_nodes()
        relationships = self._neo4j_relationships()

        return {
            "nodes": nodes,
            "relationships": relationships,
            "csv_exports": {
                "nodes": nodes,
                "relationships": relationships,
            },
            "json_exports": {
                "nodes": nodes,
                "relationships": relationships,
            },
        }

    def ai_ready_data_layer(self) -> dict[str, Any]:
        """Clean, structured datasets for future AI and RAG workflows."""

        fir_rows = self._fir_ai_rows()
        return {
            "clean_fir_text": [row["clean_fir_text"] for row in fir_rows],
            "ocr_processed_fields": [
                {
                    "fir_number": row["fir_number"],
                    "complainant_name": row["complainant_name"],
                    "status": row["status"],
                    "district_name": row["district_name"],
                }
                for row in fir_rows
            ],
            "crime_metadata": self._crime_metadata_rows(),
            "evidence_metadata": self._evidence_metadata_rows(),
            "investigation_metadata": self._investigation_metadata_rows(),
            "historical_crime_records": self._historical_crime_records(),
            "district_statistics": self.district_analytics(),
            "structured_crime_summaries": self._structured_crime_summaries(),
            "rag_ready_datasets": fir_rows,
            "vector_ready_metadata": self._vector_ready_metadata(fir_rows),
            "feature_ready_datasets": self.query_service.ai_feature_inputs(),
        }

    def backend_ready_outputs(self) -> dict[str, Any]:
        """Reusable datasets for backend API consumption."""

        return {
            "dashboard_summary": self.dashboard_analytics_datasets()["summary"],
            "crime_search": self._crime_search_dataset(),
            "district_search": self._district_search_dataset(),
            "officer_search": self._officer_search_dataset(),
            "evidence_search": self._evidence_search_dataset(),
            "analytics_summary": {
                "crime_trends": self.crime_trend_engine(),
                "district_overview": self.district_analytics(),
            },
            "heatmap_data": self.gis_data_layer()["heatmap_data"],
            "investigation_timeline": self._investigation_timeline_dataset(),
        }

    def query_optimization_assets(self) -> dict[str, Any]:
        """Materialized views, indexes, and benchmark guidance."""

        return {
            "indexes": [
                "CREATE INDEX IF NOT EXISTS idx_firs_district_date ON firs (district_id, fir_date DESC);",
                "CREATE INDEX IF NOT EXISTS idx_crimes_fir_category ON crimes (fir_id, category_id);",
                "CREATE INDEX IF NOT EXISTS idx_crimes_reported_at ON crimes (reported_at DESC);",
                "CREATE INDEX IF NOT EXISTS idx_officers_district_station ON officers (district_id, station_id);",
                "CREATE INDEX IF NOT EXISTS idx_evidence_collected_by ON evidence (collected_by);",
            ],
            "materialized_views": [
                {
                    "name": "mv_dashboard_summary",
                    "sql": self._dashboard_summary_sql(),
                },
                {
                    "name": "mv_district_summary",
                    "sql": self._district_summary_sql(),
                },
            ],
            "aggregation_queries": {
                "district_crime_counts": self.query_service.crimes_by_district(),
                "category_crime_counts": self.query_service.crimes_by_category(),
                "monthly_crime_counts": self.query_service.monthly_crime_statistics(),
            },
            "grouped_queries": {
                "officer_workload": self.query_service.officer_workload(),
                "district_summary": self.query_service.district_summary(),
            },
            "filtering_queries": {
                "fir_search": self.query_service.fir_search(""),
                "district_filter_sql": "SELECT * FROM districts WHERE district_name ILIKE :search_text OR district_code ILIKE :search_text;",
            },
            "performance_benchmarks": [
                {"name": "dashboard_analytics", "rows_scanned": len(self.dashboard_analytics_datasets()["crime_category_distribution"])},
                {"name": "district_analytics", "rows_scanned": len(self.district_analytics())},
                {"name": "neo4j_exports", "rows_scanned": len(self.neo4j_export_layer()["nodes"])},
            ],
        }

    def _count(self, model: Any) -> int:
        return int(self.session.query(func.count()).select_from(model).scalar() or 0)

    def _count_firs_by_status(self, statuses: set[str]) -> int:
        normalized = {status.lower() for status in statuses}
        rows = self.session.query(FIR.status).all()
        return sum(1 for (status,) in rows if _normalize_text(status) in normalized)

    def _arrest_rate(self) -> float:
        suspects = self.session.query(CrimeSuspect.status).all()
        if not suspects:
            suspect_statuses = self.session.query(Suspect.status).all()
            total = len(suspect_statuses)
            arrested = sum(1 for (status,) in suspect_statuses if _normalize_text(status) in ARRESTED_STATUSES)
        else:
            total = len(suspects)
            arrested = sum(1 for (status,) in suspects if _normalize_text(status) in ARRESTED_STATUSES)
        if total == 0:
            return 0.0
        return round((arrested / total) * 100.0, 2)

    def _crime_growth_rate(self) -> float:
        yearly = self._yearly_crime_trends()
        if len(yearly) < 2:
            return 0.0
        previous = yearly[-2]["crime_count"]
        current = yearly[-1]["crime_count"]
        if previous == 0:
            return 0.0
        return round(((current - previous) / previous) * 100.0, 2)

    def _monthly_fir_trends(self) -> list[dict[str, Any]]:
        rows = self.session.query(FIR.fir_date).all()
        counts: dict[str, int] = defaultdict(int)
        for (fir_date,) in rows:
            if fir_date is None:
                continue
            key = fir_date.strftime("%Y-%m-01")
            counts[key] += 1
        return [{"month": month, "fir_count": count} for month, count in sorted(counts.items())]

    def _monthly_growth_series(self) -> list[dict[str, Any]]:
        monthly = self.query_service.monthly_crime_statistics()
        growth: list[dict[str, Any]] = []
        previous_count: int | None = None
        for row in monthly:
            count = int(row["crime_count"])
            if previous_count in (None, 0):
                rate = 0.0
            else:
                rate = round(((count - previous_count) / previous_count) * 100.0, 2)
            growth.append({"month": row["month"], "crime_count": count, "growth_rate": rate})
            previous_count = count
        return growth

    def _yearly_crime_trends(self) -> list[dict[str, Any]]:
        rows = self.session.query(Crime.reported_at, Crime.crime_id).all()
        counts: dict[int, int] = defaultdict(int)
        for reported_at, _crime_id in rows:
            if reported_at is None:
                continue
            counts[reported_at.year] += 1
        return [{"year": year, "crime_count": counts[year]} for year in sorted(counts)]

    def _district_metric_rows(self) -> list[dict[str, Any]]:
        district_rows = self.session.query(District).order_by(District.district_name).all()
        crime_counts = self._group_counts(
            self.session.query(District.district_name, func.count(Crime.crime_id))
            .select_from(District)
            .outerjoin(FIR, FIR.district_id == District.district_id)
            .outerjoin(Crime, Crime.fir_id == FIR.fir_id)
            .group_by(District.district_name)
        )
        fir_counts = self._group_counts(
            self.session.query(District.district_name, func.count(FIR.fir_id))
            .select_from(District)
            .outerjoin(FIR, FIR.district_id == District.district_id)
            .group_by(District.district_name)
        )
        solved_counts = self._group_counts(
            self.session.query(District.district_name, func.count(FIR.fir_id))
            .select_from(District)
            .outerjoin(FIR, FIR.district_id == District.district_id)
            .filter(func.lower(FIR.status).in_(sorted(SOLVED_STATUSES)))
            .group_by(District.district_name)
        )
        pending_counts = self._group_counts(
            self.session.query(District.district_name, func.count(FIR.fir_id))
            .select_from(District)
            .outerjoin(FIR, FIR.district_id == District.district_id)
            .filter(func.lower(FIR.status).in_(sorted(ACTIVE_STATUSES)))
            .group_by(District.district_name)
        )
        station_counts = self._group_counts(
            self.session.query(District.district_name, func.count(PoliceStation.station_id))
            .select_from(District)
            .outerjoin(PoliceStation, PoliceStation.district_id == District.district_id)
            .group_by(District.district_name)
        )
        officer_counts = self._group_counts(
            self.session.query(District.district_name, func.count(Officer.officer_id))
            .select_from(District)
            .outerjoin(Officer, Officer.district_id == District.district_id)
            .group_by(District.district_name)
        )
        suspect_counts = self._group_counts(
            self.session.query(District.district_name, func.count(Suspect.suspect_id))
            .select_from(District)
            .outerjoin(Suspect, Suspect.district_id == District.district_id)
            .group_by(District.district_name)
        )
        arrest_counts = self._group_counts(
            self.session.query(District.district_name, func.count(Suspect.suspect_id))
            .select_from(District)
            .outerjoin(Suspect, Suspect.district_id == District.district_id)
            .filter(func.lower(Suspect.status).in_(sorted(ARRESTED_STATUSES)))
            .group_by(District.district_name)
        )

        rows: list[dict[str, Any]] = []
        for district in district_rows:
            name = district.district_name
            crimes = crime_counts.get(name, 0)
            firs = fir_counts.get(name, 0)
            solved = solved_counts.get(name, 0)
            pending = pending_counts.get(name, 0)
            stations = station_counts.get(name, 0)
            officers = officer_counts.get(name, 0)
            suspects = suspect_counts.get(name, 0)
            arrested = arrest_counts.get(name, 0)
            crime_density = round(crimes / max(stations, 1), 2)
            arrest_rate = round((arrested / suspects) * 100.0, 2) if suspects else 0.0
            risk_score = round(
                min(
                    100.0,
                    (crimes * 2.0)
                    + (pending * 2.5)
                    + ((firs - solved) * 1.5)
                    + (crime_density * 5.0)
                    + ((officers - stations) * 0.5),
                ),
                2,
            )
            rows.append(
                {
                    "district_id": district.district_id,
                    "district_name": name,
                    "region": district.region,
                    "headquarters": district.headquarters,
                    "total_crimes": crimes,
                    "crime_categories": [],
                    "crime_growth": self._district_growth_rate(name),
                    "solved_cases": solved,
                    "active_cases": firs - solved,
                    "crime_density": crime_density,
                    "arrest_rate": arrest_rate,
                    "risk_score": risk_score,
                    "fir_count": firs,
                    "station_count": stations,
                    "officer_count": officers,
                }
            )
        return rows

    def _district_growth_rate(self, district_name: str) -> float:
        rows = (
            self.session.query(Crime.reported_at)
            .join(FIR, FIR.fir_id == Crime.fir_id)
            .join(District, District.district_id == FIR.district_id)
            .filter(District.district_name == district_name)
            .all()
        )
        year_counts: dict[int, int] = defaultdict(int)
        for (reported_at,) in rows:
            if reported_at is None:
                continue
            year_counts[reported_at.year] += 1
        if len(year_counts) < 2:
            return 0.0
        years = sorted(year_counts)
        previous = year_counts[years[-2]]
        current = year_counts[years[-1]]
        if previous == 0:
            return 0.0
        return round(((current - previous) / previous) * 100.0, 2)

    def _district_category_rows(self) -> list[dict[str, Any]]:
        rows = (
            self.session.query(District.district_name, CrimeCategory.category_name, func.count(Crime.crime_id))
            .select_from(District)
            .join(FIR, FIR.district_id == District.district_id)
            .join(Crime, Crime.fir_id == FIR.fir_id)
            .join(CrimeCategory, CrimeCategory.category_id == Crime.category_id)
            .group_by(District.district_name, CrimeCategory.category_name)
            .order_by(District.district_name, func.count(Crime.crime_id).desc())
            .all()
        )
        return [
            {"district_name": row[0], "category_name": row[1], "crime_count": int(row[2])}
            for row in rows
        ]

    def _station_rows(self) -> list[dict[str, Any]]:
        rows = (
            self.session.query(
                PoliceStation.station_id,
                PoliceStation.station_name,
                PoliceStation.station_code,
                PoliceStation.station_type,
                District.district_name,
                PoliceStation.latitude,
                PoliceStation.longitude,
            )
            .join(District, District.district_id == PoliceStation.district_id)
            .order_by(District.district_name, PoliceStation.station_name)
            .all()
        )
        return [
            {
                "station_id": row[0],
                "station_name": row[1],
                "station_code": row[2],
                "station_type": row[3],
                "district_name": row[4],
                "latitude": _to_number(row[5]),
                "longitude": _to_number(row[6]),
            }
            for row in rows
        ]

    def _crime_location_rows(self) -> list[dict[str, Any]]:
        rows = (
            self.session.query(
                Crime.crime_id,
                Crime.reported_at,
                FIR.fir_number,
                District.district_name,
                PoliceStation.station_name,
                PoliceStation.latitude,
                PoliceStation.longitude,
                CrimeCategory.category_name,
                Crime.severity,
            )
            .join(FIR, FIR.fir_id == Crime.fir_id)
            .join(District, District.district_id == FIR.district_id)
            .join(PoliceStation, PoliceStation.station_id == FIR.station_id)
            .join(CrimeCategory, CrimeCategory.category_id == Crime.category_id)
            .order_by(Crime.reported_at.desc().nullslast(), Crime.crime_id.desc())
            .all()
        )
        return [
            {
                "crime_id": row[0],
                "reported_at": _to_iso(row[1]),
                "fir_number": row[2],
                "district_name": row[3],
                "station_name": row[4],
                "latitude": _to_number(row[5]),
                "longitude": _to_number(row[6]),
                "category_name": row[7],
                "severity": row[8],
                "location_source": "police_station",
            }
            for row in rows
        ]

    def _district_boundary_rows(self) -> list[dict[str, Any]]:
        rows = self.session.query(District).order_by(District.district_name).all()
        return [
            {
                "district_id": district.district_id,
                "district_name": district.district_name,
                "region": district.region,
                "headquarters": district.headquarters,
                "boundary_geojson": _parse_json_text(district.boundary_geojson),
            }
            for district in rows
        ]

    def _district_feature_collection(self, district_rows: list[dict[str, Any]]) -> dict[str, Any]:
        features: list[dict[str, Any]] = []
        for row in district_rows:
            boundary = row["boundary_geojson"]
            if isinstance(boundary, dict) and boundary.get("type") == "Feature":
                feature = dict(boundary)
                feature.setdefault("properties", {})
                feature["properties"] = {
                    **feature["properties"],
                    "district_id": row["district_id"],
                    "district_name": row["district_name"],
                    "region": row["region"],
                    "headquarters": row["headquarters"],
                }
                features.append(feature)
            else:
                features.append(
                    {
                        "type": "Feature",
                        "properties": {
                            "district_id": row["district_id"],
                            "district_name": row["district_name"],
                            "region": row["region"],
                            "headquarters": row["headquarters"],
                        },
                        "geometry": boundary if isinstance(boundary, dict) else None,
                    }
                )
        return {"type": "FeatureCollection", "features": features}

    def _station_feature_collection(self, station_rows: list[dict[str, Any]]) -> dict[str, Any]:
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "station_id": row["station_id"],
                        "station_name": row["station_name"],
                        "station_code": row["station_code"],
                        "station_type": row["station_type"],
                        "district_name": row["district_name"],
                    },
                    "geometry": _point_geometry(row["longitude"], row["latitude"]),
                }
                for row in station_rows
            ],
        }

    def _crime_feature_collection(self, crime_rows: list[dict[str, Any]]) -> dict[str, Any]:
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "crime_id": row["crime_id"],
                        "fir_number": row["fir_number"],
                        "district_name": row["district_name"],
                        "station_name": row["station_name"],
                        "category_name": row["category_name"],
                        "severity": row["severity"],
                        "reported_at": row["reported_at"],
                    },
                    "geometry": _point_geometry(row["longitude"], row["latitude"]),
                }
                for row in crime_rows
            ],
        }

    def _timeline_coordinates(self, crime_rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
        timeline: list[dict[str, Any]] = []
        for row in crime_rows:
            timeline.append(
                {
                    "crime_id": row["crime_id"],
                    "fir_number": row["fir_number"],
                    "reported_at": row["reported_at"],
                    "district_name": row["district_name"],
                    "latitude": row["latitude"],
                    "longitude": row["longitude"],
                }
            )
        return timeline

    def _cluster_datasets(self, crime_rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
        clusters: dict[tuple[str, float | None, float | None], int] = defaultdict(int)
        for row in crime_rows:
            key = (row["district_name"], row["latitude"], row["longitude"])
            clusters[key] += 1
        return [
            {
                "district_name": district_name,
                "latitude": latitude,
                "longitude": longitude,
                "crime_count": crime_count,
            }
            for (district_name, latitude, longitude), crime_count in clusters.items()
        ]

    def _heatmap_data(
        self, station_rows: list[dict[str, Any]], crime_rows: list[dict[str, Any]]
    ) -> list[dict[str, Any]]:
        crime_counts: dict[str, int] = defaultdict(int)
        for row in crime_rows:
            crime_counts[row["station_name"]] += 1
        heatmap: list[dict[str, Any]] = []
        for row in station_rows:
            heatmap.append(
                {
                    "station_name": row["station_name"],
                    "district_name": row["district_name"],
                    "latitude": row["latitude"],
                    "longitude": row["longitude"],
                    "crime_count": crime_counts.get(row["station_name"], 0),
                }
            )
        return heatmap

    def _crime_frequency_series(self, monthly_rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return [
            {"period": row["month"], "crime_count": row["crime_count"]}
            for row in monthly_rows
        ]

    def _seasonal_analysis(self) -> list[dict[str, Any]]:
        rows = self.session.query(Crime.reported_at).all()
        seasons: dict[str, int] = defaultdict(int)
        for (reported_at,) in rows:
            if reported_at is None:
                continue
            month = reported_at.month
            if month in {12, 1, 2}:
                key = "winter"
            elif month in {3, 4, 5}:
                key = "summer"
            elif month in {6, 7, 8}:
                key = "monsoon"
            else:
                key = "post_monsoon"
            seasons[key] += 1
        return [{"season": season, "crime_count": count} for season, count in seasons.items()]

    def _fir_ai_rows(self) -> list[dict[str, Any]]:
        rows = (
            self.session.query(
                FIR.fir_id,
                FIR.fir_number,
                FIR.fir_date,
                FIR.complainant_name,
                FIR.complaint_details,
                FIR.status,
                District.district_name,
                PoliceStation.station_name,
                Officer.full_name,
            )
            .join(District, District.district_id == FIR.district_id)
            .join(PoliceStation, PoliceStation.station_id == FIR.station_id)
            .outerjoin(Officer, Officer.officer_id == FIR.investigating_officer_id)
            .order_by(FIR.fir_date.desc())
            .all()
        )
        return [
            {
                "fir_id": row[0],
                "fir_number": row[1],
                "fir_date": _to_iso(row[2]),
                "complainant_name": row[3],
                "complaint_details": row[4],
                "clean_fir_text": _clean_text(" ".join(filter(None, [row[1], row[3], row[4] or ""]))),
                "status": row[5],
                "district_name": row[6],
                "station_name": row[7],
                "investigating_officer": row[8],
            }
            for row in rows
        ]

    def _crime_metadata_rows(self) -> list[dict[str, Any]]:
        rows = (
            self.session.query(
                Crime.crime_id,
                FIR.fir_number,
                CrimeCategory.category_name,
                Crime.severity,
                District.district_name,
                Crime.reported_at,
            )
            .join(FIR, FIR.fir_id == Crime.fir_id)
            .join(CrimeCategory, CrimeCategory.category_id == Crime.category_id)
            .join(District, District.district_id == FIR.district_id)
            .all()
        )
        return [
            {
                "crime_id": row[0],
                "fir_number": row[1],
                "category_name": row[2],
                "severity": row[3],
                "district_name": row[4],
                "reported_at": _to_iso(row[5]),
            }
            for row in rows
        ]

    def _evidence_metadata_rows(self) -> list[dict[str, Any]]:
        rows = (
            self.session.query(
                Evidence.evidence_id,
                Evidence.evidence_type,
                Evidence.evidence_subtype,
                Evidence.storage_location,
                Officer.full_name,
            )
            .outerjoin(Officer, Officer.officer_id == Evidence.collected_by)
            .all()
        )
        return [
            {
                "evidence_id": row[0],
                "evidence_type": row[1],
                "evidence_subtype": row[2],
                "storage_location": row[3],
                "collected_by": row[4],
            }
            for row in rows
        ]

    def _investigation_metadata_rows(self) -> list[dict[str, Any]]:
        rows = (
            self.session.query(
                Crime.crime_id,
                Officer.full_name,
                PoliceStation.station_name,
                CrimeOfficer.role,
            )
            .join(CrimeOfficer, CrimeOfficer.crime_id == Crime.crime_id)
            .join(Officer, Officer.officer_id == CrimeOfficer.officer_id)
            .join(FIR, FIR.fir_id == Crime.fir_id)
            .join(PoliceStation, PoliceStation.station_id == FIR.station_id)
            .all()
        )
        return [
            {
                "crime_id": row[0],
                "officer_name": row[1],
                "station_name": row[2],
                "role": row[3],
            }
            for row in rows
        ]

    def _historical_crime_records(self) -> list[dict[str, Any]]:
        return self.query_service.ai_feature_inputs()

    def _structured_crime_summaries(self) -> list[dict[str, Any]]:
        rows = (
            self.session.query(
                Crime.crime_id,
                FIR.fir_number,
                CrimeCategory.category_name,
                District.district_name,
                FIR.status,
                Crime.severity,
            )
            .join(FIR, FIR.fir_id == Crime.fir_id)
            .join(CrimeCategory, CrimeCategory.category_id == Crime.category_id)
            .join(District, District.district_id == FIR.district_id)
            .all()
        )
        return [
            {
                "crime_id": row[0],
                "fir_number": row[1],
                "category_name": row[2],
                "district_name": row[3],
                "status": row[4],
                "severity": row[5],
                "summary_text": f"{row[2]} in {row[3]} with FIR {row[1]}",
            }
            for row in rows
        ]

    def _vector_ready_metadata(self, fir_rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return [
            {
                "id": row["fir_id"],
                "text": row["clean_fir_text"],
                "metadata": {
                    "fir_number": row["fir_number"],
                    "district_name": row["district_name"],
                    "status": row["status"],
                },
            }
            for row in fir_rows
        ]

    def _crime_search_dataset(self) -> list[dict[str, Any]]:
        return self.query_service.fir_search("")

    def _district_search_dataset(self) -> list[dict[str, Any]]:
        return self.query_service.district_summary()

    def _officer_search_dataset(self) -> list[dict[str, Any]]:
        rows = (
            self.session.query(Officer.officer_id, Officer.full_name, Officer.badge_number, Officer.rank, District.district_name)
            .outerjoin(District, District.district_id == Officer.district_id)
            .order_by(Officer.full_name)
            .all()
        )
        return [
            {
                "officer_id": row[0],
                "officer_name": row[1],
                "badge_number": row[2],
                "rank": row[3],
                "district_name": row[4],
            }
            for row in rows
        ]

    def _evidence_search_dataset(self) -> list[dict[str, Any]]:
        rows = self.session.query(Evidence).order_by(Evidence.evidence_type, Evidence.evidence_id).all()
        return [
            {
                "evidence_id": row.evidence_id,
                "evidence_type": row.evidence_type,
                "evidence_subtype": row.evidence_subtype,
                "storage_location": row.storage_location,
                "description": row.description,
            }
            for row in rows
        ]

    def _investigation_timeline_dataset(self) -> list[dict[str, Any]]:
        rows = (
            self.session.query(
                FIR.fir_number,
                FIR.fir_date,
                FIR.status,
                Officer.full_name,
                District.district_name,
            )
            .join(District, District.district_id == FIR.district_id)
            .outerjoin(Officer, Officer.officer_id == FIR.investigating_officer_id)
            .order_by(FIR.fir_date)
            .all()
        )
        return [
            {
                "fir_number": row[0],
                "fir_date": _to_iso(row[1]),
                "status": row[2],
                "investigating_officer": row[3],
                "district_name": row[4],
            }
            for row in rows
        ]

    def _neo4j_nodes(self) -> list[dict[str, Any]]:
        nodes: list[dict[str, Any]] = []
        for district in self.session.query(District).all():
            nodes.append(
                {
                    "node_id": f"district:{district.district_id}",
                    "label": "District",
                    "name": district.district_name,
                    "district_code": district.district_code,
                    "region": district.region,
                }
            )
        for station in self.session.query(PoliceStation).all():
            nodes.append(
                {
                    "node_id": f"station:{station.station_id}",
                    "label": "PoliceStation",
                    "name": station.station_name,
                    "station_code": station.station_code,
                    "station_type": station.station_type,
                    "district_id": station.district_id,
                }
            )
        for officer in self.session.query(Officer).all():
            nodes.append(
                {
                    "node_id": f"officer:{officer.officer_id}",
                    "label": "Officer",
                    "name": officer.full_name,
                    "badge_number": officer.badge_number,
                    "rank": officer.rank,
                    "district_id": officer.district_id,
                    "station_id": officer.station_id,
                }
            )
        for fir in self.session.query(FIR).all():
            nodes.append(
                {
                    "node_id": f"fir:{fir.fir_id}",
                    "label": "FIR",
                    "name": fir.fir_number,
                    "status": fir.status,
                    "district_id": fir.district_id,
                }
            )
        for crime in self.session.query(Crime).all():
            nodes.append(
                {
                    "node_id": f"crime:{crime.crime_id}",
                    "label": "Crime",
                    "crime_id": crime.crime_id,
                    "severity": crime.severity,
                }
            )
        for suspect in self.session.query(Suspect).all():
            nodes.append(
                {
                    "node_id": f"suspect:{suspect.suspect_id}",
                    "label": "Suspect",
                    "name": suspect.full_name,
                    "status": suspect.status,
                    "district_id": suspect.district_id,
                }
            )
        for victim in self.session.query(Victim).all():
            nodes.append(
                {
                    "node_id": f"victim:{victim.victim_id}",
                    "label": "Victim",
                    "name": victim.full_name,
                    "district_id": victim.district_id,
                }
            )
        for vehicle in self.session.query(Vehicle).all():
            nodes.append(
                {
                    "node_id": f"vehicle:{vehicle.vehicle_id}",
                    "label": "Vehicle",
                    "registration_number": vehicle.registration_number,
                    "vehicle_type": vehicle.vehicle_type,
                }
            )
        for weapon in self.session.query(Weapon).all():
            nodes.append(
                {
                    "node_id": f"weapon:{weapon.weapon_id}",
                    "label": "Weapon",
                    "weapon_type": weapon.weapon_type,
                    "weapon_subtype": weapon.weapon_subtype,
                }
            )
        for evidence in self.session.query(Evidence).all():
            nodes.append(
                {
                    "node_id": f"evidence:{evidence.evidence_id}",
                    "label": "Evidence",
                    "evidence_type": evidence.evidence_type,
                    "evidence_subtype": evidence.evidence_subtype,
                }
            )
        return nodes

    def _neo4j_relationships(self) -> list[dict[str, Any]]:
        relationships: list[dict[str, Any]] = []
        fir_to_district = {
            fir.fir_id: fir.district_id for fir in self.session.query(FIR).all()
        }
        fir_to_station = {
            fir.fir_id: fir.station_id for fir in self.session.query(FIR).all()
        }

        for crime in self.session.query(Crime).all():
            fir_id = crime.fir_id
            district_id = fir_to_district.get(fir_id)
            relationships.append(
                {
                    "start_node_id": f"crime:{crime.crime_id}",
                    "end_node_id": f"district:{district_id}" if district_id else None,
                    "type": "OCCURRED_AT",
                }
            )
            if fir_id in fir_to_station:
                relationships.append(
                    {
                        "start_node_id": f"crime:{crime.crime_id}",
                        "end_node_id": f"station:{fir_to_station[fir_id]}",
                        "type": "RECORDED_BY",
                    }
                )

        for crime_suspect in self.session.query(CrimeSuspect).all():
            relationships.append(
                {
                    "start_node_id": f"suspect:{crime_suspect.suspect_id}",
                    "end_node_id": f"crime:{crime_suspect.crime_id}",
                    "type": "COMMITTED",
                    "role": crime_suspect.role,
                    "status": crime_suspect.status,
                }
            )
            relationships.append(
                {
                    "start_node_id": f"crime:{crime_suspect.crime_id}",
                    "end_node_id": f"suspect:{crime_suspect.suspect_id}",
                    "type": "INVOLVES",
                    "role": crime_suspect.role,
                    "status": crime_suspect.status,
                }
            )

        for crime_victim in self.session.query(CrimeVictim).all():
            relationships.append(
                {
                    "start_node_id": f"crime:{crime_victim.crime_id}",
                    "end_node_id": f"victim:{crime_victim.victim_id}",
                    "type": "INVOLVES",
                    "relationship_to_suspect": crime_victim.relationship_to_suspect,
                }
            )

        for crime_vehicle in self.session.query(CrimeVehicle).all():
            relationships.append(
                {
                    "start_node_id": f"crime:{crime_vehicle.crime_id}",
                    "end_node_id": f"vehicle:{crime_vehicle.vehicle_id}",
                    "type": "USED",
                    "involvement_type": crime_vehicle.involvement_type,
                }
            )

        for crime_weapon in self.session.query(CrimeWeapon).all():
            relationships.append(
                {
                    "start_node_id": f"crime:{crime_weapon.crime_id}",
                    "end_node_id": f"weapon:{crime_weapon.weapon_id}",
                    "type": "USED",
                }
            )

        for crime_evidence in self.session.query(CrimeEvidence).all():
            relationships.append(
                {
                    "start_node_id": f"crime:{crime_evidence.crime_id}",
                    "end_node_id": f"evidence:{crime_evidence.evidence_id}",
                    "type": "INVOLVES",
                }
            )

        for crime_officer in self.session.query(CrimeOfficer).all():
            relationships.append(
                {
                    "start_node_id": f"officer:{crime_officer.officer_id}",
                    "end_node_id": f"crime:{crime_officer.crime_id}",
                    "type": "ASSIGNED_TO",
                    "role": crime_officer.role,
                }
            )

        for officer in self.session.query(Officer).all():
            if officer.station_id:
                relationships.append(
                    {
                        "start_node_id": f"officer:{officer.officer_id}",
                        "end_node_id": f"station:{officer.station_id}",
                        "type": "ASSIGNED_TO",
                    }
                )

        for suspect_associate in self.session.query(SuspectAssociate).all():
            relationships.append(
                {
                    "start_node_id": f"suspect:{suspect_associate.suspect_id}",
                    "end_node_id": f"suspect:{suspect_associate.associate_id}",
                    "type": "ASSOCIATED_WITH",
                    "relationship_type": suspect_associate.relationship_type,
                    "notes": suspect_associate.notes,
                }
            )

        return relationships

    def _dashboard_summary_sql(self) -> str:
        return (
            "SELECT "
            "COUNT(DISTINCT crimes.crime_id) AS total_crimes, "
            "COUNT(DISTINCT firs.fir_id) AS total_firs, "
            "SUM(CASE WHEN lower(firs.status) IN ('registered','open','pending','in progress','under investigation') THEN 1 ELSE 0 END) AS active_cases "
            "FROM crimes "
            "JOIN firs ON firs.fir_id = crimes.fir_id;"
        )

    def _district_summary_sql(self) -> str:
        return (
            "SELECT districts.district_name, "
            "COUNT(DISTINCT firs.fir_id) AS fir_count, "
            "COUNT(DISTINCT crimes.crime_id) AS crime_count "
            "FROM districts "
            "LEFT JOIN firs ON firs.district_id = districts.district_id "
            "LEFT JOIN crimes ON crimes.fir_id = firs.fir_id "
            "GROUP BY districts.district_name;"
        )

    def _group_counts(self, query: Any) -> dict[str, int]:
        return {row[0]: int(row[1]) for row in query.all()}

    def _write_named_json_bundle(self, name: str, payload: Any, filename: str) -> list[Sprint5ExportBundle]:
        path = self.output_dir / filename
        path.write_text(json.dumps(payload, indent=2, default=_json_default), encoding="utf-8")
        return [Sprint5ExportBundle(name=name, path=path, row_count=_count_rows(payload), format="json")]

    def _write_named_csv_bundle(self, name: str, rows: list[dict[str, Any]], filename: str) -> list[Sprint5ExportBundle]:
        path = self.output_dir / filename
        _write_csv(path, rows)
        return [Sprint5ExportBundle(name=name, path=path, row_count=len(rows), format="csv")]

    def _write_neo4j_bundles(self, payload: dict[str, Any]) -> list[Sprint5ExportBundle]:
        bundles: list[Sprint5ExportBundle] = []
        nodes_path = self.output_dir / "neo4j_nodes.csv"
        rels_path = self.output_dir / "neo4j_relationships.csv"
        _write_csv(nodes_path, payload["nodes"])
        _write_csv(rels_path, payload["relationships"])
        bundles.append(
            Sprint5ExportBundle(name="neo4j_nodes", path=nodes_path, row_count=len(payload["nodes"]), format="csv")
        )
        bundles.append(
            Sprint5ExportBundle(
                name="neo4j_relationships",
                path=rels_path,
                row_count=len(payload["relationships"]),
                format="csv",
            )
        )
        json_path = self.output_dir / "neo4j_exports.json"
        json_path.write_text(json.dumps(payload, indent=2, default=_json_default), encoding="utf-8")
        bundles.append(
            Sprint5ExportBundle(name="neo4j_exports", path=json_path, row_count=len(payload["nodes"]), format="json")
        )
        return bundles

    def _write_markdown_report(self, manifest: dict[str, Any]) -> Sprint5ExportBundle:
        path = self.output_dir / "sprint5_delivery_report.md"
        lines = [
            "# Sprint 5 Data Delivery Layer Report",
            "",
            "## Summary",
            f"- Dashboard datasets: {len(manifest['dashboard']['crime_category_distribution'])} category rows",
            f"- District analytics: {len(manifest['district'])} districts",
            f"- GIS rows: {len(manifest['gis']['crime_coordinates'])} crime locations",
            f"- Neo4j nodes: {len(manifest['neo4j']['nodes'])}",
            f"- Neo4j relationships: {len(manifest['neo4j']['relationships'])}",
            f"- AI records: {len(manifest['ai']['rag_ready_datasets'])}",
            "",
            "## Delivered Files",
        ]
        lines.extend(
            [
                "- dashboard_analytics.json",
                "- district_analytics.csv",
                "- gis_layer.json",
                "- trend_engine.json",
                "- neo4j_nodes.csv",
                "- neo4j_relationships.csv",
                "- neo4j_exports.json",
                "- ai_ready_data.json",
                "- backend_ready_outputs.json",
                "- query_optimizations.json",
            ]
        )
        path.write_text("\n".join(lines), encoding="utf-8")
        return Sprint5ExportBundle(name="sprint5_report", path=path, row_count=1, format="md")


def _count_rows(payload: Any) -> int:
    if isinstance(payload, list):
        return len(payload)
    if isinstance(payload, dict):
        return len(payload)
    return 1


def _clean_text(value: str) -> str:
    text = value.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _normalize_text(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip().lower()


def _to_iso(value: Any) -> Any:
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    return value


def _to_number(value: Any) -> float | None:
    if value in (None, ""):
        return None
    try:
        return round(float(value), 6)
    except (TypeError, ValueError):
        return None


def _parse_json_text(value: Any) -> Any:
    if value in (None, ""):
        return None
    if isinstance(value, (dict, list)):
        return value
    try:
        return json.loads(value)
    except (TypeError, ValueError, json.JSONDecodeError):
        return value


def _json_default(value: Any) -> Any:
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, Path):
        return str(value)
    return value


def _point_geometry(longitude: Any, latitude: Any) -> dict[str, Any] | None:
    x = _to_number(longitude)
    y = _to_number(latitude)
    if x is None or y is None:
        return None
    return {"type": "Point", "coordinates": [x, y]}


def _write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        path.write_text("", encoding="utf-8")
        return
    headers = sorted({key for row in rows for key in row.keys()})
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow({key: _csv_value(row.get(key)) for key in headers})


def _csv_value(value: Any) -> Any:
    if isinstance(value, (dict, list)):
        return json.dumps(value, default=_json_default)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, float) and math.isnan(value):
        return ""
    return value
