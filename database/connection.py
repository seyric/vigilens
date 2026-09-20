"""Vigilens - PostgreSQL database connection and session management."""

from __future__ import annotations

from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Generator
import time

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from config.settings import get_settings
from utils.logger import logger


class Base(DeclarativeBase):
    """Declarative base shared by all SQLAlchemy models."""


@dataclass(slots=True)
class DatabaseManagerConfig:
    """Runtime database configuration derived from application settings."""

    database_url: str
    sqlite_fallback_path: Path
    pool_size: int
    max_overflow: int
    pool_recycle: int
    connection_retries: int
    retry_delay_seconds: float
    echo: bool = False


class ConnectionManager:
    """Builds engines, sessions, and transactions with retry support."""

    def __init__(
        self,
        config: DatabaseManagerConfig | None = None,
        engine_factory: Callable[[str, dict[str, Any]], Engine] | None = None,
    ) -> None:
        settings = get_settings()
        self.config = config or DatabaseManagerConfig(
            database_url=settings.postgres_url,
            sqlite_fallback_path=Path(settings.data_dir) / "Vigilens_ai.db",
            pool_size=settings.postgres_pool_size,
            max_overflow=settings.postgres_max_overflow,
            pool_recycle=settings.postgres_pool_recycle,
            connection_retries=settings.database_connection_retries,
            retry_delay_seconds=settings.database_retry_delay_seconds,
            echo=False,
        )
        self._engine_factory = engine_factory or create_engine
        self._engine: Engine | None = None
        self._using_sqlite = False

    @property
    def engine(self) -> Engine:
        if self._engine is None:
            self._engine = self._create_engine()
        return self._engine

    def _create_engine(self) -> Engine:
        try:
            engine = self._build_postgres_engine()
            self._test_connection(engine)
            logger.info("PostgreSQL connection successful.")
            return engine
        except Exception as error:
            logger.warning(
                "PostgreSQL unavailable ({}). Falling back to SQLite at {}.",
                type(error).__name__,
                self.config.sqlite_fallback_path,
            )
            self._using_sqlite = True
            return self._build_sqlite_engine()

    def _build_postgres_engine(self) -> Engine:
        return self._engine_factory(
            self.config.database_url,
            pool_size=self.config.pool_size,
            max_overflow=self.config.max_overflow,
            pool_recycle=self.config.pool_recycle,
            pool_pre_ping=True,
            echo=self.config.echo,
        )

    def _build_sqlite_engine(self) -> Engine:
        self.config.sqlite_fallback_path.parent.mkdir(parents=True, exist_ok=True)
        sqlite_url = f"sqlite:///{self.config.sqlite_fallback_path}"
        logger.info("Using SQLite fallback database at {}", self.config.sqlite_fallback_path)
        return self._engine_factory(sqlite_url, echo=self.config.echo)

    def _test_connection(self, engine: Engine) -> None:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

    def retry_operation(self, operation: Callable[[], Any]) -> Any:
        """Retry a database operation with simple exponential backoff."""

        last_error: Exception | None = None
        for attempt in range(1, self.config.connection_retries + 1):
            try:
                return operation()
            except Exception as error:
                last_error = error
                if attempt >= self.config.connection_retries:
                    raise
                sleep_for = self.config.retry_delay_seconds * attempt
                logger.warning("Database operation failed on attempt {}. Retrying in {:.2f}s.", attempt, sleep_for)
                time.sleep(sleep_for)

        if last_error is not None:
            raise last_error
        raise RuntimeError("Retry operation exhausted without an error or result.")

    def session_factory(self) -> sessionmaker:
        return sessionmaker(bind=self.engine, autoflush=False, autocommit=False, expire_on_commit=False)

    @contextmanager
    def session_scope(self) -> Generator[Session, None, None]:
        session = self.session_factory()()
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    @contextmanager
    def transaction(self, session: Session) -> Generator[Session, None, None]:
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise

    def create_all(self) -> None:
        Base.metadata.create_all(bind=self.engine)

    def drop_all(self) -> None:
        Base.metadata.drop_all(bind=self.engine)

    @property
    def using_sqlite(self) -> bool:
        return self._using_sqlite or self.engine.dialect.name == "sqlite"


_manager = ConnectionManager()
engine = _manager.engine
SessionLocal = _manager.session_factory()


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """Yield a managed SQLAlchemy session with commit/rollback semantics."""

    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@contextmanager
def transaction_manager(session: Session) -> Generator[Session, None, None]:
    """Backward-compatible transactional context manager."""

    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise


def get_db() -> Generator[Session, None, None]:
    """Compatibility alias used by older call sites."""

    with get_session() as session:
        yield session


def is_using_sqlite() -> bool:
    """Return True when the SQLite fallback is active."""

    return _manager.using_sqlite
