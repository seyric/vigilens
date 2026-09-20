"""
Vigilens
Crime Master Data

Defines crime categories and subtypes used across the
synthetic crime intelligence engine.
"""

# ==========================================================
# CRIME CATEGORIES
# ==========================================================

CRIME_CATEGORIES = [
    {
        "category_id": "CAT001",
        "name": "Violent Crime",
        "severity": "Critical",
        "is_violent": True,
        "is_cyber": False,
        "is_financial": False,
        "is_organized": True
    },
    {
        "category_id": "CAT002",
        "name": "Property Crime",
        "severity": "Medium",
        "is_violent": False,
        "is_cyber": False,
        "is_financial": False,
        "is_organized": False
    },
    {
        "category_id": "CAT003",
        "name": "Cyber Crime",
        "severity": "High",
        "is_violent": False,
        "is_cyber": True,
        "is_financial": True,
        "is_organized": True
    },
    {
        "category_id": "CAT004",
        "name": "Financial Crime",
        "severity": "High",
        "is_violent": False,
        "is_cyber": False,
        "is_financial": True,
        "is_organized": True
    },
    {
        "category_id": "CAT005",
        "name": "Drug Offence",
        "severity": "High",
        "is_violent": False,
        "is_cyber": False,
        "is_financial": False,
        "is_organized": True
    },
    {
        "category_id": "CAT006",
        "name": "Traffic Offence",
        "severity": "Low",
        "is_violent": False,
        "is_cyber": False,
        "is_financial": False,
        "is_organized": False
    },
    {
        "category_id": "CAT007",
        "name": "Public Order",
        "severity": "Medium",
        "is_violent": False,
        "is_cyber": False,
        "is_financial": False,
        "is_organized": False
    }
]

# ==========================================================
# CRIME SUBTYPES
# ==========================================================

CRIME_SUBTYPES = [

    {
        "subtype_id": "SUB001",
        "category_id": "CAT001",
        "name": "Murder"
    },
    {
        "subtype_id": "SUB002",
        "category_id": "CAT001",
        "name": "Attempt to Murder"
    },
    {
        "subtype_id": "SUB003",
        "category_id": "CAT001",
        "name": "Kidnapping"
    },
    {
        "subtype_id": "SUB004",
        "category_id": "CAT001",
        "name": "Assault"
    },

    {
        "subtype_id": "SUB005",
        "category_id": "CAT002",
        "name": "Theft"
    },
    {
        "subtype_id": "SUB006",
        "category_id": "CAT002",
        "name": "Burglary"
    },
    {
        "subtype_id": "SUB007",
        "category_id": "CAT002",
        "name": "Robbery"
    },

    {
        "subtype_id": "SUB008",
        "category_id": "CAT003",
        "name": "Phishing"
    },
    {
        "subtype_id": "SUB009",
        "category_id": "CAT003",
        "name": "Identity Theft"
    },
    {
        "subtype_id": "SUB010",
        "category_id": "CAT003",
        "name": "Ransomware"
    },

    {
        "subtype_id": "SUB011",
        "category_id": "CAT004",
        "name": "Money Laundering"
    },
    {
        "subtype_id": "SUB012",
        "category_id": "CAT004",
        "name": "Fraud"
    },

    {
        "subtype_id": "SUB013",
        "category_id": "CAT005",
        "name": "Drug Possession"
    },
    {
        "subtype_id": "SUB014",
        "category_id": "CAT005",
        "name": "Drug Trafficking"
    },

    {
        "subtype_id": "SUB015",
        "category_id": "CAT006",
        "name": "Drunk Driving"
    },
    {
        "subtype_id": "SUB016",
        "category_id": "CAT006",
        "name": "Hit and Run"
    },

    {
        "subtype_id": "SUB017",
        "category_id": "CAT007",
        "name": "Rioting"
    },
    {
        "subtype_id": "SUB018",
        "category_id": "CAT007",
        "name": "Unlawful Assembly"
    }
]