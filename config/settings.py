"""
Vigilens — Application Settings

Environment-based configuration using pydantic-settings.
Loads values from .env file or environment variables.
"""

from __future__ import annotations

from pathlib import Path
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


# ── Project Paths ──────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "datasets"
RAW_DIR = DATA_DIR / "raw"
CLEANED_DIR = DATA_DIR / "cleaned"
PROCESSED_DIR = DATA_DIR / "processed"
EXPORTS_DIR = DATA_DIR / "exports"
MIGRATIONS_DIR = PROJECT_ROOT / "migrations"
DOCS_DIR = PROJECT_ROOT / "docs"
METADATA_DIR = PROJECT_ROOT / "metadata"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=str(PROJECT_ROOT / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── PostgreSQL ──
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "Vigilens_ai"
    postgres_user: str = "vigilens_user"
    postgres_password: str = "changeme"
    postgres_pool_size: int = 10
    postgres_max_overflow: int = 20
    postgres_pool_recycle: int = 3600
    database_connection_retries: int = 3
    database_retry_delay_seconds: float = 0.5

    # ── Neo4j ──
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "changeme"

        # ── AI provider ──
    ai_provider: str = "ollama"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.1:8b"
    ollama_embed_model: str = "nomic-embed-text"
    openai_compatible_base_url: str = "http://127.0.0.1:8080/v1"
    openai_compatible_api_key: str = ""
    openai_compatible_model: str = "local-model"
    openai_compatible_embed_model: str = ""
    gemini_api_key: str = ""
    gemini_api_key_2: str = ""
    gemini_api_key_3: str = ""
    gemini_model: str = "gemini-2.0-flash"
    grok_api_key: str = ""
    grok_model: str = "grok-3-mini"
    grok_base_url: str = "https://api.x.ai/v1"
    hybrid_sensitive_tasks: str = "local"
    seed_dev_users: bool = False
    secret_key: str = ""
    usb_key_required: bool = False

    # ── Application ──
    app_env: str = "development"
    log_level: str = "INFO"
    data_dir: str = str(DATA_DIR)

    # ── Backend API ──
    backend_api_url: str = "http://localhost:8000/api/v1"

    # ── ETL Configuration ──
    bulk_load_chunk_size: int = 10000

    @property
    def postgres_url(self) -> str:
        """SQLAlchemy-compatible PostgreSQL connection URL."""
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def database_url(self) -> str:
        """Alias used by the database manager."""
        return self.postgres_url

    @property
    def postgres_async_url(self) -> str:
        """Async PostgreSQL connection URL (asyncpg)."""
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def database_async_url(self) -> str:
        """Alias used by async database integrations."""
        return self.postgres_async_url

    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.app_env.lower() == "development"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Get cached application settings singleton."""
    return Settings()
