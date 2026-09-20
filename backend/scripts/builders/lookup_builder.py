"""
lookup_builder.py

Automatically builds all lookup CSV files from the
backend/config/lookup package.

Author: Vigilens
"""

from __future__ import annotations

import importlib
import inspect
from pathlib import Path

import pandas as pd


LOOKUP_MODULES = [
    "demographics",
    "geography",
    "crime",
    "police",
    "behavior",
    "vehicle",
    "evidence",
    "legal",
]


OUTPUT_DIR = (
    Path(__file__).resolve().parents[2]
    / "datasets"
    / "lookup"
)

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def export_lookup(table_name: str, records: list) -> None:
    """
    Export one lookup table.
    """

    df = pd.DataFrame(records)

    output_file = OUTPUT_DIR / f"{table_name.lower()}.csv"

    df.to_csv(output_file, index=False)

    print(
        f"✓ {table_name:<25}"
        f"{len(df):>5} rows"
    )


def build():
    """
    Build every lookup table.
    """

    print("=" * 60)
    print(" Vigilens Lookup Builder ")
    print("=" * 60)

    total_tables = 0

    for module_name in LOOKUP_MODULES:

        module = importlib.import_module(
            f"config.lookup.{module_name}"
        )

        for name, value in inspect.getmembers(module):

            if (
                name.isupper()
                and isinstance(value, list)
                and len(value) > 0
                and isinstance(value[0], dict)
            ):
                export_lookup(name.lower(), value)
                total_tables += 1

    print("=" * 60)
    print(f"Generated {total_tables} lookup tables.")
    print("=" * 60)


if __name__ == "__main__":
    build()