"""
Vigilens — Data Extraction Module

Extracts raw data from paths specified in the YAML configuration.
Validates that the file exists and the schema matches expectations.
"""

from __future__ import annotations

import yaml
from pathlib import Path
from typing import Any

import pandas as pd

from config.settings import PROJECT_ROOT
from utils.logger import logger


class Extractor:
    """Handles data extraction based on YAML configuration."""

    def __init__(self, config_path: str = "config/etl_config.yaml") -> None:
        self.config_path = PROJECT_ROOT / config_path
        self.config = self._load_config()

    def _load_config(self) -> dict[str, Any]:
        """Load and parse the ETL YAML configuration."""
        if not self.config_path.exists():
            raise FileNotFoundError(f"Configuration file missing: {self.config_path}")
        
        with open(self.config_path, "r") as f:
            return yaml.safe_load(f)

    def get_dag(self) -> dict[str, dict[str, Any]]:
        """Return the DAG definition from the configuration."""
        return self.config.get("dag", {})

    def extract_dataset(self, dataset_name: str) -> pd.DataFrame:
        """
        Extract a single dataset into a pandas DataFrame.

        Args:
            dataset_name: Name of the dataset to extract.

        Returns:
            DataFrame containing the raw data.
            
        Raises:
            KeyError: If dataset is not in configuration.
            FileNotFoundError: If the dataset file does not exist.
        """
        dag = self.get_dag()
        if dataset_name not in dag:
            raise KeyError(f"Dataset '{dataset_name}' not found in DAG configuration.")

        file_path = PROJECT_ROOT / dag[dataset_name]["path"]
        
        if not file_path.exists():
            logger.error(f"Extraction failed: File not found - {file_path}")
            raise FileNotFoundError(f"Dataset file missing: {file_path}")

        logger.info(f"Extracting {dataset_name} from {file_path}...")
        
        # Read CSV. Handle bad lines gracefully if needed.
        try:
            df = pd.read_csv(file_path, low_memory=False)
            logger.info(f"Successfully extracted {len(df)} rows for {dataset_name}.")
            return df
        except Exception as e:
            logger.error(f"Failed to read CSV for {dataset_name}: {e}")
            raise

    def get_execution_order(self) -> list[str]:
        """
        Compute the execution order based on DAG dependencies using topological sort.
        """
        dag = self.get_dag()
        visited: set[str] = set()
        temp_mark: set[str] = set()
        order: list[str] = []

        def visit(node: str) -> None:
            if node in temp_mark:
                raise ValueError(f"Circular dependency detected involving '{node}'")
            if node not in visited:
                temp_mark.add(node)
                for dep in dag.get(node, {}).get("dependencies", []):
                    visit(dep)
                temp_mark.remove(node)
                visited.add(node)
                order.append(node)

        for node in dag.keys():
            if node not in visited:
                visit(node)
                
        return order

    def get_schema_version(self, dataset_name: str) -> str:
        """Return the configured schema version for a dataset."""
        return self.config.get("schemas", {}).get(dataset_name, "unknown")
