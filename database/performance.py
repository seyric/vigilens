"""Vigilens - Database benchmark and performance reporting utilities."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from pathlib import Path
from time import perf_counter
from typing import Callable, Any
import json

from config.settings import PROJECT_ROOT
from utils.logger import logger


@dataclass(slots=True)
class BenchmarkEntry:
    name: str
    rows_scanned: int
    duration_seconds: float
    notes: str = ""


@dataclass(slots=True)
class DatabaseBenchmark:
    entries: list[BenchmarkEntry] = field(default_factory=list)

    def record(self, name: str, rows_scanned: int, duration_seconds: float, notes: str = "") -> None:
        self.entries.append(BenchmarkEntry(name, rows_scanned, duration_seconds, notes))

    def as_dict(self) -> dict[str, Any]:
        return {"entries": [asdict(entry) for entry in self.entries]}


class DatabasePerformanceReport:
    """Collect simple execution benchmarks for database work."""

    def __init__(self, output_dir: str | Path = "reports/database") -> None:
        self.output_dir = PROJECT_ROOT / Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.benchmark = DatabaseBenchmark()

    def time_call(self, name: str, fn: Callable[[], Any], rows_scanned: int = 0, notes: str = "") -> Any:
        started_at = perf_counter()
        result = fn()
        duration_seconds = perf_counter() - started_at
        self.benchmark.record(name=name, rows_scanned=rows_scanned, duration_seconds=duration_seconds, notes=notes)
        logger.info("Benchmark {} completed in {:.4f}s", name, duration_seconds)
        return result

    def write_json(self, filename: str = "database_benchmarks.json") -> Path:
        report_path = self.output_dir / filename
        report_path.write_text(json.dumps(self.benchmark.as_dict(), indent=2), encoding="utf-8")
        return report_path

    def write_markdown(self, filename: str = "database_benchmarks.md") -> Path:
        report_path = self.output_dir / filename
        lines = ["# Database Benchmark Report", ""]
        for entry in self.benchmark.entries:
            lines.append(
                f"- {entry.name}: {entry.duration_seconds:.4f}s for {entry.rows_scanned} rows"
                + (f" ({entry.notes})" if entry.notes else "")
            )
        report_path.write_text("\n".join(lines), encoding="utf-8")
        return report_path
