"""
graph_generator.py

Builds graph relationships from generated datasets.
"""

from scripts.generators.core.base_generator import BaseGenerator


class GraphGenerator(BaseGenerator):

    def __init__(self):

        super().__init__("graph_relationships.csv")

    # ======================================================
    # Dependencies
    # ======================================================

    def load_dependencies(self):

        self.persons = self.dataset_loader.get_generated(
            "persons"
        )

        self.phones = self.dataset_loader.get_generated(
            "phones"
        )

        self.vehicles = self.dataset_loader.get_generated(
            "vehicles"
        )

        self.bank_accounts = self.dataset_loader.get_generated(
            "bank_accounts"
        )

        self.transactions = self.dataset_loader.get_generated(
            "transactions"
        )

        self.case_persons = self.dataset_loader.get_generated(
            "case_persons"
        )

    # ======================================================
    # Generate
    # ======================================================

    def generate(self):

        self.records = []

        self._person_phone()

        self._person_vehicle()

        self._person_bank()

        self._case_person()

        self._bank_transactions()

    def validate(self):
        edge_ids = set()

    for edge in self.records:

        if edge["edge_id"] in edge_ids:

            raise ValueError(
                f"Duplicate Edge ID: {edge['edge_id']}"
            )

        edge_ids.add(edge["edge_id"])

    print(
        f"✓ Generated {len(self.records)} graph relationships."
    )
        

    def _person_phone(self):

        for phone in self.phones:

        self.records.append({

            "edge_id":
                self.id_generator.generate("EDGE"),

            "from_node":
                phone["person_id"],

            "from_type":
                "PERSON",

            "relationship":
                "OWNS_PHONE",

            "to_node":
                phone["phone_id"],

            "to_type":
                "PHONE"

        })

        def _person_vehicle(self):

            for vehicle in self.vehicles:

        self.records.append({

            "edge_id":
                self.id_generator.generate("EDGE"),

            "from_node":
                vehicle["person_id"],

            "from_type":
                "PERSON",

            "relationship":
                "OWNS_VEHICLE",

            "to_node":
                vehicle["vehicle_id"],

            "to_type":
                "VEHICLE"

        })

        def _person_bank(self):

            for account in self.bank_accounts:

        self.records.append({

            "edge_id":
                self.id_generator.generate("EDGE"),

            "from_node":
                account["person_id"],

            "from_type":
                "PERSON",

            "relationship":
                "OWNS_ACCOUNT",

            "to_node":
                account["account_id"],

            "to_type":
                "BANK_ACCOUNT"

        })

        def _case_person(self):

    role_mapping = {

        "Suspect": "HAS_SUSPECT",

        "Victim": "HAS_VICTIM",

        "Witness": "HAS_WITNESS",

        "Complainant": "HAS_COMPLAINANT",

        "Informant": "HAS_INFORMANT",

        "Investigating Officer": "INVESTIGATED_BY"

    }

    for relation in self.case_persons:

        self.records.append({

            "edge_id":
                self.id_generator.generate("EDGE"),

            "from_node":
                relation["case_id"],

            "from_type":
                "CASE",

            "relationship":
                role_mapping.get(
                    relation["role"],
                    "RELATED_TO"
                ),

            "to_node":
                relation["person_id"],

            "to_type":
                "PERSON"

        })

        def _bank_transactions(self):

    for transaction in self.transactions:

        self.records.append({

            "edge_id":
                self.id_generator.generate("EDGE"),

            "from_node":
                transaction["from_account_id"],

            "from_type":
                "BANK_ACCOUNT",

            "relationship":
                "TRANSFERRED_TO",

            "to_node":
                transaction["to_account_id"],

            "to_type":
                "BANK_ACCOUNT",

            "transaction_id":
                transaction["transaction_id"],

            "amount":
                transaction["amount"],

            "transaction_type":
                transaction["transaction_type"],

            "status":
                transaction["status"]

        })