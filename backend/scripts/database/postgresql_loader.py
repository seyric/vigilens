from __future__ import annotations

import os
import time
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text


class PostgreSQLLoader:
    TABLES = ["persons", "phones", "vehicles", "bank_accounts", "transactions", "cases", "case_person_relationships", "fir", "evidence", "arrests", "chargesheets", "court_cases", "investigation_diary", "devices", "cdr", "sms_records", "whatsapp_messages", "emails"]
    PRIMARY_KEYS = {"persons": "person_id", "phones": "phone_id", "vehicles": "vehicle_id", "bank_accounts": "account_id", "transactions": "transaction_id", "cases": "case_id", "case_person_relationships": "relationship_id", "fir": "fir_id", "evidence": "evidence_id", "arrests": "arrest_id", "chargesheets": "chargesheet_id", "court_cases": "court_case_id", "investigation_diary": "diary_id", "devices": "device_id", "cdr": "cdr_id", "sms_records": "sms_id", "whatsapp_messages": "message_id", "emails": "email_id"}

    def __init__(self):
        self.root = Path(__file__).resolve().parents[2]
        self.generated_dir = self.root / "data" / "generated"
        load_dotenv(self.root.parent / ".env")
        load_dotenv(self.root / ".env")
        host = os.getenv("POSTGRES_HOST")
        port = os.getenv("POSTGRES_PORT", "5432")
        database = os.getenv("POSTGRES_DATABASE", os.getenv("POSTGRES_DB"))
        user = os.getenv("POSTGRES_USER")
        password = os.getenv("POSTGRES_PASSWORD")
        if not all((host, database, user, password)):
            raise RuntimeError("POSTGRES_HOST, POSTGRES_DATABASE, POSTGRES_USER, and POSTGRES_PASSWORD are required")
        self.database_url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
        self.engine = create_engine(self.database_url, connect_args={"sslmode": os.getenv("POSTGRES_SSLMODE", "require")}, pool_pre_ping=True)

    def run(self):
        started = time.perf_counter()
        frames = {table: pd.read_csv(self.generated_dir / f"{table}.csv") for table in self.TABLES}
        with self.engine.begin() as connection:
            for table, frame in frames.items():
                frame.to_sql(table, connection, if_exists="replace", index=False, method="multi", chunksize=1000)
            for table, column in self.PRIMARY_KEYS.items():
                connection.execute(text(f'CREATE UNIQUE INDEX IF NOT EXISTS "pk_{table}_{column}" ON "{table}" ("{column}")'))
        counts = {}
        with self.engine.connect() as connection:
            for table, frame in frames.items():
                count = connection.execute(text(f'SELECT COUNT(*) FROM "{table}"')).scalar_one()
                counts[table] = int(count)
                if count != len(frame):
                    raise RuntimeError(f"{table}: database count {count} != CSV count {len(frame)}")
        print(f"SUCCESS: PostgreSQL loaded {len(frames)} tables and {sum(counts.values())} records in {time.perf_counter() - started:.2f}s")
        return counts


if __name__ == "__main__":
    PostgreSQLLoader().run()
