"""
Vigilens — Constants & Enumerations

Centralized reference values used across the data module.
All enums and constant lists defined here match the Sprint 1 Data Dictionary.
"""

from __future__ import annotations

from enum import StrEnum


# ============================================================
# Status Enums
# ============================================================

class FIRStatus(StrEnum):
    """FIR case status values."""
    REGISTERED = "Registered"
    UNDER_INVESTIGATION = "Under Investigation"
    CHARGE_SHEET_FILED = "Charge Sheet Filed"
    UNDETECTED = "Undetected"
    CLOSED = "Closed"
    TRANSFERRED = "Transferred"


class Priority(StrEnum):
    """Case priority levels."""
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class Severity(StrEnum):
    """Crime severity levels."""
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class SuspectStatus(StrEnum):
    """Suspect status values."""
    ACTIVE = "Active"
    ARRESTED = "Arrested"
    ABSCONDING = "Absconding"
    ACQUITTED = "Acquitted"
    CONVICTED = "Convicted"
    DECEASED = "Deceased"


class OfficerStatus(StrEnum):
    """Officer status values."""
    ACTIVE = "Active"
    TRANSFERRED = "Transferred"
    RETIRED = "Retired"
    SUSPENDED = "Suspended"


class OfficerRank(StrEnum):
    """Karnataka Police rank hierarchy (ascending)."""
    CONSTABLE = "Constable"
    HEAD_CONSTABLE = "HC"
    ASI = "ASI"
    PSI = "PSI"
    PI = "PI"
    DYSP = "DySP"
    SP = "SP"
    DIG = "DIG"
    IGP = "IGP"
    ADGP = "ADGP"
    DGP = "DGP"


class StationType(StrEnum):
    """Police station types."""
    POLICE_STATION = "Police Station"
    OUTPOST = "Outpost"
    TRAFFIC = "Traffic"
    CYBER = "Cyber"
    WOMEN = "Women"
    CEN = "CEN"


class Gender(StrEnum):
    """Gender values."""
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"


class EvidenceType(StrEnum):
    """Evidence type classification."""
    PHYSICAL = "Physical"
    DIGITAL = "Digital"
    DOCUMENTARY = "Documentary"
    FORENSIC = "Forensic"
    TESTIMONIAL = "Testimonial"
    CCTV = "CCTV"


class EvidenceStatus(StrEnum):
    """Evidence processing status."""
    COLLECTED = "Collected"
    IN_ANALYSIS = "In Analysis"
    ANALYZED = "Analyzed"
    PRESENTED = "Presented"
    RETURNED = "Returned"
    DESTROYED = "Destroyed"


class WeaponType(StrEnum):
    """Weapon type classification."""
    FIREARM = "Firearm"
    KNIFE = "Knife"
    BLUNT_OBJECT = "Blunt Object"
    EXPLOSIVE = "Explosive"
    CHEMICAL = "Chemical"
    DIGITAL = "Digital"
    OTHER = "Other"


class VehicleType(StrEnum):
    """Vehicle type classification."""
    TWO_WHEELER = "Two Wheeler"
    CAR = "Car"
    SUV = "SUV"
    AUTO = "Auto"
    TRUCK = "Truck"
    BUS = "Bus"
    TEMPO = "Tempo"
    OTHER = "Other"


class VehicleStatus(StrEnum):
    """Vehicle involvement status."""
    ACTIVE = "Active"
    SEIZED = "Seized"
    RELEASED = "Released"
    STOLEN = "Stolen"
    RECOVERED = "Recovered"


class VehicleInvolvement(StrEnum):
    """How a vehicle was involved in a crime."""
    USED_IN_CRIME = "Used In Crime"
    STOLEN = "Stolen"
    DAMAGED = "Damaged"
    EVIDENCE = "Evidence"
    GETAWAY = "Getaway"


class SuspectRole(StrEnum):
    """Suspect role in a crime."""
    PRIMARY = "Primary"
    ACCOMPLICE = "Accomplice"
    ABETTOR = "Abettor"
    CONSPIRATOR = "Conspirator"


class CrimeSuspectStatus(StrEnum):
    """Suspect status in a specific crime."""
    SUSPECTED = "Suspected"
    ARRESTED = "Arrested"
    CHARGE_SHEETED = "Charge Sheeted"
    ACQUITTED = "Acquitted"
    CONVICTED = "Convicted"


class WitnessType(StrEnum):
    """Witness type classification."""
    EYE_WITNESS = "Eye Witness"
    EXPERT = "Expert"
    CHARACTER = "Character"
    HOSTILE = "Hostile"
    OFFICIAL = "Official"


class TestimonyStatus(StrEnum):
    """Witness testimony status."""
    PENDING = "Pending"
    RECORDED = "Recorded"
    RETRACTED = "Retracted"
    SUBMITTED_TO_COURT = "Submitted to Court"


class AssociateRelationship(StrEnum):
    """Criminal associate relationship types."""
    GANG_MEMBER = "Gang Member"
    FAMILY = "Family"
    BUSINESS = "Business"
    CO_ACCUSED = "Co-accused"
    KNOWN_ASSOCIATE = "Known Associate"


class IDType(StrEnum):
    """Identity document types."""
    AADHAAR = "Aadhaar"
    PAN = "PAN"
    VOTER_ID = "Voter ID"
    PASSPORT = "Passport"
    DRIVING_LICENSE = "Driving License"


class ActivityAction(StrEnum):
    """Audit log action types."""
    CREATE = "CREATE"
    READ = "READ"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    LOGIN = "LOGIN"
    LOGOUT = "LOGOUT"
    EXPORT = "EXPORT"
    SEARCH = "SEARCH"


# ============================================================
# Karnataka Administrative Constants
# ============================================================

KARNATAKA_DIVISIONS: dict[str, list[str]] = {
    "Bengaluru": [
        "Bengaluru Urban", "Bengaluru Rural", "Chikballapur",
        "Kolar", "Ramanagara", "Tumakuru", "Chitradurga", "Davanagere",
    ],
    "Mysuru": [
        "Mysuru", "Mandya", "Hassan", "Chamarajanagar", "Kodagu",
        "Chikkamagaluru", "Shivamogga", "Udupi", "Dakshina Kannada",
    ],
    "Belagavi": [
        "Belagavi", "Bagalkot", "Dharwad", "Gadag", "Haveri",
        "Uttara Kannada", "Vijayapura",
    ],
    "Kalaburagi": [
        "Kalaburagi", "Bidar", "Raichur", "Yadgir", "Ballari", "Koppal",
    ],
}

ALL_DISTRICTS: list[str] = [
    district
    for districts in KARNATAKA_DIVISIONS.values()
    for district in districts
]


# ============================================================
# Heatmap Severity Weights
# ============================================================

SEVERITY_WEIGHTS: dict[str, float] = {
    "Low": 1.0,
    "Medium": 2.0,
    "High": 3.0,
    "Critical": 5.0,
}


# ============================================================
# System Roles
# ============================================================

SYSTEM_ROLES: list[str] = [
    "Super Admin",
    "Admin",
    "SP",
    "Inspector",
    "SI",
    "Constable",
    "Analyst",
    "Viewer",
]
