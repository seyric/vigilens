from __future__ import annotations

from types import SimpleNamespace

from sqlalchemy import inspect

from database.models import User
from database.queries import QueryService
from database.repositories import CrimeRepository, FIRRepository
from tests.test_database.helpers import seed_sprint5_delivery_graph


def test_user_model_exposes_authentication_contract() -> None:
    columns = set(inspect(User).columns.keys())
    assert {
        "user_id",
        "username",
        "password_hash",
        "district_id",
        "station_id",
        "is_active",
    }.issubset(columns)
    assert hasattr(User, "role")


def test_repository_and_query_service_apply_geographic_scope(session) -> None:
    payload = seed_sprint5_delivery_graph(session)
    central, south = payload["districts"]
    _, south_station = payload["stations"]

    district_user = SimpleNamespace(role=3, district_id=central.district_id, station_id=None)
    station_user = SimpleNamespace(role=4, district_id=south.district_id, station_id=south_station.station_id)

    fir_repo = FIRRepository(session)
    crime_repo = CrimeRepository(session)
    assert len(fir_repo.list_by_district(central.district_id, district_user)) == 1
    assert fir_repo.get_by_number("FIR-2025-014", district_user) is None
    assert len(crime_repo.get_recent(current_user=station_user)) == 1
    assert crime_repo.get_recent(current_user=station_user)[0].fir.station_id == south_station.station_id

    scoped_service = QueryService(session, current_user=district_user)
    assert scoped_service.crimes_by_district() == [{"district_name": "Central", "crime_count": 1}]
    assert scoped_service.fir_search("assault") == []


def test_graph_export_matches_frontend_shape(session) -> None:
    seed_sprint5_delivery_graph(session)
    graph = QueryService(session).graph_export()
    assert {"nodes", "edges"} == set(graph)
    assert {"id", "label", "status"}.issubset(graph["nodes"][0])
    assert {"source", "target", "relationship"}.issubset(graph["edges"][0])
