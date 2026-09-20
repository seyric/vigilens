from __future__ import annotations

import os
import time
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv
from neo4j import GraphDatabase


class Neo4jExporter:
    NODE_DEFINITIONS = [("persons", "Person", "person_id"), ("phones", "Phone", "phone_id"), ("vehicles", "Vehicle", "vehicle_id"), ("bank_accounts", "BankAccount", "account_id"), ("transactions", "Transaction", "transaction_id"), ("cases", "Case", "case_id"), ("fir", "FIR", "fir_id"), ("evidence", "Evidence", "evidence_id"), ("arrests", "Arrest", "arrest_id"), ("chargesheets", "Chargesheet", "chargesheet_id"), ("court_cases", "CourtCase", "court_case_id"), ("devices", "Device", "device_id")]

    def __init__(self):
        self.root = Path(__file__).resolve().parents[2]
        self.generated_dir = self.root / "data" / "generated"
        load_dotenv(self.root.parent / ".env")
        load_dotenv(self.root / ".env")
        self.uri = os.getenv("NEO4J_URI")
        self.username = os.getenv("NEO4J_USERNAME", os.getenv("NEO4J_USER"))
        self.password = os.getenv("NEO4J_PASSWORD")
        if not all((self.uri, self.username, self.password)):
            raise RuntimeError("NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD are required")
        self.driver = GraphDatabase.driver(self.uri, auth=(self.username, self.password))

    def run(self):
        started = time.perf_counter()
        data = {path.stem: pd.read_csv(path) for path in self.generated_dir.glob("*.csv")}
        with self.driver.session() as session:
            for dataset, label, key in self.NODE_DEFINITIONS:
                for row in data.get(dataset, []).to_dict("records"):
                    properties = {name: (None if pd.isna(value) else value.item() if hasattr(value, "item") else value) for name, value in row.items()}
                    session.run(f"MERGE (n:{label} {{{key}: $id}}) SET n += $properties", id=properties[key], properties=properties).consume()
            relationships = [("phones", "Person", "person_id", "Phone", "phone_id", "OWNS"), ("vehicles", "Person", "person_id", "Vehicle", "vehicle_id", "OWNS"), ("bank_accounts", "Person", "person_id", "BankAccount", "account_id", "OWNS"), ("devices", "Person", "person_id", "Device", "device_id", "USES"), ("case_person_relationships", "Person", "person_id", "Case", "case_id", "INVOLVED_IN"), ("fir", "Case", "case_id", "FIR", "fir_id", "HAS_FIR"), ("evidence", "FIR", "fir_id", "Evidence", "evidence_id", "HAS_EVIDENCE"), ("arrests", "FIR", "fir_id", "Arrest", "arrest_id", "RESULTED_IN"), ("chargesheets", "Arrest", "arrest_id", "Chargesheet", "chargesheet_id", "CHARGED_AS"), ("court_cases", "Chargesheet", "chargesheet_id", "CourtCase", "court_case_id", "HEARD_IN")]
            for dataset, source_label, source_key, target_label, target_key, relation in relationships:
                for row in data.get(dataset, []).to_dict("records"):
                    source_id = row.get(source_key)
                    if dataset == "chargesheets": source_id = row.get("fir_id")
                    session.run(f"MATCH (a:{source_label} {{{source_key}: $source}}) MATCH (b:{target_label} {{{target_key}: $target}}) MERGE (a)-[:{relation}]->(b)", source=source_id, target=row[target_key]).consume()
        self.driver.close()
        nodes = sum(len(data.get(dataset, [])) for dataset, _, _ in self.NODE_DEFINITIONS)
        print(f"SUCCESS: Neo4j exported {nodes} nodes from {len(data)} datasets in {time.perf_counter() - started:.2f}s")
        return nodes


if __name__ == "__main__":
    Neo4jExporter().run()
