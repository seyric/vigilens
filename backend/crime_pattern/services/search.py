"""Scoped, parameter-bound searches and RapidFuzz fallback matching."""
from time import perf_counter
from rapidfuzz import fuzz
from sqlalchemy import inspect, or_, select, MetaData, Table
from backend.auth.models import Roles
from database.models import FIR, Suspect, Vehicle, Evidence, Crime, CrimeCategory, District, PoliceStation
from utils.logger import logger

KEYS = (
    "persons", "phones", "vehicles", "bank_accounts", "transactions", 
    "cases", "fir", "evidence", "arrests", "chargesheets", 
    "court_cases", "devices", "cdr", "sms_records", "whatsapp_messages", "emails"
)

def serialize(item):
    return {col.name: getattr(item, col.name) for col in item.__table__.columns}

class CrimeRecordSearcher:
    def search(self, db, user, parsed):
        started = perf_counter()
        out = {key: [] for key in KEYS}
        unmatched_queries = {"persons": [], "vehicles": []}
        candidates = {"persons": [], "vehicles": []}

        # 1. Exact / ILIKE Search for Suspects / Persons
        if parsed.name:
            matched_person_ids = set()
            for name_val in parsed.name:
                clean_val = name_val.strip()
                if not clean_val:
                    continue
                rows = db.query(Suspect).filter(Suspect.full_name.ilike(f"%{clean_val}%")).limit(50).all()
                if rows:
                    for row in rows:
                        if row.suspect_id not in matched_person_ids:
                            matched_person_ids.add(row.suspect_id)
                            out["persons"].append(serialize(row))
                else:
                    unmatched_queries["persons"].append(clean_val)

        # 2. Exact / ILIKE Search for Vehicles
        if parsed.vehicle:
            matched_vehicle_ids = set()
            for vehicle_val in parsed.vehicle:
                clean_val = vehicle_val.strip()
                if not clean_val:
                    continue
                rows = db.query(Vehicle).filter(Vehicle.registration_number.ilike(f"%{clean_val}%")).limit(50).all()
                if rows:
                    for row in rows:
                        if row.vehicle_id not in matched_vehicle_ids:
                            matched_vehicle_ids.add(row.vehicle_id)
                            out["vehicles"].append(serialize(row))
                else:
                    unmatched_queries["vehicles"].append(clean_val)

        # 3. FIR Search
        filters = []
        if parsed.fir_no:
            filters.extend([FIR.fir_number.ilike(f"%{val.strip()}%") for val in parsed.fir_no if val.strip()])
        if parsed.name:
            filters.extend([FIR.complainant_name.ilike(f"%{val.strip()}%") for val in parsed.name if val.strip()])

        if filters:
            firs_q = self._scope(db.query(FIR), user)
            if parsed.district:
                firs_q = firs_q.join(District).filter(
                    or_(*[District.district_name.ilike(f"%{val.strip()}%") for val in parsed.district if val.strip()])
                )
            if parsed.police_station:
                firs_q = firs_q.join(PoliceStation).filter(
                    or_(*[PoliceStation.station_name.ilike(f"%{val.strip()}%") for val in parsed.police_station if val.strip()])
                )
            out["fir"] = [serialize(row) for row in firs_q.filter(or_(*filters)).limit(50).all()]

        # 4. Crimes / Cases Search
        if parsed.crime_type:
            crime_filters = [CrimeCategory.category_name.ilike(f"%{val.strip()}%") for val in parsed.crime_type if val.strip()]
            if crime_filters:
                crimes_q = self._scope(db.query(Crime).join(FIR), user).join(CrimeCategory).filter(or_(*crime_filters))
                out["cases"] = [serialize(row) for row in crimes_q.limit(50).all()]

        # 5. Evidence Search
        terms = [val.strip() for val in (*parsed.name, *parsed.location, *parsed.organization) if val.strip()]
        if terms:
            out["evidence"] = [
                serialize(row) for row in db.query(Evidence).filter(
                    or_(*[Evidence.description.ilike(f"%{val}%") for val in terms])
                ).limit(50).all()
            ]

        # 6. Optional Tables Search
        self._optional_tables(db, parsed, out)

        # 7. RapidFuzz Fallback Matching ONLY for Unmatched Queries
        if unmatched_queries["persons"]:
            candidates["persons"] = [serialize(row) for row in db.query(Suspect).limit(300).all()]
        if unmatched_queries["vehicles"]:
            candidates["vehicles"] = [serialize(row) for row in db.query(Vehicle).limit(300).all()]

        similar_matches = self._similar(unmatched_queries, candidates)

        logger.info("Crime-pattern database query time={}ms", round((perf_counter() - started) * 1000))
        return out, similar_matches

    def _scope(self, query, user):
        if user.role == Roles.DISTRICT_SUPERINTENDENT:
            return query.filter(FIR.district_id == user.district_id)
        if user.role in (Roles.STATION_HOUSE_OFFICER, Roles.INVESTIGATING_OFFICER):
            return query.filter(FIR.station_id == user.station_id)
        return query

    def _optional_tables(self, db, parsed, out):
        values = [
            val.strip() for val in (*parsed.phone, *parsed.email, *parsed.bank_account, *parsed.case_no, *parsed.aadhaar, *parsed.pan) 
            if val.strip()
        ]
        if not values:
            return
        
        try:
            inspector = inspect(db.bind)
            existing_tables = set(inspector.get_table_names())
        except Exception as error:
            logger.warning("Could not inspect database tables: {}", type(error).__name__)
            return

        target_tables = (set(KEYS) & existing_tables) - {"vehicles", "evidence"}
        for name in target_tables:
            try:
                table = Table(name, MetaData(), autoload_with=db.bind)
                string_columns = [column for column in table.c if getattr(column.type, "python_type", None) is str][:12]
                if string_columns:
                    stmt = select(table).where(
                        or_(*[column.ilike(f"%{val}%") for column in string_columns for val in values])
                    ).limit(50)
                    out[name] = [dict(row) for row in db.execute(stmt).mappings()]
            except Exception as error:
                logger.warning("Optional crime-pattern table {} skipped: {}", name, type(error).__name__)

    def _similar(self, unmatched_queries, candidates):
        matches = []
        for dataset, values, field in (("persons", unmatched_queries["persons"], "full_name"), ("vehicles", unmatched_queries["vehicles"], "registration_number")):
            for value in values:
                clean_q = value.replace(" ", "").lower()
                for record in candidates[dataset]:
                    rec_val = str(record.get(field) or "").replace(" ", "").lower()
                    if not rec_val:
                        continue
                    score = fuzz.ratio(clean_q, rec_val)
                    if 60 <= score < 100:
                        matches.append({
                            "dataset": dataset,
                            "query": value,
                            "record": record,
                            "similarity_percentage": round(score, 2)
                        })
        return sorted(matches, key=lambda item: item["similarity_percentage"], reverse=True)[:50]
