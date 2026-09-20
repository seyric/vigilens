"""
vehicle_generator.py

Generates vehicle records linked to persons.
"""

from __future__ import annotations

import random
from datetime import date, timedelta

from scripts.generators.core.base_generator import BaseGenerator


class VehicleGenerator(BaseGenerator):

    def __init__(self):

        super().__init__("vehicles.csv")

    # ======================================================
    # Dependencies
    # ======================================================

    def load_dependencies(self):

        self.vehicle_types = self.lookup.get(
            "vehicle_types"
        )

        self.vehicle_brands = self.lookup.get(
            "vehicle_brands"
        )

        self.vehicle_colors = self.lookup.get(
            "vehicle_colors"
        )

        self.fuel_types = self.lookup.get(
            "fuel_types"
        )

        self.vehicle_status = self.lookup.get(
            "vehicle_status"
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

            vehicle_count = random.choices(
                [0, 1, 2],
                weights=[30, 55, 15],
                k=1
            )[0]

            for _ in range(vehicle_count):

                self.records.append(
                    self._generate_vehicle(person)
                )

    # ======================================================
    # Validation
    # ======================================================

    def validate(self):

        vehicle_ids = set()
        registration_numbers = set()

        for vehicle in self.records:

            if vehicle["vehicle_id"] in vehicle_ids:
                raise ValueError(
                    "Duplicate Vehicle ID"
                )

            vehicle_ids.add(vehicle["vehicle_id"])

            if (
                vehicle["registration_number"]
                in registration_numbers
            ):
                raise ValueError(
                    "Duplicate Registration Number"
                )

            registration_numbers.add(
                vehicle["registration_number"]
            )

            # ======================================================
# Vehicle Generator
# ======================================================

def _generate_vehicle(self, person):

    vehicle_type = self.choose(self.vehicle_types)
    brand = self.choose(self.vehicle_brands)
    color = self.choose(self.vehicle_colors)
    fuel = self.choose(self.fuel_types)
    status = self.choose(self.vehicle_status)

    return {

        "vehicle_id": self.id_generator.generate("VEH"),

        "person_id": person["person_id"],

        "registration_number":
            self._generate_registration_number(),

        "vehicle_type":
            vehicle_type["name"],

        "brand":
            brand["name"],

        "model":
            self._generate_model(brand),

        "color":
            color["name"],

        "fuel_type":
            fuel["name"],

        "engine_number":
            self._generate_engine_number(),

        "chassis_number":
            self._generate_chassis_number(),

        "registration_date":
            self._generate_registration_date(),

        "status":
            status["name"]

    }
    def _generate_registration_number(self):

    district = random.randint(1, 99)

    letters = "".join(
        random.choices(
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            k=2
        )
    )

    numbers = "".join(
        random.choices(
            "0123456789",
            k=4
        )
    )

    return f"KA{district:02d}{letters}{numbers}"

    def _generate_engine_number(self):

    return "ENG" + "".join(

        random.choices(
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            k=10
        )

    )
    def _generate_chassis_number(self):

    return "CHS" + "".join(

        random.choices(
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            k=14
        )

    )
    def _generate_registration_date(self):

    today = date.today()

    days = random.randint(
        0,
        3650
    )

    registration = today - timedelta(days=days)

    return registration.isoformat()

    def _generate_model(self, brand):

    models = {

        "Hyundai": [
            "Creta",
            "i20",
            "Venue"
        ],

        "Maruti Suzuki": [
            "Swift",
            "Baleno",
            "Brezza"
        ],

        "Honda": [
            "City",
            "Amaze"
        ],

        "Tata": [
            "Nexon",
            "Punch",
            "Harrier"
        ],

        "Mahindra": [
            "Scorpio",
            "Thar",
            "XUV700"
        ]

    }

    return random.choice(

        models.get(
            brand["name"],
            ["Unknown"]
        )

    )

