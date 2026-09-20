"""
lookup_data.py

Master lookup data for Vigilens.

This file contains ALL static reference data used throughout
the synthetic data generation engine.

DO NOT hardcode lookup values inside generators.
Always import from this module.
"""

# ==========================================================
# GENDERS
# ==========================================================

GENDERS = [
    "Male",
    "Female",
    "Non-Binary",
    "Transgender",
    "Other",
    "Prefer Not To Say"
]

# ==========================================================
# NATIONALITIES
# ==========================================================

NATIONALITIES = [
    "Indian",
    "Nepali",
    "Bangladeshi",
    "Sri Lankan",
    "Pakistani",
    "Chinese",
    "American",
    "British",
    "Canadian",
    "Australian",
    "German",
    "French",
    "Japanese",
    "South Korean",
    "Singaporean",
    "UAE",
    "Saudi Arabian",
    "Nigerian",
    "Brazilian",
    "Other"
]

# ==========================================================
# LANGUAGES
# ==========================================================

LANGUAGES = [
    "Kannada",
    "Hindi",
    "English",
    "Tamil",
    "Telugu",
    "Malayalam",
    "Marathi",
    "Gujarati",
    "Punjabi",
    "Bengali",
    "Urdu",
    "Odia",
    "Assamese",
    "Nepali",
    "Sinhala",
    "Arabic",
    "French",
    "German",
    "Spanish",
    "Mandarin"
]

# ==========================================================
# MARITAL STATUS
# ==========================================================

MARITAL_STATUS = [
    "Single",
    "Married",
    "Divorced",
    "Widowed",
    "Separated"
]

# ==========================================================
# EDUCATION LEVELS
# ==========================================================

EDUCATION_LEVELS = [
    "No Formal Education",
    "Primary School",
    "Middle School",
    "High School",
    "Diploma",
    "Undergraduate",
    "Graduate",
    "Postgraduate",
    "Doctorate",
    "Vocational Training"
]

# ==========================================================
# BLOOD GROUPS
# ==========================================================

BLOOD_GROUPS = [
    "A+","A-","B+","B-",
    "AB+","AB-","O+","O-"
]

# ==========================================================
# EYE COLORS
# ==========================================================

EYE_COLORS = [
    "Black",
    "Brown",
    "Blue",
    "Green",
    "Hazel",
    "Grey"
]

# ==========================================================
# HAIR COLORS
# ==========================================================

HAIR_COLORS = [
    "Black",
    "Brown",
    "Blonde",
    "Grey",
    "White",
    "Red"
]

# ==========================================================
# DISTRICTS (Karnataka)
# ==========================================================

DISTRICTS = [
    {
        "district_id": "DIS001",
        "district_name": "Bengaluru Urban",
        "state": "Karnataka",
        "latitude": 12.9716,
        "longitude": 77.5946
    },
    {
        "district_id": "DIS002",
        "district_name": "Bengaluru Rural",
        "state": "Karnataka",
        "latitude": 13.2846,
        "longitude": 77.6078
    },
    {
        "district_id": "DIS003",
        "district_name": "Mysuru",
        "state": "Karnataka",
        "latitude": 12.2958,
        "longitude": 76.6394
    },
    {
        "district_id": "DIS004",
        "district_name": "Mangaluru",
        "state": "Karnataka",
        "latitude": 12.9141,
        "longitude": 74.8560
    },
    {
        "district_id": "DIS005",
        "district_name": "Hubballi-Dharwad",
        "state": "Karnataka",
        "latitude": 15.3647,
        "longitude": 75.1240
    },
    {
        "district_id": "DIS006",
        "district_name": "Belagavi",
        "state": "Karnataka",
        "latitude": 15.8497,
        "longitude": 74.4977
    },
    {
        "district_id": "DIS007",
        "district_name": "Ballari",
        "state": "Karnataka",
        "latitude": 15.1394,
        "longitude": 76.9214
    },
    {
        "district_id": "DIS008",
        "district_name": "Shivamogga",
        "state": "Karnataka",
        "latitude": 13.9299,
        "longitude": 75.5681
    },
    {
        "district_id": "DIS009",
        "district_name": "Kalaburagi",
        "state": "Karnataka",
        "latitude": 17.3297,
        "longitude": 76.8343
    },
    {
        "district_id": "DIS010",
        "district_name": "Vijayapura",
        "state": "Karnataka",
        "latitude": 16.8302,
        "longitude": 75.7100
    }
]

POLICE_STATIONS = [
    {
        "station_id": "PS001",
        "station_name": "Cubbon Park Police Station",
        "district_id": "DIS001"
    },
    {
        "station_id": "PS002",
        "station_name": "Ashok Nagar Police Station",
        "district_id": "DIS001"
    },
    {
        "station_id": "PS003",
        "station_name": "Mysuru South Police Station",
        "district_id": "DIS003"
    },
    {
        "station_id": "PS004",
        "station_name": "Mangaluru North Police Station",
        "district_id": "DIS004"
    },
    {
        "station_id": "PS005",
        "station_name": "Hubballi Town Police Station",
        "district_id": "DIS005"
    }
]
JAILS = [
    {
        "jail_id": "JAIL001",
        "jail_name": "Bengaluru Central Prison",
        "district_id": "DIS001",
        "security_level": "Maximum",
        "capacity": 5000
    },
    {
        "jail_id": "JAIL002",
        "jail_name": "Mysuru District Prison",
        "district_id": "DIS003",
        "security_level": "Medium",
        "capacity": 1500
    },
    {
        "jail_id": "JAIL003",
        "jail_name": "Belagavi Central Prison",
        "district_id": "DIS006",
        "security_level": "Maximum",
        "capacity": 2500
    }
]
COURTS = [
    {
        "court_id": "CRT001",
        "court_name": "Bengaluru District Court",
        "district_id": "DIS001",
        "court_type": "District Court"
    },
    {
        "court_id": "CRT002",
        "court_name": "Mysuru District Court",
        "district_id": "DIS003",
        "court_type": "District Court"
    },
    {
        "court_id": "CRT003",
        "court_name": "Karnataka High Court",
        "district_id": "DIS001",
        "court_type": "High Court"
    }
]