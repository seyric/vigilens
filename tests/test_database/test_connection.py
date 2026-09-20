from __future__ import annotations

from pathlib import Path

from sqlalchemy import create_engine

from database.connection import ConnectionManager, DatabaseManagerConfig


def test_retry_operation_eventually_succeeds(tmp_path: Path) -> None:
    config = DatabaseManagerConfig(
        database_url="sqlite://",
        sqlite_fallback_path=tmp_path / "retry.db",
        pool_size=1,
        max_overflow=0,
        pool_recycle=3600,
        connection_retries=3,
        retry_delay_seconds=0.0,
    )
    manager = ConnectionManager(config=config, engine_factory=lambda url, kwargs: create_engine(url, **kwargs))

    attempts = {"count": 0}

    def flaky_operation() -> str:
        attempts["count"] += 1
        if attempts["count"] < 3:
            raise RuntimeError("transient failure")
        return "ok"

    assert manager.retry_operation(flaky_operation) == "ok"
    assert attempts["count"] == 3
