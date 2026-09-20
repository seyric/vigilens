"""Vigilens - Bulk loading utilities for PostgreSQL and SQLite."""

from __future__ import annotations

from dataclasses import dataclass
from io import StringIO
from pathlib import Path
from time import perf_counter
from typing import Any, Iterable

import pandas as pd
from sqlalchemy import text
from sqlalchemy.engine import Engine

from config.settings import get_settings
from utils.logger import logger


@dataclass(slots=True)
class BulkLoadResult:
    table_name: str
    rows_attempted: int
    rows_loaded: int
    batches: int
    used_copy: bool
    duration_seconds: float


class BulkLoader:
    """Load tabular data in batches with optional PostgreSQL COPY support."""

    def __init__(self, engine: Engine | None = None, chunk_size: int | None = None) -> None:
        from database.connection import engine as default_engine

        settings = get_settings()
        self.engine = engine or default_engine
        self.chunk_size = chunk_size or settings.bulk_load_chunk_size

    def load_dataframe(
        self,
        table_name: str,
        dataframe: pd.DataFrame,
        *,
        chunk_size: int | None = None,
        use_copy: bool = True,
    ) -> BulkLoadResult:
        if dataframe.empty:
            return BulkLoadResult(table_name, 0, 0, 0, False, 0.0)

        effective_chunk_size = chunk_size or self.chunk_size
        started_at = perf_counter()

        if use_copy and self.engine.dialect.name == "postgresql":
            rows_loaded = self._copy_dataframe(table_name, dataframe)
            duration = perf_counter() - started_at
            return BulkLoadResult(table_name, len(dataframe), rows_loaded, 1, True, duration)

        batches = 0
        rows_loaded = 0
        with self.engine.begin() as connection:
            for start in range(0, len(dataframe), effective_chunk_size):
                chunk = dataframe.iloc[start : start + effective_chunk_size]
                chunk.to_sql(table_name, con=connection, if_exists="append", index=False)
                batches += 1
                rows_loaded += len(chunk)

        duration = perf_counter() - started_at
        logger.info("[{}] Loaded {} rows in {} batches.", table_name, rows_loaded, batches)
        return BulkLoadResult(table_name, len(dataframe), rows_loaded, batches, False, duration)

    def load_records(
        self,
        table_name: str,
        records: Iterable[dict[str, Any]],
        *,
        chunk_size: int | None = None,
        use_copy: bool = True,
    ) -> BulkLoadResult:
        frame = pd.DataFrame(list(records))
        return self.load_dataframe(table_name, frame, chunk_size=chunk_size, use_copy=use_copy)

    def load_csv(
        self,
        table_name: str,
        csv_path: str | Path,
        *,
        chunk_size: int | None = None,
        use_copy: bool = True,
        **read_csv_kwargs: Any,
    ) -> BulkLoadResult:
        frame = pd.read_csv(csv_path, **read_csv_kwargs)
        return self.load_dataframe(table_name, frame, chunk_size=chunk_size, use_copy=use_copy)

    def _copy_dataframe(self, table_name: str, dataframe: pd.DataFrame) -> int:
        """Use PostgreSQL COPY when available for the fastest bulk ingest."""

        raw_buffer = StringIO()
        dataframe.to_csv(raw_buffer, index=False, header=True)
        raw_buffer.seek(0)
        copy_sql = f"COPY {table_name} FROM STDIN WITH (FORMAT CSV, HEADER TRUE)"

        raw_connection = self.engine.raw_connection()
        cursor = raw_connection.cursor()
        try:
            cursor.copy_expert(copy_sql, raw_buffer)
            raw_connection.commit()
        except Exception:
            raw_connection.rollback()
            raise
        finally:
            cursor.close()
            raw_connection.close()

        return len(dataframe)

    def clear_table(self, table_name: str) -> None:
        with self.engine.begin() as connection:
            connection.execute(text(f"DELETE FROM {table_name}"))
