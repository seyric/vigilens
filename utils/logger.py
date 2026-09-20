"""
Vigilens — Structured Logging

Provides a pre-configured Loguru logger for the entire data module.
Logs to both console (colored) and dedicated rotating files (etl.log, error.log).
"""

from __future__ import annotations

import sys
from pathlib import Path

from loguru import logger as _logger

from config.settings import get_settings, PROJECT_ROOT


def setup_logger() -> None:
    """
    Configure the application logger.

    - Console: colored, INFO+ level in production, DEBUG in development.
    - File (etl.log): Detailed execution trace, 10 MB max, 30-day retention.
    - File (error.log): Only ERROR and CRITICAL logs.
    """
    settings = get_settings()

    # Remove default handler
    _logger.remove()

    # Console handler
    _logger.add(
        sys.stderr,
        level=settings.log_level,
        format=(
            "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
            "<level>{message}</level>"
        ),
        colorize=True,
    )

    # Log directories
    log_dir = PROJECT_ROOT / "logs"
    log_dir.mkdir(exist_ok=True)

    # General ETL Log
    _logger.add(
        log_dir / "etl.log",
        level="DEBUG",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} | {message}",
        rotation="10 MB",
        retention="30 days",
        compression="gz",
        enqueue=True,
    )

    # Dedicated Error Log
    _logger.add(
        log_dir / "error.log",
        level="ERROR",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} | {message}",
        rotation="10 MB",
        retention="30 days",
        compression="gz",
        enqueue=True,
    )


# Auto-configure on import
setup_logger()

# Re-export the configured logger
logger = _logger
