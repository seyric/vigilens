"""
Vigilens
Evidence Master Data

Defines evidence types and forensic laboratories
used throughout the synthetic crime intelligence engine.
"""

# ==========================================================
# EVIDENCE CATEGORIES
# ==========================================================

EVIDENCE_CATEGORIES = [

    {
        "category_id": "EC001",
        "name": "Physical"
    },

    {
        "category_id": "EC002",
        "name": "Digital"
    },

    {
        "category_id": "EC003",
        "name": "Financial"
    },

    {
        "category_id": "EC004",
        "name": "Documentary"
    },

    {
        "category_id": "EC005",
        "name": "Biological"
    }

]

# ==========================================================
# EVIDENCE TYPES
# ==========================================================

EVIDENCE_TYPES = [

    {
        "evidence_type_id": "EV001",
        "category_id": "EC001",
        "name": "Weapon"
    },

    {
        "evidence_type_id": "EV002",
        "category_id": "EC001",
        "name": "Fingerprint"
    },

    {
        "evidence_type_id": "EV003",
        "category_id": "EC001",
        "name": "Footprint"
    },

    {
        "evidence_type_id": "EV004",
        "category_id": "EC001",
        "name": "Clothing"
    },

    {
        "evidence_type_id": "EV005",
        "category_id": "EC002",
        "name": "Mobile Phone"
    },

    {
        "evidence_type_id": "EV006",
        "category_id": "EC002",
        "name": "Laptop"
    },

    {
        "evidence_type_id": "EV007",
        "category_id": "EC002",
        "name": "CCTV Footage"
    },

    {
        "evidence_type_id": "EV008",
        "category_id": "EC002",
        "name": "Email Records"
    },

    {
        "evidence_type_id": "EV009",
        "category_id": "EC003",
        "name": "Bank Statement"
    },

    {
        "evidence_type_id": "EV010",
        "category_id": "EC003",
        "name": "UPI Transaction"
    },

    {
        "evidence_type_id": "EV011",
        "category_id": "EC003",
        "name": "Credit Card Record"
    },

    {
        "evidence_type_id": "EV012",
        "category_id": "EC004",
        "name": "Passport"
    },

    {
        "evidence_type_id": "EV013",
        "category_id": "EC004",
        "name": "Aadhaar Card"
    },

    {
        "evidence_type_id": "EV014",
        "category_id": "EC004",
        "name": "Driving Licence"
    },

    {
        "evidence_type_id": "EV015",
        "category_id": "EC005",
        "name": "DNA Sample"
    },

    {
        "evidence_type_id": "EV016",
        "category_id": "EC005",
        "name": "Blood Sample"
    },

    {
        "evidence_type_id": "EV017",
        "category_id": "EC005",
        "name": "Hair Sample"
    }

]

# ==========================================================
# FORENSIC LABS
# ==========================================================

FORENSIC_LABS = [

    {
        "lab_id": "LAB001",
        "name": "Bengaluru FSL",
        "city": "Bengaluru"
    },

    {
        "lab_id": "LAB002",
        "name": "Mysuru FSL",
        "city": "Mysuru"
    },

    {
        "lab_id": "LAB003",
        "name": "Mangaluru FSL",
        "city": "Mangaluru"
    },

    {
        "lab_id": "LAB004",
        "name": "Hubballi FSL",
        "city": "Hubballi"
    }

]

# ==========================================================
# CHAIN OF CUSTODY STATUS
# ==========================================================

CHAIN_OF_CUSTODY_STATUS = [

    {
        "status_id": "CC001",
        "name": "Collected"
    },

    {
        "status_id": "CC002",
        "name": "Sealed"
    },

    {
        "status_id": "CC003",
        "name": "Transferred to FSL"
    },

    {
        "status_id": "CC004",
        "name": "Under Analysis"
    },

    {
        "status_id": "CC005",
        "name": "Returned"
    },

    {
        "status_id": "CC006",
        "name": "Presented in Court"
    }

]