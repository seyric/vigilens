"""Vigilens - Integration interfaces for downstream platform modules."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from sqlalchemy.orm import Session

from database.queries import QueryService


@dataclass(slots=True)
class BackendDataInterfaces:
    """Prepared database services for backend consumption."""

    query_service: QueryService

    def crime_lookup(self) -> list[dict[str, Any]]:
        return self.query_service.fir_search("")

    def district_overview(self) -> list[dict[str, Any]]:
        return self.query_service.district_summary()


@dataclass(slots=True)
class AnalyticsDataInterfaces:
    """Prepared source layers for KPI and trend analysis."""

    query_service: QueryService

    def kpi_sources(self) -> dict[str, list[dict[str, Any]]]:
        return {
            "monthly_crime_statistics": self.query_service.monthly_crime_statistics(),
            "crimes_by_district": self.query_service.crimes_by_district(),
            "crimes_by_category": self.query_service.crimes_by_category(),
        }


@dataclass(slots=True)
class GISDataInterfaces:
    """Location and heatmap-friendly outputs for GIS consumers."""

    query_service: QueryService

    def heatmap_sources(self) -> list[dict[str, Any]]:
        return self.query_service.district_heatmap_data()


@dataclass(slots=True)
class Neo4jExportInterfaces:
    """Relationship exports for graph loading workflows."""

    query_service: QueryService

    def relationship_rows(self) -> list[dict[str, Any]]:
        return self.query_service.export_relationship_rows()

    def graph_payload(self) -> dict[str, list[dict[str, Any]]]:
        return self.query_service.graph_export()


@dataclass(slots=True)
class AIDataInterfaces:
    """Feature-engineering sources for future ML or RAG workflows."""

    query_service: QueryService

    def feature_rows(self) -> list[dict[str, Any]]:
        return self.query_service.ai_feature_inputs()


class DataPlatformInterfaces:
    """Convenience wrapper that exposes the sprint 4 integration surfaces."""

    def __init__(self, session: Session) -> None:
        query_service = QueryService(session)
        self.backend = BackendDataInterfaces(query_service)
        self.analytics = AnalyticsDataInterfaces(query_service)
        self.gis = GISDataInterfaces(query_service)
        self.neo4j = Neo4jExportInterfaces(query_service)
        self.ai = AIDataInterfaces(query_service)


class DatabaseIntegrationLayer(DataPlatformInterfaces):
    """Backward-compatible alias for the platform integration wrapper."""
