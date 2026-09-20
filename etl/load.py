"""
Vigilens — Data Loading Module

Loads validated and transformed data into the database using transactions.
Supports chunked inserts and rollback on failure.
Works with both PostgreSQL (production) and SQLite (demo/fallback).
"""

from __future__ import annotations

import pandas as pd

from database.bulk_loader import BulkLoader
from utils.logger import logger


class Loader:
    """Loads DataFrames into the database."""

    def __init__(self) -> None:
        self.bulk_loader = BulkLoader()

    def load_dataset(self, df: pd.DataFrame, table_name: str, chunk_size: int = 10000) -> int:
        """
        Load a DataFrame into the database using chunked inserts within a transaction.

        Args:
            df: DataFrame to load.
            table_name: Target database table.
            chunk_size: Number of rows per insert batch.

        Returns:
            Number of rows successfully loaded.

        Raises:
            SQLAlchemyError: If the database transaction fails.
        """
        if df.empty:
            logger.info(f"[{table_name}] Nothing to load (empty DataFrame).")
            return 0

        try:
            logger.info(f"Loading {len(df)} rows into '{table_name}'...")
            result = self.bulk_loader.load_dataframe(table_name, df, chunk_size=chunk_size)
            logger.info(f"[{table_name}] Successfully loaded {result.rows_loaded} rows.")
            return result.rows_loaded
        except Exception as e:
            logger.error(f"[{table_name}] CRITICAL: Database transaction failed. Rolling back. Error: {e}")
            raise
