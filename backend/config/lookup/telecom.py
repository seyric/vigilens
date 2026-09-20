"""
Vigilens
Telecom Master Lookup

Contains telecom-related lookup tables used for
PhoneGenerator, CDR Generator and Digital Intelligence.
"""

# ==========================================================
# TELECOM PROVIDERS
# ==========================================================

TELECOM_PROVIDERS = [

    {
        "provider_id": "TEL001",
        "name": "Reliance Jio",
        "short_name": "Jio"
    },

    {
        "provider_id": "TEL002",
        "name": "Bharti Airtel",
        "short_name": "Airtel"
    },

    {
        "provider_id": "TEL003",
        "name": "Vodafone Idea",
        "short_name": "Vi"
    },

    {
        "provider_id": "TEL004",
        "name": "BSNL",
        "short_name": "BSNL"
    }

]

# ==========================================================
# SIM TYPES
# ==========================================================

SIM_TYPES = [

    {
        "sim_type_id": "SIM001",
        "name": "2G"
    },

    {
        "sim_type_id": "SIM002",
        "name": "3G"
    },

    {
        "sim_type_id": "SIM003",
        "name": "4G"
    },

    {
        "sim_type_id": "SIM004",
        "name": "5G"
    },

    {
        "sim_type_id": "SIM005",
        "name": "eSIM"
    }

]

# ==========================================================
# PHONE STATUS
# ==========================================================

PHONE_STATUS = [

    {
        "status_id": "PS001",
        "name": "Active"
    },

    {
        "status_id": "PS002",
        "name": "Inactive"
    },

    {
        "status_id": "PS003",
        "name": "Suspended"
    },

    {
        "status_id": "PS004",
        "name": "Lost"
    },

    {
        "status_id": "PS005",
        "name": "Stolen"
    }

]

# ==========================================================
# CONNECTION TYPES
# ==========================================================

CONNECTION_TYPES = [

    {
        "connection_type_id": "CT001",
        "name": "Prepaid"
    },

    {
        "connection_type_id": "CT002",
        "name": "Postpaid"
    }

]