"""
transaction_generator.py

Generates financial transactions between bank accounts.
"""

from __future__ import annotations

import random
from datetime import datetime, timedelta

from scripts.generators.core.base_generator import BaseGenerator


class TransactionGenerator(BaseGenerator):

    def __init__(self):

        super().__init__("transactions.csv")

    # ======================================================
    # Dependencies
    # ======================================================

    def load_dependencies(self):

        self.accounts = self.dataset_loader.get_generated(
            "bank_accounts"
        )

    # ======================================================
    # Generate
    # ======================================================

    def generate(self):

        self.records = []

        for account in self.accounts:

            transaction_count = random.randint(
                20,
                150
            )

            for _ in range(transaction_count):

                self.records.append(
                    self._generate_transaction(
                        account
                    )
                )

    # ======================================================
    # Validation
    # ======================================================

    def validate(self):

        transaction_ids = set()

        for transaction in self.records:

            if transaction["transaction_id"] in transaction_ids:

                raise ValueError(
                    "Duplicate Transaction ID"
                )

            transaction_ids.add(
                transaction["transaction_id"]
            )

            # ======================================================
# Transaction Generator
# ======================================================

def _generate_transaction(self, from_account):

    to_account = random.choice(self.accounts)

    while (
        to_account["account_id"]
        == from_account["account_id"]
    ):
        to_account = random.choice(self.accounts)

    transaction_type = self.choose(
        self.transaction_types
    )

    payment_mode = self.choose(
        self.payment_modes
    )

    status = self.choose(
        self.transaction_status
    )

    category = self.choose(
        self.transaction_categories
    )

    return {

        "transaction_id":
            self.id_generator.generate("TXN"),

        "from_account_id":
            from_account["account_id"],

        "to_account_id":
            to_account["account_id"],

        "transaction_type":
            transaction_type["name"],

        "amount":
            self._generate_amount(),

        "currency":
            "INR",

        "transaction_time":
            self._generate_transaction_time(),

        "payment_mode":
            payment_mode["name"],

        "status":
            status["name"],

        "category":
            category["name"],

        "remarks":
            self._generate_remarks(category)

    }
    def _generate_amount(self):
         return round(

        random.uniform(
            10,
            500000
        ),

        2

    )

    def _generate_transaction_time(self):
         now = datetime.now()

    days = random.randint(
        0,
        730
    )

    seconds = random.randint(
        0,
        86400
    )

    transaction_time = now - timedelta(
        days=days,
        seconds=seconds
    )

    return transaction_time.isoformat()

    def _generate_remarks(self, category):

        remarks = {

        "Shopping": [
            "Online Purchase",
            "Retail Payment"
        ],

        "Salary": [
            "Monthly Salary",
            "Payroll"
        ],

        "Food": [
            "Restaurant",
            "Food Delivery"
        ],

        "Fuel": [
            "Fuel Station"
        ],

        "Medical": [
            "Hospital",
            "Pharmacy"
        ],

        "Transfer": [
            "Fund Transfer"
        ],

        "Investment": [
            "Mutual Fund",
            "Stocks"
        ],

        "Utility Bill": [
            "Electricity",
            "Water Bill"
        ],

        "Loan EMI": [
            "Loan Payment"
        ],

        "Rent": [
            "House Rent"
        ]

    }

    return random.choice(

        remarks.get(
            category["name"],
            ["Payment"]
        )

    )

