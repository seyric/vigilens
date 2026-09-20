import os
import sys
import csv
import pandas as pd
from pathlib import Path
from datetime import datetime
import random

# Add the root directory to path to allow imports from database and config
root_dir = Path(__file__).resolve().parents[3]
sys.path.append(str(root_dir))

from database.connection import get_session
from database.models import (
    District, PoliceStation, Officer, CrimeCategory, FIR, Crime,
    Suspect, CrimeSuspect, Evidence, CrimeEvidence, Role, User
)

def read_csv(filename):
    data_dir = root_dir / "backend" / "data" / "generated"
    file_path = data_dir / filename
    if not file_path.exists():
        print(f"Warning: {filename} not found.")
        return []
    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)

def load_raw_csvs_to_postgres():
    """Load generated CSVs into a raw schema for Neo4j and data-science access."""
    print("Loading raw CSVs into 'raw' schema...")
    data_dir = root_dir / "backend" / "data" / "generated"
    
    TABLES = ["persons", "phones", "vehicles", "bank_accounts", "transactions", "cases", 
              "case_person_relationships", "fir", "evidence", "arrests", "chargesheets", 
              "court_cases", "investigation_diary", "devices", "cdr", "sms_records", 
              "whatsapp_messages", "emails"]
              
    from sqlalchemy import create_engine, text
    from dotenv import load_dotenv
    
    load_dotenv(root_dir.parent / ".env")
    load_dotenv(root_dir / ".env")
    
    host = os.getenv("POSTGRES_HOST")
    port = os.getenv("POSTGRES_PORT", "5432")
    database = os.getenv("POSTGRES_DATABASE", os.getenv("POSTGRES_DB"))
    user = os.getenv("POSTGRES_USER")
    password = os.getenv("POSTGRES_PASSWORD")
    
    if not all((host, database, user, password)):
        print("Missing DB credentials, skipping raw loader.")
        return
        
    database_url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
    engine = create_engine(database_url, connect_args={"sslmode": os.getenv("POSTGRES_SSLMODE", "require")}, pool_pre_ping=True)
    
    with engine.begin() as connection:
        connection.execute(text("CREATE SCHEMA IF NOT EXISTS raw;"))
        for table in TABLES:
            csv_path = data_dir / f"{table}.csv"
            if csv_path.exists():
                frame = pd.read_csv(csv_path)
                frame.to_sql(table, connection, schema="raw", if_exists="replace", index=False, method="multi", chunksize=1000)
    print("Successfully loaded raw tables into 'raw' schema.")

def seed_db():
    print("Reading CSVs for ORM...")
    persons = read_csv("persons.csv")
    cases = read_csv("cases.csv")
    firs = read_csv("fir.csv")
    relationships = read_csv("case_person_relationships.csv")
    evidence = read_csv("evidence.csv")

    with get_session() as session:
        # Since this is PostgreSQL and we have complex foreign keys, use TRUNCATE CASCADE
        from sqlalchemy import text
        session.execute(text("TRUNCATE TABLE districts CASCADE;"))
        session.execute(text("TRUNCATE TABLE roles CASCADE;"))
        session.execute(text("TRUNCATE TABLE crime_categories CASCADE;"))
        session.execute(text("TRUNCATE TABLE weapons CASCADE;"))
        
        # Pandas to_sql overwrote these tables with wrong schema previously, so we must DROP and recreate them
        session.execute(text("DROP TABLE IF EXISTS evidence CASCADE;"))
        session.execute(text("DROP TABLE IF EXISTS vehicles CASCADE;"))
        session.commit()
        
        from database.connection import engine
        from database.models import Base
        Base.metadata.create_all(engine)

        print("Seeding Districts & Stations...")
        district_map = {}
        unique_districts = set([p["district"] for p in persons] + ["Bengaluru Urban"])
        for d_name in unique_districts:
            district = District(district_name=d_name, region="Karnataka", headquarters=d_name)
            session.add(district)
            session.flush()
            district_map[d_name] = district.district_id

        station_map = {}
        station_to_district = {}
        unique_stations = set([f["police_station"] for f in firs] + ["Central Station"])
        for idx, s_name in enumerate(unique_stations):
            d_name = list(unique_districts)[idx % len(unique_districts)]
            d_id = district_map[d_name]
            station = PoliceStation(station_name=s_name, station_code=f"PS{idx:03d}", station_type="PS", district_id=d_id)
            session.add(station)
            session.flush()
            station_map[s_name] = station.station_id
            station_to_district[station.station_id] = d_id

        print("Seeding Officers...")
        # Create a few officers spread across districts
        officers = []
        for d_name, d_id in district_map.items():
            # Get a station in this district
            s_id = next((sid for sid, did in station_to_district.items() if did == d_id), list(station_map.values())[0])
            officer = Officer(full_name=f"IO {d_name}", rank="Inspector", designation="Investigating Officer", district_id=d_id, station_id=s_id)
            session.add(officer)
            session.flush()
            officers.append(officer)
            
        # Specific officer for sho_asha
        bengaluru_d_id = district_map.get("Bengaluru Urban")
        bengaluru_s_id = next((sid for sid, did in station_to_district.items() if did == bengaluru_d_id), list(station_map.values())[0])
        asha_officer = Officer(full_name="Asha Patil", rank="Inspector", designation="SHO", district_id=bengaluru_d_id, station_id=bengaluru_s_id)
        session.add(asha_officer)
        session.flush()
        officers.append(asha_officer)

        print("Seeding Crime Categories...")
        category_map = {}
        unique_categories = set([c["crime_type"] for c in cases])
        for c_name in unique_categories:
            severity = "High" if "Murder" in c_name or "Robbery" in c_name else "Medium"
            cat = CrimeCategory(category_name=c_name, severity=severity)
            session.add(cat)
            session.flush()
            category_map[c_name] = cat.category_id

        print("Seeding Persons as Suspects...")
        person_suspect_map = {}
        for p in persons:
            suspect = Suspect(full_name=f"{p['first_name']} {p['last_name']}", gender=p['gender'], district_id=district_map.get(p['district']))
            session.add(suspect)
            session.flush()
            person_suspect_map[p["person_id"]] = suspect.suspect_id

        print("Seeding FIRs & Crimes...")
        cases_by_id = {c["case_id"]: c for c in cases}
        
        fir_map = {}
        crime_map = {}
        for f in firs:
            case = cases_by_id.get(f["case_id"])
            if not case:
                continue
            
            complainant_person = next((p for p in persons if p["person_id"] == f["complainant_id"]), None)
            comp_name = f"{complainant_person['first_name']} {complainant_person['last_name']}" if complainant_person else "Unknown Complainant"

            try:
                fir_date = datetime.fromisoformat(f["registration_datetime"])
                incident_date = datetime.fromisoformat(case["incident_datetime"])
            except ValueError:
                fir_date = datetime.now()
                incident_date = datetime.now()

            s_id = station_map.get(f["police_station"], list(station_map.values())[0])
            d_id = station_to_district.get(s_id, list(district_map.values())[0])
            
            # Find an officer in this district
            d_officers = [o for o in officers if o.district_id == d_id]
            investigating_officer = d_officers[0] if d_officers else officers[0]

            new_fir = FIR(
                fir_number=f["fir_number"],
                fir_date=fir_date,
                station_id=s_id,
                district_id=d_id,
                complainant_name=comp_name,
                complaint_details=f"Case {case['case_number']}: {case['crime_type']} reported.",
                investigating_officer_id=investigating_officer.officer_id,
                status=case["status"],
                severity="High" if "Murder" in case["crime_type"] else "Medium"
            )
            session.add(new_fir)
            session.flush()
            fir_map[f["fir_id"]] = new_fir.fir_id

            new_crime = Crime(
                fir_id=new_fir.fir_id,
                category_id=category_map[case["crime_type"]],
                crime_description=f"Incident of {case['crime_type']}",
                reported_at=incident_date,
                severity=new_fir.severity
            )
            session.add(new_crime)
            session.flush()
            crime_map[case["case_id"]] = new_crime.crime_id

        print("Seeding Suspect Relationships...")
        for r in relationships:
            if r["role"] == "Suspect" and r["case_id"] in crime_map and r["person_id"] in person_suspect_map:
                crime_suspect = CrimeSuspect(
                    crime_id=crime_map[r["case_id"]],
                    suspect_id=person_suspect_map[r["person_id"]],
                    role="Primary",
                    status="Arrested" if r["status"] == "Closed" else "Wanted"
                )
                session.add(crime_suspect)

        print("Seeding Evidence...")
        for e in evidence:
            if e["case_id"] in crime_map:
                new_evidence = Evidence(
                    evidence_type="Physical",
                    evidence_subtype=e["evidence_type"],
                    description=f"Location: {e.get('location', 'Unknown')}",
                    collected_by=officers[0].officer_id,
                    storage_location="Evidence Room"
                )
                session.add(new_evidence)
                session.flush()

                ce = CrimeEvidence(crime_id=crime_map[e["case_id"]], evidence_id=new_evidence.evidence_id)
                session.add(ce)

        session.commit()
        print("Successfully seeded the synthetic data into the ORM models!")

if __name__ == "__main__":
    load_raw_csvs_to_postgres()
    seed_db()
