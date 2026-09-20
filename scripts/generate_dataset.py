import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

NUM_RECORDS = 500

crime_types = [
    "Burglary",
    "Robbery",
    "Vehicle Theft",
    "Cyber Crime",
    "Fraud",
    "Assault",
]

areas = [
    ("Connaught Place", 28.6315, 77.2167),
    ("Karol Bagh", 28.6519, 77.1909),
    ("Dwarka", 28.5921, 77.0460),
    ("Rohini", 28.7495, 77.0565),
    ("Saket", 28.5245, 77.2066),
    ("Lajpat Nagar", 28.5677, 77.2435),
]

start_date = datetime(2024, 1, 1)

output_file = Path("data/prediction/crime_dataset.csv")

with open(output_file, "w", newline="", encoding="utf-8") as file:

    writer = csv.writer(file)
    crime_type = random.choice(crime_types)

    if crime_type == "Burglary":
        hour = random.randint(22, 23) if random.random() < 0.5 else random.randint(0, 5)

    elif crime_type == "Vehicle Theft":
        hour = random.randint(20, 23) if random.random() < 0.5 else random.randint(0, 4)

    elif crime_type == "Robbery":
        hour = random.randint(18, 23)

    elif crime_type == "Assault":
        hour = random.randint(19, 23) if random.random() < 0.6 else random.randint(0, 2)

    elif crime_type == "Fraud":
        hour = random.randint(9, 18)

    else:  # Cyber Crime
        hour = random.randint(0, 23)

    minute = random.randint(0, 59)

    crime_time = f"{hour:02}:{minute:02}"
    writer.writerow([
        "fir_number",
        "crime_type",
        "date",
        "time",
        "area",
        "latitude",
        "longitude",
        "property_value",
        "weapon_used",
        "arrest_made"
    ])

    for i in range(1, NUM_RECORDS + 1):

        area = random.choices(
    areas,
    weights=[35, 25, 15, 10, 8, 7],
    k=1
)[0]

        writer.writerow([
            f"FIR-{i:04}",
            crime_types,
            (start_date + timedelta(days=random.randint(0, 730))).strftime("%Y-%m-%d"),
            crime_time,
            area[0],
            area[1],
            area[2],
            random.randint(5000, 5000000),
            random.choice(["Yes", "No"]),
            random.choice(["Yes", "No"]),
        ])

print(f"✅ Dataset created with {NUM_RECORDS} records.")