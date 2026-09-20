"""
csv_writer.py

Utility for writing generated datasets to CSV files.

Author: Vigilens
"""

from __future__ import annotations

from pathlib import Path
from typing import List, Dict

import pandas as pd


class CSVWriter:
    """
    Writes generated records to CSV files.

    Features
    --------
    ✓ Automatically creates directories
    ✓ Overwrite control
    ✓ Row statistics
    ✓ UTF-8 encoding
    """

    def __init__(self) -> None:
        self.output_dir = (
            Path(__file__).resolve().parents[2]
            / "datasets"
        )

        self.output_dir.mkdir(parents=True, exist_ok=True)

    def write(
        self,
        filename: str,
        records: List[Dict],
        folder: str = "generated",
        overwrite: bool = True,
    ) -> Path:
        """
        Write records to a CSV file.

        Args:
            filename: Name of CSV file (without extension)
            records: List of dictionaries
            folder: Output subfolder
            overwrite: Whether to overwrite an existing file

        Returns:
            Path to generated CSV
        """

        destination = self.output_dir / folder
        destination.mkdir(parents=True, exist_ok=True)

        csv_path = destination / f"{filename}.csv"

        if csv_path.exists() and not overwrite:
            raise FileExistsError(
                f"{csv_path} already exists."
            )

        df = pd.DataFrame(records)

        df.to_csv(
            csv_path,
            index=False,
            encoding="utf-8"
        )

        print(
            f"✓ {filename}.csv written successfully "
            f"({len(df)} rows)"
        )

        return csv_path

    def write_dataframe(
        self,
        filename: str,
        dataframe: pd.DataFrame,
        folder: str = "generated",
        overwrite: bool = True,
    ) -> Path:

        destination = self.output_dir / folder
        destination.mkdir(parents=True, exist_ok=True)

        csv_path = destination / f"{filename}.csv"

        if csv_path.exists() and not overwrite:
            raise FileExistsError(
                f"{csv_path} already exists."
            )

        dataframe.to_csv(
            csv_path,
            index=False,
            encoding="utf-8"
        )

        print(
            f"✓ {filename}.csv written successfully "
            f"({len(dataframe)} rows)"
        )

        return csv_path


# Singleton instance
csv_writer = CSVWriter()


if __name__ == "__main__":

    sample_data = [
        {
            "id": 1,
            "name": "Alice",
            "city": "Bengaluru"
        },
        {
            "id": 2,
            "name": "Rahul",
            "city": "Mysuru"
        }
    ]

    csv_writer.write(
        filename="sample",
        records=sample_data
    )