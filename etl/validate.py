"""
Vigilens — Data Validation Module

Validates data quality with severity levels (INFO, WARNING, ERROR, CRITICAL).
Computes Data Quality Scores and isolates failed/duplicate records.
"""

from __future__ import annotations

import pandas as pd
from typing import Any
from pathlib import Path

from config.settings import PROJECT_ROOT
from utils.logger import logger


class Validator:
    """Validates data and calculates quality scores."""

    def __init__(self, report_dir: str = "datasets/exports/reports") -> None:
        self.report_dir = PROJECT_ROOT / report_dir
        self.report_dir.mkdir(parents=True, exist_ok=True)

    def validate_dataset(
        self, 
        df: pd.DataFrame, 
        dataset_name: str, 
        primary_key: str
    ) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, float]:
        """
        Validate dataset, separate bad records, and compute quality score.

        Args:
            df: Raw DataFrame.
            dataset_name: Name of the dataset.
            primary_key: Primary key column for duplicate checking.

        Returns:
            Tuple of (valid_df, failed_df, duplicates_df, quality_score).
        """
        initial_rows = len(df)
        if initial_rows == 0:
            logger.warning(f"Validation skipped for {dataset_name}: DataFrame is empty.")
            return df, pd.DataFrame(), pd.DataFrame(), 100.0

        # Guard: ensure the primary_key column exists
        if primary_key not in df.columns:
            logger.warning(
                f"[{dataset_name}] WARNING: PK column '{primary_key}' not found. "
                f"Available columns: {list(df.columns)}. Using first column as PK."
            )
            primary_key = df.columns[0]

        logger.info(f"Validating {dataset_name} ({initial_rows} rows)...")

        # 1. Uniqueness (CRITICAL)
        duplicates_mask = df.duplicated(subset=[primary_key], keep=False)
        duplicates_df = df[duplicates_mask].copy()
        df_unique = df[~duplicates_mask].copy()
        
        if not duplicates_df.empty:
            logger.error(f"[{dataset_name}] CRITICAL: Found {len(duplicates_df)} duplicate rows on PK '{primary_key}'.")
            self._save_bad_records(duplicates_df, dataset_name, "duplicates")

        # 2. Completeness (ERROR/WARNING depending on column)
        # We assume primary_key must be present.
        null_pk_mask = df_unique[primary_key].isnull()
        failed_df = df_unique[null_pk_mask].copy()
        valid_df = df_unique[~null_pk_mask].copy()
        
        if not failed_df.empty:
            logger.error(f"[{dataset_name}] CRITICAL: Found {len(failed_df)} rows with missing PK '{primary_key}'.")
            self._save_bad_records(failed_df, dataset_name, "failed_records")

        # Data Quality Score Calculation
        # Completeness: % of non-null cells
        total_cells = valid_df.size
        null_cells = valid_df.isnull().sum().sum()
        completeness = ((total_cells - null_cells) / total_cells) * 100 if total_cells > 0 else 100.0

        # Uniqueness: % of unique rows
        uniqueness = (len(valid_df) / initial_rows) * 100 if initial_rows > 0 else 100.0
        
        # Overall Score (Weighted Average)
        quality_score = round((completeness * 0.6) + (uniqueness * 0.4), 2)
        
        logger.info(
            f"[{dataset_name}] Validation Complete. "
            f"Valid: {len(valid_df)}, Failed: {len(failed_df)}, Duplicates: {len(duplicates_df)}. "
            f"Quality Score: {quality_score}%"
        )

        return valid_df, failed_df, duplicates_df, quality_score

    def _save_bad_records(self, df: pd.DataFrame, dataset_name: str, file_type: str) -> None:
        """Save bad records to CSV for review."""
        filepath = self.report_dir / f"{dataset_name}_{file_type}.csv"
        df.to_csv(filepath, index=False)
        logger.debug(f"Saved {len(df)} bad records to {filepath}")
