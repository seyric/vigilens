"""
phone_generator.py

Generates phone records linked to persons.

Each person can own multiple phone numbers.
"""

from __future__ import annotations

import random
from datetime import date, timedelta

from scripts.generators.core.base_generator import BaseGenerator


class PhoneGenerator(BaseGenerator):

    def __init__(self):

        super().__init__("phones.csv")

    # ======================================================
    # Dependencies
    # ======================================================

    def load_dependencies(self):

        self.providers = self.lookup.get("telecom_providers")

        self.sim_types = self.lookup.get("sim_types")

        self.connection_types = self.lookup.get(
            "connection_types"
        )

        self.phone_status = self.lookup.get(
            "phone_status"
        )

        # Load generated persons
        self.persons = self.lookup.get_generated(
            "persons"
        )

    # ======================================================
    # Dataset
    # ======================================================

    def generate(self):

        self.records = []

        for person in self.persons:

            phone_count = random.choices(
                [1, 2, 3],
                weights=[65, 25, 10],
                k=1
            )[0]

            primary_assigned = False

            for _ in range(phone_count):

                self.records.append(

                    self._generate_phone(
                        person,
                        not primary_assigned
                    )

                )

                primary_assigned = True

    # ======================================================
    # Validation
    # ======================================================

    def validate(self):
    """
    Validate generated phone records.
    """

    phone_ids = set()
    mobile_numbers = set()
    imeis = set()
    imsis = set()

    primary_phone_count = {}

    for phone in self.records:

        # Required fields
        required_fields = [
            "phone_id",
            "person_id",
            "mobile_number",
            "imei",
            "imsi",
            "provider",
            "sim_type",
            "connection_type",
            "activation_date",
            "status",
            "is_primary"
        ]

        for field in required_fields:
            if field not in phone:
                raise ValueError(
                    f"Missing field '{field}'"
                )

        # Unique Phone ID
        if phone["phone_id"] in phone_ids:
            raise ValueError(
                f"Duplicate Phone ID: {phone['phone_id']}"
            )

        phone_ids.add(phone["phone_id"])

        # Unique Mobile Number
        if phone["mobile_number"] in mobile_numbers:
            raise ValueError(
                "Duplicate Mobile Number"
            )

        mobile_numbers.add(phone["mobile_number"])

        # Unique IMEI
        if phone["imei"] in imeis:
            raise ValueError(
                "Duplicate IMEI"
            )

        imeis.add(phone["imei"])

        # Unique IMSI
        if phone["imsi"] in imsis:
            raise ValueError(
                "Duplicate IMSI"
            )

        imsis.add(phone["imsi"])

        # Only one primary phone
        if phone["is_primary"]:

            person_id = phone["person_id"]

            primary_phone_count[person_id] = (
                primary_phone_count.get(person_id, 0) + 1
            )

            if primary_phone_count[person_id] > 1:
                raise ValueError(
                    f"Multiple primary phones for {person_id}"
                )

    print(
        f"✓ Validation successful ({len(self.records)} phones)"
    )

            # ======================================================
# Phone Generator
# ======================================================

def _generate_phone(self, person, is_primary):

    provider = self.choose(self.providers)
    sim_type = self.choose(self.sim_types)
    connection_type = self.choose(self.connection_types)
    status = self.choose(self.phone_status)

    return {

        "phone_id": self.id_generator.generate("PHN"),

        "person_id": person["person_id"],

        "mobile_number": self._generate_mobile_number(),

        "imei": self._generate_imei(),

        "imsi": self._generate_imsi(),

        "provider": provider["short_name"],

        "sim_type": sim_type["name"],

        "connection_type": connection_type["name"],

        "activation_date": self._generate_activation_date(),

        "status": status["name"],

        "is_primary": is_primary

    }
    def _generate_mobile_number(self):
        first_digit = random.choice(
        ["9", "8", "7", "6"]
    )

    remaining = "".join(
        random.choices(
            "0123456789",
            k=9
        )
    )

    return first_digit + remaining

    def _generate_imei(self):

        return "".join(

        random.choices(
            "0123456789",
            k=15
        )

    )

    def _generate_imsi(self):

        return "404" + "".join(

        random.choices(
            "0123456789",
            k=12
        )

    )

    def _generate_activation_date(self):

        today = date.today()

        days = random.randint(0,3650)

        activation = today - timedelta(days=days)
        return activation.isoformat()
    