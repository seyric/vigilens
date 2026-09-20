#!/usr/bin/env python3
"""
Vigilens - Crime Category Seeder (v2.0)
==========================================
Seeds all 15 crime categories and 40+ subtypes into the live database.
Run this BEFORE loading FIRs/crimes when upgrading from a single-category setup.

Usage:
    python scripts/seed_crime_categories.py

This script is safe to run multiple times (idempotent — uses upsert logic).

ALL DATA IS FICTIONAL — Safe for public demonstration.
"""

import sys
import os
import uuid
from datetime import datetime

# ── Path setup ────────────────────────────────────────────────────────────────
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT)

from database.connection import SessionLocal
from database.models import CrimeCategory

# ═══════════════════════════════════════════════════════════════════════════════
#  CRIME CATEGORY DEFINITIONS (mirrors generate_synthetic_data.py)
# ═══════════════════════════════════════════════════════════════════════════════

CRIME_CATEGORY_DEFINITIONS = {
    "Theft": {
        "severity": "Medium",
        "ipc": ["379", "380", "381"],
        "description": "All theft-related offences involving taking of property without violence.",
        "subtypes": {
            "Mobile Theft": {"severity": "Medium", "ipc": ["379", "380"], "desc": "Theft of mobile phones by snatching or pickpocketing."},
            "Jewellery Theft": {"severity": "High", "ipc": ["379", "381"], "desc": "Theft of gold, silver or other jewellery from persons or residences."},
            "Shoplifting": {"severity": "Low", "ipc": ["380", "381"], "desc": "Theft of goods from retail establishments without payment."},
            "Bag Theft": {"severity": "Medium", "ipc": ["379", "380"], "desc": "Theft of handbags, backpacks or shoulder bags from victims."},
        }
    },
    "Vehicle Theft": {
        "severity": "High",
        "ipc": ["379", "411"],
        "description": "Theft of motorised vehicles including two-wheelers, cars and commercial vehicles.",
        "subtypes": {
            "Motorcycle Theft": {"severity": "High", "ipc": ["379", "411"], "desc": "Theft of motorcycles or scooters from parking areas or roads."},
            "Car Theft": {"severity": "High", "ipc": ["379", "411"], "desc": "Theft of four-wheeled passenger vehicles."},
            "Commercial Vehicle Theft": {"severity": "High", "ipc": ["379", "411"], "desc": "Theft of trucks, tempos, buses or auto-rickshaws."},
        }
    },
    "Burglary": {
        "severity": "High",
        "ipc": ["454", "457", "458", "380"],
        "description": "House breaking, office breaking or warehouse break-in with intent to commit theft.",
        "subtypes": {
            "Residential Burglary": {"severity": "High", "ipc": ["457", "380"], "desc": "Breaking into residences to commit theft."},
            "Office Burglary": {"severity": "High", "ipc": ["454", "380"], "desc": "Breaking into offices or commercial establishments to commit theft."},
            "Warehouse Break-in": {"severity": "High", "ipc": ["454", "458"], "desc": "Breaking into warehouses or storage godowns to steal goods."},
        }
    },
    "Robbery": {
        "severity": "Critical",
        "ipc": ["390", "392", "394", "397"],
        "description": "Taking of property from a person by force, threat or violence.",
        "subtypes": {
            "Armed Robbery": {"severity": "Critical", "ipc": ["392", "397"], "desc": "Robbery committed with weapons such as knives or firearms."},
            "Chain Snatching": {"severity": "High", "ipc": ["392", "394"], "desc": "Snatching of gold chains or necklaces from victims, often from vehicles."},
            "Street Robbery": {"severity": "High", "ipc": ["390", "392"], "desc": "Robbery of cash, mobile or valuables on public roads or isolated areas."},
        }
    },
    "Cyber Crime": {
        "severity": "High",
        "ipc": ["420", "465", "468", "471"],
        "description": "Criminal activities committed using computers, internet or mobile technology.",
        "subtypes": {
            "UPI Fraud": {"severity": "High", "ipc": ["420", "468"], "desc": "Fraud involving Unified Payment Interface transactions."},
            "QR Scam": {"severity": "High", "ipc": ["420", "468"], "desc": "Fraudulent use of QR codes to deceive victims into paying money."},
            "OTP Scam": {"severity": "High", "ipc": ["420", "465"], "desc": "Obtaining OTPs under false pretenses to access bank accounts."},
            "Phishing": {"severity": "High", "ipc": ["420", "471"], "desc": "Creating fake websites or emails to steal credentials and banking details."},
            "Fake Job Scam": {"severity": "Medium", "ipc": ["420", "465"], "desc": "Collecting fees for non-existent job offers."},
            "Online Shopping Fraud": {"severity": "Medium", "ipc": ["420", "468"], "desc": "Fraud through fake e-commerce platforms or social media sellers."},
            "Identity Theft": {"severity": "High", "ipc": ["465", "468", "471"], "desc": "Misuse of personal identity documents for financial gain."},
        }
    },
    "Financial Fraud": {
        "severity": "High",
        "ipc": ["406", "409", "420", "465", "467", "468"],
        "description": "Fraud involving financial instruments, documents or investment schemes.",
        "subtypes": {
            "Investment Scam": {"severity": "High", "ipc": ["420", "406"], "desc": "Fraudulent investment schemes promising high returns."},
            "Loan Fraud": {"severity": "High", "ipc": ["420", "468"], "desc": "Fraudulent loan applications or illegal lending activities."},
            "Credit Card Fraud": {"severity": "High", "ipc": ["420", "465"], "desc": "Unauthorised use of credit card details for financial transactions."},
            "Forgery": {"severity": "High", "ipc": ["465", "467", "468"], "desc": "Creation of forged documents, cheques or property papers."},
        }
    },
    "Assault": {
        "severity": "High",
        "ipc": ["323", "324", "325", "326", "504", "506"],
        "description": "Physical attack or violence causing bodily harm to another person.",
        "subtypes": {
            "Physical Assault": {"severity": "High", "ipc": ["323", "324"], "desc": "Direct physical attack on an individual causing injuries."},
            "Group Violence": {"severity": "Critical", "ipc": ["324", "325", "506"], "desc": "Assault by a group of persons on an individual or another group."},
            "Public Altercation": {"severity": "Medium", "ipc": ["323", "504"], "desc": "Fighting or violent confrontation in a public place."},
        }
    },
    "Missing Person": {
        "severity": "High",
        "ipc": ["363", "365"],
        "description": "Complaints regarding persons who have gone missing from their last known location.",
        "subtypes": {
            "Missing Adult": {"severity": "High", "ipc": ["365"], "desc": "Missing persons aged 18 years and above."},
            "Missing Child": {"severity": "Critical", "ipc": ["363", "365"], "desc": "Missing persons below the age of 18 years."},
        }
    },
    "Kidnapping / Abduction": {
        "severity": "Critical",
        "ipc": ["363", "364", "365", "366", "370"],
        "description": "Forceful or deceptive taking away of a person from their lawful custody or guardianship.",
        "subtypes": {
            "Kidnapping for Ransom": {"severity": "Critical", "ipc": ["364A", "365"], "desc": "Abduction of a person with demand for money or other concession."},
            "Abduction": {"severity": "Critical", "ipc": ["363", "366"], "desc": "Forceful or deceptive removal of a person from their home or custody."},
        }
    },
    "Drug & NDPS Offences": {
        "severity": "Critical",
        "ipc": ["NDPS-8", "NDPS-20", "NDPS-22", "NDPS-29"],
        "description": "Offences relating to Narcotic Drugs and Psychotropic Substances Act.",
        "subtypes": {
            "Drug Possession": {"severity": "High", "ipc": ["NDPS-8", "NDPS-20"], "desc": "Possession of controlled substances for personal consumption."},
            "Drug Trafficking": {"severity": "Critical", "ipc": ["NDPS-8", "NDPS-22", "NDPS-29"], "desc": "Production, transportation and distribution of controlled substances."},
        }
    },
    "Traffic & Road Crime": {
        "severity": "High",
        "ipc": ["279", "304A", "337", "338"],
        "description": "Offences relating to road traffic including accidents and drunk driving.",
        "subtypes": {
            "Hit and Run": {"severity": "High", "ipc": ["279", "304A"], "desc": "Causing death or injury in an accident and fleeing the scene."},
            "Drunk Driving": {"severity": "High", "ipc": ["279", "337"], "desc": "Driving a motor vehicle while under the influence of alcohol."},
            "Rash Driving": {"severity": "Medium", "ipc": ["279", "338"], "desc": "Rash and negligent driving endangering life and property."},
        }
    },
    "Property Damage": {
        "severity": "Medium",
        "ipc": ["427", "435", "436"],
        "description": "Deliberate destruction or damage to property.",
        "subtypes": {
            "Vandalism": {"severity": "Medium", "ipc": ["427"], "desc": "Deliberate destruction or damage to public or private property."},
            "Arson": {"severity": "Critical", "ipc": ["435", "436"], "desc": "Deliberate setting fire to property or crops."},
        }
    },
    "Public Disorder": {
        "severity": "High",
        "ipc": ["143", "144", "147", "148", "149"],
        "description": "Disturbance of peace and order in public spaces.",
        "subtypes": {
            "Riot": {"severity": "Critical", "ipc": ["147", "148", "149"], "desc": "Violent disturbance by a group causing injury or damage."},
            "Unlawful Assembly": {"severity": "High", "ipc": ["143", "144"], "desc": "Gathering of five or more persons for unlawful purpose."},
        }
    },
    "Illegal Arms & Organized Crime": {
        "severity": "Critical",
        "ipc": ["25", "27", "120B", "395"],
        "description": "Possession of unlicensed weapons and organised criminal gang activities.",
        "subtypes": {
            "Illegal Weapon Possession": {"severity": "Critical", "ipc": ["25", "27"], "desc": "Possession of unlicensed firearms or prohibited weapons."},
            "Organized Criminal Activity": {"severity": "Critical", "ipc": ["120B", "395"], "desc": "Criminal activities planned and executed by an organised gang."},
        }
    },
    "Environmental & Wildlife Crime": {
        "severity": "High",
        "ipc": ["WPA-51", "MMDR-21", "IFA-33"],
        "description": "Offences against environment, wildlife and forest resources.",
        "subtypes": {
            "Illegal Sand Mining": {"severity": "High", "ipc": ["MMDR-21"], "desc": "Unlawful extraction of sand from rivers and riverbeds."},
            "Wildlife Smuggling": {"severity": "Critical", "ipc": ["WPA-51"], "desc": "Illegal trade in protected wild animals, plants or their parts."},
            "Forest Offence": {"severity": "High", "ipc": ["IFA-33"], "desc": "Illegal felling of trees, forest encroachment and charcoal burning."},
        }
    },
}


def seed_categories(db) -> dict:
    """
    Upsert all crime categories into the database.
    Returns a mapping of category_name -> category_id.
    """
    now = datetime.utcnow()
    name_to_id = {}

    # ── Pass 1: Upsert parent categories ─────────────────────────────────────
    for parent_name, meta in CRIME_CATEGORY_DEFINITIONS.items():
        existing = db.query(CrimeCategory).filter(
            CrimeCategory.category_name == parent_name
        ).first()

        if existing:
            name_to_id[parent_name] = existing.category_id
            print(f"  [EXISTS]  {parent_name}")
        else:
            cat_id = str(uuid.uuid4())
            name_to_id[parent_name] = cat_id
            db.add(CrimeCategory(
                category_id=cat_id,
                category_name=parent_name,
                parent_category_id=None,
                severity=meta["severity"],
                description=meta["description"],
            ))
            print(f"  [INSERT]  {parent_name}")

    db.flush()

    # ── Pass 2: Upsert subtypes ───────────────────────────────────────────────
    for parent_name, meta in CRIME_CATEGORY_DEFINITIONS.items():
        parent_id = name_to_id[parent_name]
        for subtype_name, sub_meta in meta["subtypes"].items():
            existing = db.query(CrimeCategory).filter(
                CrimeCategory.category_name == subtype_name
            ).first()

            if existing:
                name_to_id[subtype_name] = existing.category_id
                print(f"    [EXISTS]    {subtype_name}")
            else:
                sub_id = str(uuid.uuid4())
                name_to_id[subtype_name] = sub_id
                db.add(CrimeCategory(
                    category_id=sub_id,
                    category_name=subtype_name,
                    parent_category_id=parent_id,
                    severity=sub_meta["severity"],
                    description=sub_meta["desc"],
                ))
                print(f"    [INSERT]    {subtype_name}")

    db.commit()
    return name_to_id


def main():
    print("=" * 60)
    print("  VIGILENS AI — Crime Category Seeder v2.0")
    print("  15 Categories | 40+ Subtypes")
    print("=" * 60)

    db = SessionLocal()
    try:
        print("\nSeeding crime categories...\n")
        name_to_id = seed_categories(db)

        total_parents = len(CRIME_CATEGORY_DEFINITIONS)
        total_subtypes = sum(len(v["subtypes"]) for v in CRIME_CATEGORY_DEFINITIONS.values())

        print(f"\n{'='*60}")
        print(f"  Done!")
        print(f"  Parent categories : {total_parents}")
        print(f"  Subtypes          : {total_subtypes}")
        print(f"  Total seeded      : {total_parents + total_subtypes}")
        print(f"{'='*60}")
        print("\n  Category ID map (for reference):")
        for name, cid in list(name_to_id.items())[:5]:
            print(f"  {name:<40} {cid}")
        print(f"  ... and {len(name_to_id) - 5} more.")
        print(f"\n  ✓ Database ready for multi-category Vigilens demo.")

    except Exception as e:
        db.rollback()
        print(f"\n  [ERROR] {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
