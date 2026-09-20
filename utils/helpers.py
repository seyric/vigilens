"""
Vigilens — Common Helper Functions

Shared utility functions used across ETL, analytics, GIS, and Neo4j modules.
"""

from __future__ import annotations

import hashlib
import uuid
from datetime import datetime, date
from pathlib import Path
from typing import Any

import pandas as pd


def generate_uuid() -> str:
    """Generate a new UUID v4 string."""
    return str(uuid.uuid4())


def safe_read_csv(filepath: str | Path, **kwargs: Any) -> pd.DataFrame:
    """
    Safely read a CSV file with error handling.

    Args:
        filepath: Path to the CSV file.
        **kwargs: Additional arguments passed to pd.read_csv.

    Returns:
        DataFrame with the CSV contents.

    Raises:
        FileNotFoundError: If the file does not exist.
    """
    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(f"CSV file not found: {path}")

    return pd.read_csv(path, **kwargs)


def standardize_district_name(name: str) -> str:
    """
    Standardize district name to title case with known corrections.

    Args:
        name: Raw district name.

    Returns:
        Standardized district name.

    Examples:
        >>> standardize_district_name("BENGALURU URBAN")
        'Bengaluru Urban'
        >>> standardize_district_name("bangalore urban")
        'Bengaluru Urban'
    """
    corrections: dict[str, str] = {
        "bangalore urban": "Bengaluru Urban",
        "bangalore rural": "Bengaluru Rural",
        "belgaum": "Belagavi",
        "bellary": "Ballari",
        "bijapur": "Vijayapura",
        "gulbarga": "Kalaburagi",
        "shimoga": "Shivamogga",
        "tumkur": "Tumakuru",
        "chickmagalur": "Chikkamagaluru",
        "chickballapur": "Chikballapur",
        "chamrajnagar": "Chamarajanagar",
        "dk": "Dakshina Kannada",
        "uk": "Uttara Kannada",
        "mysore": "Mysuru",
        "mangalore": "Dakshina Kannada",
    }

    normalized = name.strip().lower()
    if normalized in corrections:
        return corrections[normalized]

    return name.strip().title()


def standardize_crime_category(category: str) -> str:
    """
    Standardize crime category to title case with known corrections.

    Args:
        category: Raw crime category.

    Returns:
        Standardized crime category.
    """
    corrections: dict[str, str] = {
        "murder": "Murder",
        "theft": "Theft",
        "robbery": "Robbery",
        "burglary": "Burglary",
        "assault": "Assault",
        "kidnapping": "Kidnapping",
        "cyber crime": "Cyber Crime",
        "cybercrime": "Cyber Crime",
        "fraud": "Fraud",
        "cheating": "Fraud",
        "sexual offense": "Sexual Offense",
        "sexual offence": "Sexual Offense",
        "rape": "Sexual Offense",
        "narcotics": "Narcotics",
        "drugs": "Narcotics",
        "chain snatching": "Chain Snatching",
        "eve teasing": "Eve Teasing",
        "domestic violence": "Domestic Violence",
        "dowry": "Dowry",
        "hit and run": "Hit and Run",
        "hit & run": "Hit and Run",
    }

    normalized = category.strip().lower()
    if normalized in corrections:
        return corrections[normalized]

    return category.strip().title()


def calculate_age(dob: date | datetime, reference_date: date | None = None) -> int | None:
    """
    Calculate age from date of birth.

    Args:
        dob: Date of birth.
        reference_date: Date to calculate age at (defaults to today).

    Returns:
        Age in years, or None if DOB is invalid.
    """
    if dob is None:
        return None

    ref = reference_date or date.today()
    if isinstance(dob, datetime):
        dob = dob.date()

    age = ref.year - dob.year - ((ref.month, ref.day) < (dob.month, dob.day))
    return age if age >= 0 else None


def hash_pii(value: str) -> str:
    """
    Hash personally identifiable information for anonymization.

    Args:
        value: PII string to hash.

    Returns:
        SHA-256 hash of the value.
    """
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def ensure_directory(path: str | Path) -> Path:
    """
    Ensure a directory exists, creating it if necessary.

    Args:
        path: Directory path.

    Returns:
        Path object for the directory.
    """
    dir_path = Path(path)
    dir_path.mkdir(parents=True, exist_ok=True)
    return dir_path


def chunk_dataframe(
    df: pd.DataFrame,
    chunk_size: int = 10_000,
) -> list[pd.DataFrame]:
    """
    Split a DataFrame into chunks for batch processing.

    Args:
        df: DataFrame to split.
        chunk_size: Number of rows per chunk.

    Returns:
        List of DataFrame chunks.
    """
    return [df.iloc[i : i + chunk_size] for i in range(0, len(df), chunk_size)]
