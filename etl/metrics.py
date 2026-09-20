"""
Vigilens — ETL Metrics Tracker

Tracks performance, resource usage, and data volumes during the pipeline run.
Generates `etl_metrics.json`.
"""

from __future__ import annotations

import json
import time
import psutil
from pathlib import Path
from datetime import datetime
from typing import Any

from config.settings import PROJECT_ROOT
from utils.logger import logger


class MetricsTracker:
    """Tracks and records ETL pipeline metrics."""

    def __init__(self, metrics_file: str = "datasets/exports/reports/etl_metrics.json") -> None:
        """
        Initialize the metrics tracker.

        Args:
            metrics_file: Path relative to project root for the output report.
        """
        self.file_path = PROJECT_ROOT / metrics_file
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        
        self.start_time: float = time.time()
        self.metrics: dict[str, Any] = {
            "run_id": datetime.now().strftime("%Y%m%d_%H%M%S"),
            "start_time": datetime.now().isoformat(),
            "end_time": None,
            "duration_seconds": 0.0,
            "datasets": {},
            "summary": {
                "total_rows_read": 0,
                "total_rows_loaded": 0,
                "total_rows_rejected": 0,
                "datasets_processed": 0,
                "datasets_failed": 0,
                "datasets_skipped": 0
            },
            "system": {
                "cpu_percent_avg": 0.0,
                "memory_usage_mb_max": 0.0
            }
        }
        
        self._cpu_samples: list[float] = []
        self._memory_samples: list[float] = []

    def start_dataset(self, dataset: str) -> None:
        """Initialize metrics for a new dataset."""
        self.metrics["datasets"][dataset] = {
            "status": "IN_PROGRESS",
            "rows_read": 0,
            "rows_loaded": 0,
            "rows_rejected": 0,
            "validation_score": 0.0,
            "start_time": time.time(),
            "duration_seconds": 0.0
        }

    def record_dataset_metrics(
        self, 
        dataset: str, 
        rows_read: int = 0, 
        rows_loaded: int = 0, 
        rows_rejected: int = 0,
        validation_score: float = 0.0,
        status: str = "COMPLETED"
    ) -> None:
        """Record final metrics for a dataset."""
        if dataset not in self.metrics["datasets"]:
            self.start_dataset(dataset)
            
        ds_metrics = self.metrics["datasets"][dataset]
        ds_metrics["rows_read"] = rows_read
        ds_metrics["rows_loaded"] = rows_loaded
        ds_metrics["rows_rejected"] = rows_rejected
        ds_metrics["validation_score"] = validation_score
        ds_metrics["status"] = status
        ds_metrics["duration_seconds"] = round(time.time() - ds_metrics["start_time"], 2)
        
        # Remove raw start_time from output
        del ds_metrics["start_time"]

        # Update globals
        self.metrics["summary"]["total_rows_read"] += rows_read
        self.metrics["summary"]["total_rows_loaded"] += rows_loaded
        self.metrics["summary"]["total_rows_rejected"] += rows_rejected
        
        if status == "COMPLETED":
            self.metrics["summary"]["datasets_processed"] += 1
        elif status == "FAILED":
            self.metrics["summary"]["datasets_failed"] += 1
        elif status == "SKIPPED":
            self.metrics["summary"]["datasets_skipped"] += 1

    def sample_system_resources(self) -> None:
        """Sample CPU and Memory usage. Should be called periodically."""
        self._cpu_samples.append(psutil.cpu_percent(interval=None))
        process = psutil.Process()
        self._memory_samples.append(process.memory_info().rss / (1024 * 1024))

    def finalize(self) -> None:
        """Finalize all metrics and write to disk."""
        self.metrics["end_time"] = datetime.now().isoformat()
        self.metrics["duration_seconds"] = round(time.time() - self.start_time, 2)
        
        if self._cpu_samples:
            self.metrics["system"]["cpu_percent_avg"] = round(sum(self._cpu_samples) / len(self._cpu_samples), 2)
        if self._memory_samples:
            self.metrics["system"]["memory_usage_mb_max"] = round(max(self._memory_samples), 2)

        with open(self.file_path, "w") as f:
            json.dump(self.metrics, f, indent=2)
            
        logger.info(f"ETL Metrics finalized and saved to {self.file_path}")
