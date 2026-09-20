# Vigilens — Sprint 3 Design Document

## Production ETL Pipeline and Data Quality Framework

Sprint 3 implemented the full production-grade ETL pipeline for the Vigilens data module.

### 1. ETL Pipeline

- `etl/pipeline.py` — Pipeline orchestrator with Extract, Validate, Transform, Load stages.
- Configuration-driven DAG execution using `config/etl_config.yaml`.
- Dependency-aware dataset ordering and topological sorting.
- Recovery mode with blocked downstream dataset handling.
- Retry logic for database connectivity failures.
- Checkpointing for resumed execution.

### 2. Validation Engine

- `etl/validate.py` — Data validation engine with severity levels.
- Duplicate detection and failed-record extraction.
- Data quality score computation based on completeness and uniqueness.
- Consolidated reporting of invalid and duplicate rows.

### 3. Transformation Engine

- `etl/transform.py` — Standardizes text, cleans strings, and coerces dates.
- Dataset-specific normalization for districts and crime categories.

### 4. Load Engine

- `etl/load.py` — Transactional loading using SQLAlchemy.
- Supports chunked inserts and rollback on failure.

### 5. Reporting

- `reports/etl_summary.html` — HTML summary report with execution timeline.
- `reports/etl_metrics.json` — Pipeline metrics output.
- `reports/duplicates.csv` — Consolidated duplicate row report.
- `reports/failed_records.csv` — Consolidated failed row report.

### 6. Audit and Logging

- `utils/logger.py` — Structured logging with console, `logs/etl.log`, and `logs/error.log`.
- `etl/checkpoints.py` — Persistent pipeline checkpoint state.
- `etl/metrics.py` — System and dataset metrics tracking.

### 7. Testing

- `tests/test_etl/test_extract.py`
- `tests/test_etl/test_validate.py`
- `tests/test_etl/test_metrics.py`

### 8. Demo Guide

- `DEMO.md` — Sprint 3 demonstration guide for judges and reviewers.
