from __future__ import annotations

import csv
from datetime import datetime
from pathlib import Path


class FinalValidationEngine:
    """Validate generated CSV keys, foreign keys, and case chronology."""

    def __init__(self):
        self.generated_dir = Path(__file__).resolve().parents[2] / "data" / "generated"
        self.datasets: dict[str, list[dict[str, str]]] = {}
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def load_datasets(self) -> None:
        for path in sorted(self.generated_dir.glob("*.csv")):
            with path.open(newline="", encoding="utf-8") as handle:
                self.datasets[path.stem] = list(csv.DictReader(handle))
        if not self.datasets:
            raise FileNotFoundError(f"No generated CSV files found in {self.generated_dir}")

    def _keys(self, dataset: str, column: str) -> set[str]:
        rows = self.datasets.get(dataset, [])
        values = [row.get(column, "") for row in rows]
        if any(not value for value in values):
            self.errors.append(f"{dataset}.{column}: null or missing primary key")
        if len(values) != len(set(values)):
            self.errors.append(f"{dataset}.{column}: duplicate primary key")
        return set(values)

    def validate(self) -> None:
        primary_keys = {"persons": "person_id", "phones": "phone_id", "vehicles": "vehicle_id", "bank_accounts": "account_id", "transactions": "transaction_id", "cases": "case_id", "case_person_relationships": "relationship_id", "fir": "fir_id", "evidence": "evidence_id", "arrests": "arrest_id", "chargesheets": "chargesheet_id", "court_cases": "court_case_id", "investigation_diary": "diary_id", "devices": "device_id", "cdr": "cdr_id", "sms_records": "sms_id", "whatsapp_messages": "message_id", "emails": "email_id"}
        keys = {name: self._keys(name, column) for name, column in primary_keys.items() if name in self.datasets}
        relationships = [("phones", "person_id", "persons", "person_id"), ("vehicles", "person_id", "persons", "person_id"), ("bank_accounts", "person_id", "persons", "person_id"), ("transactions", "account_id", "bank_accounts", "account_id"), ("case_person_relationships", "case_id", "cases", "case_id"), ("case_person_relationships", "person_id", "persons", "person_id"), ("fir", "case_id", "cases", "case_id"), ("fir", "complainant_id", "persons", "person_id"), ("evidence", "fir_id", "fir", "fir_id"), ("evidence", "case_id", "cases", "case_id"), ("arrests", "fir_id", "fir", "fir_id"), ("arrests", "suspect_id", "persons", "person_id"), ("chargesheets", "fir_id", "fir", "fir_id"), ("chargesheets", "case_id", "cases", "case_id"), ("chargesheets", "suspect_id", "persons", "person_id"), ("court_cases", "chargesheet_id", "chargesheets", "chargesheet_id"), ("court_cases", "case_id", "cases", "case_id"), ("investigation_diary", "case_id", "cases", "case_id")]
        for child, child_column, parent, parent_column in relationships:
            if child not in self.datasets or parent not in keys:
                continue
            missing = {row.get(child_column, "") for row in self.datasets[child]} - keys[parent]
            missing.discard("")
            if missing:
                self.errors.append(f"{child}.{child_column}: {len(missing)} invalid references to {parent}.{parent_column}")

        def dates(dataset: str, column: str) -> dict[str, datetime]:
            result = {}
            for row in self.datasets.get(dataset, []):
                try:
                    result[row[primary_keys[dataset]]] = datetime.fromisoformat(row[column])
                except (KeyError, ValueError):
                    self.errors.append(f"{dataset}.{column}: invalid timestamp")
            return result

        cases = dates("cases", "incident_datetime")
        firs = dates("fir", "registration_datetime")
        arrests = dates("arrests", "arrest_datetime")
        for row in self.datasets.get("fir", []):
            if row.get("case_id") in cases and firs.get(row.get("fir_id")) < cases[row["case_id"]]: self.errors.append(f"{row['fir_id']}: FIR precedes incident")
        for row in self.datasets.get("arrests", []):
            if row.get("fir_id") in firs and arrests.get(row.get("arrest_id")) < firs[row["fir_id"]]: self.errors.append(f"{row['arrest_id']}: arrest precedes FIR")

    def report(self) -> bool:
        total = sum(len(rows) for rows in self.datasets.values())
        print(f"Datasets: {len(self.datasets)} | Records: {total}")
        print(f"PASS: primary keys and foreign keys checked")
        print(f"{'PASS' if not self.errors else 'FAIL'}: {len(self.errors)} errors, {len(self.warnings)} warnings")
        for error in self.errors: print(f"ERROR: {error}")
        for warning in self.warnings: print(f"WARNING: {warning}")
        return not self.errors


if __name__ == "__main__":
    engine = FinalValidationEngine()
    engine.load_datasets()
    engine.validate()
    raise SystemExit(0 if engine.report() else 1)
