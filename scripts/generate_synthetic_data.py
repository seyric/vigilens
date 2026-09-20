#!/usr/bin/env python3
"""
Vigilens - Synthetic Data Generator
=======================================
Generates realistic synthetic CSV datasets for Karnataka State Police
Crime Intelligence Operating System (Sprint 1).

Entities (15 primary + 8 junction):
  Primary: districts, police_stations, officers, crime_categories, firs,
           crimes, suspects, victims, witnesses, vehicles, weapons,
           evidence, users, roles
  Junction: fir_suspects, fir_victims, fir_witnesses, fir_vehicles,
            fir_weapons, fir_evidence, crime_suspects, user_roles

Author: Vigilens Data Engineering Team
"""

import csv
import os
import random
import uuid
import hashlib
from datetime import datetime, timedelta

# ─── Reproducibility ──────────────────────────────────────────────────────────
random.seed(42)

# ─── Output base path ─────────────────────────────────────────────────────────
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
RAW_DIR = os.path.join(BASE_DIR, 'datasets', 'raw')

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def write_csv(entity_name, rows, fieldnames):
    """Write rows to datasets/raw/{entity_name}/{entity_name}.csv"""
    folder = os.path.join(RAW_DIR, entity_name)
    ensure_dir(folder)
    # extract just the last part for filename
    basename = entity_name.split('/')[-1] if '/' in entity_name else entity_name
    filepath = os.path.join(folder, f'{basename}.csv')
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"  > {entity_name}: {len(rows)} rows -> {filepath}")
    return filepath

# ─── UUID helper ───────────────────────────────────────────────────────────────
def genuuid():
    return str(uuid.uuid4())

# ─── Date helpers ──────────────────────────────────────────────────────────────
START_DATE = datetime(2022, 1, 1)
END_DATE   = datetime(2024, 12, 31)
TOTAL_DAYS = (END_DATE - START_DATE).days

def random_date(start=None, end=None):
    s = start or START_DATE
    e = end or END_DATE
    delta = (e - s).days
    if delta <= 0:
        return s
    return s + timedelta(days=random.randint(0, delta))

def random_datetime(start=None, end=None):
    d = random_date(start, end)
    return d.replace(hour=random.randint(0, 23),
                     minute=random.randint(0, 59),
                     second=random.randint(0, 59))

def fmt_date(dt):
    return dt.strftime('%Y-%m-%d')

def fmt_datetime(dt):
    return dt.strftime('%Y-%m-%d %H:%M:%S')

# ═══════════════════════════════════════════════════════════════════════════════
#  REFERENCE DATA - Karnataka-specific
# ═══════════════════════════════════════════════════════════════════════════════

KARNATAKA_DISTRICTS = [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
    "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga",
    "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan",
    "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal",
    "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga",
    "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir",
]

# District-to-division mapping
DISTRICT_DIVISION = {
    "Bengaluru Urban": "Bengaluru", "Bengaluru Rural": "Bengaluru",
    "Ramanagara": "Bengaluru", "Tumakuru": "Bengaluru", "Chikballapur": "Bengaluru",
    "Kolar": "Bengaluru", "Chitradurga": "Bengaluru", "Davanagere": "Bengaluru",
    "Shivamogga": "Bengaluru",
    "Mysuru": "Mysuru", "Mandya": "Mysuru", "Chamarajanagar": "Mysuru",
    "Hassan": "Mysuru", "Kodagu": "Mysuru", "Chikkamagaluru": "Mysuru",
    "Dakshina Kannada": "Mysuru", "Udupi": "Mysuru",
    "Belagavi": "Belagavi", "Dharwad": "Belagavi", "Haveri": "Belagavi",
    "Gadag": "Belagavi", "Uttara Kannada": "Belagavi", "Bagalkot": "Belagavi",
    "Vijayapura": "Belagavi",
    "Kalaburagi": "Kalaburagi", "Bidar": "Kalaburagi", "Raichur": "Kalaburagi",
    "Koppal": "Kalaburagi", "Ballari": "Kalaburagi", "Yadgir": "Kalaburagi",
}

# RTO codes for vehicle registration
DISTRICT_RTO_CODES = {
    "Bengaluru Urban": ["KA01", "KA02", "KA03", "KA04", "KA05", "KA41",
                        "KA50", "KA51", "KA52", "KA53"],
    "Bengaluru Rural": ["KA57"],
    "Mysuru": ["KA09", "KA55"],
    "Belagavi": ["KA22"],
    "Ballari": ["KA26"],
    "Dakshina Kannada": ["KA19", "KA21"],
    "Tumakuru": ["KA06"],
    "Kolar": ["KA07"],
    "Mandya": ["KA10"],
    "Hassan": ["KA13"],
    "Dharwad": ["KA25"],
    "Shivamogga": ["KA14"],
    "Davanagere": ["KA16"],
    "Chitradurga": ["KA15"],
    "Chikkamagaluru": ["KA18"],
    "Udupi": ["KA20"],
    "Kalaburagi": ["KA32"],
    "Raichur": ["KA36"],
    "Bidar": ["KA38"],
    "Kodagu": ["KA12"],
    "Haveri": ["KA24"],
    "Gadag": ["KA27"],
    "Koppal": ["KA37"],
    "Bagalkot": ["KA23"],
    "Vijayapura": ["KA28"],
    "Uttara Kannada": ["KA29", "KA48"],
    "Yadgir": ["KA39"],
    "Chamarajanagar": ["KA11"],
    "Chikballapur": ["KA08"],
    "Ramanagara": ["KA43"],
}

# Police station name templates per district
PS_TEMPLATES = {
    "Bengaluru Urban": [
        "Cubbon Park", "Koramangala", "Indiranagar", "HSR Layout",
        "Whitefield", "Electronic City", "Jayanagar", "Rajajinagar",
        "Yelahanka", "Marathahalli", "JP Nagar", "Basavanagudi",
        "KR Puram", "Mahadevapura", "Hebbal", "Banashankari",
        "BTM Layout", "Bommanahalli", "Ramamurthy Nagar", "Peenya"
    ],
    "Mysuru": [
        "Devaraja", "Nazarbad", "Lashkar Mohalla", "Kuvempunagar",
        "Jayalakshmipuram", "Vijayanagar"
    ],
    "Belagavi": [
        "Camp", "Market", "Udyambag", "Shahapur", "Tilakwadi"
    ],
    "Kalaburagi": [
        "Brahmapur", "Maha Gandhi", "Chowk", "Jewargi Colony"
    ],
}

# Generic station name parts for other districts
GENERIC_PS_NAMES = [
    "Town", "City", "Rural", "East", "West", "North", "South",
    "Market Yard", "Taluk", "Cantonment", "New Town", "Old Town",
    "Industrial Area", "University", "Railway Station", "Bus Stand",
    "Circle", "Nagar"
]

# ─── Indian names ──────────────────────────────────────────────────────────────
MALE_FIRST = [
    "Ramesh", "Suresh", "Mahesh", "Rajesh", "Ganesh", "Venkatesh",
    "Manjunath", "Basavaraj", "Shivakumar", "Siddaramaiah", "Krishnappa",
    "Nagaraj", "Shankar", "Ravi", "Kumar", "Arun", "Vijay", "Prasad",
    "Anand", "Mohan", "Deepak", "Sanjay", "Kiran", "Manoj", "Sunil",
    "Naveen", "Vinod", "Ashok", "Harish", "Girish", "Pradeep",
    "Srinivas", "Raghavendra", "Jagadish", "Prakash", "Dinesh",
    "Umesh", "Ramachandra", "Hanumanthappa", "Mallikarjun",
    "Channappa", "Sangamesh", "Fakkirappa", "Yamanappa", "Basappa",
    "Iranna", "Sharanappa", "Shivanand", "Veerabhadra", "Ningappa",
    "Amith", "Rohit", "Sachin", "Prashant", "Santosh",
    "Chethan", "Darshan", "Abhishek", "Akash", "Mohammed",
    "Imran", "Saleem", "Farhan", "Abdul", "Rizwan",
    "Ibrahim", "Ismail", "Altaf", "Asif", "Nadeem",
    "Joseph", "David", "Samuel", "Daniel", "Thomas"
]

FEMALE_FIRST = [
    "Lakshmi", "Parvathi", "Saraswathi", "Savitri", "Meena",
    "Geetha", "Shantha", "Bhagya", "Suma", "Anitha",
    "Rekha", "Kavitha", "Sunitha", "Padma", "Pushpa",
    "Roopa", "Asha", "Mamatha", "Nethravathi", "Jayamma",
    "Rashmi", "Pooja", "Divya", "Sneha", "Priya",
    "Swathi", "Anusha", "Nandini", "Vidya", "Shilpa",
    "Deepika", "Pallavi", "Rachana", "Sinchana", "Chaitra",
    "Akshatha", "Ramya", "Sahana", "Tejaswini", "Shwetha",
    "Fatima", "Ayesha", "Amina", "Zainab", "Nafisa",
    "Maria", "Grace", "Sarah", "Ruth", "Rebecca"
]

LAST_NAMES = [
    "Gowda", "Shetty", "Naik", "Patil", "Reddy", "Hegde", "Rao",
    "Kumar", "Sharma", "Patel", "Kulkarni", "Desai", "Joshi",
    "Nayak", "Bhat", "Acharya", "Kamath", "Shenoy", "Poojary",
    "Bangera", "Devadiga", "Kini", "Suvarna", "Shettigar",
    "Hiremath", "Hosur", "Hubli", "Mudhol", "Badami",
    "Bijapur", "Raichur", "Bellary", "Koppal", "Gadag",
    "Biradar", "Hadagali", "Hukkeri", "Savadi", "Kattimani",
    "Madar", "Lamani", "Nayaka", "Thimmappa", "Sidda",
    "Hanumanthachar", "Lingappa", "Basavalingappa", "Dodda",
    "Khan", "Ahmed", "Sheikh", "Pasha", "Baig",
    "Pereira", "D'Souza", "Fernandes", "Lobo", "Rodrigues"
]

# ─── IPC Sections and Crime categories ────────────────────────────────────────
IPC_SECTIONS = [
    "302", "304", "304A", "306", "307", "323", "324", "325",
    "326", "341", "342", "354", "354A", "354B", "354C", "354D",
    "363", "365", "366", "370", "376", "376A", "376D",
    "379", "380", "381", "382", "384", "385", "386", "387",
    "388", "389", "390", "392", "393", "394", "395", "396",
    "397", "399", "406", "408", "409", "411", "413", "414",
    "415", "417", "418", "419", "420", "421", "422",
    "427", "435", "436", "447", "448", "449", "450",
    "452", "453", "454", "456", "457", "458", "459", "460",
    "465", "467", "468", "471", "489A", "489B", "489C",
    "494", "498A", "504", "506", "509", "511"
]

CRIME_CATEGORY_HIERARCHY = {
    "Crimes Against Person": [
        "Murder", "Attempt to Murder", "Culpable Homicide",
        "Dowry Death", "Abetment of Suicide", "Assault",
        "Grievous Hurt", "Simple Hurt", "Kidnapping",
        "Kidnapping of Women", "Human Trafficking"
    ],
    "Crimes Against Women": [
        "Rape", "Attempt to Rape", "Sexual Harassment",
        "Voyeurism", "Stalking", "Dowry Cruelty",
        "Domestic Violence", "Eve Teasing"
    ],
    "Crimes Against Property": [
        "Dacoity", "Robbery", "Burglary",
        "House Breaking", "Theft", "Motor Vehicle Theft",
        "Chain Snatching", "Extortion", "Criminal Breach of Trust",
        "Cheating", "Forgery", "Counterfeiting"
    ],
    "Crimes Against Public Order": [
        "Rioting", "Unlawful Assembly", "Arson",
        "Mischief", "Criminal Trespass", "House Trespass"
    ],
    "Cyber Crimes": [
        "Online Fraud", "Identity Theft", "Cyber Stalking",
        "Ransomware", "Data Theft", "Social Media Crime"
    ],
    "Economic Offences": [
        "Bank Fraud", "Investment Fraud", "Insurance Fraud",
        "Money Laundering"
    ],
}

WEAPON_TYPES = [
    "Knife", "Machete", "Axe", "Sword", "Dagger", "Sickle",
    "Country-made Pistol", "Revolver", "Rifle", "Shotgun",
    "Iron Rod", "Wooden Stick", "Cricket Bat", "Hockey Stick",
    "Stone", "Brick", "Glass Bottle", "Acid",
    "Rope", "Wire", "Chain", "Hammer",
    "Explosive", "Petrol Bomb", "Grenade",
    "Bare Hands", "Blunt Object", "Sharp Object", "Unknown"
]

EVIDENCE_TYPES = [
    "Physical", "Documentary", "Digital", "Forensic",
    "Testimonial", "Photographic", "Video", "Audio",
    "Biological", "Ballistic", "Chemical", "Trace"
]

EVIDENCE_SUBTYPES = {
    "Physical": ["Weapon", "Clothing", "Tool", "Vehicle Part", "Broken Lock", "Footwear"],
    "Documentary": ["FIR Copy", "Panchanama", "Medical Report", "Bank Statement",
                    "Phone Records", "Aadhaar Card", "Driving License", "Property Deed"],
    "Digital": ["CCTV Footage", "Mobile Phone Data", "Email Records",
                "Social Media Posts", "GPS Data", "Computer Hard Drive", "USB Drive"],
    "Forensic": ["Fingerprints", "DNA Sample", "Blood Sample", "Hair Sample",
                 "Fibre Sample", "Soil Sample", "Paint Sample"],
    "Testimonial": ["Witness Statement", "Dying Declaration", "Confession Statement",
                    "Expert Opinion"],
    "Photographic": ["Crime Scene Photos", "Injury Photos", "Evidence Photos",
                     "Surveillance Photos"],
    "Video": ["Body Cam Footage", "Dash Cam Footage", "CCTV Recording",
              "Drone Footage", "Mobile Video"],
    "Audio": ["Phone Call Recording", "Ambient Recording", "911 Call Recording"],
    "Biological": ["Blood Stain", "Semen Sample", "Saliva Sample", "Tissue Sample"],
    "Ballistic": ["Bullet", "Cartridge Case", "Firearm", "Gun Powder Residue"],
    "Chemical": ["Drug Sample", "Poison Sample", "Explosive Residue", "Accelerant"],
    "Trace": ["Glass Fragment", "Paint Chip", "Tyre Mark", "Tool Mark"]
}

VEHICLE_MAKES_MODELS = {
    "Maruti Suzuki": ["Alto", "Swift", "Baleno", "Dzire", "WagonR",
                      "Brezza", "Ertiga", "Celerio", "S-Presso", "Eeco"],
    "Hyundai": ["i10", "i20", "Creta", "Venue", "Verna", "Aura", "Alcazar"],
    "Tata": ["Nexon", "Harrier", "Safari", "Punch", "Altroz", "Tiago", "Tigor"],
    "Mahindra": ["Scorpio", "Bolero", "XUV700", "Thar", "XUV300"],
    "Honda": ["City", "Amaze", "WR-V", "Jazz"],
    "Toyota": ["Innova", "Fortuner", "Glanza", "Urban Cruiser"],
    "Kia": ["Seltos", "Sonet", "Carens"],
    "Bajaj": ["Pulsar", "Dominar", "Platina", "CT100", "Avenger"],
    "Hero": ["Splendor", "HF Deluxe", "Glamour", "Xtreme", "Xpulse"],
    "TVS": ["Apache", "Jupiter", "Ntorq", "Raider", "Star City"],
    "Royal Enfield": ["Classic 350", "Bullet", "Meteor", "Hunter 350", "Himalayan"],
    "Yamaha": ["FZ", "R15", "MT-15", "Fascino", "Ray ZR"],
    "Honda MC": ["Activa", "Shine", "Unicorn", "SP125", "Dio"],
    "Ashok Leyland": ["Dost", "Bada Dost", "Partner", "Ecomet"],
    "TATA CV": ["Ace", "Yodha", "Intra", "Ultra"],
    "Eicher": ["Pro 2049", "Pro 3015", "Pro 6025"]
}

VEHICLE_COLORS = [
    "White", "Silver", "Grey", "Black", "Red", "Blue",
    "Brown", "Green", "Yellow", "Orange", "Maroon", "Beige"
]

ADDRESSES_AREAS = [
    "MG Road", "Brigade Road", "Residency Road", "Commercial Street",
    "Gandhi Nagar", "Nehru Nagar", "Ambedkar Nagar", "Rajiv Nagar",
    "Jawahar Nagar", "Basaveshwara Nagar", "Vidyanagar",
    "Shivaji Nagar", "Subhash Nagar", "Tilak Nagar",
    "Industrial Area", "Market Area", "Railway Colony",
    "Teachers Colony", "Doctors Colony", "Bank Colony",
    "1st Cross", "2nd Cross", "3rd Main", "4th Main",
    "5th Cross", "6th Main", "7th Cross", "8th Main",
    "9th Cross", "10th Main", "Ring Road", "Bypass Road",
    "Station Road", "Temple Road", "College Road", "Hospital Road",
    "Bus Stand Road", "Lake View", "Hill View", "Park View"
]

OFFICER_RANKS = [
    "Director General of Police",
    "Additional Director General of Police",
    "Inspector General of Police",
    "Deputy Inspector General of Police",
    "Superintendent of Police",
    "Additional Superintendent of Police",
    "Deputy Superintendent of Police",
    "Inspector", "Sub-Inspector", "Assistant Sub-Inspector",
    "Head Constable", "Constable"
]

RANK_WEIGHTS = [1, 2, 4, 6, 31, 31, 40, 80, 100, 60, 80, 65]

OFFICER_DESIGNATIONS = {
    "Director General of Police": ["DGP"],
    "Additional Director General of Police": ["ADGP Crime", "ADGP Law & Order", "ADGP Training"],
    "Inspector General of Police": ["IGP Bengaluru", "IGP Mysuru", "IGP Belagavi", "IGP Kalaburagi"],
    "Deputy Inspector General of Police": ["DIG Range", "DIG Admin", "DIG Crime"],
    "Superintendent of Police": ["SP"],
    "Additional Superintendent of Police": ["Addl SP"],
    "Deputy Superintendent of Police": ["Dy SP Circle", "Dy SP Crime"],
    "Inspector": ["SHO", "Inspector Crime", "Inspector Traffic", "Inspector CEN"],
    "Sub-Inspector": ["SI Law & Order", "SI Crime", "SI Traffic"],
    "Assistant Sub-Inspector": ["ASI"],
    "Head Constable": ["HC"],
    "Constable": ["PC"]
}

ROLES_DATA = [
    ("Super Admin", "Full system access with all permissions"),
    ("Admin", "Administrative access for user and system management"),
    ("SP", "Superintendent of Police - district level access"),
    ("Inspector", "Station House Officer level access"),
    ("Sub-Inspector", "Sub-Inspector level access for case management"),
    ("Data Analyst", "Read-only analytical access to dashboards and reports"),
    ("Forensic Expert", "Access to evidence and forensic data modules"),
    ("Viewer", "Basic read-only access to public case information")
]

FIR_STATUSES = [
    "Registered", "Under Investigation", "Charge Sheet Filed",
    "Closed", "Transferred", "Reopened", "Referred to Court"
]

CRIME_STATUSES = [
    "Reported", "Under Investigation", "Evidence Collection",
    "Suspect Identified", "Arrested", "Charge Sheeted",
    "Acquitted", "Convicted", "Case Closed", "Pending Trial"
]

SUSPECT_STATUSES = [
    "Suspected", "Wanted", "Arrested", "Released on Bail",
    "Absconding", "Surrendered", "Convicted", "Acquitted"
]

BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

EDUCATION_LEVELS = [
    "Illiterate", "Primary", "Middle School", "High School",
    "PUC/12th", "Diploma", "Graduate", "Post Graduate", "Professional"
]

OCCUPATIONS = [
    "Farmer", "Daily Wage Labourer", "Auto Driver", "Taxi Driver",
    "Shop Keeper", "Business", "Teacher", "Government Employee",
    "Private Employee", "Student", "Homemaker", "Doctor",
    "Engineer", "Lawyer", "Contractor", "Real Estate",
    "Unemployed", "Retired", "Self Employed", "IT Professional",
    "Mechanic", "Electrician", "Plumber", "Carpenter",
    "Mason", "Painter", "Security Guard", "Watchman"
]

RELIGIONS = ["Hindu", "Muslim", "Christian", "Jain", "Buddhist", "Sikh", "Other"]
RELIGION_WEIGHTS = [72, 14, 5, 4, 2, 1, 2]

CASTES = ["General", "OBC", "SC", "ST"]
CASTE_WEIGHTS = [25, 40, 20, 15]


# ═══════════════════════════════════════════════════════════════════════════════
#  HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def random_name(gender=None):
    if gender is None:
        gender = random.choice(["M", "F"])
    if gender == "M":
        first = random.choice(MALE_FIRST)
    else:
        first = random.choice(FEMALE_FIRST)
    last = random.choice(LAST_NAMES)
    return first, last, gender

def random_phone():
    prefixes = ["6", "7", "8", "9"]
    return random.choice(prefixes) + ''.join([str(random.randint(0,9)) for _ in range(9)])

def random_aadhaar():
    return ''.join([str(random.randint(0,9)) for _ in range(12)])

def random_email(first, last):
    domains = ["gmail.com", "yahoo.co.in", "rediffmail.com", "outlook.com", "hotmail.com"]
    sep = random.choice([".", "_", ""])
    num = random.randint(1, 999)
    return f"{first.lower()}{sep}{last.lower()}{num}@{random.choice(domains)}"

def random_vehicle_reg(district=None):
    if district and district in DISTRICT_RTO_CODES:
        rto = random.choice(DISTRICT_RTO_CODES[district])
    else:
        all_rto = [c for codes in DISTRICT_RTO_CODES.values() for c in codes]
        rto = random.choice(all_rto)
    middle = random.choice(["A", "B", "C", "D", "E", "F", "G", "H",
                             "J", "K", "L", "M", "N", "P", "Q", "R",
                             "S", "T", "U", "V", "W", "X", "Y", "Z",
                             "AA", "AB", "AC", "AD", "AE", "AF",
                             "BA", "BB", "BC", "BD", "BE", "BF",
                             "CA", "CB", "CC", "CD", "CE"])
    num = random.randint(1, 9999)
    return f"{rto}{middle}{num:04d}"

def random_lat_lon(district_name):
    district_coords = {
        "Bengaluru Urban": (12.97, 77.59, 0.15),
        "Bengaluru Rural": (13.15, 77.40, 0.25),
        "Mysuru": (12.30, 76.65, 0.30),
        "Belagavi": (15.85, 74.50, 0.40),
        "Kalaburagi": (17.33, 76.83, 0.30),
        "Ballari": (15.15, 76.93, 0.35),
        "Dharwad": (15.46, 75.01, 0.25),
        "Dakshina Kannada": (12.87, 74.88, 0.30),
        "Tumakuru": (13.34, 77.10, 0.30),
        "Mandya": (12.52, 76.90, 0.25),
        "Hassan": (13.00, 76.10, 0.30),
        "Udupi": (13.34, 74.74, 0.25),
        "Shivamogga": (13.93, 75.57, 0.35),
        "Raichur": (16.20, 77.36, 0.30),
        "Chitradurga": (14.23, 76.40, 0.30),
        "Davanagere": (14.47, 75.92, 0.25),
        "Kodagu": (12.42, 75.74, 0.20),
        "Chikkamagaluru": (13.32, 75.78, 0.30),
        "Haveri": (14.79, 75.40, 0.25),
        "Gadag": (15.43, 75.63, 0.20),
        "Kolar": (13.14, 78.13, 0.20),
        "Chikballapur": (13.44, 77.73, 0.20),
        "Bidar": (17.91, 77.52, 0.25),
        "Koppal": (15.35, 76.15, 0.25),
        "Bagalkot": (16.18, 75.70, 0.30),
        "Vijayapura": (16.83, 75.71, 0.30),
        "Uttara Kannada": (14.63, 74.69, 0.40),
        "Yadgir": (16.77, 77.14, 0.20),
        "Chamarajanagar": (11.93, 76.94, 0.25),
        "Ramanagara": (12.72, 77.28, 0.20),
    }
    if district_name in district_coords:
        lat, lon, spread = district_coords[district_name]
    else:
        lat, lon, spread = 14.0, 76.0, 1.0
    return (
        round(lat + random.uniform(-spread, spread), 6),
        round(lon + random.uniform(-spread, spread), 6)
    )

def random_address(area=None):
    house_num = random.randint(1, 999)
    if area is None:
        area = random.choice(ADDRESSES_AREAS)
    ward = random.randint(1, 198)
    return f"#{house_num}, {area}, Ward {ward}"


# ═══════════════════════════════════════════════════════════════════════════════
#  ENTITY GENERATORS
# ═══════════════════════════════════════════════════════════════════════════════

def generate_districts():
    rows = []
    for i, name in enumerate(KARNATAKA_DISTRICTS, 1):
        did = genuuid()
        division = DISTRICT_DIVISION.get(name, "Bengaluru")
        lat, lon = random_lat_lon(name)
        rows.append({
            "district_id": did,
            "district_name": name,
            "district_code": f"KA{i:02d}",
            "division": division,
            "state": "Karnataka",
            "population": random.randint(300000, 12000000),
            "area_sq_km": round(random.uniform(1400, 10500), 2),
            "latitude": lat,
            "longitude": lon,
            "created_at": fmt_datetime(random_datetime(datetime(2022,1,1), datetime(2022,1,31))),
            "updated_at": fmt_datetime(random_datetime(datetime(2024,6,1), datetime(2024,12,31))),
            "is_active": True
        })
    return rows

def generate_police_stations(districts, target=100):
    rows = []
    district_ids_by_name = {d["district_name"]: d["district_id"] for d in districts}

    for dist_name, stations in PS_TEMPLATES.items():
        did = district_ids_by_name[dist_name]
        for ps_name in stations:
            lat, lon = random_lat_lon(dist_name)
            rows.append({
                "station_id": genuuid(),
                "station_name": f"{ps_name} Police Station",
                "station_code": f"PS{len(rows)+1:04d}",
                "district_id": did,
                "address": random_address(ps_name),
                "phone": f"080-{random.randint(20000000, 29999999)}",
                "email": f"{ps_name.lower().replace(' ', '')}ps@kapolice.gov.in",
                "latitude": lat,
                "longitude": lon,
                "station_type": random.choice(["Urban", "Semi-Urban"]),
                "jurisdiction_area_sq_km": round(random.uniform(5, 50), 2),
                "officer_strength": random.randint(15, 80),
                "created_at": fmt_datetime(random_datetime(datetime(2022,1,1), datetime(2022,2,28))),
                "updated_at": fmt_datetime(random_datetime(datetime(2024,6,1), datetime(2024,12,31))),
                "is_active": True
            })

    remaining = target - len(rows)
    other_districts = [d for d in KARNATAKA_DISTRICTS if d not in PS_TEMPLATES]
    random.shuffle(other_districts)

    stations_per = max(1, remaining // len(other_districts))
    for dist_name in other_districts:
        did = district_ids_by_name[dist_name]
        count = random.randint(max(1, stations_per - 1), stations_per + 2)
        for j in range(count):
            if len(rows) >= target:
                break
            suffix = random.choice(GENERIC_PS_NAMES)
            ps_name = f"{dist_name} {suffix}"
            lat, lon = random_lat_lon(dist_name)
            rows.append({
                "station_id": genuuid(),
                "station_name": f"{ps_name} Police Station",
                "station_code": f"PS{len(rows)+1:04d}",
                "district_id": did,
                "address": random_address(),
                "phone": f"08{random.randint(10,99)}-{random.randint(200000, 299999)}",
                "email": f"{suffix.lower().replace(' ', '')}ps_{dist_name[:3].lower()}@kapolice.gov.in",
                "latitude": lat,
                "longitude": lon,
                "station_type": random.choice(["Urban", "Semi-Urban", "Rural"]),
                "jurisdiction_area_sq_km": round(random.uniform(20, 200), 2),
                "officer_strength": random.randint(10, 45),
                "created_at": fmt_datetime(random_datetime(datetime(2022,1,1), datetime(2022,2,28))),
                "updated_at": fmt_datetime(random_datetime(datetime(2024,6,1), datetime(2024,12,31))),
                "is_active": random.choices([True, False], weights=[95, 5])[0]
            })
        if len(rows) >= target:
            break

    return rows[:target]

def generate_officers(police_stations, districts, target=500):
    rows = []
    station_ids = [s["station_id"] for s in police_stations]
    station_district = {s["station_id"]: s["district_id"] for s in police_stations}

    for i in range(target):
        first, last, gender = random_name()
        rank = random.choices(OFFICER_RANKS, weights=RANK_WEIGHTS, k=1)[0]
        designation = random.choice(OFFICER_DESIGNATIONS[rank])
        sid = random.choice(station_ids)
        join_date = random_date(datetime(2000,1,1), datetime(2022,12,31))

        rows.append({
            "officer_id": genuuid(),
            "badge_number": f"KSP{random.randint(10000, 99999)}",
            "first_name": first,
            "last_name": last,
            "gender": gender,
            "date_of_birth": fmt_date(random_date(datetime(1965,1,1), datetime(1998,12,31))),
            "rank": rank,
            "designation": designation,
            "station_id": sid,
            "district_id": station_district[sid],
            "phone": random_phone(),
            "email": f"{first.lower()}.{last.lower()}{i}@kapolice.gov.in",
            "date_of_joining": fmt_date(join_date),
            "years_of_service": (datetime(2024,12,31) - join_date).days // 365,
            "specialization": random.choice([
                "Crime Investigation", "Cyber Crime", "Traffic",
                "Law & Order", "Forensics", "Intelligence",
                "Anti-Terrorism", "Narcotics", "Women & Child",
                "General Duty", "VIP Security", "Communication"
            ]),
            "is_active": random.choices([True, False], weights=[92, 8])[0],
            "created_at": fmt_datetime(random_datetime(datetime(2022,1,1), datetime(2022,6,30))),
            "updated_at": fmt_datetime(random_datetime(datetime(2024,1,1), datetime(2024,12,31)))
        })
    return rows

def generate_crime_categories():
    rows = []
    cat_id_map = {}

    for parent_name in CRIME_CATEGORY_HIERARCHY:
        cid = genuuid()
        cat_id_map[parent_name] = cid
        rows.append({
            "category_id": cid,
            "category_name": parent_name,
            "category_code": parent_name[:3].upper() + str(len(rows)+1).zfill(2),
            "parent_category_id": "",
            "description": f"All crimes classified under {parent_name}",
            "severity_level": random.choice(["High", "Critical"]),
            "ipc_sections": "",
            "is_active": True,
            "created_at": fmt_datetime(random_datetime(datetime(2022,1,1), datetime(2022,1,31))),
            "updated_at": fmt_datetime(random_datetime(datetime(2024,6,1), datetime(2024,12,31)))
        })

    for parent_name, children in CRIME_CATEGORY_HIERARCHY.items():
        parent_id = cat_id_map[parent_name]
        for child_name in children:
            cid = genuuid()
            cat_id_map[child_name] = cid
            assigned_ipc = random.sample(IPC_SECTIONS, k=random.randint(1, 3))
            rows.append({
                "category_id": cid,
                "category_name": child_name,
                "category_code": child_name[:3].upper() + str(len(rows)+1).zfill(2),
                "parent_category_id": parent_id,
                "description": f"{child_name} as defined under relevant IPC sections",
                "severity_level": random.choice(["Low", "Medium", "High", "Critical"]),
                "ipc_sections": ",".join(assigned_ipc),
                "is_active": True,
                "created_at": fmt_datetime(random_datetime(datetime(2022,1,1), datetime(2022,1,31))),
                "updated_at": fmt_datetime(random_datetime(datetime(2024,6,1), datetime(2024,12,31)))
            })

    return rows, cat_id_map

def generate_firs(police_stations, officers, districts, target=2000):
    rows = []
    station_ids = [s["station_id"] for s in police_stations]
    station_district_map = {s["station_id"]: s["district_id"] for s in police_stations}
    station_name_map = {s["station_id"]: s["station_name"] for s in police_stations}
    officer_ids = [o["officer_id"] for o in officers]
    district_name_map = {d["district_id"]: d["district_name"] for d in districts}

    for i in range(target):
        sid = random.choice(station_ids)
        did = station_district_map[sid]
        dist_name = district_name_map.get(did, "Unknown")
        fir_date = random_datetime()
        year = fir_date.year

        io = random.choice(officer_ids)
        status = random.choices(
            FIR_STATUSES,
            weights=[15, 30, 20, 15, 5, 5, 10],
            k=1
        )[0]

        ipc = random.sample(IPC_SECTIONS, k=random.randint(1, 4))

        rows.append({
            "fir_id": genuuid(),
            "fir_number": f"FIR/{year}/{dist_name[:3].upper()}/{i+1:05d}",
            "fir_date": fmt_datetime(fir_date),
            "station_id": sid,
            "district_id": did,
            "complainant_name": f"{random.choice(MALE_FIRST + FEMALE_FIRST)} {random.choice(LAST_NAMES)}",
            "complainant_phone": random_phone(),
            "complainant_address": random_address(),
            "incident_date": fmt_datetime(fir_date - timedelta(days=random.randint(0, 7))),
            "incident_location": random_address(),
            "incident_latitude": random_lat_lon(dist_name)[0],
            "incident_longitude": random_lat_lon(dist_name)[1],
            "ipc_sections": ",".join(ipc),
            "description": f"FIR registered for offence under IPC sections {', '.join(ipc)} at {station_name_map[sid]}",
            "investigating_officer_id": io,
            "status": status,
            "priority": random.choices(
                ["Low", "Medium", "High", "Critical"],
                weights=[20, 40, 30, 10], k=1
            )[0],
            "closure_date": fmt_datetime(fir_date + timedelta(days=random.randint(30, 365))) if status in ["Closed", "Charge Sheet Filed", "Referred to Court"] else "",
            "closure_reason": random.choice(["Case Solved", "Insufficient Evidence", "Compromise", "Final Report", ""]) if status == "Closed" else "",
            "created_at": fmt_datetime(fir_date),
            "updated_at": fmt_datetime(random_datetime(fir_date, END_DATE))
        })
    return rows

def generate_crimes(firs, crime_categories, cat_id_map, target=2500):
    rows = []
    fir_ids = [f["fir_id"] for f in firs]
    fir_map = {f["fir_id"]: f for f in firs}
    child_cats = [c for c in crime_categories if c["parent_category_id"]]
    child_cat_ids = [c["category_id"] for c in child_cats]

    assigned_firs = list(fir_ids)
    random.shuffle(assigned_firs)

    for i in range(target):
        if i < len(assigned_firs):
            fid = assigned_firs[i]
        else:
            fid = random.choice(fir_ids)

        fir = fir_map[fid]
        cat_id = random.choice(child_cat_ids)
        crime_date = datetime.strptime(fir["fir_date"], '%Y-%m-%d %H:%M:%S')

        rows.append({
            "crime_id": genuuid(),
            "fir_id": fid,
            "category_id": cat_id,
            "crime_date": fmt_datetime(crime_date),
            "crime_location": fir["incident_location"],
            "crime_latitude": fir["incident_latitude"],
            "crime_longitude": fir["incident_longitude"],
            "district_id": fir["district_id"],
            "station_id": fir["station_id"],
            "ipc_sections": fir["ipc_sections"],
            "status": random.choices(
                CRIME_STATUSES,
                weights=[10, 20, 10, 10, 10, 15, 5, 5, 10, 5],
                k=1
            )[0],
            "modus_operandi": random.choice([
                "Break and enter through rear window",
                "Snatching from moving vehicle",
                "Luring victim through social media",
                "Assault during altercation",
                "Online phishing and fund transfer",
                "Fake documents and impersonation",
                "Armed robbery at gunpoint",
                "Poisoning of food/drink",
                "Kidnapping for ransom demand",
                "Domestic dispute escalation",
                "Road rage incident",
                "Property dispute violence",
                "Financial fraud through fake company",
                "Chain snatching while on motorcycle",
                "Housebreaking during nighttime",
                "Drug peddling and distribution",
                "Vehicle theft from parking area",
                "Cattle theft from farmland"
            ]),
            "severity": random.choices(
                ["Low", "Medium", "High", "Critical"],
                weights=[15, 35, 35, 15], k=1
            )[0],
            "is_solved": random.choices([True, False], weights=[45, 55])[0],
            "created_at": fmt_datetime(crime_date),
            "updated_at": fmt_datetime(random_datetime(crime_date, END_DATE))
        })
    return rows

def generate_persons(target, role_type="suspect"):
    rows = []
    for i in range(target):
        first, last, gender = random_name()
        dob = random_date(datetime(1960,1,1), datetime(2005,12,31))
        age = 2024 - dob.year

        row = {
            f"{role_type}_id": genuuid(),
            "first_name": first,
            "last_name": last,
            "full_name": f"{first} {last}",
            "gender": gender,
            "date_of_birth": fmt_date(dob),
            "age": age,
            "phone": random_phone(),
            "email": random_email(first, last) if random.random() > 0.3 else "",
            "address": random_address(),
            "city": random.choice(KARNATAKA_DISTRICTS),
            "state": "Karnataka",
            "nationality": "Indian",
            "id_type": random.choice(["Aadhaar", "PAN", "Driving License", "Voter ID", "Passport"]),
            "id_number": random_aadhaar() if random.random() > 0.3 else "",
            "blood_group": random.choice(BLOOD_GROUPS),
            "religion": random.choices(RELIGIONS, weights=RELIGION_WEIGHTS, k=1)[0],
            "caste_category": random.choices(CASTES, weights=CASTE_WEIGHTS, k=1)[0],
            "education": random.choice(EDUCATION_LEVELS),
            "occupation": random.choice(OCCUPATIONS),
            "created_at": fmt_datetime(random_datetime()),
            "updated_at": fmt_datetime(random_datetime())
        }

        if role_type == "suspect":
            row["alias"] = random.choice(["", f"{first[:3]}a", f"Chhota {first}", f"{first} Bhai"]) if random.random() > 0.5 else ""
            row["status"] = random.choices(SUSPECT_STATUSES, weights=[20, 10, 25, 15, 10, 5, 10, 5], k=1)[0]
            row["criminal_history"] = random.choices([True, False], weights=[35, 65])[0]
            row["num_prior_cases"] = random.randint(0, 12) if row["criminal_history"] else 0
            row["is_habitual_offender"] = row["num_prior_cases"] >= 3
            row["risk_score"] = round(random.uniform(0.1, 1.0), 2)
            row["height_cm"] = random.randint(150, 190)
            row["weight_kg"] = random.randint(45, 110)
            row["complexion"] = random.choice(["Fair", "Wheatish", "Dark", "Very Fair"])
            row["identifying_marks"] = random.choice([
                "", "Scar on left cheek", "Tattoo on right arm",
                "Mole below right eye", "Missing front tooth",
                "Burn mark on left hand", "Birthmark on neck"
            ])

        elif role_type == "victim":
            row["injury_type"] = random.choice([
                "None", "Minor", "Grievous", "Fatal",
                "Fracture", "Laceration", "Bruise", "Burns"
            ])
            row["injury_description"] = random.choice([
                "", "Head injury", "Multiple fractures",
                "Stab wounds", "Blunt force trauma",
                "Chemical burns", "Emotional trauma",
                "Financial loss"
            ])
            row["medical_status"] = random.choice([
                "Treated and Discharged", "Under Treatment",
                "Hospitalized", "Deceased", "No Treatment Required"
            ])
            row["compensation_amount"] = random.choice([0, 0, 0, 10000, 25000, 50000, 100000, 200000, 500000])
            row["is_minor"] = age < 18

        elif role_type == "witness":
            row["witness_type"] = random.choice([
                "Eye Witness", "Ear Witness", "Expert Witness",
                "Character Witness", "Hostile Witness", "Independent Witness"
            ])
            row["statement_recorded"] = random.choices([True, False], weights=[75, 25])[0]
            row["statement_date"] = fmt_date(random_date()) if row["statement_recorded"] else ""
            row["is_reliable"] = random.choices([True, False], weights=[80, 20])[0]
            row["protection_required"] = random.choices([True, False], weights=[15, 85])[0]

        rows.append(row)
    return rows

def generate_vehicles(target=400):
    rows = []
    for i in range(target):
        make = random.choice(list(VEHICLE_MAKES_MODELS.keys()))
        model = random.choice(VEHICLE_MAKES_MODELS[make])
        district = random.choice(KARNATAKA_DISTRICTS)

        if make in ["Bajaj", "Hero", "TVS", "Royal Enfield", "Yamaha"]:
            body = "Motorcycle"
        elif make == "Honda MC":
            body = random.choice(["Motorcycle", "Scooter"])
        elif make in ["Ashok Leyland", "TATA CV", "Eicher"]:
            body = random.choice(["Truck", "Tempo", "Bus"])
        else:
            body = random.choice(["Sedan", "Hatchback", "SUV", "MUV"])

        fuel = random.choice(["Petrol", "Diesel", "CNG", "Electric"])
        year = random.randint(2005, 2024)

        rows.append({
            "vehicle_id": genuuid(),
            "registration_number": random_vehicle_reg(district),
            "make": make,
            "model": model,
            "body_type": body,
            "color": random.choice(VEHICLE_COLORS),
            "fuel_type": fuel,
            "year_of_manufacture": year,
            "engine_number": f"ENG{random.randint(100000, 999999)}",
            "chassis_number": f"CHS{random.randint(1000000, 9999999)}",
            "owner_name": f"{random.choice(MALE_FIRST + FEMALE_FIRST)} {random.choice(LAST_NAMES)}",
            "owner_phone": random_phone(),
            "owner_address": random_address(),
            "district": district,
            "vehicle_status": random.choices(
                ["Active", "Stolen", "Recovered", "Seized", "Scrapped", "Abandoned"],
                weights=[40, 25, 10, 15, 5, 5], k=1
            )[0],
            "involvement_type": random.choice([
                "Suspect Vehicle", "Victim Vehicle", "Evidence Vehicle",
                "Stolen Vehicle", "Accident Vehicle", "Getaway Vehicle"
            ]),
            "is_stolen": random.choices([True, False], weights=[25, 75])[0],
            "created_at": fmt_datetime(random_datetime()),
            "updated_at": fmt_datetime(random_datetime())
        })
    return rows

def generate_weapons(target=300):
    rows = []
    for i in range(target):
        wtype = random.choice(WEAPON_TYPES)
        is_firearm = wtype in ["Country-made Pistol", "Revolver", "Rifle", "Shotgun"]

        rows.append({
            "weapon_id": genuuid(),
            "weapon_type": wtype,
            "weapon_category": "Firearm" if is_firearm else (
                "Sharp" if wtype in ["Knife", "Machete", "Axe", "Sword", "Dagger", "Sickle"] else (
                "Blunt" if wtype in ["Iron Rod", "Wooden Stick", "Cricket Bat", "Hockey Stick",
                                      "Stone", "Brick", "Hammer"] else (
                "Explosive" if wtype in ["Explosive", "Petrol Bomb", "Grenade"] else (
                "Chemical" if wtype == "Acid" else "Other"
                )))),
            "description": f"{wtype} used/found at crime scene",
            "serial_number": f"WPN{random.randint(10000, 99999)}" if is_firearm else "",
            "is_licensed": random.choices([True, False], weights=[20, 80])[0] if is_firearm else False,
            "license_number": f"KA/FA/{random.randint(1000, 9999)}/{random.randint(2015, 2024)}" if is_firearm and random.random() > 0.5 else "",
            "recovery_status": random.choices(
                ["Recovered", "Not Recovered", "Seized", "Destroyed"],
                weights=[40, 30, 20, 10], k=1
            )[0],
            "recovery_date": fmt_date(random_date()) if random.random() > 0.3 else "",
            "recovery_location": random_address() if random.random() > 0.3 else "",
            "forensic_report_available": random.choices([True, False], weights=[40, 60])[0],
            "created_at": fmt_datetime(random_datetime()),
            "updated_at": fmt_datetime(random_datetime())
        })
    return rows

def generate_evidence(firs, target=3000):
    rows = []
    fir_ids = [f["fir_id"] for f in firs]

    for i in range(target):
        etype = random.choice(EVIDENCE_TYPES)
        subtype = random.choice(EVIDENCE_SUBTYPES[etype])
        collection_date = random_datetime()

        rows.append({
            "evidence_id": genuuid(),
            "evidence_number": f"EVD/{collection_date.year}/{i+1:06d}",
            "evidence_type": etype,
            "evidence_subtype": subtype,
            "description": f"{subtype} collected as {etype.lower()} evidence",
            "collection_date": fmt_datetime(collection_date),
            "collection_location": random_address(),
            "collected_by": f"{random.choice(MALE_FIRST)} {random.choice(LAST_NAMES)}",
            "storage_location": f"Evidence Room {random.choice(['A', 'B', 'C', 'D', 'E'])}-{random.randint(1, 50):02d}",
            "chain_of_custody": f"Collected -> Sealed -> Transported -> Stored (Entry #{random.randint(1000, 9999)})",
            "forensic_lab_id": f"KFSL/{random.choice(['BLR', 'MYS', 'BLG', 'KLB'])}/{random.randint(1000, 9999)}",
            "forensic_status": random.choices(
                ["Pending Analysis", "Under Analysis", "Analysis Complete",
                 "Report Generated", "Not Sent"],
                weights=[20, 15, 30, 25, 10], k=1
            )[0],
            "forensic_findings": random.choice([
                "", "Match found with suspect", "Inconclusive results",
                "DNA profile generated", "Fingerprint matched",
                "Chemical analysis complete", "No significant findings",
                "Partial match - further analysis needed"
            ]),
            "is_tampered": random.choices([True, False], weights=[3, 97])[0],
            "digital_hash": hashlib.sha256(f"evidence_{i}_{random.random()}".encode()).hexdigest(),
            "created_at": fmt_datetime(collection_date),
            "updated_at": fmt_datetime(random_datetime(collection_date, END_DATE))
        })
    return rows

def generate_roles():
    rows = []
    for name, desc in ROLES_DATA:
        rows.append({
            "role_id": genuuid(),
            "role_name": name,
            "role_code": name.upper().replace(" ", "_"),
            "description": desc,
            "permissions": ",".join(random.sample([
                "view_fir", "create_fir", "edit_fir", "delete_fir",
                "view_crime", "create_crime", "edit_crime",
                "view_evidence", "manage_evidence",
                "view_suspect", "manage_suspect",
                "view_reports", "generate_reports",
                "manage_users", "system_config", "audit_log",
                "view_dashboard", "export_data", "import_data",
                "manage_stations", "view_analytics", "manage_gis"
            ], k=random.randint(3, 15))),
            "is_active": True,
            "created_at": fmt_datetime(random_datetime(datetime(2022,1,1), datetime(2022,1,31))),
            "updated_at": fmt_datetime(random_datetime(datetime(2024,6,1), datetime(2024,12,31)))
        })
    return rows

def generate_users(officers, roles, target=50):
    rows = []
    officer_subset = random.sample(officers, min(target, len(officers)))
    role_ids = [r["role_id"] for r in roles]

    for i, officer in enumerate(officer_subset):
        username = f"{officer['first_name'].lower()}.{officer['last_name'].lower()}{i}"
        rows.append({
            "user_id": genuuid(),
            "username": username,
            "email": officer["email"],
            "password_hash": hashlib.sha256(f"Vigilens_{username}_{random.random()}".encode()).hexdigest(),
            "officer_id": officer["officer_id"],
            "first_name": officer["first_name"],
            "last_name": officer["last_name"],
            "phone": officer["phone"],
            "is_active": random.choices([True, False], weights=[90, 10])[0],
            "last_login": fmt_datetime(random_datetime(datetime(2024,1,1), END_DATE)),
            "login_count": random.randint(1, 500),
            "failed_login_attempts": random.randint(0, 5),
            "account_locked": False,
            "created_at": fmt_datetime(random_datetime(datetime(2022,1,1), datetime(2022,6,30))),
            "updated_at": fmt_datetime(random_datetime(datetime(2024,1,1), END_DATE))
        })
    return rows


# ═══════════════════════════════════════════════════════════════════════════════
#  JUNCTION TABLE GENERATORS
# ═══════════════════════════════════════════════════════════════════════════════

def generate_fir_suspects(firs, suspects):
    rows = []
    seen = set()
    fir_ids = [f["fir_id"] for f in firs]
    suspect_ids = [s["suspect_id"] for s in suspects]

    for sid in suspect_ids:
        fid = random.choice(fir_ids)
        key = (fid, sid)
        if key not in seen:
            seen.add(key)
            rows.append({
                "fir_suspect_id": genuuid(),
                "fir_id": fid,
                "suspect_id": sid,
                "role_in_crime": random.choice([
                    "Main Accused", "Accomplice", "Abettor",
                    "Conspirator", "Handler", "Lookout"
                ]),
                "date_linked": fmt_date(random_date()),
                "created_at": fmt_datetime(random_datetime()),
                "updated_at": fmt_datetime(random_datetime())
            })

    extra = len(fir_ids) // 3
    for _ in range(extra):
        fid = random.choice(fir_ids)
        sid = random.choice(suspect_ids)
        key = (fid, sid)
        if key not in seen:
            seen.add(key)
            rows.append({
                "fir_suspect_id": genuuid(),
                "fir_id": fid,
                "suspect_id": sid,
                "role_in_crime": random.choice([
                    "Main Accused", "Accomplice", "Abettor",
                    "Conspirator", "Handler", "Lookout"
                ]),
                "date_linked": fmt_date(random_date()),
                "created_at": fmt_datetime(random_datetime()),
                "updated_at": fmt_datetime(random_datetime())
            })

    return rows

def generate_fir_victims(firs, victims):
    rows = []
    seen = set()
    fir_ids = [f["fir_id"] for f in firs]
    victim_ids = [v["victim_id"] for v in victims]

    for vid in victim_ids:
        fid = random.choice(fir_ids)
        key = (fid, vid)
        if key not in seen:
            seen.add(key)
            rows.append({
                "fir_victim_id": genuuid(),
                "fir_id": fid,
                "victim_id": vid,
                "victim_type": random.choice(["Primary", "Secondary", "Indirect"]),
                "date_linked": fmt_date(random_date()),
                "created_at": fmt_datetime(random_datetime()),
                "updated_at": fmt_datetime(random_datetime())
            })

    extra = len(fir_ids) // 4
    for _ in range(extra):
        fid = random.choice(fir_ids)
        vid = random.choice(victim_ids)
        key = (fid, vid)
        if key not in seen:
            seen.add(key)
            rows.append({
                "fir_victim_id": genuuid(),
                "fir_id": fid,
                "victim_id": vid,
                "victim_type": random.choice(["Primary", "Secondary", "Indirect"]),
                "date_linked": fmt_date(random_date()),
                "created_at": fmt_datetime(random_datetime()),
                "updated_at": fmt_datetime(random_datetime())
            })

    return rows

def generate_fir_witnesses(firs, witnesses):
    rows = []
    seen = set()
    fir_ids = [f["fir_id"] for f in firs]
    witness_ids = [w["witness_id"] for w in witnesses]

    for wid in witness_ids:
        fid = random.choice(fir_ids)
        key = (fid, wid)
        if key not in seen:
            seen.add(key)
            rows.append({
                "fir_witness_id": genuuid(),
                "fir_id": fid,
                "witness_id": wid,
                "witness_sequence": random.randint(1, 10),
                "date_linked": fmt_date(random_date()),
                "created_at": fmt_datetime(random_datetime()),
                "updated_at": fmt_datetime(random_datetime())
            })

    return rows

def generate_fir_vehicles(firs, vehicles):
    rows = []
    seen = set()
    fir_ids = [f["fir_id"] for f in firs]
    vehicle_ids = [v["vehicle_id"] for v in vehicles]

    num_links = len(vehicle_ids) + len(fir_ids) // 5
    for _ in range(num_links):
        fid = random.choice(fir_ids)
        vid = random.choice(vehicle_ids)
        key = (fid, vid)
        if key not in seen:
            seen.add(key)
            rows.append({
                "fir_vehicle_id": genuuid(),
                "fir_id": fid,
                "vehicle_id": vid,
                "involvement_type": random.choice([
                    "Suspect Vehicle", "Victim Vehicle", "Evidence",
                    "Getaway Vehicle", "Stolen Vehicle", "Accident Vehicle"
                ]),
                "date_linked": fmt_date(random_date()),
                "created_at": fmt_datetime(random_datetime()),
                "updated_at": fmt_datetime(random_datetime())
            })
    return rows

def generate_fir_weapons(firs, weapons):
    rows = []
    seen = set()
    fir_ids = [f["fir_id"] for f in firs]
    weapon_ids = [w["weapon_id"] for w in weapons]

    num_links = len(weapon_ids) + len(fir_ids) // 4
    for _ in range(num_links):
        fid = random.choice(fir_ids)
        wid = random.choice(weapon_ids)
        key = (fid, wid)
        if key not in seen:
            seen.add(key)
            rows.append({
                "fir_weapon_id": genuuid(),
                "fir_id": fid,
                "weapon_id": wid,
                "usage_description": random.choice([
                    "Used in commission of crime",
                    "Found at crime scene",
                    "Recovered from suspect",
                    "Used for threatening",
                    "Seized during search"
                ]),
                "date_linked": fmt_date(random_date()),
                "created_at": fmt_datetime(random_datetime()),
                "updated_at": fmt_datetime(random_datetime())
            })
    return rows

def generate_fir_evidence(firs, evidence):
    rows = []
    seen = set()
    fir_ids = [f["fir_id"] for f in firs]
    evidence_ids = [e["evidence_id"] for e in evidence]

    for eid in evidence_ids:
        fid = random.choice(fir_ids)
        key = (fid, eid)
        if key not in seen:
            seen.add(key)
            rows.append({
                "fir_evidence_id": genuuid(),
                "fir_id": fid,
                "evidence_id": eid,
                "relevance": random.choice(["Primary", "Supporting", "Circumstantial"]),
                "date_linked": fmt_date(random_date()),
                "created_at": fmt_datetime(random_datetime()),
                "updated_at": fmt_datetime(random_datetime())
            })

    return rows

def generate_crime_suspects(crimes, suspects):
    rows = []
    seen = set()
    crime_ids = [c["crime_id"] for c in crimes]
    suspect_ids = [s["suspect_id"] for s in suspects]

    for sid in suspect_ids:
        num_crimes = random.randint(1, 3)
        for _ in range(num_crimes):
            cid = random.choice(crime_ids)
            key = (cid, sid)
            if key not in seen:
                seen.add(key)
                rows.append({
                    "crime_suspect_id": genuuid(),
                    "crime_id": cid,
                    "suspect_id": sid,
                    "role_in_crime": random.choice([
                        "Principal Offender", "Accomplice", "Abettor",
                        "Conspirator", "Instigator"
                    ]),
                    "confidence_score": round(random.uniform(0.3, 1.0), 2),
                    "date_linked": fmt_date(random_date()),
                    "created_at": fmt_datetime(random_datetime()),
                    "updated_at": fmt_datetime(random_datetime())
                })
    return rows

def generate_user_roles(users, roles):
    rows = []
    seen = set()
    role_ids = [r["role_id"] for r in roles]

    for user in users:
        num_roles = random.choices([1, 2], weights=[70, 30])[0]
        assigned_roles = random.sample(role_ids, k=min(num_roles, len(role_ids)))
        for rid in assigned_roles:
            key = (user["user_id"], rid)
            if key not in seen:
                seen.add(key)
                rows.append({
                    "user_role_id": genuuid(),
                    "user_id": user["user_id"],
                    "role_id": rid,
                    "assigned_date": fmt_date(random_date(datetime(2022,1,1), datetime(2023,12,31))),
                    "assigned_by": random.choice(users)["user_id"] if len(users) > 1 else user["user_id"],
                    "is_active": random.choices([True, False], weights=[90, 10])[0],
                    "created_at": fmt_datetime(random_datetime(datetime(2022,1,1), datetime(2023,6,30))),
                    "updated_at": fmt_datetime(random_datetime(datetime(2024,1,1), END_DATE))
                })
    return rows


# ═══════════════════════════════════════════════════════════════════════════════
#  FIELD NAME DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════════════

DISTRICT_FIELDS = [
    "district_id", "district_name", "district_code", "division", "state",
    "population", "area_sq_km", "latitude", "longitude",
    "created_at", "updated_at", "is_active"
]

STATION_FIELDS = [
    "station_id", "station_name", "station_code", "district_id",
    "address", "phone", "email", "latitude", "longitude",
    "station_type", "jurisdiction_area_sq_km", "officer_strength",
    "created_at", "updated_at", "is_active"
]

OFFICER_FIELDS = [
    "officer_id", "badge_number", "first_name", "last_name", "gender",
    "date_of_birth", "rank", "designation", "station_id", "district_id",
    "phone", "email", "date_of_joining", "years_of_service",
    "specialization", "is_active", "created_at", "updated_at"
]

CATEGORY_FIELDS = [
    "category_id", "category_name", "category_code", "parent_category_id",
    "description", "severity_level", "ipc_sections",
    "is_active", "created_at", "updated_at"
]

FIR_FIELDS = [
    "fir_id", "fir_number", "fir_date", "station_id", "district_id",
    "complainant_name", "complainant_phone", "complainant_address",
    "incident_date", "incident_location", "incident_latitude", "incident_longitude",
    "ipc_sections", "description", "investigating_officer_id", "status",
    "priority", "closure_date", "closure_reason",
    "created_at", "updated_at"
]

CRIME_FIELDS = [
    "crime_id", "fir_id", "category_id", "crime_date",
    "crime_location", "crime_latitude", "crime_longitude",
    "district_id", "station_id", "ipc_sections", "status",
    "modus_operandi", "severity", "is_solved",
    "created_at", "updated_at"
]

SUSPECT_FIELDS = [
    "suspect_id", "first_name", "last_name", "full_name", "gender",
    "date_of_birth", "age", "phone", "email", "address", "city", "state",
    "nationality", "id_type", "id_number", "blood_group",
    "religion", "caste_category", "education", "occupation",
    "alias", "status", "criminal_history", "num_prior_cases",
    "is_habitual_offender", "risk_score",
    "height_cm", "weight_kg", "complexion", "identifying_marks",
    "created_at", "updated_at"
]

VICTIM_FIELDS = [
    "victim_id", "first_name", "last_name", "full_name", "gender",
    "date_of_birth", "age", "phone", "email", "address", "city", "state",
    "nationality", "id_type", "id_number", "blood_group",
    "religion", "caste_category", "education", "occupation",
    "injury_type", "injury_description", "medical_status",
    "compensation_amount", "is_minor",
    "created_at", "updated_at"
]

WITNESS_FIELDS = [
    "witness_id", "first_name", "last_name", "full_name", "gender",
    "date_of_birth", "age", "phone", "email", "address", "city", "state",
    "nationality", "id_type", "id_number", "blood_group",
    "religion", "caste_category", "education", "occupation",
    "witness_type", "statement_recorded", "statement_date",
    "is_reliable", "protection_required",
    "created_at", "updated_at"
]

VEHICLE_FIELDS = [
    "vehicle_id", "registration_number", "make", "model", "body_type",
    "color", "fuel_type", "year_of_manufacture",
    "engine_number", "chassis_number",
    "owner_name", "owner_phone", "owner_address", "district",
    "vehicle_status", "involvement_type", "is_stolen",
    "created_at", "updated_at"
]

WEAPON_FIELDS = [
    "weapon_id", "weapon_type", "weapon_category", "description",
    "serial_number", "is_licensed", "license_number",
    "recovery_status", "recovery_date", "recovery_location",
    "forensic_report_available",
    "created_at", "updated_at"
]

EVIDENCE_FIELDS = [
    "evidence_id", "evidence_number", "evidence_type", "evidence_subtype",
    "description", "collection_date", "collection_location",
    "collected_by", "storage_location", "chain_of_custody",
    "forensic_lab_id", "forensic_status", "forensic_findings",
    "is_tampered", "digital_hash",
    "created_at", "updated_at"
]

ROLE_FIELDS = [
    "role_id", "role_name", "role_code", "description",
    "permissions", "is_active", "created_at", "updated_at"
]

USER_FIELDS = [
    "user_id", "username", "email", "password_hash", "officer_id",
    "first_name", "last_name", "phone",
    "is_active", "last_login", "login_count",
    "failed_login_attempts", "account_locked",
    "created_at", "updated_at"
]

FIR_SUSPECT_FIELDS = ["fir_suspect_id", "fir_id", "suspect_id", "role_in_crime", "date_linked", "created_at", "updated_at"]
FIR_VICTIM_FIELDS = ["fir_victim_id", "fir_id", "victim_id", "victim_type", "date_linked", "created_at", "updated_at"]
FIR_WITNESS_FIELDS = ["fir_witness_id", "fir_id", "witness_id", "witness_sequence", "date_linked", "created_at", "updated_at"]
FIR_VEHICLE_FIELDS = ["fir_vehicle_id", "fir_id", "vehicle_id", "involvement_type", "date_linked", "created_at", "updated_at"]
FIR_WEAPON_FIELDS = ["fir_weapon_id", "fir_id", "weapon_id", "usage_description", "date_linked", "created_at", "updated_at"]
FIR_EVIDENCE_FIELDS = ["fir_evidence_id", "fir_id", "evidence_id", "relevance", "date_linked", "created_at", "updated_at"]
CRIME_SUSPECT_FIELDS = ["crime_suspect_id", "crime_id", "suspect_id", "role_in_crime", "confidence_score", "date_linked", "created_at", "updated_at"]
USER_ROLE_FIELDS = ["user_role_id", "user_id", "role_id", "assigned_date", "assigned_by", "is_active", "created_at", "updated_at"]


# ═══════════════════════════════════════════════════════════════════════════════
#  MAIN ORCHESTRATOR
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    print("=" * 70)
    print("  VIGILENS AI - Synthetic Data Generator")
    print("  Karnataka State Police Crime Intelligence System")
    print("=" * 70)
    print(f"\n  Output: {RAW_DIR}\n")

    print("[1/3] Generating primary entities...\n")

    districts = generate_districts()
    write_csv("districts", districts, DISTRICT_FIELDS)

    police_stations = generate_police_stations(districts, target=100)
    write_csv("police_stations", police_stations, STATION_FIELDS)

    officers = generate_officers(police_stations, districts, target=500)
    write_csv("officers", officers, OFFICER_FIELDS)

    crime_categories, cat_id_map = generate_crime_categories()
    write_csv("crime_categories", crime_categories, CATEGORY_FIELDS)

    firs = generate_firs(police_stations, officers, districts, target=2000)
    write_csv("firs", firs, FIR_FIELDS)

    crimes = generate_crimes(firs, crime_categories, cat_id_map, target=2500)
    write_csv("crimes", crimes, CRIME_FIELDS)

    suspects = generate_persons(target=1000, role_type="suspect")
    write_csv("suspects", suspects, SUSPECT_FIELDS)

    victims = generate_persons(target=1500, role_type="victim")
    write_csv("victims", victims, VICTIM_FIELDS)

    witnesses = generate_persons(target=800, role_type="witness")
    write_csv("witnesses", witnesses, WITNESS_FIELDS)

    vehicles = generate_vehicles(target=400)
    write_csv("vehicles", vehicles, VEHICLE_FIELDS)

    weapons = generate_weapons(target=300)
    write_csv("weapons", weapons, WEAPON_FIELDS)

    evidence = generate_evidence(firs, target=3000)
    write_csv("evidence", evidence, EVIDENCE_FIELDS)

    roles = generate_roles()
    write_csv("roles", roles, ROLE_FIELDS)

    users = generate_users(officers, roles, target=50)
    write_csv("users", users, USER_FIELDS)

    print("\n[2/3] Generating junction tables...\n")

    junctions_dir = os.path.join(RAW_DIR, 'junctions')
    ensure_dir(junctions_dir)

    fir_suspects = generate_fir_suspects(firs, suspects)
    write_csv("junctions/fir_suspects", fir_suspects, FIR_SUSPECT_FIELDS)

    fir_victims = generate_fir_victims(firs, victims)
    write_csv("junctions/fir_victims", fir_victims, FIR_VICTIM_FIELDS)

    fir_witnesses = generate_fir_witnesses(firs, witnesses)
    write_csv("junctions/fir_witnesses", fir_witnesses, FIR_WITNESS_FIELDS)

    fir_vehicles = generate_fir_vehicles(firs, vehicles)
    write_csv("junctions/fir_vehicles", fir_vehicles, FIR_VEHICLE_FIELDS)

    fir_weapons = generate_fir_weapons(firs, weapons)
    write_csv("junctions/fir_weapons", fir_weapons, FIR_WEAPON_FIELDS)

    fir_evidence = generate_fir_evidence(firs, evidence)
    write_csv("junctions/fir_evidence", fir_evidence, FIR_EVIDENCE_FIELDS)

    crime_suspects = generate_crime_suspects(crimes, suspects)
    write_csv("junctions/crime_suspects", crime_suspects, CRIME_SUSPECT_FIELDS)

    user_roles = generate_user_roles(users, roles)
    write_csv("junctions/user_roles", user_roles, USER_ROLE_FIELDS)

    # ── Summary ──────────────────────────────────────────────────────────────
    print("\n" + "=" * 70)
    print("  GENERATION COMPLETE - Summary")
    print("=" * 70)

    all_entities = [
        ("districts", districts), ("police_stations", police_stations),
        ("officers", officers), ("crime_categories", crime_categories),
        ("firs", firs), ("crimes", crimes),
        ("suspects", suspects), ("victims", victims),
        ("witnesses", witnesses), ("vehicles", vehicles),
        ("weapons", weapons), ("evidence", evidence),
        ("roles", roles), ("users", users),
    ]
    all_junctions = [
        ("fir_suspects", fir_suspects), ("fir_victims", fir_victims),
        ("fir_witnesses", fir_witnesses), ("fir_vehicles", fir_vehicles),
        ("fir_weapons", fir_weapons), ("fir_evidence", fir_evidence),
        ("crime_suspects", crime_suspects), ("user_roles", user_roles),
    ]

    total = 0
    print(f"\n  {'Entity':<25} {'Rows':>8}")
    print(f"  {'---'*9} {'---'*3}")
    for name, data in all_entities:
        print(f"  {name:<25} {len(data):>8,}")
        total += len(data)
    print(f"\n  {'Junction Table':<25} {'Rows':>8}")
    print(f"  {'---'*9} {'---'*3}")
    for name, data in all_junctions:
        print(f"  {name:<25} {len(data):>8,}")
        total += len(data)

    print(f"\n  {'TOTAL':<25} {total:>8,}")
    print(f"\n  All files saved to: {RAW_DIR}")
    print("=" * 70)

    # ── Verify FK consistency ────────────────────────────────────────────────
    print("\n[3/3] Verifying foreign key consistency...\n")

    district_ids = {d["district_id"] for d in districts}
    station_ids = {s["station_id"] for s in police_stations}
    officer_ids = {o["officer_id"] for o in officers}
    fir_ids = {f["fir_id"] for f in firs}
    crime_ids = {c["crime_id"] for c in crimes}
    suspect_ids = {s["suspect_id"] for s in suspects}
    victim_ids = {v["victim_id"] for v in victims}
    witness_ids = {w["witness_id"] for w in witnesses}
    vehicle_ids = {v["vehicle_id"] for v in vehicles}
    weapon_ids = {w["weapon_id"] for w in weapons}
    evidence_ids = {e["evidence_id"] for e in evidence}
    user_ids = {u["user_id"] for u in users}
    role_ids_set = {r["role_id"] for r in roles}
    category_ids = {c["category_id"] for c in crime_categories}

    checks = [
        ("police_stations.district_id -> districts", all(s["district_id"] in district_ids for s in police_stations)),
        ("officers.station_id -> police_stations", all(o["station_id"] in station_ids for o in officers)),
        ("officers.district_id -> districts", all(o["district_id"] in district_ids for o in officers)),
        ("firs.station_id -> police_stations", all(f["station_id"] in station_ids for f in firs)),
        ("firs.district_id -> districts", all(f["district_id"] in district_ids for f in firs)),
        ("firs.investigating_officer_id -> officers", all(f["investigating_officer_id"] in officer_ids for f in firs)),
        ("crimes.fir_id -> firs", all(c["fir_id"] in fir_ids for c in crimes)),
        ("crimes.category_id -> crime_categories", all(c["category_id"] in category_ids for c in crimes)),
        ("crimes.district_id -> districts", all(c["district_id"] in district_ids for c in crimes)),
        ("crimes.station_id -> police_stations", all(c["station_id"] in station_ids for c in crimes)),
        ("fir_suspects.fir_id -> firs", all(r["fir_id"] in fir_ids for r in fir_suspects)),
        ("fir_suspects.suspect_id -> suspects", all(r["suspect_id"] in suspect_ids for r in fir_suspects)),
        ("fir_victims.fir_id -> firs", all(r["fir_id"] in fir_ids for r in fir_victims)),
        ("fir_victims.victim_id -> victims", all(r["victim_id"] in victim_ids for r in fir_victims)),
        ("fir_witnesses.fir_id -> firs", all(r["fir_id"] in fir_ids for r in fir_witnesses)),
        ("fir_witnesses.witness_id -> witnesses", all(r["witness_id"] in witness_ids for r in fir_witnesses)),
        ("fir_vehicles.fir_id -> firs", all(r["fir_id"] in fir_ids for r in fir_vehicles)),
        ("fir_vehicles.vehicle_id -> vehicles", all(r["vehicle_id"] in vehicle_ids for r in fir_vehicles)),
        ("fir_weapons.fir_id -> firs", all(r["fir_id"] in fir_ids for r in fir_weapons)),
        ("fir_weapons.weapon_id -> weapons", all(r["weapon_id"] in weapon_ids for r in fir_weapons)),
        ("fir_evidence.fir_id -> firs", all(r["fir_id"] in fir_ids for r in fir_evidence)),
        ("fir_evidence.evidence_id -> evidence", all(r["evidence_id"] in evidence_ids for r in fir_evidence)),
        ("crime_suspects.crime_id -> crimes", all(r["crime_id"] in crime_ids for r in crime_suspects)),
        ("crime_suspects.suspect_id -> suspects", all(r["suspect_id"] in suspect_ids for r in crime_suspects)),
        ("user_roles.user_id -> users", all(r["user_id"] in user_ids for r in user_roles)),
        ("user_roles.role_id -> roles", all(r["role_id"] in role_ids_set for r in user_roles)),
        ("users.officer_id -> officers", all(u["officer_id"] in officer_ids for u in users)),
    ]

    all_passed = True
    for desc, result in checks:
        status = "PASS" if result else "FAIL"
        if not result:
            all_passed = False
        print(f"  [{status}]  {desc}")

    print(f"\n  {'All 27 FK checks passed!' if all_passed else 'Some FK checks FAILED!'}")
    print("=" * 70)


if __name__ == "__main__":
    main()
