"""
Vigilens
Occupation Master Lookup

Contains occupations grouped by sector for realistic
synthetic population generation.
"""

# ==========================================================
# EMPLOYMENT TYPES
# ==========================================================

EMPLOYMENT_TYPES = [

    {"employment_type_id": "ET001", "name": "Government"},
    {"employment_type_id": "ET002", "name": "Private"},
    {"employment_type_id": "ET003", "name": "Self Employed"},
    {"employment_type_id": "ET004", "name": "Business Owner"},
    {"employment_type_id": "ET005", "name": "Student"},
    {"employment_type_id": "ET006", "name": "Unemployed"},
    {"employment_type_id": "ET007", "name": "Retired"},
    {"employment_type_id": "ET008", "name": "Freelancer"}

]

# ==========================================================
# OCCUPATIONS
# ==========================================================

OCCUPATIONS = [

    # -------------------- IT --------------------

    {
        "occupation_id": "OCC001",
        "name": "Software Engineer",
        "sector": "IT",
        "employment_type": "Private",
        "income_band": "High"
    },

    {
        "occupation_id": "OCC002",
        "name": "Data Scientist",
        "sector": "IT",
        "employment_type": "Private",
        "income_band": "High"
    },

    {
        "occupation_id": "OCC003",
        "name": "Cyber Security Analyst",
        "sector": "IT",
        "employment_type": "Private",
        "income_band": "High"
    },

    {
        "occupation_id": "OCC004",
        "name": "AI Engineer",
        "sector": "IT",
        "employment_type": "Private",
        "income_band": "High"
    },

    {
        "occupation_id": "OCC005",
        "name": "System Administrator",
        "sector": "IT",
        "employment_type": "Private",
        "income_band": "Medium"
    },

    # -------------------- Healthcare --------------------

    {
        "occupation_id": "OCC006",
        "name": "Doctor",
        "sector": "Healthcare",
        "employment_type": "Government",
        "income_band": "High"
    },

    {
        "occupation_id": "OCC007",
        "name": "Nurse",
        "sector": "Healthcare",
        "employment_type": "Government",
        "income_band": "Medium"
    },

    {
        "occupation_id": "OCC008",
        "name": "Pharmacist",
        "sector": "Healthcare",
        "employment_type": "Private",
        "income_band": "Medium"
    },

    # -------------------- Education --------------------

    {
        "occupation_id": "OCC009",
        "name": "Teacher",
        "sector": "Education",
        "employment_type": "Government",
        "income_band": "Medium"
    },

    {
        "occupation_id": "OCC010",
        "name": "Professor",
        "sector": "Education",
        "employment_type": "Government",
        "income_band": "High"
    },

    # -------------------- Law Enforcement --------------------

    {
        "occupation_id": "OCC011",
        "name": "Police Constable",
        "sector": "Law Enforcement",
        "employment_type": "Government",
        "income_band": "Medium"
    },

    {
        "occupation_id": "OCC012",
        "name": "Police Inspector",
        "sector": "Law Enforcement",
        "employment_type": "Government",
        "income_band": "High"
    },

    # -------------------- Agriculture --------------------

    {
        "occupation_id": "OCC013",
        "name": "Farmer",
        "sector": "Agriculture",
        "employment_type": "Self Employed",
        "income_band": "Low"
    },

    # -------------------- Transport --------------------

    {
        "occupation_id": "OCC014",
        "name": "Bus Driver",
        "sector": "Transportation",
        "employment_type": "Government",
        "income_band": "Medium"
    },

    {
        "occupation_id": "OCC015",
        "name": "Truck Driver",
        "sector": "Transportation",
        "employment_type": "Private",
        "income_band": "Medium"
    },

    # -------------------- Finance --------------------

    {
        "occupation_id": "OCC016",
        "name": "Bank Manager",
        "sector": "Finance",
        "employment_type": "Government",
        "income_band": "High"
    },

    {
        "occupation_id": "OCC017",
        "name": "Accountant",
        "sector": "Finance",
        "employment_type": "Private",
        "income_band": "Medium"
    },

    # -------------------- Retail --------------------

    {
        "occupation_id": "OCC018",
        "name": "Shop Owner",
        "sector": "Retail",
        "employment_type": "Business Owner",
        "income_band": "Medium"
    },

    {
        "occupation_id": "OCC019",
        "name": "Sales Executive",
        "sector": "Retail",
        "employment_type": "Private",
        "income_band": "Medium"
    },

    # -------------------- General --------------------

    {
        "occupation_id": "OCC020",
        "name": "Student",
        "sector": "Education",
        "employment_type": "Student",
        "income_band": "None"
    },

    {
        "occupation_id": "OCC021",
        "name": "Homemaker",
        "sector": "Domestic",
        "employment_type": "Unemployed",
        "income_band": "None"
    },

    {
        "occupation_id": "OCC022",
        "name": "Retired",
        "sector": "General",
        "employment_type": "Retired",
        "income_band": "Pension"
    }

]