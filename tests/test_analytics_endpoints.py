import os
import pytest

# Configure environment variables before importing FastAPI app
os.environ["SECRET_KEY"] = "Vigilens-ai-integration-test-key-32-chars-long"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"
os.environ["GEMINI_API_KEY"] = "mock-gemini-key-for-testing"

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.main import app
from database.connection import get_db
from backend.auth.dependencies import get_current_active_user
from backend.auth.models import CurrentUser, Roles
from database.models import Base, Suspect, SuspectAssociate
from tests.test_database.helpers import seed_minimum_crime_graph

client = TestClient(app)

@pytest.fixture()
def db_session(tmp_path):
    db_file = tmp_path / "test_analytics_endpoints.db"
    engine = create_engine(f"sqlite:///{db_file}", future=True)
    Base.metadata.create_all(bind=engine)
    
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture(autouse=True)
def override_db(db_session):
    app.dependency_overrides[get_db] = lambda: db_session
    yield
    app.dependency_overrides.clear()


def test_analytics_dashboard_stats(db_session):
    seed_minimum_crime_graph(db_session)
    
    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sys-admin",
        role=Roles.SYSTEM_ADMIN,
        is_active=True
    )

    response = client.get("/analytics/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_firs"] == 1
    assert data["total_crimes"] == 1
    assert data["total_officers"] == 1


def test_analytics_dashboard_breakdowns(db_session):
    seed_minimum_crime_graph(db_session)
    
    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sys-admin",
        role=Roles.SYSTEM_ADMIN,
        is_active=True
    )

    # Crimes by district
    res_dist = client.get("/analytics/dashboard/crimes-by-district")
    assert res_dist.status_code == 200
    assert len(res_dist.json()) == 1
    assert res_dist.json()[0]["district_name"] == "Central"

    # Crimes by category
    res_cat = client.get("/analytics/dashboard/crimes-by-category")
    assert res_cat.status_code == 200
    assert len(res_cat.json()) == 1
    assert res_cat.json()[0]["category_name"] == "Theft"

    # Monthly stats
    res_month = client.get("/analytics/dashboard/monthly-stats")
    assert res_month.status_code == 200
    assert len(res_month.json()) == 1

    # Officer workload
    res_work = client.get("/analytics/dashboard/officer-workload")
    assert res_work.status_code == 200
    assert len(res_work.json()) == 1
    assert res_work.json()[0]["officer_name"] == "Asha Kumar"


def test_analytics_gis_endpoints(db_session):
    seed_minimum_crime_graph(db_session)
    
    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sys-admin",
        role=Roles.SYSTEM_ADMIN,
        is_active=True
    )

    # Heatmap
    res_heat = client.get("/analytics/gis/heatmap")
    assert res_heat.status_code == 200
    assert len(res_heat.json()) == 1

    # Clustering (Central station coords are None by default in seed helper, let's update them)
    from database.models import PoliceStation
    station = db_session.query(PoliceStation).first()
    station.latitude = "12.97"
    station.longitude = "77.59"
    db_session.commit()

    res_clust = client.get("/analytics/gis/clustering")
    assert res_clust.status_code == 200
    assert len(res_clust.json()) == 1
    assert res_clust.json()[0]["latitude"] == 12.97


def test_analytics_network_suspects(db_session):
    graph = seed_minimum_crime_graph(db_session)
    
    # Seed suspects and associations
    s1 = Suspect(suspect_id="s1", full_name="John Doe", district_id=graph["district"].district_id)
    s2 = Suspect(suspect_id="s2", full_name="Jane Smith", district_id=graph["district"].district_id)
    assoc = SuspectAssociate(suspect_id="s1", associate_id="s2", relationship_type="Co-conspirator")
    db_session.add_all([s1, s2, assoc])
    db_session.commit()

    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sys-admin",
        role=Roles.SYSTEM_ADMIN,
        is_active=True
    )

    response = client.get("/analytics/network/suspects")
    assert response.status_code == 200
    data = response.json()
    assert len(data["nodes"]) == 2
    assert len(data["edges"]) == 1
    assert data["edges"][0]["relationship"] == "Co-conspirator"


def test_analytics_global_search(db_session):
    seed_minimum_crime_graph(db_session)
    
    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sys-admin",
        role=Roles.SYSTEM_ADMIN,
        is_active=True
    )

    response = client.get("/analytics/search?q=theft")
    assert response.status_code == 200
    data = response.json()
    assert len(data["firs"]) == 1
    assert len(data["crimes"]) == 1
