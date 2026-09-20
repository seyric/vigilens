from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from backend.auth.dependencies import get_current_active_user
from backend.auth.models import CurrentUser
from backend.core.service import core_service, orm_to_dict
from pydantic import BaseModel
from database.models import Suspect, Vehicle, Victim, District, PoliceStation, Officer, FIR
from sqlalchemy import func

core_router = APIRouter(prefix="/core", tags=["core"])

class FIRCreateRequest(BaseModel):
    firNumber: str
    crimeType: str
    date: str
    time: str
    district: str
    policeStation: str
    officer: str
    victimName: str
    accusedName: str
    vehicleNumber: str
    weaponUsed: str
    location: str
    description: str

class DiaryEntryRequest(BaseModel):
    content: str
    fir_id: str | None = None

# ── FIR Endpoints ────────────────────────────────────────────────────────────

@core_router.get("/firs")
def get_firs(
    station_id: Optional[str] = None,
    district_id: Optional[str] = None,
    status: Optional[str] = None,
    severity: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve list of FIR cases filtered by current user's geographical scope."""
    firs = core_service.get_firs(
        db=db,
        user=current_user,
        station_id=station_id,
        district_id=district_id,
        status=status,
        severity=severity
    )
    result = []
    for fir in firs:
        fir_dict = orm_to_dict(fir)
        fir_dict["district_name"] = fir.district.district_name if getattr(fir, "district", None) else None
        fir_dict["station_name"] = fir.station.station_name if getattr(fir, "station", None) else None
        fir_dict["officer_name"] = fir.investigating_officer.full_name if getattr(fir, "investigating_officer", None) else None
        result.append(fir_dict)
    return result

@core_router.post("/firs")
def create_fir(
    payload: FIRCreateRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user)
):
    district = db.query(District).filter(District.district_name == payload.district).first()
    if not district:
        district = db.query(District).first()
    
    station = db.query(PoliceStation).filter(PoliceStation.station_name == payload.policeStation).first()
    if not station:
        station = db.query(PoliceStation).first()
        
    officer = db.query(Officer).filter(Officer.full_name == payload.officer).first()
    if not officer:
        officer = db.query(Officer).first()

    new_fir = FIR(
        fir_number=payload.firNumber,
        fir_date=func.now(),
        station_id=station.station_id if station else current_user.station_id,
        district_id=district.district_id if district else current_user.district_id,
        complainant_name=payload.victimName,
        complaint_details=payload.description,
        investigating_officer_id=officer.officer_id if officer else current_user.officer_id,
        status="Investigating",
        severity="High"
    )
    db.add(new_fir)
    db.commit()
    db.refresh(new_fir)
    return {"message": "FIR saved successfully", "fir_id": new_fir.fir_id}

@core_router.get("/firs/{fir_id}")
def get_fir_by_id(
    fir_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve details of a specific FIR case after checking geographical visibility."""
    return orm_to_dict(core_service.get_fir_by_id(db=db, user=current_user, fir_id=fir_id))


# ── Crime Endpoints ──────────────────────────────────────────────────────────

@core_router.get("/crimes")
def get_crimes(
    category_id: Optional[str] = None,
    severity: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve list of recorded crimes filtered by user geographical access."""
    return orm_to_dict(
        core_service.get_crimes(
            db=db,
            user=current_user,
            category_id=category_id,
            severity=severity
        )
    )


@core_router.get("/crimes/{crime_id}")
def get_crime_by_id(
    crime_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve details of a specific crime instance."""
    return orm_to_dict(core_service.get_crime_by_id(db=db, user=current_user, crime_id=crime_id))


# ── District Endpoints ────────────────────────────────────────────────────────

@core_router.get("/districts")
def get_districts(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve districts list, scoping results depending on administrative access."""
    return orm_to_dict(core_service.get_districts(db=db, user=current_user))


@core_router.get("/districts/{district_id}")
def get_district_by_id(
    district_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve specific district metadata."""
    return orm_to_dict(core_service.get_district_by_id(db=db, user=current_user, district_id=district_id))


# ── Officer Endpoints ─────────────────────────────────────────────────────────

@core_router.get("/officers")
def get_officers(
    station_id: Optional[str] = None,
    district_id: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve list of registered officers in current user's geographical scope."""
    return orm_to_dict(
        core_service.get_officers(
            db=db,
            user=current_user,
            station_id=station_id,
            district_id=district_id,
            status=status
        )
    )


@core_router.get("/officers/{officer_id}")
def get_officer_by_id(
    officer_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve specific officer file details."""
    return orm_to_dict(core_service.get_officer_by_id(db=db, user=current_user, officer_id=officer_id))


# ── Evidence Endpoints ────────────────────────────────────────────────────────

@core_router.get("/evidence")
def get_evidence(
    evidence_type: Optional[str] = None,
    collected_by: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve evidence items record filtered by user's jurisdiction."""
    evidence_list = core_service.get_evidence(
        db=db,
        user=current_user,
        evidence_type=evidence_type,
        collected_by=collected_by
    )
    result = []
    for ev in evidence_list:
        ev_dict = orm_to_dict(ev)
        if hasattr(ev, 'crimes') and ev.crimes and ev.crimes[0].crime:
            ev_dict["fir_id"] = ev.crimes[0].crime.fir_id
        else:
            ev_dict["fir_id"] = None
        result.append(ev_dict)
    return result


@core_router.get("/evidence/{evidence_id}")
def get_evidence_by_id(
    evidence_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Retrieve a specific piece of evidence details."""
    return orm_to_dict(core_service.get_evidence_by_id(db=db, user=current_user, evidence_id=evidence_id))


@core_router.get("/entities")
def get_entities(fir_id: Optional[str] = None, db: Session = Depends(get_db)):
    from database.models import Crime, CrimeSuspect, CrimeVehicle, CrimeVictim

    if not fir_id:
        suspect = db.query(Suspect).first()
        vehicle = db.query(Vehicle).first()
        victim = db.query(Victim).first()
    else:
        crime = db.query(Crime).filter(Crime.fir_id == fir_id).first()
        if crime:
            cs = db.query(CrimeSuspect).filter(CrimeSuspect.crime_id == crime.crime_id).first()
            cv = db.query(CrimeVehicle).filter(CrimeVehicle.crime_id == crime.crime_id).first()
            c_vic = db.query(CrimeVictim).filter(CrimeVictim.crime_id == crime.crime_id).first()

            suspect = cs.suspect if cs else None
            vehicle = cv.vehicle if cv else None
            victim = c_vic.victim if c_vic else None
        else:
            suspect, vehicle, victim = None, None, None

    return {
        "suspect": orm_to_dict(suspect) if suspect else None,
        "vehicle": orm_to_dict(vehicle) if vehicle else None,
        "victim": orm_to_dict(victim) if victim else None
    }


# ── Diary Endpoints ──────────────────────────────────────────────────────────

@core_router.post("/diary")
def create_diary_entry(
    request: DiaryEntryRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user)
):
    """Officer Investigation Diary: Add a new diary entry, stored as an ActivityLog."""
    from database.models import ActivityLog
    
    log = ActivityLog(
        user_id=current_user.user_id,
        entity_type="DIARY_ENTRY",
        entity_id=request.fir_id, # Optional link to FIR
        action="CREATE_DIARY",
        details={"content": request.content}
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    
    # We could trigger AI summarization here, but for now we just return the saved log.
    return {"message": "Diary entry saved.", "log_id": log.activity_log_id}


@core_router.get("/diary")
def get_diary_entries(
    fir_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user)
):
    """Officer Investigation Diary: Retrieve past diary entries."""
    from database.models import ActivityLog
    
    query = db.query(ActivityLog).filter(
        ActivityLog.user_id == current_user.user_id,
        ActivityLog.entity_type == "DIARY_ENTRY"
    )
    
    if fir_id:
        query = query.filter(ActivityLog.entity_id == fir_id)
        
    logs = query.order_by(ActivityLog.timestamp.desc()).all()
    return [
        {
            "log_id": log.activity_log_id,
            "timestamp": log.timestamp,
            "fir_id": log.entity_id,
            "content": log.details.get("content", "") if log.details else ""
        }
        for log in logs
    ]

