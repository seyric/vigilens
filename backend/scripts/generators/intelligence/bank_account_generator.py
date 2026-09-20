"""
bank_account_generator.py

Generates bank accounts linked to persons.
"""

from __future__ import annotations

import random
from datetime import date, timedelta

from scripts.generators.core.base_generator import BaseGenerator


class BankAccountGenerator(BaseGenerator):

    def __init__(self):

        super().__init__("bank_accounts.csv")

    # ======================================================
    # Dependencies
    # ======================================================

    def load_dependencies(self):

        self.banks = self.lookup.get("banks")

        self.account_types = self.lookup.get(
            "account_types"
        )

        self.account_status = self.lookup.get(
            "account_status"
        )

        self.persons = self.dataset_loader.get_generated(
            "persons"
        )

    # ======================================================
    # Generate
    # ======================================================

    def generate(self):

        self.records = []

        for person in self.persons:

            account_count = random.choices(
                [1, 2, 3],
                weights=[70, 25, 5],
                k=1
            )[0]

            for _ in range(account_count):

                self.records.append(
                    self._generate_account(person)
                )

    # ======================================================
    # Validation
    # ======================================================

    def validate(self):

        account_ids = set()
        account_numbers = set()
        upi_ids = set()

        for account in self.records:

            if account["account_id"] in account_ids:
                raise ValueError("Duplicate Account ID")

            account_ids.add(account["account_id"])

            if account["account_number"] in account_numbers:
                raise ValueError("Duplicate Account Number")

            account_numbers.add(account["account_number"])

            if account["upi_id"] in upi_ids:
                raise ValueError("Duplicate UPI ID")

            upi_ids.add(account["upi_id"])

            # ======================================================
# Bank Account Generator
# ======================================================

def _generate_account(self, person):

    bank = self.choose(self.banks)
    account_type = self.choose(self.account_types)
    status = self.choose(self.account_status)

    first_name = person["first_name"].lower()

    return {

        "account_id":
            self.id_generator.generate("ACC"),

        "person_id":
            person["person_id"],

        "bank_name":
            bank["name"],

        "account_number":
            self._generate_account_number(),

        "ifsc_code":
            self._generate_ifsc_code(bank),

        "account_type":
            account_type["name"],

        "upi_id":
            self._generate_upi_id(
                first_name,
                bank
            ),

        "opening_date":
            self._generate_opening_date(),

        "status":
            status["name"]

    }
    def _generate_account_number(self):
        return "".join(

        random.choices(
            "0123456789",
            k=12
        )

    )
    def _generate_ifsc_code(self, bank):

    branch = "".join(

        random.choices(
            "0123456789",
            k=6
        )

    )

    return bank["ifsc_prefix"] + branch
    def _generate_upi_id(
    self,
    first_name,
    bank
):

    handles = {

        "SBI": "@sbi",
        "HDFC": "@hdfcbank",
        "ICICI": "@icici",
        "AXIS": "@axisbank",
        "Canara": "@cnrb",
        "PNB": "@pnb",
        "BOB": "@barodampay",
        "Union": "@ubin",
        "Kotak": "@kotak",
        "IndusInd": "@indus"

    }

    suffix = random.randint(
        100,
        9999
    )

    handle = handles.get(
        bank["short_name"],
        "@upi"
    )

    return f"{first_name}{suffix}{handle}"
def _generate_opening_date(self):

    today = date.today()

    days = random.randint(
        365,
        3650
    )

    opening = today - timedelta(
        days=days
    )

    return opening.isoformat()

