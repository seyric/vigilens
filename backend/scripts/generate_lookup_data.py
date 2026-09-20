import os
import pandas as pd

# Base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOOKUP_DIR = os.path.join(BASE_DIR, "datasets", "lookup")

os.makedirs(LOOKUP_DIR, exist_ok=True)


def save_csv(filename, data):
    df = pd.DataFrame(data)
    df.to_csv(os.path.join(LOOKUP_DIR, filename), index=False)
    print(f"✔ Generated {filename}")


# ---------------- Crime Categories ----------------

crime_categories = [
    {"category_id": 1, "category_name": "Theft"},
    {"category_id": 2, "category_name": "Robbery"},
    {"category_id": 3, "category_name": "Burglary"},
    {"category_id": 4, "category_name": "Cyber Crime"},
    {"category_id": 5, "category_name": "Murder"},
    {"category_id": 6, "category_name": "Assault"},
    {"category_id": 7, "category_name": "Kidnapping"},
    {"category_id": 8, "category_name": "Fraud"},
    {"category_id": 9, "category_name": "Drug Offence"},
    {"category_id": 10, "category_name": "Domestic Violence"},
    {"category_id": 11, "category_name": "Traffic Crime"},
    {"category_id": 12, "category_name": "Missing Person"},
    {"category_id": 13, "category_name": "Extortion"},
    {"category_id": 14, "category_name": "Illegal Arms"},
    {"category_id": 15, "category_name": "Human Trafficking"},
]

save_csv("crime_categories.csv", crime_categories)

# ---------------- Case Status ----------------

case_status = [
    {"status_id": 1, "status": "Open"},
    {"status_id": 2, "status": "Under Investigation"},
    {"status_id": 3, "status": "Chargesheet Filed"},
    {"status_id": 4, "status": "Closed"},
    {"status_id": 5, "status": "Pending"},
]

save_csv("case_status.csv", case_status)

# ---------------- Priority ----------------

priority = [
    {"priority_id": 1, "priority": "Low"},
    {"priority_id": 2, "priority": "Medium"},
    {"priority_id": 3, "priority": "High"},
    {"priority_id": 4, "priority": "Critical"},
]

save_csv("priority_levels.csv", priority)

# ---------------- Officer Ranks ----------------

ranks = [
    {"rank_id": 1, "rank": "Constable"},
    {"rank_id": 2, "rank": "Head Constable"},
    {"rank_id": 3, "rank": "Sub Inspector"},
    {"rank_id": 4, "rank": "Inspector"},
    {"rank_id": 5, "rank": "ACP"},
    {"rank_id": 6, "rank": "DCP"},
    {"rank_id": 7, "rank": "SP"},
]

save_csv("officer_ranks.csv", ranks)

# ---------------- Risk Levels ----------------

risk = [
    {"risk_id": 1, "risk": "Low"},
    {"risk_id": 2, "risk": "Medium"},
    {"risk_id": 3, "risk": "High"},
    {"risk_id": 4, "risk": "Critical"},
]

save_csv("risk_levels.csv", risk)

print("\n✅ Lookup Data Generated Successfully!")