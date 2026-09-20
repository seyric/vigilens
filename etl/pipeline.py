"""
Vigilens — ETL Pipeline Orchestrator

Coordinates Extract -> Validate -> Transform -> Load.
Provides Recovery Mode, Retry Logic, Progress Bars, and HTML Reports.
"""

from __future__ import annotations

import time
import sys
from pathlib import Path

import pandas as pd
from tqdm import tqdm
from sqlalchemy.exc import OperationalError

from config.settings import PROJECT_ROOT
from utils.logger import logger
from etl.extract import Extractor
from etl.validate import Validator
from etl.transform import Transformer
from etl.load import Loader
from etl.checkpoints import CheckpointManager
from etl.metrics import MetricsTracker


class PipelineRunner:
    """Orchestrates the entire ETL workflow."""

    def __init__(self, force_full_reload: bool = False) -> None:
        self.extractor = Extractor()
        self.dag = self.extractor.get_dag()

        self.report_dir = PROJECT_ROOT / self.extractor.config.get("global_settings", {}).get("report_dir", "reports")
        self.report_dir.mkdir(parents=True, exist_ok=True)

        metrics_file = self.extractor.config.get("global_settings", {}).get(
            "metrics_file", str(self.report_dir / "etl_metrics.json")
        )
        self.validator = Validator(report_dir=str(self.report_dir))
        self.transformer = Transformer()
        self.loader = Loader()
        checkpoint_path = Path(
            self.extractor.config.get("global_settings", {}).get("checkpoint_dir", "metadata/checkpoints")
        ) / "etl_state.json"
        self.checkpoints = CheckpointManager(checkpoint_file=str(checkpoint_path))
        self.metrics = MetricsTracker(metrics_file=metrics_file)

        self.max_retries = self.extractor.config.get("global_settings", {}).get("max_retries", 3)
        self.retry_delay = self.extractor.config.get("global_settings", {}).get("retry_delay_seconds", 5)

        self.failed_datasets: set[str] = set()
        self.blocked_datasets: set[str] = set()
        self.failed_records: list[pd.DataFrame] = []
        self.duplicate_records: list[pd.DataFrame] = []

        if force_full_reload:
            self.checkpoints.reset_all()

    def run_pipeline(self) -> None:
        """Execute the full ETL DAG."""
        logger.info("Starting Vigilens ETL Pipeline...")
        
        try:
            execution_order = self.extractor.get_execution_order()
            logger.info(f"Execution DAG Order: {' -> '.join(execution_order)}")
        except Exception as e:
            logger.critical(f"Failed to compute execution DAG: {e}")
            return

        with tqdm(total=len(execution_order), desc="ETL Pipeline Progress", unit="dataset") as pbar:
            for dataset_name in execution_order:
                if dataset_name in self.blocked_datasets:
                    logger.warning(
                        f"[{dataset_name}] Skipping because a dependency failed earlier."
                    )
                    self.metrics.start_dataset(dataset_name)
                    self.metrics.record_dataset_metrics(dataset_name, status="SKIPPED")
                    pbar.update(1)
                    continue

                dependencies = self.dag.get(dataset_name, {}).get("dependencies", [])
                blocked_by = [dep for dep in dependencies if dep in self.failed_datasets]
                if blocked_by:
                    logger.warning(
                        f"[{dataset_name}] Skipping because dependency failure: {', '.join(blocked_by)}"
                    )
                    self.blocked_datasets.add(dataset_name)
                    self.metrics.start_dataset(dataset_name)
                    self.metrics.record_dataset_metrics(dataset_name, status="SKIPPED")
                    pbar.update(1)
                    continue

                # Checkpoint: Skip if already loaded successfully
                if self.checkpoints.is_completed(dataset_name, stage="load"):
                    logger.info(f"[{dataset_name}] Skipping: Checkpoint marks as already loaded.")
                    self.metrics.start_dataset(dataset_name)
                    self.metrics.record_dataset_metrics(dataset_name, status="SKIPPED")
                    pbar.update(1)
                    continue

                self.metrics.start_dataset(dataset_name)
                
                try:
                    self._process_single_dataset(dataset_name, pbar)
                    self.checkpoints.mark_completed(dataset_name, stage="load")
                except Exception as e:
                    logger.error(f"[{dataset_name}] Pipeline execution failed: {e}")
                    self.failed_datasets.add(dataset_name)
                    self._block_dependents(dataset_name)
                    self.metrics.record_dataset_metrics(dataset_name, status="FAILED")
                    logger.warning(f"Recovery Mode: Continuing pipeline despite failure in {dataset_name}.")
                
                pbar.update(1)
                self.metrics.sample_system_resources()

        # Finalize
        self._save_consolidated_reports()
        self.metrics.finalize()
        self._generate_html_report()
        logger.info("ETL Pipeline Execution Completed.")

    def _process_single_dataset(self, dataset_name: str, pbar: tqdm) -> None:
        """Process Extract -> Validate -> Transform -> Load for one dataset."""
        dag_config = self.dag[dataset_name]
        table_name = dag_config.get("table", dataset_name)
        primary_key = dag_config.get("primary_key", "id")
        schema_version = self.extractor.get_schema_version(dataset_name)

        pbar.set_description(f"Extracting {dataset_name}")
        df = self.extractor.extract_dataset(dataset_name)
        rows_read = len(df)
        
        if rows_read == 0:
            logger.warning(f"[{dataset_name}] No rows to process.")
            self.metrics.record_dataset_metrics(dataset_name, rows_read=0, status="COMPLETED")
            return

        pbar.set_description(f"Validating {dataset_name}")
        valid_df, failed_df, duplicates_df, quality_score = self.validator.validate_dataset(
            df, dataset_name, primary_key
        )
        rows_rejected = len(failed_df) + len(duplicates_df)

        if not failed_df.empty:
            failed_df = failed_df.copy()
            failed_df["dataset_name"] = dataset_name
            failed_df["failure_type"] = "failed"
            self.failed_records.append(failed_df)

        if not duplicates_df.empty:
            duplicates_df = duplicates_df.copy()
            duplicates_df["dataset_name"] = dataset_name
            duplicates_df["failure_type"] = "duplicate"
            self.duplicate_records.append(duplicates_df)

        pbar.set_description(f"Transforming {dataset_name}")
        transformed_df = self.transformer.transform_dataset(valid_df, dataset_name)

        pbar.set_description(f"Loading {dataset_name}")
        
        # Retry Logic for Database Connections
        rows_loaded = 0
        for attempt in range(1, self.max_retries + 1):
            try:
                rows_loaded = self.loader.load_dataset(transformed_df, table_name)
                break  # Success
            except OperationalError as e:
                logger.warning(f"[{dataset_name}] Database connection error on attempt {attempt}/{self.max_retries}: {e}")
                if attempt == self.max_retries:
                    logger.error(f"[{dataset_name}] Max retries reached. Failing dataset.")
                    raise
                time.sleep(self.retry_delay)

        self.metrics.record_dataset_metrics(
            dataset_name,
            rows_read=rows_read,
            rows_loaded=rows_loaded,
            rows_rejected=rows_rejected,
            validation_score=quality_score,
            status="COMPLETED"
        )
        self.metrics.metrics["datasets"][dataset_name]["schema_version"] = schema_version

    def _generate_html_report(self) -> None:
        """Generate a polished HTML summary report."""
        report_path = self.report_dir / "etl_summary.html"
        
        # Build Timeline HTML
        timeline_html = "<ul>"
        for ds, data in self.metrics.metrics["datasets"].items():
            status_icon = "✅" if data["status"] == "COMPLETED" else "❌"
            schema_version = data.get("schema_version", "unknown")
            timeline_html += (
                f"<li>{status_icon} <b>{ds}</b> (schema: {schema_version}): "
                f"{data['rows_loaded']} rows loaded ({data['duration_seconds']}s)</li>"
            )
        timeline_html += "</ul>"

        # Build Flow Diagram
        flow_diagram = """
        <div style="display:flex; justify-content:space-between; align-items:center; background:#f4f4f9; padding:20px; border-radius:8px;">
            <div style="text-align:center;"><b>Extract</b><br>✔️</div>
            <div>➔</div>
            <div style="text-align:center;"><b>Validate</b><br>✔️</div>
            <div>➔</div>
            <div style="text-align:center;"><b>Transform</b><br>✔️</div>
            <div>➔</div>
            <div style="text-align:center;"><b>Load</b><br>✔️</div>
        </div>
        """

        summary = self.metrics.metrics["summary"]
        
        html_content = f"""
        <html>
        <head>
            <title>Vigilens - ETL Summary</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; color: #333; }}
                h1 {{ color: #2c3e50; }}
                .metric-box {{ border: 1px solid #ddd; padding: 15px; border-radius: 5px; background: #fafafa; margin-bottom: 20px; }}
            </style>
        </head>
        <body>
            <h1>Vigilens — ETL Pipeline Summary</h1>
            <p>Run ID: {self.metrics.metrics['run_id']}</p>
            
            <h2>Pipeline Flow</h2>
            {flow_diagram}
            
            <h2>Metrics Overview</h2>
            <div class="metric-box">
                <p><b>Total Rows Read:</b> {summary['total_rows_read']}</p>
                <p><b>Total Rows Loaded:</b> {summary['total_rows_loaded']}</p>
                <p><b>Total Rows Rejected:</b> {summary['total_rows_rejected']}</p>
                <p><b>Execution Time:</b> {self.metrics.metrics['duration_seconds']} seconds</p>
                <p><b>Datasets Processed:</b> {summary['datasets_processed']}</p>
                <p><b>Datasets Failed:</b> {summary['datasets_failed']}</p>
                <p><b>Datasets Skipped:</b> {summary['datasets_skipped']}</p>
            </div>
            
            <h2>Execution Timeline</h2>
            {timeline_html}
            
            <p><small>Generated automatically by the Vigilens Data Module.</small></p>
        </body>
        </html>
        """

        with open(report_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        logger.info(f"HTML Summary Report generated at {report_path}")

    def _save_consolidated_reports(self) -> None:
        """Write consolidated duplicates and failed records reports."""
        if self.duplicate_records:
            combined_duplicates = pd.concat(self.duplicate_records, ignore_index=True)
            duplicates_path = self.report_dir / "duplicates.csv"
            combined_duplicates.to_csv(duplicates_path, index=False)
            logger.info(f"Consolidated duplicate report generated at {duplicates_path}")

        if self.failed_records:
            combined_failed = pd.concat(self.failed_records, ignore_index=True)
            failed_path = self.report_dir / "failed_records.csv"
            combined_failed.to_csv(failed_path, index=False)
            logger.info(f"Consolidated failed record report generated at {failed_path}")

    def _build_dependents_map(self) -> dict[str, list[str]]:
        """Build a reverse dependency map for the DAG."""
        dependents: dict[str, list[str]] = {}
        for node, config in self.dag.items():
            for dep in config.get("dependencies", []):
                dependents.setdefault(dep, []).append(node)
        return dependents

    def _block_dependents(self, dataset_name: str) -> None:
        """Mark downstream datasets as blocked due to a failed dependency."""
        dependents = self._build_dependents_map()
        children = dependents.get(dataset_name, [])
        for child in children:
            if child not in self.blocked_datasets:
                self.blocked_datasets.add(child)
                logger.warning(f"[{child}] Blocked because dependency '{dataset_name}' failed.")
                self._block_dependents(child)


if __name__ == "__main__":
    # If run directly as a script
    # e.g., python -m etl.pipeline
    runner = PipelineRunner(force_full_reload=True)
    runner.run_pipeline()
