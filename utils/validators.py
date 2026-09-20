"""
Vigilens — Data Validators

Reusable validation functions for data quality checks
across the ETL pipeline and analytics modules.
"""

from __future__ import annotations

import re
import uuid
from datetime import date, datetime
from typing import Any


def is_valid_uuid(value: str) -> bool:
    """Check if a string is a valid UUID v4."""
    try:
        uuid.UUID(str(value), version=4)
        return True
    except (ValueError, AttributeError):
        return False


def is_valid_fir_number(fir_number: str) -> bool:
    """
    Validate FIR number format: STATION_CODE/SEQ/YEAR.

    Examples:
        >>> is_valid_fir_number("HSR/0042/2024")
        True
        >>> is_valid_fir_number("0042/2024")
        True
        >>> is_valid_fir_number("invalid")
        False
    """
    patterns = [
        r"^[A-Z]{2,10}/\d{4}/\d{4}$",     # STATION/SEQ/YEAR
        r"^\d{4}/\d{4}$",                   # SEQ/YEAR
    ]
    return any(re.match(p, fir_number) for p in patterns)


def is_valid_vehicle_registration(reg_number: str) -> bool:
    """
    Validate Karnataka vehicle registration format.

    Format: KA{2-digit district}{2-char series}{4-digit number}
    Example: KA01AB1234

    Args:
        reg_number: Vehicle registration number.

    Returns:
        True if valid Karnataka registration format.
    """
    pattern = r"^KA\d{2}[A-Z]{1,2}\d{4}$"
    return bool(re.match(pattern, reg_number.replace(" ", "").upper()))


def is_valid_latitude(lat: float | None) -> bool:
    """Check if latitude is within valid range for Karnataka (~11.5 to ~18.5)."""
    if lat is None:
        return False
    return 11.0 <= lat <= 19.0


def is_valid_longitude(lng: float | None) -> bool:
    """Check if longitude is within valid range for Karnataka (~74 to ~78.5)."""
    if lng is None:
        return False
    return 73.5 <= lng <= 79.0


def is_valid_date_range(
    start_date: date | datetime,
    end_date: date | datetime,
) -> bool:
    """Check that start_date is before or equal to end_date."""
    return start_date <= end_date


def is_non_empty_string(value: Any) -> bool:
    """Check if value is a non-empty string after stripping whitespace."""
    return isinstance(value, str) and len(value.strip()) > 0


def is_valid_phone(phone: str | None) -> bool:
    """
    Validate Indian phone number format.

    Accepts: +91XXXXXXXXXX, 91XXXXXXXXXX, XXXXXXXXXX, 0XX-XXXXXXXX
    """
    if phone is None:
        return False
    cleaned = re.sub(r"[\s\-\(\)]", "", phone)
    patterns = [
        r"^\+91\d{10}$",
        r"^91\d{10}$",
        r"^\d{10}$",
        r"^0\d{2}\d{8}$",
    ]
    return any(re.match(p, cleaned) for p in patterns)


def is_valid_ipc_section(section: str) -> bool:
    """Check if IPC section is a valid format (numeric, with optional sub-sections)."""
    pattern = r"^\d{1,3}[A-Z]?$"
    return bool(re.match(pattern, section.strip()))


def validate_not_null(value: Any, field_name: str) -> None:
    """
    Raise ValueError if value is None or empty string.

    Args:
        value: The value to check.
        field_name: Field name for the error message.

    Raises:
        ValueError: If value is None or empty.
    """
    if value is None or (isinstance(value, str) and value.strip() == ""):
        raise ValueError(f"Field '{field_name}' must not be null or empty.")


def validate_enum_value(value: str, allowed: list[str], field_name: str) -> None:
    """
    Raise ValueError if value is not in allowed list.

    Args:
        value: The value to check.
        allowed: List of allowed values.
        field_name: Field name for the error message.

    Raises:
        ValueError: If value is not in the allowed list.
    """
    if value not in allowed:
        raise ValueError(
            f"Field '{field_name}' has invalid value '{value}'. "
            f"Allowed: {allowed}"
        )
