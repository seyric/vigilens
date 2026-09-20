import os
import pytest

# Configure environment variables before importing FastAPI app
os.environ["SECRET_KEY"] = "Vigilens-ai-integration-test-key-32-chars-long"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"
os.environ["GEMINI_API_KEY"] = "mock-gemini-key-for-testing"

from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.main import app
from database.connection import get_db
from backend.auth.dependencies import get_current_active_user
from backend.auth.models import CurrentUser, Roles
from app.services.gemini_service import gemini_service
from app.services.ocr_service import ocr_service
from database.models import Base
from tests.test_database.helpers import seed_minimum_crime_graph

client = TestClient(app)

@pytest.fixture()
def db_session(tmp_path):
    db_file = tmp_path / "test_ai_endpoints.db"
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


@pytest.fixture(autouse=True)
def mock_ai_services(monkeypatch):
    # Mock ask method
    monkeypatch.setattr(gemini_service, "ask", lambda prompt: "Mocked Gemini Response")
    
    # Mock client and generate_content
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Mocked Multimodal OCR Text"
    mock_client.models.generate_content.return_value = mock_response
    monkeypatch.setattr(gemini_service, "client", mock_client)
    
    # Mock default successful Tesseract extract
    monkeypatch.setattr(ocr_service, "extract_text", lambda path: "Mocked Tesseract Text")


def test_ai_ocr_tesseract_success(tmp_path):
    # Create a dummy image file
    from PIL import Image
    dummy_img = tmp_path / "dummy.jpg"
    img = Image.new("RGB", (50, 50), color="blue")
    img.save(dummy_img)

    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sys-admin",
        role=Roles.SYSTEM_ADMIN,
        is_active=True
    )

    response = client.post("/ai/ocr", json={"image_path": str(dummy_img)})
    assert response.status_code == 200
    assert response.json()["extracted_text"] == "Mocked Tesseract Text"


def test_ai_ocr_gemini_fallback(tmp_path, monkeypatch):
    from PIL import Image
    dummy_img = tmp_path / "dummy.jpg"
    img = Image.new("RGB", (50, 50), color="blue")
    img.save(dummy_img)

    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sys-admin",
        role=Roles.SYSTEM_ADMIN,
        is_active=True
    )

    # Force Tesseract to fail to trigger Gemini fallback
    def fail_tesseract(path):
        raise FileNotFoundError("tesseract.exe not found")
    monkeypatch.setattr(ocr_service, "extract_text", fail_tesseract)

    response = client.post("/ai/ocr", json={"image_path": str(dummy_img)})
    assert response.status_code == 200
    assert response.json()["extracted_text"] == "Mocked Multimodal OCR Text"


def test_ai_assistant(db_session):
    seed_minimum_crime_graph(db_session)

    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sys-admin",
        role=Roles.SYSTEM_ADMIN,
        is_active=True
    )

    response = client.post("/ai/assistant", json={"question": "Summarize my cases"})
    assert response.status_code == 200
    assert response.json()["response"] == "Mocked Gemini Response"


def test_ai_report(db_session):
    graph = seed_minimum_crime_graph(db_session)
    fir_id = graph["fir"].fir_id

    app.dependency_overrides[get_current_active_user] = lambda: CurrentUser(
        id="sys-admin",
        role=Roles.SYSTEM_ADMIN,
        is_active=True
    )

    response = client.post("/ai/report", json={"fir_id": fir_id})
    assert response.status_code == 200
    assert "report" in response.json()
    assert response.json()["report"] == "Mocked Gemini Response"
