"""
neo4j_exporter.py

Exports Vigilens datasets into Neo4j import format.
"""

from pathlib import Path

from backend.scripts.utils.csv_writer import CSVWriter
from backend.scripts.utils.dataset_loader import DatasetLoader

class Neo4jExporter:

    def __init__(self):

        self.loader = DatasetLoader()

        self.writer = CSVWriter()

        self.output_dir = Path(
            "backend/datasets/neo4j"
        )

        self.output_dir.mkdir(
            parents=True,
            exist_ok=True
        )

    def export(self):

        self.load_data()

        self.export_nodes()

        self.export_relationships()

        print(" NEO4J export completed.")
    def load_data(self):

        self.persons = self.loader.get_generated(
        "persons"
    )

    self.phones = self.loader.get_generated(
        "phones"
    )

    self.vehicles = self.loader.get_generated(
        "vehicles"
    )

    self.bank_accounts = self.loader.get_generated(
        "bank_accounts"
    )

    self.transactions = self.loader.get_generated(
        "transactions"
    )

    self.cases = self.loader.get_generated(
        "cases"
    )

    self.graph = self.loader.get_generated(
        "graph_relationships"
    )

    def export_nodes(self):
        nodes = []

        for person in self.persons:

            nodes.append({

            "id": person["person_id"],

            "label": "Person",

            "name": person["full_name"]

        })

    for phone in self.phones:

        nodes.append({

            "id": phone["phone_id"],

            "label": "Phone",

            "name": phone["mobile_number"]

        })

        for vehicle in self.vehicles:
            nodes.append({

            "id": vehicle["vehicle_id"],

            "label": "Vehicle",

            "name": vehicle["registration_number"]

        })

    for account in self.bank_accounts:

        nodes.append({

            "id": account["account_id"],

            "label": "BankAccount",

            "name": account["account_number"]

        })

        for case in self.cases:

             nodes.append({

            "id": case["case_id"],

            "label": "Case",

            "name": case["case_number"]

        })

    self.writer.write(

        records=nodes,

        output_path=self.output_dir /
        "nodes.csv",

        overwrite=True

    )
    def export_relationships(self):
        relationships = []

    for edge in self.graph:

        relationships.append({

            "start_id":
                edge["from_node"],

            "end_id":
                edge["to_node"],

            "type":
                edge["relationship"]

        })

    self.writer.write(

        records=relationships,

        output_path=self.output_dir /
        "relationships.csv",

        overwrite=True

    )
