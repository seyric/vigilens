"""
case_generator.py

Generates criminal investigation cases.
"""

from __future__ import annotations

import random
from datetime import date, timedelta

from scripts.generators.core.base_generator import BaseGenerator


class CaseGenerator(BaseGenerator):

    def __init__(self):

        super().__init__("cases.csv")

    # ======================================================
    # Dependencies
    # ======================================================

    def load_dependencies(self):

        self.crime_types = self.lookup.get(
            "crime_types"
        )

        self.case_status = self.lookup.get(
            "case_status"
        )

        self.police_stations = self.lookup.get(
            "police_stations"
        )

        self.districts = self.lookup.get(
            "districts"
        )

        self.persons = self.dataset_loader.get_generated(
            "persons"
        )

    # ======================================================
    # Generate
    # ======================================================

    def generate(self):

        self.records = []

        case_count = len(self.persons) // 8

        for _ in range(case_count):

            self.records.append(
                self._generate_case()
            )

    # ======================================================
    # Validation
    # ======================================================

    def validate(self):

        case_ids = set()

        case_numbers = set()

        for case in self.records:

            if case["case_id"] in case_ids:
                raise ValueError(
                    "Duplicate Case ID"
                )

            case_ids.add(case["case_id"])

            if case["case_number"] in case_numbers:
                raise ValueError(
                    "Duplicate Case Number"
                )

            case_numbers.add(
                case["case_number"]
            )
            # ======================================================
# Case Generator
# ======================================================

def _generate_case(self):

    crime = self.choose(self.crime_types)

    station = self.choose(
        self.police_stations
    )

    district = self.choose(
        self.districts
    )

    status = self.choose(
        self.case_status
    )

    priority = self._generate_priority()

    lead_officer = random.choice(
        self.persons
    )

    incident_date = self._generate_incident_date()

    reported_date = self._generate_reported_date(
        incident_date
    )

    return {

        "case_id":
            self.id_generator.generate("CASE"),

        "case_number":
            self._generate_case_number(district),

        "crime_type":
            crime["name"],

        "crime_category":
            crime["category"],

        "police_station":
            station["name"],

        "district":
            district["name"],

        "incident_date":
            incident_date,

        "reported_date":
            reported_date,

        "status":
            status["name"],

        "priority":
            priority,

        "lead_officer_id":
            lead_officer["person_id"],

        "description":
            self._generate_description(crime)

    }
    def _generate_case_number(self, district):
        year = date.today().year

    serial = random.randint(
        1,
        999999
    )

    code = district["code"]

    return f"{code}-{year}-{serial:06d}"

    def _generate_incident_date(self):
        today = date.today()

    days = random.randint(
        0,
        730
    )

    incident = today - timedelta(
        days=days
    )

    return incident.isoformat()

    def _generate_reported_date(self, incident_date):
        incident = date.fromisoformat(
        incident_date
    )

    delay = random.randint(
        0,
        30
    )

    reported = incident + timedelta(
        days=delay
    )

    return reported.isoformat()
    def _generate_priority(self):
        return random.choices(

        [
            "Low",
            "Medium",
            "High",
            "Critical"
        ],

        weights=[
            40,
            35,
            20,
            5
        ],

        k=1

    )[0]

    def _generate_description(self,crime):

         return (
        f"Reported case of "
        f"{crime['name']} "
        f"under investigation."
    )

