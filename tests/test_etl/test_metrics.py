import pytest
from etl.metrics import MetricsTracker
from etl.extract import Extractor


def test_metrics_skipped_dataset_counts() -> None:
    metrics = MetricsTracker(metrics_file="reports/test_etl_metrics.json")
    metrics.start_dataset("districts")
    metrics.record_dataset_metrics("districts", rows_read=0, rows_loaded=0, rows_rejected=0, status="SKIPPED")

    assert metrics.metrics["summary"]["datasets_skipped"] == 1
    assert metrics.metrics["datasets"]["districts"]["status"] == "SKIPPED"
    assert metrics.metrics["datasets"]["districts"]["rows_read"] == 0


def test_extractor_schema_version_lookup() -> None:
    extractor = Extractor()
    assert extractor.get_schema_version("districts") == "v1.0"
    assert extractor.get_schema_version("unknown_dataset") == "unknown"
