from fastapi.testclient import TestClient
import os

os.environ["SECRET_KEY"] = "dev-secret-key-super-secure-32chars"
from backend.main import app

client = TestClient(app)


def test_osint_health_endpoint():
    response = client.get("/api/v1/osint/live/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["feed_sources"] == 23


def test_osint_news_endpoint():
    response = client.get("/api/v1/osint/news/latest")
    assert response.status_code == 200
    news = response.json()
    assert isinstance(news, list)
    if news:
        first = news[0]
        assert "risk_score" in first
        assert "title" in first


def test_osint_radio_endpoint():
    response = client.get("/api/v1/osint/radio/top")
    assert response.status_code == 200
    radio = response.json()
    assert isinstance(radio, list)
    assert len(radio) > 0


def test_osint_cybint_collection():
    response = client.post("/api/v1/osint/collection/start", json={
        "int_type": "CYBINT",
        "target": "example.com"
    })
    assert response.status_code == 200
    job = response.json()
    assert job["int_type"] == "CYBINT"
    assert job["status"] == "completed"
    assert "results" in job
    assert job["results"]["discipline"] == "CYBINT"


def test_osint_socmint_collection():
    response = client.post("/api/v1/osint/collection/start", json={
        "int_type": "SOCMINT",
        "target": "alice_test"
    })
    assert response.status_code == 200
    job = response.json()
    assert job["int_type"] == "SOCMINT"
    assert job["results"]["query_handle"] == "alice_test"


def test_osint_stix_export():
    response = client.get("/api/v1/osint/stix/export")
    assert response.status_code == 200
    bundle = response.json()
    assert bundle["type"] == "bundle"
    assert "objects" in bundle
    assert len(bundle["objects"]) >= 2
