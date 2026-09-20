import os
import random
import pandas as pd
from faker import Faker

fake = Faker("en_IN")
random.seed(42)
Faker.seed(42)

# ------------------------------------
# Paths
# ------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)

DATASET_DIR = os.path.join(BASE_DIR, "datasets")
os.makedirs(DATASET_DIR, exist_ok=True)

OUTPUT_FILE = os.path.join(DATASET_DIR, "officers.csv")

# ------------------------------------
# Lookup Values
# ------------------------------------

RANKS = [
    "Constable",
    "Head Constable",
    "Sub Inspector",
    "Inspector",
    "ACP",
    "DCP",
    "SP"
]

SPECIALIZATIONS = [
    "Cyber Crime",
    "Crime Branch",
    "Forensics",
    "Traffic",
    "Narcotics",
    "Women Safety",
    "Economic Offences",
    "Homicide",
    "Intelligence",
    "Anti-Terror"
]

STATUS = [
    "Active",
    "On Leave",
    "Transferred"
]

# Karnataka districts

DISTRICTS = [
    "Bengaluru Urban",
    "Bengaluru Rural",
    "Mysuru",
    "Belagavi",
    "Dharwad",
    "Kalaburagi",
    "Shivamogga",
    "Dakshina Kannada",
    "Udupi",
    "Ballari"
]

# ------------------------------------
# Generate Officers
# ------------------------------------

officers = []

for i in range(1, 101):

    officer = {
        "officer_id": f"OFF{i:04}",

        "badge_number": f"KA-{random.randint(10000,99999)}",

        "first_name": fake.first_name(),

        "last_name": fake.last_name(),

        "gender": random.choice(["Male","Female"]),

        "rank": random.choice(RANKS),

        "specialization": random.choice(SPECIALIZATIONS),

        "district": random.choice(DISTRICTS),

        "phone": fake.msisdn()[:10],

        "email": f"officer{i}@vigilens.local",

        "years_of_service": random.randint(1,30),

        "cases_solved": random.randint(5,250),

        "status": random.choice(STATUS)
    }

    officers.append(officer)

# ------------------------------------
# Save CSV
# ------------------------------------

df = pd.DataFrame(officers)

df.to_csv(OUTPUT_FILE,index=False)

print("="*50)
print("Officer Dataset Generated Successfully")
print("="*50)
print(f"Total Officers : {len(df)}")
print(f"Saved At : {OUTPUT_FILE}")
print("="*50)