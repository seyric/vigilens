# Vigilens — Sprint 2 Design Document

## Project Scaffolding & Synthetic Data

Sprint 2 established the repository structure and project scaffolding for the Vigilens Data & Intelligence module.

### 1. Project Architecture

- `config/` — Centralized settings, constants, and ETL configuration.
- `etl/` — ETL pipeline modules for extraction, validation, transformation, loading, checkpoints, and metrics.
- `utils/` — Shared utilities and logging.
- `datasets/` — Raw, cleaned, processed, and exported data storage.
- `metadata/` — Checkpoints and metadata for data lineage and quality.
- `migrations/` — SQL migration scripts for database schema initialization.
- `tests/` — Test coverage for ETL and utility modules.

### 2. Configuration and Settings

Sprint 2 introduced:
- `config/etl_config.yaml` — ETL DAG and global settings.
- `config/settings.py` — Environment-driven application settings.
- `config/database.py` — Database engine configuration.

### 3. Logging Framework

Sprint 2 added structured logging using Loguru, including:
- `logs/etl.log`
- `logs/error.log`

### 4. Synthetic Data Generation

Added synthetic data generation support for the crime intelligence dataset.
- `scripts/generate_synthetic_data.py`

### 5. Migrations and Validators

Sprint 2 added initial database migration scripts and validation utilities.
- `migrations/001_create_tables.sql`
- `migrations/002_create_indexes.sql`
- `migrations/003_seed_reference_data.sql`
- `utils/validators.py`

### 6. Utilities

Added utility functions for data normalization, helpers, and shared logic.
- `utils/helpers.py`
- `utils/logger.py`
- `utils/validators.py`
