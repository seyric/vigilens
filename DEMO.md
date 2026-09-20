# Vigilens — Hackathon Demonstration Guide

This guide is designed for the judging panel to quickly verify the execution and architecture of the **Vigilens Data & Intelligence Module**.

## Prerequisites

1. PostgreSQL database running locally (`vigilens`).
2. Virtual environment with dependencies installed (`pip install -r requirements.txt`).

## Sprint 3 Demo: Execution of the ETL Pipeline

We have designed a fully automated, configuration-driven ETL DAG that extracts raw data, performs validation and quality scoring, transforms datatypes, and safely bulk loads the data into PostgreSQL.

### Execution Command

Run the following command from the project root:

```bash
python -m etl.pipeline
```

### Expected Output

1. **Terminal Console:**
   - A `tqdm` progress bar visualizing the pipeline execution across all dataset stages.
   - Colored logs indicating `INFO` (Successful loads) and `ERROR` / `CRITICAL` for failed rows, demonstrating our **Recovery Mode**.

2. **Database:**
   - Verify the `vigilens` PostgreSQL database. All loaded rows should be present across the target tables.

3. **Generated Reports:**
   Look inside `reports/` for our automated enterprise reports:
   - `etl_summary.html` — A visual HTML summary including the pipeline flow and execution metrics.
   - `etl_metrics.json` — A JSON file tracking exact memory, CPU usage, and processing time per dataset.
   - `failed_records.csv` and `duplicates.csv` — Isolated bad data for human review.

4. **Logs:**
   - Look in the `logs/` directory.
   - `etl.log` contains the full trace.
   - `error.log` isolates `ERROR` and `CRITICAL` messages.

5. **Logs:**
   - Look in the `logs/` directory.
   - `etl.log` contains the full trace.
   - `error.log` isolates any failures.

## Sprint 5 Demo: Final Data Delivery Layer

Sprint 5 packages the data module into reusable export bundles for the rest of Vigilens.

### Execution Command

Run the delivery layer against a populated database:

```bash
python scripts/generate_sprint5_delivery.py
```

### Expected Output

1. `reports/sprint5/` contains JSON, CSV, and Markdown artifacts for dashboard analytics, district analytics, GIS, trends, AI, backend views, Neo4j exports, and query optimization guidance.
2. `reports/sprint5/sprint5_delivery_report.md` summarizes the delivered bundles.
3. The output is designed to be consumed directly by the frontend, backend, AI, and Neo4j integration workstreams.

## Recovery Mode Demonstration

If you intentionally corrupt a dataset (e.g., delete a required `district_id` in `datasets/raw/police_stations/police_stations.csv`), running the pipeline will:

1. Log an `ERROR` for `police_stations`.
2. Skip loading that specific dataset.
3. Automatically continue loading all other independent datasets, ensuring the system remains functional.

---

_Built for the Karnataka State Police (KSP) Crime Intelligence Operating System._
