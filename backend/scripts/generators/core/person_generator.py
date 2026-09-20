"""
person_generator.py

Master Person Generator for Vigilens.

Every human entity in Vigilens is created from this class.

Derived generators:
    • OfficerGenerator
    • SuspectGenerator
    • VictimGenerator
    • WitnessGenerator
    • InformantGenerator
"""

from __future__ import annotations

import random
from datetime import date, datetime, timedelta

from scripts.generators.core.base_generator import BaseGenerator


class PersonGenerator(BaseGenerator):
    """
    Generates realistic synthetic persons.

    Child generators reuse this identity generation logic.
    """

    def __init__(self):

        super().__init__("persons.csv")

        self.records = []

    # ======================================================
    # Dependencies
    # ======================================================

    def load_dependencies(self):

        # Person Names
        self.male_names = self.lookup.get("male_first_names")
        self.female_names = self.lookup.get("female_first_names")
        self.last_names = self.lookup.get("last_names")

        # Lookup tables
        self.genders = self.lookup.get("genders")
        self.education_levels = self.lookup.get("education_levels")
        self.marital_status = self.lookup.get("marital_status")
        self.languages = self.lookup.get("languages")
        self.blood_groups = self.lookup.get("blood_groups")
        self.occupations = self.lookup.get("occupations")
        self.districts = self.lookup.get("districts")

    # ======================================================
    # Dataset Generation
    # ======================================================

    def generate(self, count: int = 1000):

        self.records = []

        for _ in range(count):
            self.records.append(
                self._generate_person()
            )

    # ======================================================
    # Validation
    # ======================================================

    def validate(self):
        person_ids = set()
        aadhaar_numbers = set()
        pan_numbers = set()

        required_fields = [
        "person_id",
        "first_name",
        "last_name",
        "gender",
        "date_of_birth",
        "age",
        "mobile_number",
        "aadhaar_number",
        "pan_number",
        "district"
    ]

    for person in self.records:

        # Required fields
        for field in required_fields:
            if field not in person:
                raise ValueError(
                    f"Missing field '{field}'"
                )

        # Duplicate Person ID
        if person["person_id"] in person_ids:
            raise ValueError(
                f"Duplicate Person ID: {person['person_id']}"
            )

        person_ids.add(person["person_id"])

        # Duplicate Aadhaar
        if person["aadhaar_number"] in aadhaar_numbers:
            raise ValueError(
                "Duplicate Aadhaar Number"
            )

            aadhaar_numbers.add(
            person["aadhaar_number"]
        )

        # Duplicate PAN
        if person["pan_number"] in pan_numbers:
            raise ValueError(
                "Duplicate PAN Number"
            )

        pan_numbers.add(
            person["pan_number"]
        )

        # Age validation
        if not (0 <= person["age"] <= 120):
            raise ValueError(
                f"Invalid age: {person['age']}"
            )

    print(
        f"✓ Validation successful ({len(self.records)} persons)"
    )

    # ======================================================
    # Person
    # ======================================================

    
    def _generate_person(self):
        gender = self._generate_gender()
        first_name, last_name = self._generate_name(gender)
        dob = self._generate_dob()
        age = self._calculate_age(dob)
        address = self._generate_address()
        
        return {
            "person_id": self.id_generator.generate("PER"),
            "first_name": first_name,
            "last_name": last_name,
            "full_name": f"{first_name} {last_name}",

        "gender": gender,

        "date_of_birth": dob.isoformat(),

        "age": age,

        "blood_group": self._generate_blood_group(),

        "marital_status": self._generate_marital_status(),

        "education_level": self._generate_education(),

        "occupation": self._generate_occupation(),

        "primary_language": self._generate_language(),

        "nationality": "Indian",

        "mobile_number": self._generate_mobile(),

        "email": self._generate_email(
            first_name,
            last_name
        ),

        "aadhaar_number": self._generate_aadhaar(),

        "pan_number": self._generate_pan(),

        "voter_id": self._generate_voter_id(),

        "passport_number": self._generate_passport(),

        "driving_license": self._generate_driving_license(),

        "district": address["district"],

        "address": address["address"],

        "pincode": address["pincode"],

        "latitude": address["latitude"],

        "longitude": address["longitude"],

        "created_at": self._generate_created_at(),

        "updated_at": self._generate_updated_at()
    }   

    # ======================================================
    # Identity
    # ======================================================

    def _generate_gender(self):

        gender = self.choose(self.genders)

        return gender["name"]

    def _generate_name(self, gender):

        if gender.lower() == "male":
            first = self.choose(
                self.male_names
            )["name"]

        else:
            first = self.choose(
                self.female_names
            )["name"]

        last = self.choose(
            self.last_names
        )["name"]

        return first, last

    def _generate_dob(self):

        age = random.randint(18, 80)

        today = date.today()

        return today - timedelta(
            days=age * 365
        )

    def _calculate_age(self, dob):

        today = date.today()

        return (
            today.year
            - dob.year
            - (
                (today.month, today.day)
                <
                (dob.month, dob.day)
            )
        )

# ======================================================
# Contact Information
# ======================================================

def _generate_mobile(self):

    prefix = random.choice([
        "98", "99", "97", "96",
        "95", "94", "93", "91"
    ])

    remaining = "".join(
        random.choices("0123456789", k=8)
    )

    return prefix + remaining


def _generate_email(self, first_name, last_name):

    domains = [
        "gmail.com",
        "outlook.com",
        "yahoo.com",
        "icloud.com"
    ]

    username = (
        first_name.lower()
        + "."
        + last_name.lower()
        + str(random.randint(10, 999))
    )

    return f"{username}@{random.choice(domains)}"


# ======================================================
# Address
# ======================================================

def _generate_address(self):

    district = self.choose(self.districts)

    house_number = random.randint(1, 999)

    street = random.choice([
        "MG Road",
        "Church Street",
        "Station Road",
        "Temple Road",
        "Lake View Road",
        "Market Road",
        "Nehru Road"
    ])

    pincode = (
        "56"
        + "".join(random.choices("0123456789", k=4))
    )

    return {
        "district": district["name"],
        "address": f"House {house_number}, {street}",
        "pincode": pincode,
        "latitude": district["latitude"],
        "longitude": district["longitude"]
    }
# ======================================================
# Government IDs
# ======================================================

def _generate_aadhaar(self):
    """
    Generate a synthetic 12-digit Aadhaar number.
    """
    return "".join(random.choices("0123456789", k=12))


def _generate_pan(self):
    """
    Generate a synthetic PAN number.
    Format: ABCDE1234F
    """
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    return (
        "".join(random.choices(letters, k=5))
        + "".join(random.choices("0123456789", k=4))
        + random.choice(letters)
    )


def _generate_voter_id(self):
    """
    Generate a synthetic Voter ID.
    Example: ABC1234567
    """
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    return (
        "".join(random.choices(letters, k=3))
        + "".join(random.choices("0123456789", k=7))
    )


def _generate_passport(self):
    """
    Generate a synthetic Passport number.
    Example: P1234567
    """
    return (
        random.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
        + "".join(random.choices("0123456789", k=7))
    )


def _generate_driving_license(self):
    """
    Generate a synthetic Karnataka Driving Licence.
    Example: KA0120230012345
    """
    return (
        "KA"
        + "".join(random.choices("0123456789", k=13))
    )
# ======================================================
# Personal Attributes
# ======================================================

def _generate_blood_group(self):

    return self.choose(
        self.blood_groups
    )["name"]


def _generate_education(self):

    return self.choose(
        self.education_levels
    )["name"]


def _generate_marital_status(self):

    return self.choose(
        self.marital_status
    )["name"]


def _generate_language(self):

    return self.choose(
        self.languages
    )["name"]


def _generate_occupation(self):

    occupation = self.choose(
        self.occupations
    )

    return occupation["name"]
    # ======================================================
    # Metadata
    # ======================================================

    def _generate_created_at(self):

        return datetime.utcnow().isoformat()

    def _generate_updated_at(self):

        return datetime.utcnow().isoformat()