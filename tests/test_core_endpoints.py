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
from database.models import Base, District, PoliceStation, Officer, FIR, Crime, Evidence
from tests.test_database.helpers import seed_minimum_crime_graph

client = TestClient(app)

# Setup a clean test engine and Session
@pytest.fixture()
def db_session(tmp_path):
    db_file = tmp_path / "test_core_endpoints.db"
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


def test_core_firs_as_system_admin(db_session):
    # Seed db
    seed_minimum_crime_graph(db_session)
    
    # Mock system admin user
    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sys-admin",
        role=Roles.SYSTEM_ADMIN,
        is_active=True
    )

    response = client.get("/core/firs")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["fir_number"] == "FIR-2024-001"


def test_core_firs_as_sho_authorized(db_session):
    graph = seed_minimum_crime_graph(db_session)
    
    # Mock SHO with same station id
    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sho-user",
        role=Roles.STATION_HOUSE_OFFICER,
        station_id=graph["station"].station_id,
        district_id=graph["district"].district_id,
        is_active=True
    )

    response = client.get("/core/firs")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_core_firs_as_sho_unauthorized(db_session):
    seed_minimum_crime_graph(db_session)
    
    # Mock SHO with different station id
    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sho-user-diff",
        role=Roles.STATION_HOUSE_OFFICER,
        station_id="diff-station-uuid",
        district_id="diff-district-uuid",
        is_active=True
    )

    response = client.get("/core/firs")
    assert response.status_code == 200
    assert len(response.json()) == 0


def test_core_fir_details_unauthorized(db_session):
    graph = seed_minimum_crime_graph(db_session)
    fir_id = graph["fir"].fir_id

    # Mock SHO with different station id to verify geographical check
    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sho-user-diff",
        role=Roles.STATION_HOUSE_OFFICER,
        station_id="diff-station-uuid",
        district_id="diff-district-uuid",
        is_active=True
    )

    response = client.get(f"/core/firs/{fir_id}")
    assert response.status_code == 403
    assert "geographical scoping" in response.json()["detail"]


def test_core_crimes_filtering(db_session):
    seed_minimum_crime_graph(db_session)
    
    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sys-admin",
        role=Roles.SYSTEM_ADMIN,
        is_active=True
    )

    response = client.get("/core/crimes")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["crime_description"] == "Wallet theft"


def test_core_districts(db_session):
    graph = seed_minimum_crime_graph(db_session)
    dist_id = graph["district"].district_id

    # Enforce district scoping for non-admins
    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sho-user",
        role=Roles.STATION_HOUSE_OFFICER,
        district_id=dist_id,
        is_active=True
    )

    response = client.get("/core/districts")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["district_name"] == "Central"

    # Request diff district
    response = client.get("/core/districts/diff-district-uuid")
    assert response.status_code == 403
