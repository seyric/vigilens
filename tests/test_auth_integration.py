# Integration tests for Vigilens backend/auth.

import os
from datetime import datetime, timezone, timedelta
import pytest
from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, Column, String, ForeignKey
from sqlalchemy.orm import sessionmaker, Session

# Set environment variables for testing
os.environ["SECRET_KEY"] = "Vigilens-ai-integration-test-key-32-chars-long"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"

# Dynamically patch User model to expose the expected contract for database integration testing
from database.models import User, Base, Role, District, PoliceStation, Officer
if not hasattr(User, "password_hash"):
    User.password_hash = Column("password_hash", String(255), nullable=True)
if not hasattr(User, "station_id"):
    User.station_id = Column("station_id", String(36), ForeignKey("police_stations.station_id"), nullable=True)

# Imports from auth module
from backend.auth.password import hash_password, verify_password
from backend.auth.jwt_handler import create_access_token, verify_access_token, ExpiredTokenError, InvalidTokenError
from backend.auth.models import Roles, Permission, TokenPayload, CurrentUser
from backend.auth.permissions import has_permission, can_access_district, can_access_station
from backend.auth.exceptions import InvalidCredentialsError, InactiveUserError, InsufficientPermissionError
from backend.auth.router import auth_router
from backend.auth.dependencies import get_current_user
from database.connection import get_db

# Initialize FastAPI test app
app = FastAPI()
app.include_router(auth_router)

# Register exception handlers on the test app to map exceptions to HTTP status codes
@app.exception_handler(InvalidTokenError)
@app.exception_handler(ExpiredTokenError)
def invalid_token_handler(request, exc):
    return JSONResponse(status_code=401, content={"detail": str(exc)})


@app.exception_handler(InactiveUserError)
def inactive_user_handler(request, exc):
    return JSONResponse(status_code=403, content={"detail": str(exc)})


@app.exception_handler(InsufficientPermissionError)
def insufficient_permission_handler(request, exc):
    return JSONResponse(status_code=403, content={"detail": str(exc)})


client = TestClient(app)


@pytest.fixture()
def db_session(tmp_path):
    """Creates a clean SQLite database session for each test."""
    db_file = tmp_path / "test_auth_integration.db"
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
def override_database_dependency(db_session):
    """Overrides the FastAPI get_db dependency to use the test session."""
    app.dependency_overrides[get_db] = lambda: db_session
    yield
    app.dependency_overrides.clear()


# ==============================================================================
# Password Tests
# ==============================================================================

def test_password_hashing_and_verification():
    raw_password = "SecurePassword123!"
    hashed = hash_password(raw_password)
    
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


# ==============================================================================
# JWT Tests
# ==============================================================================

def test_jwt_creation_and_verification():
    payload = TokenPayload(
        sub="user-uuid-12345",
        role_id=Roles.STATION_HOUSE_OFFICER,
        district_id="district-uuid-1",
        station_id="station-uuid-101"
    )
    token = create_access_token(payload)
    decoded = verify_access_token(token)
    
    assert decoded.sub == "user-uuid-12345"
    assert decoded.role_id == Roles.STATION_HOUSE_OFFICER
    assert decoded.district_id == "district-uuid-1"
    assert decoded.station_id == "station-uuid-101"


def test_jwt_expired_token():
    past_time = int((datetime.now(timezone.utc) - timedelta(minutes=5)).timestamp())
    payload = TokenPayload(
        sub="user-uuid-12345",
        role_id=Roles.INVESTIGATING_OFFICER,
        exp=past_time
    )
    token = create_access_token(payload)
    
    with pytest.raises(ExpiredTokenError):
        verify_access_token(token)


def test_jwt_invalid_signature():
    payload = TokenPayload(
        sub="user-uuid-12345",
        role_id=Roles.INVESTIGATING_OFFICER
    )
    token = create_access_token(payload)
    tampered_token = token + "corrupted"
    
    with pytest.raises(InvalidTokenError):
        verify_access_token(tampered_token)


# ==============================================================================
# RBAC and Permission Tests
# ==============================================================================

def test_rbac_and_geographic_scoping():
    user = CurrentUser(
        id="user-uuid-123",
        role=Roles.DISTRICT_SUPERINTENDENT,
        district_id="district-uuid-99",
        station_id=None,
        is_active=True
    )
    
    # 1. District Superintendent permissions
    assert has_permission(user, Permission.VIEW_ANALYTICS) is True
    assert has_permission(user, Permission.MANAGE_USERS) is True
    assert has_permission(user, Permission.DELETE_CASE) is False  # Only SYSTEM_ADMIN
    
    # 2. District Scoping (comparing identical string UUID types without casting)
    assert can_access_district(user, "district-uuid-99") is True
    assert can_access_district(user, "district-uuid-different") is False
    
    # 3. Station Scoping (District Superintendent can access any station in their district)
    station_in_district = {
        "id": "station-uuid-1",
        "district_id": "district-uuid-99"
    }
    station_outside_district = {
        "id": "station-uuid-2",
        "district_id": "district-uuid-different"
    }
    
    assert can_access_station(user, station_in_district) is True
    assert can_access_station(user, station_outside_district) is False


# ==============================================================================
# Login Endpoint and Flow Tests
# ==============================================================================

def seed_test_user(db_session: Session, username: str, password_raw: str, is_active: bool = True) -> User:
    """Helper to seed a test user with a related district and station."""
    district = District(
        district_id="dist-uuid-karnataka",
        district_name="Bengaluru Central",
        district_code="BLR-C",
        region="South"
    )
    station = PoliceStation(
        station_id="station-uuid-cubbon",
        station_name="Cubbon Park PS",
        station_code="CP-001",
        station_type="Local",
        district=district
    )
    role = Role(
        role_id="role-uuid-sho",
        role_name="Inspector",
        description="Inspector role"
    )
    officer = Officer(
        officer_id="off-uuid-asha",
        full_name="Asha Kumar",
        badge_number="B-100",
        rank="Inspector",
        designation="SHO",
        station=station,
        district=district
    )
    user = User(
        user_id="user-uuid-asha",
        username=username,
        email="asha@Vigilens.local",
        password_hash=hash_password(password_raw),
        role=role,
        officer=officer,
        district=district,
        station_id=station.station_id,
        is_active=is_active
    )
    
    db_session.add_all([district, station, role, officer, user])
    db_session.commit()
    return user


def test_login_success(db_session):
    seed_test_user(db_session, "inspector_asha", "Vigilens123!")
    
    response = client.post("/auth/login", json={
        "username": "inspector_asha",
        "password": "Vigilens123!"
    })
    
    assert response.status_code == 200
    data = response.json()
    
    assert "user" in data
    assert data["user"]["id"] == "user-uuid-asha"
    assert data["user"]["role"] == Roles.STATION_HOUSE_OFFICER.value
    assert data["user"]["district_id"] == "dist-uuid-karnataka"
    assert data["user"]["station_id"] == "station-uuid-cubbon"
    assert data["user"]["is_active"] is True
    
    assert "token" in data
    assert data["token"]["token_type"] == "Bearer"
    assert "access_token" in data["token"]
    assert data["token"]["expires_in"] == 1800


def test_login_invalid_username(db_session):
    seed_test_user(db_session, "inspector_asha", "Vigilens123!")
    
    response = client.post("/auth/login", json={
        "username": "non_existent_username",
        "password": "Vigilens123!"
    })
    
    assert response.status_code == 401
    assert "detail" in response.json()


def test_login_invalid_password(db_session):
    seed_test_user(db_session, "inspector_asha", "Vigilens123!")
    
    response = client.post("/auth/login", json={
        "username": "inspector_asha",
        "password": "WrongPassword!"
    })
    
    assert response.status_code == 401
    assert "detail" in response.json()


def test_login_inactive_user(db_session):
    seed_test_user(db_session, "inspector_asha", "Vigilens123!", is_active=False)
    
    response = client.post("/auth/login", json={
        "username": "inspector_asha",
        "password": "Vigilens123!"
    })
    
    assert response.status_code == 403
    assert "detail" in response.json()


# ==============================================================================
# FastAPI Dependency injection test
# ==============================================================================

def test_get_current_user_dependency(db_session):
    seed_test_user(db_session, "inspector_asha", "Vigilens123!")
    
    # 1. Login to get token
    login_response = client.post("/auth/login", json={
        "username": "inspector_asha",
        "password": "Vigilens123!"
    })
    token = login_response.json()["token"]["access_token"]
    
    # Define route protected by get_current_user
    @app.get("/test-protected-route")
    def protected_route(current_user: CurrentUser = Depends(get_current_user)):
        return {"user_id": current_user.id, "role": current_user.role}
        
    # Request with valid token
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/test-protected-route", headers=headers)
    assert response.status_code == 200
    assert response.json()["user_id"] == "user-uuid-asha"
    
    # Request with invalid token
    bad_headers = {"Authorization": "Bearer badtoken"}
    response = client.get("/test-protected-route", headers=bad_headers)
    assert response.status_code == 401
