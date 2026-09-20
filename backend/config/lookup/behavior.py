"""
Vigilens
Behavior & Modus Operandi Master Data

Defines criminal behavior profiles and modus operandi
used by the synthetic crime intelligence engine.
"""

# ==========================================================
# BEHAVIOR PROFILES
# ==========================================================

BEHAVIOR_PROFILES = [

    {
        "behavior_id": "BEH001",
        "profile": "Opportunistic",
        "aggression": 20,
        "planning": 30,
        "violence": 15,
        "repeat_offender_probability": 40
    },

    {
        "behavior_id": "BEH002",
        "profile": "Organized",
        "aggression": 45,
        "planning": 95,
        "violence": 55,
        "repeat_offender_probability": 90
    },

    {
        "behavior_id": "BEH003",
        "profile": "Violent",
        "aggression": 100,
        "planning": 55,
        "violence": 100,
        "repeat_offender_probability": 85
    },

    {
        "behavior_id": "BEH004",
        "profile": "Cyber Specialist",
        "aggression": 10,
        "planning": 95,
        "violence": 0,
        "repeat_offender_probability": 75
    },

    {
        "behavior_id": "BEH005",
        "profile": "Financial Fraudster",
        "aggression": 15,
        "planning": 90,
        "violence": 5,
        "repeat_offender_probability": 80
    },

    {
        "behavior_id": "BEH006",
        "profile": "Drug Network Member",
        "aggression": 60,
        "planning": 70,
        "violence": 50,
        "repeat_offender_probability": 88
    },

    {
        "behavior_id": "BEH007",
        "profile": "Juvenile Offender",
        "aggression": 35,
        "planning": 20,
        "violence": 20,
        "repeat_offender_probability": 25
    }

]

# ==========================================================
# MODUS OPERANDI
# ==========================================================

MODUS_OPERANDI = [

    {
        "mo_id": "MO001",
        "name": "Forced Entry",
        "requires_vehicle": False,
        "uses_weapon": False,
        "organized": False,
        "digital": False
    },

    {
        "mo_id": "MO002",
        "name": "Armed Robbery",
        "requires_vehicle": True,
        "uses_weapon": True,
        "organized": True,
        "digital": False
    },

    {
        "mo_id": "MO003",
        "name": "Online Phishing",
        "requires_vehicle": False,
        "uses_weapon": False,
        "organized": True,
        "digital": True
    },

    {
        "mo_id": "MO004",
        "name": "Identity Theft",
        "requires_vehicle": False,
        "uses_weapon": False,
        "organized": True,
        "digital": True
    },

    {
        "mo_id": "MO005",
        "name": "ATM Card Cloning",
        "requires_vehicle": False,
        "uses_weapon": False,
        "organized": True,
        "digital": True
    },

    {
        "mo_id": "MO006",
        "name": "Drug Distribution Network",
        "requires_vehicle": True,
        "uses_weapon": False,
        "organized": True,
        "digital": False
    },

    {
        "mo_id": "MO007",
        "name": "Hit and Run",
        "requires_vehicle": True,
        "uses_weapon": False,
        "organized": False,
        "digital": False
    },

    {
        "mo_id": "MO008",
        "name": "Contract Killing",
        "requires_vehicle": True,
        "uses_weapon": True,
        "organized": True,
        "digital": False
    }

]