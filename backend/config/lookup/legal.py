"""
Vigilens
Legal Master Data

Stores legal sections, punishment details,
and bail eligibility.
"""

# ==========================================================
# LEGAL SECTIONS
# ==========================================================

LEGAL_SECTIONS = [

    {
        "section_id": "LEG001",
        "law": "BNS",
        "section": "103",
        "offence": "Murder",
        "max_punishment": "Death / Life Imprisonment",
        "bailable": False
    },

    {
        "section_id": "LEG002",
        "law": "BNS",
        "section": "109",
        "offence": "Attempt to Murder",
        "max_punishment": "10 Years",
        "bailable": False
    },

    {
        "section_id": "LEG003",
        "law": "BNS",
        "section": "304",
        "offence": "Theft",
        "max_punishment": "3 Years",
        "bailable": True
    },

    {
        "section_id": "LEG004",
        "law": "BNS",
        "section": "309",
        "offence": "Robbery",
        "max_punishment": "10 Years",
        "bailable": False
    },

    {
        "section_id": "LEG005",
        "law": "Information Technology Act",
        "section": "66C",
        "offence": "Identity Theft",
        "max_punishment": "3 Years",
        "bailable": True
    },

    {
        "section_id": "LEG006",
        "law": "Information Technology Act",
        "section": "66D",
        "offence": "Cheating by Personation using Computer",
        "max_punishment": "3 Years",
        "bailable": True
    },

    {
        "section_id": "LEG007",
        "law": "NDPS Act",
        "section": "21",
        "offence": "Drug Possession",
        "max_punishment": "10 Years",
        "bailable": False
    },

    {
        "section_id": "LEG008",
        "law": "Motor Vehicles Act",
        "section": "185",
        "offence": "Drunk Driving",
        "max_punishment": "Fine / Imprisonment",
        "bailable": True
    }
]