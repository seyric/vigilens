"""Vigilens - Query services for analytics and backend integration."""

from __future__ import annotations

from typing import Any

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from database.models import (
    Crime,
    CrimeCategory,
    District,
    FIR,
    Officer,
    PoliceStation,
    Suspect,
    SuspectAssociate,
)
from database.repositories import BaseRepository


class QueryService:
    """Optimized, reusable query layer for downstream consumers."""

    def __init__(self, session: Session, current_user: Any | None = None) -> None:
        self.session = session
        self.current_user = current_user

    def _scope(self):
        level = BaseRepository._role_level(self.current_user) if self.current_user is not None else None
        if level in (3, 4, 5):
            field = FIR.district_id if level == 3 else FIR.station_id
            value = getattr(self.current_user, "district_id" if level == 3 else "station_id", None)
            return field, value
        return None

    def _apply_case_scope(self, query):
        scope = self._scope()
        return query if scope is None else query.filter(scope[0] == scope[1])

    def _month_expression(self):
        dialect = self.session.bind.dialect.name if self.session.bind is not None else "sqlite"
        if dialect == "postgresql":
            return func.date_trunc("month", Crime.reported_at)
        return func.strftime("%Y-%m-01", Crime.reported_at)

    def crimes_by_district(self) -> list[dict[str, Any]]:
        query = (
            self.session.query(
                District.district_name,
                func.count(Crime.crime_id).label("crime_count"),
            )
            .join(FIR, FIR.district_id == District.district_id)
            .join(Crime, Crime.fir_id == FIR.fir_id)
            .group_by(District.district_name)
            .order_by(func.count(Crime.crime_id).desc())
        )
        result = self._apply_case_scope(query).all()
        return [dict(district_name=row[0], crime_count=int(row[1])) for row in result]

    def crimes_by_category(self) -> list[dict[str, Any]]:
        query = (
            self.session.query(
                CrimeCategory.category_name,
                func.count(Crime.crime_id).label("crime_count"),
            )
            .join(Crime, Crime.category_id == CrimeCategory.category_id)
            .join(FIR, FIR.fir_id == Crime.fir_id)
            .group_by(CrimeCategory.category_name)
            .order_by(func.count(Crime.crime_id).desc())
        )
        result = self._apply_case_scope(query).all()
        return [dict(category_name=row[0], crime_count=int(row[1])) for row in result]

    def monthly_crime_statistics(self) -> list[dict[str, Any]]:
        month_expr = self._month_expression()
        query = (
            self.session.query(
                month_expr.label("month"),
                func.count(Crime.crime_id).label("crime_count"),
            )
            .join(FIR, FIR.fir_id == Crime.fir_id)
            .group_by(month_expr)
            .order_by(month_expr)
        )
        result = self._apply_case_scope(query).all()

        rows: list[dict[str, Any]] = []
        for row in result:
            month_value = row[0]
            if hasattr(month_value, "isoformat"):
                month_value = month_value.isoformat()
            rows.append({"month": month_value, "crime_count": int(row[1])})
        return rows

    def officer_workload(self) -> list[dict[str, Any]]:
        query = (
            self.session.query(
                Officer.full_name,
                func.count(FIR.fir_id).label("assigned_firs"),
            )
            .join(FIR, FIR.investigating_officer_id == Officer.officer_id)
            .group_by(Officer.full_name)
            .order_by(func.count(FIR.fir_id).desc())
        )
        result = self._apply_case_scope(query).all()
        return [dict(officer_name=row[0], assigned_firs=int(row[1])) for row in result]

    def fir_search(self, search_text: str) -> list[dict[str, Any]]:
        pattern = f"%{search_text}%"
        query = (
            self.session.query(FIR)
            .filter(or_(FIR.complaint_details.ilike(pattern), FIR.fir_number.ilike(pattern), FIR.complainant_name.ilike(pattern)))
        )
        results = self._apply_case_scope(query).limit(50).all()
        return [
            {
                "fir_id": fir.fir_id,
                "fir_number": fir.fir_number,
                "complainant_name": fir.complainant_name,
                "status": fir.status,
            }
            for fir in results
        ]

    def district_summary(self) -> list[dict[str, Any]]:
        query = (
            self.session.query(
                District.district_name,
                func.count(func.distinct(FIR.fir_id)).label("firs"),
                func.count(func.distinct(Crime.crime_id)).label("crimes"),
            )
            .outerjoin(FIR, FIR.district_id == District.district_id)
            .outerjoin(Crime, Crime.fir_id == FIR.fir_id)
            .group_by(District.district_id)
            .order_by(District.district_name)
        )
        result = self._apply_case_scope(query).all()
        return [dict(district_name=row[0], firs=int(row[1]), crimes=int(row[2])) for row in result]

    def district_heatmap_data(self) -> list[dict[str, Any]]:
        query = (
            self.session.query(
                District.district_name,
                District.boundary_geojson,
                func.count(FIR.fir_id).label("firs"),
            )
            .outerjoin(FIR, FIR.district_id == District.district_id)
            .group_by(District.district_name, District.boundary_geojson)
            .order_by(func.count(FIR.fir_id).desc())
        )
        result = self._apply_case_scope(query).all()
        rows = [
            {
                "district_name": row[0],
                "boundary_geojson": row[1],
                "firs": int(row[2]),
                "stations": [],
            }
            for row in result
        ]
        if rows:
            stations = self.session.query(PoliceStation).all()
            by_district = {}
            for station in stations:
                by_district.setdefault(station.district.district_name if station.district else None, []).append(
                    {
                        "station_id": station.station_id,
                        "station_name": station.station_name,
                        "latitude": station.latitude,
                        "longitude": station.longitude,
                    }
                )
            for row in rows:
                row["stations"] = by_district.get(row["district_name"], [])
        return rows

    def export_relationship_rows(self) -> list[dict[str, Any]]:
        query = (
            self.session.query(
                FIR.fir_number,
                Crime.crime_id,
                CrimeCategory.category_name,
                District.district_name,
            )
            .join(Crime, Crime.fir_id == FIR.fir_id)
            .join(CrimeCategory, Crime.category_id == CrimeCategory.category_id)
            .join(District, District.district_id == FIR.district_id)
        )
        result = self._apply_case_scope(query).all()
        return [
            {
                "fir_number": row[0],
                "crime_id": row[1],
                "category_name": row[2],
                "district_name": row[3],
            }
            for row in result
        ]

    def ai_feature_inputs(self) -> list[dict[str, Any]]:
        query = (
            self.session.query(
                Crime.crime_id,
                Crime.severity,
                Crime.reported_at,
                CrimeCategory.category_name,
                District.district_name,
                PoliceStation.station_type,
            )
            .join(FIR, FIR.fir_id == Crime.fir_id)
            .join(CrimeCategory, CrimeCategory.category_id == Crime.category_id)
            .join(District, District.district_id == FIR.district_id)
            .join(PoliceStation, PoliceStation.station_id == FIR.station_id)
        )
        result = self._apply_case_scope(query).all()
        return [
            {
                "crime_id": row[0],
                "severity": row[1],
                "reported_at": row[2].isoformat() if hasattr(row[2], "isoformat") else row[2],
                "category_name": row[3],
                "district_name": row[4],
                "station_type": row[5],
            }
            for row in result
        ]

    def officer_assignment_map(self) -> list[dict[str, Any]]:
        query = (
            self.session.query(
                Officer.officer_id,
                Officer.full_name,
                FIR.fir_number,
                FIR.status,
            )
            .join(FIR, FIR.investigating_officer_id == Officer.officer_id)
            .order_by(Officer.full_name, FIR.fir_number)
        )
        result = self._apply_case_scope(query).all()
        return [
            {
                "officer_id": row[0],
                "officer_name": row[1],
                "fir_number": row[2],
                "status": row[3],
            }
            for row in result
        ]

    def graph_export(self) -> dict[str, list[dict[str, Any]]]:
        """Return Neo4j-ready suspect nodes and association edges."""
        suspects = self.session.query(Suspect).all()
        nodes = [
            {"id": suspect.suspect_id, "label": suspect.full_name, "status": suspect.status}
            for suspect in suspects
        ]
        associations = self.session.query(SuspectAssociate).all()
        edges = [
            {
                "source": association.suspect_id,
                "target": association.associate_id,
                "relationship": association.relationship_type,
                "notes": association.notes,
            }
            for association in associations
        ]
        return {"nodes": nodes, "edges": edges}

    def export_graph(self) -> dict[str, list[dict[str, Any]]]:
        """Backward-compatible alias for graph export consumers."""
        return self.graph_export()
