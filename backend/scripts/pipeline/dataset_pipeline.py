from __future__ import annotations

import csv
import random
import time
from datetime import datetime, timedelta
from pathlib import Path


class DatasetPipeline:
    """Generate the complete local synthetic dataset bundle."""

    def __init__(self, seed: int = 20260720):
        self.root = Path(__file__).resolve().parents[2]
        self.generated_dir = self.root / "data" / "generated"
        self.random = random.Random(seed)

    def _write(self, name: str, rows: list[dict]) -> None:
        path = self.generated_dir / name
        path.parent.mkdir(parents=True, exist_ok=True)
        if not rows:
            path.write_text("\n", encoding="utf-8")
            return
        with path.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
            writer.writeheader()
            writer.writerows(rows)

    def _randomize_identifiers(self, datasets: dict[str, list[dict]]) -> None:
        primary_keys = {
            "persons.csv": ("person_id", "PER"), "phones.csv": ("phone_id", "PHN"),
            "vehicles.csv": ("vehicle_id", "VEH"), "bank_accounts.csv": ("account_id", "ACC"),
            "transactions.csv": ("transaction_id", "TXN"), "cases.csv": ("case_id", "CAS"),
            "case_person_relationships.csv": ("relationship_id", "REL"), "fir.csv": ("fir_id", "FIR"),
            "evidence.csv": ("evidence_id", "EVD"), "arrests.csv": ("arrest_id", "ARR"),
            "chargesheets.csv": ("chargesheet_id", "CHG"), "court_cases.csv": ("court_case_id", "CRT"),
            "investigation_diary.csv": ("diary_id", "DIA"), "devices.csv": ("device_id", "DEV"),
            "cdr.csv": ("cdr_id", "CDR"), "sms_records.csv": ("sms_id", "SMS"),
            "whatsapp_messages.csv": ("message_id", "MES"), "emails.csv": ("email_id", "EMA"),
        }
        mappings = {}
        for filename, (column, prefix) in primary_keys.items():
            values = [row[column] for row in datasets[filename]]
            replacements = set()
            while len(replacements) < len(values):
                replacements.add(f"{prefix}{self.random.randint(100000, 999999)}")
            replacements = list(replacements)
            self.random.shuffle(replacements)
            mappings[column] = dict(zip(values, replacements))
            for row, old_value in zip(datasets[filename], values):
                row[column] = mappings[column][old_value]

        foreign_keys = {
            "person_id": "person_id", "caller_person_id": "person_id", "receiver_person_id": "person_id",
            "sender_person_id": "person_id", "complainant_id": "person_id", "suspect_id": "person_id",
            "account_id": "account_id", "case_id": "case_id", "fir_id": "fir_id",
            "evidence_id": "evidence_id", "arrest_id": "arrest_id", "chargesheet_id": "chargesheet_id",
            "phone_id": "phone_id", "vehicle_id": "vehicle_id", "device_id": "device_id",
        }
        for rows in datasets.values():
            for row in rows:
                for column, mapping_key in foreign_keys.items():
                    if column in row and row[column] in mappings.get(mapping_key, {}):
                        row[column] = mappings[mapping_key][row[column]]

        case_numbers = set()
        for row in datasets["cases.csv"]:
            number = f"CASE/{self.random.randint(2020, 2026)}/{self.random.randint(10000, 99999)}"
            while number in case_numbers:
                number = f"CASE/{self.random.randint(2020, 2026)}/{self.random.randint(10000, 99999)}"
            case_numbers.add(number)
            row["case_number"] = number
        fir_numbers = set()
        for row in datasets["fir.csv"]:
            number = f"FIR/{self.random.randint(2016, 2026)}/{self.random.randint(10000, 99999)}"
            while number in fir_numbers:
                number = f"FIR/{self.random.randint(2016, 2026)}/{self.random.randint(10000, 99999)}"
            fir_numbers.add(number)
            row["fir_number"] = number

    def run(self) -> dict[str, int]:
        started = time.perf_counter()
        self.generated_dir.mkdir(parents=True, exist_ok=True)
        for path in self.generated_dir.glob("*.csv"):
            path.unlink()

        now = datetime.now().replace(microsecond=0)
        first_names = ["Aarav", "Ananya", "Vikram", "Meera", "Rohan", "Kavya", "Arjun", "Nandini", "Prakash", "Shruthi", "Siddharth", "Deepa", "Manoj", "Pooja", "Kiran", "Aishwarya", "Rahul", "Divya", "Harish", "Lakshmi"]
        last_names = ["Shetty", "Gowda", "Patil", "Reddy", "Kulkarni", "Bhat", "Hegde", "Nayak", "Desai", "Murthy", "Naik", "Joshi", "Sharma", "Rao", "Kumar"]
        districts = ["Bengaluru Urban", "Mysuru", "Dharwad", "Dakshina Kannada", "Belagavi", "Shivamogga", "Kalaburagi", "Tumakuru", "Udupi", "Kodagu"]
        crime_types = ["Cyber Crime", "Financial Fraud", "Murder", "Assault", "Robbery", "Burglary", "Kidnapping", "Drug Trafficking", "Missing Person", "Vehicle Theft", "Mobile Theft", "Chain Snatching", "Online Scam", "Identity Theft"]
        banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Canara Bank", "Punjab National Bank", "Bank of Baroda", "Union Bank", "Indian Bank", "Kotak Mahindra", "IDFC FIRST", "Federal Bank"]
        account_types = ["Savings", "Current", "Salary", "Business", "Joint"]
        vehicle_brands = ["Maruti", "Hyundai", "Honda", "Toyota", "Tata", "Mahindra", "Kia", "MG", "Skoda", "Volkswagen"]
        vehicle_types = ["Bike", "Scooter", "Car", "SUV", "Truck", "Auto"]
        evidence_types = ["CCTV Footage", "Fingerprints", "DNA Sample", "Blood Sample", "Weapon", "Laptop", "Mobile Phone", "SIM Card", "Hard Disk", "USB Drive", "Bank Statements", "Photographs", "Audio Recording", "Vehicle"]
        device_brands = ["Samsung", "Apple", "Xiaomi", "OnePlus", "Vivo", "Oppo", "Realme", "Google Pixel", "Motorola", "Dell", "HP", "Lenovo", "Asus"]
        persons = []
        for index in range(1, 101):
            persons.append({
                "person_id": f"PER{index:05d}", "first_name": first_names[(index - 1) % len(first_names)],
                "last_name": last_names[(index * 3) % len(last_names)], "gender": ["Male", "Female", "Other"][index % 3],
                "date_of_birth": f"{1965 + (index * 7) % 38:04d}-{1 + index % 12:02d}-{1 + index % 27:02d}", "age": 18 + (index * 11) % 57,
                "mobile_number": f"{9 + index % 2}{self.random.randint(100000000, 999999999)}", "aadhaar_number": f"{self.random.randint(100000000000, 999999999999)}",
                "pan_number": f"{chr(65 + index % 26)}{chr(65 + (index * 3) % 26)}{chr(65 + (index * 5) % 26)}{index:04d}P", "district": districts[(index - 1) % len(districts)],
            })
        cases = []
        for index in range(1, 31):
            incident = now - timedelta(days=self.random.randint(30, 3650), hours=self.random.randint(0, 23), minutes=self.random.randint(0, 59))
            cases.append({"case_id": f"CAS{index:05d}", "case_number": f"CASE/{index:05d}",
                          "incident_datetime": incident.isoformat(), "crime_type": crime_types[(index * 5) % len(crime_types)],
                          "status": ["Registered", "Under Investigation", "Charge Sheet Filed", "Pending Trial"][index % 4]})
        persons_by_case = []
        for index, case in enumerate(cases, 1):
            for offset, role in enumerate(("Complainant", "Suspect", "Witness")):
                persons_by_case.append({"relationship_id": f"REL{len(persons_by_case)+1:06d}",
                                        "case_id": case["case_id"], "person_id": persons[(index + offset) % 100]["person_id"],
                                        "role": role, "assigned_date": (datetime.fromisoformat(case["incident_datetime"]) + timedelta(days=self.random.randint(0, 14))).date().isoformat(), "status": ["Active", "Transferred", "Closed"][index % 3]})
        self.random.shuffle(persons_by_case)
        persons_by_case_ids = {row["case_id"]: row["person_id"] for row in persons_by_case if row["role"] == "Suspect"}
        firms = []
        for index, case in enumerate(cases, 1):
            registered = datetime.fromisoformat(case["incident_datetime"]) + timedelta(days=2)
            firms.append({"fir_id": f"FIR{index:05d}", "case_id": case["case_id"], "complainant_id": persons[(index) % 100]["person_id"],
                          "registration_datetime": registered.isoformat(), "fir_number": f"{districts[index % len(districts)][:3].upper()}/{2024 + index % 2}/{index:05d}", "police_station": ["Cubbon Park", "Vijayanagar", "Devaraja", "Mangaluru East", "Hubballi North", "Belagavi Camp", "Shivamogga Town", "Udupi Town"][index % 8]})

        phones = [{"phone_id": f"PHN{index:05d}", "person_id": person["person_id"], "mobile_number": person["mobile_number"],
                   "imei": f"{self.random.randint(100000000000000, 999999999999999)}", "imsi": f"404{self.random.randint(100000000000000, 999999999999999)}", "provider": ["Airtel", "Jio", "Vi", "BSNL"][index % 4],
                   "sim_type": ["Prepaid", "Postpaid"][index % 2], "connection_type": ["4G", "5G", "VoLTE"][index % 3], "activation_date": (now - timedelta(days=self.random.randint(30, 1800))).date().isoformat(), "status": ["Active", "Active", "Suspended"][index % 3], "is_primary": "True"}
                  for index, person in enumerate(persons, 1)]
        vehicles = [{"vehicle_id": f"VEH{index:05d}", "person_id": persons[index % 100]["person_id"], "registration_number": f"KA-{1 + index % 57:02d}-{chr(65 + index % 26)}-{self.random.randint(1000, 9999)}", "vehicle_type": f"{vehicle_types[index % len(vehicle_types)]} ({vehicle_brands[index % len(vehicle_brands)]})"} for index in range(1, 51)]
        accounts = [{"account_id": f"ACC{index:05d}", "person_id": persons[index % 100]["person_id"], "account_number": f"{self.random.randint(10000000000, 99999999999)}", "bank_name": banks[index % len(banks)], "account_type": account_types[index % len(account_types)]} for index in range(1, 81)]
        transaction_types = ["UPI", "NEFT", "RTGS", "IMPS", "Cash Withdrawal", "ATM", "Debit Card", "Credit Card", "Wallet"]
        transactions = [{"transaction_id": f"TXN{index:06d}", "account_id": accounts[index % 80]["account_id"], "transaction_datetime": (now - timedelta(days=self.random.randint(0, 180), minutes=self.random.randint(0, 1439))).isoformat(), "amount": f"{self.random.uniform(250, 250000):.2f}", "transaction_type": transaction_types[index % len(transaction_types)]} for index in range(1, 201)]
        evidence = [{"evidence_id": f"EVD{index:05d}", "fir_id": fir["fir_id"], "case_id": fir["case_id"], "evidence_type": evidence_types[index % len(evidence_types)], "collected_datetime": fir["registration_datetime"]} for index, fir in enumerate(firms, 1)]
        arrests = [{"arrest_id": f"ARR{index:05d}", "fir_id": fir["fir_id"], "case_id": fir["case_id"], "suspect_id": persons_by_case_ids[fir["case_id"]], "arrest_datetime": (datetime.fromisoformat(fir["registration_datetime"]) + timedelta(days=3)).isoformat()} for index, fir in enumerate(firms, 1)]
        chargesheets = [{"chargesheet_id": f"CHG{index:05d}", "fir_id": fir["fir_id"], "case_id": fir["case_id"], "suspect_id": persons_by_case_ids[fir["case_id"]], "filing_date": (datetime.fromisoformat(fir["registration_datetime"]) + timedelta(days=10)).date().isoformat()} for index, fir in enumerate(firms, 1)]
        court = [{"court_case_id": f"CRT{index:05d}", "chargesheet_id": chargesheets[index-1]["chargesheet_id"], "case_id": fir["case_id"], "hearing_date": (datetime.fromisoformat(fir["registration_datetime"]) + timedelta(days=20)).date().isoformat()} for index, fir in enumerate(firms, 1)]
        diary_actions = ["Witness statement recorded", "CCTV footage reviewed", "Call records requested", "Digital evidence submitted", "Suspect address verified", "Bank statement obtained", "Forensic report received"]
        diary = [{"diary_id": f"DIA{index:05d}", "case_id": case["case_id"], "entry_datetime": (datetime.fromisoformat(case["incident_datetime"]) + timedelta(days=5 + index % 12)).isoformat(), "entry_text": f"{diary_actions[index % len(diary_actions)]}; field note {index:04d} recorded by {first_names[index % len(first_names)]} {last_names[index % len(last_names)]}."} for index, case in enumerate(cases, 1)]
        devices = [{"device_id": f"DEV{index:05d}", "person_id": persons[index % 100]["person_id"], "device_type": f"{['Mobile', 'Laptop', 'Tablet'][index % 3]} ({device_brands[index % len(device_brands)]})", "device_identifier": f"DEVICE{self.random.randint(10000000, 99999999)}"} for index in range(1, 81)]
        def communication(name, key, count):
            rows = []
            for index in range(1, count + 1):
                case = cases[index % len(cases)]
                sender = persons[index % 100]["person_id"]
                receiver = persons[(index + 1) % 100]["person_id"]
                communication_time = datetime.fromisoformat(case["incident_datetime"]) + timedelta(days=self.random.randint(0, 120), hours=self.random.randint(0, 23), minutes=self.random.randint(0, 59))
                communication_time = min(communication_time, now)
                row = {key: f"{key.upper()[:3]}{index:06d}", "sender_person_id": sender, "receiver_person_id": receiver, "case_id": case["case_id"], "message_datetime": communication_time.isoformat()}
                if name == "emails":
                    row["email_datetime"] = row.pop("message_datetime")
                rows.append(row)
            return rows
        datasets = {"persons.csv": persons, "phones.csv": phones, "vehicles.csv": vehicles, "bank_accounts.csv": accounts,
                    "transactions.csv": transactions, "cases.csv": cases, "case_person_relationships.csv": persons_by_case,
                    "fir.csv": firms, "evidence.csv": evidence, "arrests.csv": arrests, "chargesheets.csv": chargesheets,
                    "court_cases.csv": court, "investigation_diary.csv": diary, "devices.csv": devices,
                    "cdr.csv": communication("cdr", "cdr_id", 150), "sms_records.csv": communication("sms_records", "sms_id", 150),
                    "whatsapp_messages.csv": communication("whatsapp_messages", "message_id", 150), "emails.csv": communication("emails", "email_id", 100)}
        self._randomize_identifiers(datasets)
        for name, rows in datasets.items():
            self._write(name, rows)
        elapsed = time.perf_counter() - started
        print(f"SUCCESS: generated {len(datasets)} CSV files with {sum(map(len, datasets.values()))} records in {elapsed:.2f}s")
        return {name: len(rows) for name, rows in datasets.items()}


if __name__ == "__main__":
    DatasetPipeline().run()
