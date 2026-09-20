"""Compatibility shim for legacy database imports.

The Sprint 4 database layer now lives in :mod:`database.connection`.
This module keeps earlier imports working for the ETL and model code.
"""

from __future__ import annotations

from database.connection import (
    Base,
    ConnectionManager,
    SessionLocal,
    engine,
    get_db,
    get_session,
    is_using_sqlite,
    transaction_manager,
)

__all__ = [
    "Base",
    "ConnectionManager",
    "SessionLocal",
    "engine",
    "get_db",
    "get_session",
    "is_using_sqlite",
    "transaction_manager",
]

