from __future__ import annotations

from database.queries import QueryService

from tests.test_database.helpers import seed_minimum_crime_graph


def test_query_service_returns_platform_ready_views(session) -> None:
    seed_minimum_crime_graph(session)
    service = QueryService(session)

    assert service.crimes_by_district()[0]["district_name"] == "Central"
    assert service.crimes_by_category()[0]["category_name"] == "Theft"
    assert service.monthly_crime_statistics()[0]["crime_count"] == 1
    assert service.officer_workload()[0]["assigned_firs"] == 1
    assert service.fir_search("market")[0]["fir_number"] == "FIR-2024-001"
    assert service.district_summary()[0]["crimes"] == 1
    assert service.export_relationship_rows()[0]["category_name"] == "Theft"
    assert service.ai_feature_inputs()[0]["station_type"] == "HQ"

