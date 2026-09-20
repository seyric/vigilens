"""
Vigilens
Police Master Data

Contains police ranks, departments,
risk levels and case priorities.
"""

# ==========================================================
# OFFICER RANKS
# ==========================================================

OFFICER_RANKS = [

    {
        "rank_id": "R001",
        "rank": "Constable",
        "level": 1
    },

    {
        "rank_id": "R002",
        "rank": "Head Constable",
        "level": 2
    },

    {
        "rank_id": "R003",
        "rank": "Assistant Sub Inspector",
        "level": 3
    },

    {
        "rank_id": "R004",
        "rank": "Sub Inspector",
        "level": 4
    },

    {
        "rank_id": "R005",
        "rank": "Inspector",
        "level": 5
    },

    {
        "rank_id": "R006",
        "rank": "Deputy Superintendent of Police",
        "level": 6
    },

    {
        "rank_id": "R007",
        "rank": "Superintendent of Police",
        "level": 7
    },

    {
        "rank_id": "R008",
        "rank": "Deputy Inspector General",
        "level": 8
    },

    {
        "rank_id": "R009",
        "rank": "Inspector General",
        "level": 9
    },

    {
        "rank_id": "R010",
        "rank": "Additional Director General",
        "level": 10
    },

    {
        "rank_id": "R011",
        "rank": "Director General of Police",
        "level": 11
    }

]

# ==========================================================
# DEPARTMENTS
# ==========================================================

DEPARTMENTS = [

    {
        "department_id": "DEP001",
        "name": "Law and Order"
    },

    {
        "department_id": "DEP002",
        "name": "Crime Branch"
    },

    {
        "department_id": "DEP003",
        "name": "Cyber Crime"
    },

    {
        "department_id": "DEP004",
        "name": "Traffic"
    },

    {
        "department_id": "DEP005",
        "name": "Women Protection Cell"
    },

    {
        "department_id": "DEP006",
        "name": "Narcotics"
    },

    {
        "department_id": "DEP007",
        "name": "Economic Offences Wing"
    },

    {
        "department_id": "DEP008",
        "name": "Intelligence"
    }

]

# ==========================================================
# CASE PRIORITY
# ==========================================================

PRIORITY_LEVELS = [

    {
        "priority_id": "P001",
        "name": "Low",
        "score": 1
    },

    {
        "priority_id": "P002",
        "name": "Medium",
        "score": 2
    },

    {
        "priority_id": "P003",
        "name": "High",
        "score": 3
    },

    {
        "priority_id": "P004",
        "name": "Critical",
        "score": 4
    }

]

# ==========================================================
# RISK LEVELS
# ==========================================================

RISK_LEVELS = [

    {
        "risk_id": "RISK001",
        "name": "Low",
        "score": 25
    },

    {
        "risk_id": "RISK002",
        "name": "Medium",
        "score": 50
    },

    {
        "risk_id": "RISK003",
        "name": "High",
        "score": 75
    },

    {
        "risk_id": "RISK004",
        "name": "Critical",
        "score": 100
    }

]

# ==========================================================
# CASE STATUS
# ==========================================================

CASE_STATUS = [

    {
        "status_id": "CS001",
        "name": "Open"
    },

    {
        "status_id": "CS002",
        "name": "Under Investigation"
    },

    {
        "status_id": "CS003",
        "name": "Chargesheet Filed"
    },

    {
        "status_id": "CS004",
        "name": "In Court"
    },

    {
        "status_id": "CS005",
        "name": "Closed"
    },

    {
        "status_id": "CS006",
        "name": "Cold Case"
    }

]