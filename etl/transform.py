"""
Vigilens — Data Transformation Module

Standardizes datatypes, handles missing values, and normalizes strings.
"""

from __future__ import annotations

import pandas as pd
from typing import Any

from utils.logger import logger
from utils.helpers import standardize_district_name, standardize_crime_category


class Transformer:
    """Transforms and cleans DataFrames."""

    def transform_dataset(self, df: pd.DataFrame, dataset_name: str) -> pd.DataFrame:
        """
        Apply transformation rules based on dataset name.
        """
        if df.empty:
            return df

        logger.info(f"Transforming {dataset_name} ({len(df)} rows)...")
        df_transformed = df.copy()

        # General Transformations (Apply to all)
        # Strip string columns
        str_cols = df_transformed.select_dtypes(include=['object']).columns
        for col in str_cols:
            df_transformed[col] = df_transformed[col].apply(
                lambda x: str(x).strip() if pd.notnull(x) else x
            )

        # Dataset-Specific Transformations
        if dataset_name == "districts":
            if "district_name" in df_transformed.columns:
                df_transformed["district_name"] = df_transformed["district_name"].apply(standardize_district_name)
        
        elif dataset_name == "crime_categories":
            if "category_name" in df_transformed.columns:
                df_transformed["category_name"] = df_transformed["category_name"].apply(standardize_crime_category)

        # Date Coercion (convert string dates to datetime if column name implies date/time)
        for col in df_transformed.columns:
            if "date" in col.lower() or "time" in col.lower() or col.endswith("_at"):
                try:
                    df_transformed[col] = pd.to_datetime(df_transformed[col], errors='coerce')
                except Exception:
                    pass

        return df_transformed
