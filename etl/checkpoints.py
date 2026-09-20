"""
Vigilens — ETL Checkpoint Manager

Manages pipeline state to support resuming from partial failures.
Tracks which datasets have been successfully processed (extracted, validated, transformed, loaded).
"""

from __future__ import annotations

import json
from pathlib import Path
from datetime import datetime

from config.settings import PROJECT_ROOT
from utils.logger import logger


class CheckpointManager:
    """Manages state persistence for the ETL pipeline."""

    def __init__(self, checkpoint_file: str = "metadata/checkpoints/etl_state.json") -> None:
        """
        Initialize the checkpoint manager.

        Args:
            checkpoint_file: Path relative to project root for storing state.
        """
        self.file_path = PROJECT_ROOT / checkpoint_file
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        self.state: dict[str, dict[str, bool]] = self._load_state()

    def _load_state(self) -> dict[str, dict[str, bool]]:
        """Load existing state or return empty dict."""
        if self.file_path.exists():
            try:
                with open(self.file_path, "r") as f:
                    return json.load(f)
            except json.JSONDecodeError:
                logger.warning(f"Failed to read checkpoint file {self.file_path}, starting fresh.")
        return {}

    def _save_state(self) -> None:
        """Persist current state to disk."""
        with open(self.file_path, "w") as f:
            json.dump(self.state, f, indent=2)

    def mark_completed(self, dataset: str, stage: str = "load") -> None:
        """
        Mark a dataset as completely processed through a specific stage.

        Args:
            dataset: The dataset name (e.g., 'districts').
            stage: The stage completed ('extract', 'validate', 'transform', 'load').
        """
        if dataset not in self.state:
            self.state[dataset] = {}
        
        self.state[dataset][stage] = True
        self.state[dataset]["last_updated"] = datetime.now().isoformat()
        self._save_state()
        logger.debug(f"Checkpoint saved: {dataset} -> {stage} completed.")

    def is_completed(self, dataset: str, stage: str = "load") -> bool:
        """
        Check if a dataset has already completed a specific stage.

        Args:
            dataset: The dataset name.
            stage: The stage to check.

        Returns:
            True if completed, False otherwise.
        """
        return self.state.get(dataset, {}).get(stage, False)

    def reset_dataset(self, dataset: str) -> None:
        """Reset state for a specific dataset."""
        if dataset in self.state:
            del self.state[dataset]
            self._save_state()
            logger.info(f"Reset checkpoint for {dataset}.")

    def reset_all(self) -> None:
        """Clear all checkpoints (e.g., for a full run)."""
        self.state = {}
        if self.file_path.exists():
            self.file_path.unlink()
        logger.info("All checkpoints cleared.")
