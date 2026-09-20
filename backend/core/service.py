from typing import List, Optional, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException

from database.models import FIR, Crime, District, Officer, Evidence, PoliceStation
from backend.auth.models import CurrentUser, Roles
from backend.auth.exceptions import InsufficientPermissionError
from backend.auth.permissions import can_view_case


def orm_to_dict(instance: Any) -> Any:
    """Helper to convert SQLAlchemy model instances to dicts, removing relations to prevent serialization RecursionError."""
    if instance is None:
        return None
    if isinstance(instance, list):
        return [orm_to_dict(item) for item in instance]
    if hasattr(instance, "__table__"):
        return {col.name: getattr(instance, col.name) for col in instance.__table__.columns}
    return instance


class CoreService:
    """Service layer coordinating Core APIs and applying geographical scoping rules."""

    # ── FIR Services ─────────────────────────────────────────────────────────

    def get_firs(
        self,
        db: Session,
        user: CurrentUser,
        station_id: Optional[str] = None,
        district_id: Optional[str] = None,
        status: Optional[str] = None,
        severity: Optional[str] = None,
    ) -> List[FIR]:
        query = db.query(FIR)

        # Apply geographic security filters based on user role
        if user.role in (Roles.SYSTEM_ADMIN, Roles.STATE_ADMIN):
            # Admins see everything, but can filter by query params
            if district_id:
                query = query.filter(FIR.district_id == district_id)
            if station_id:
                query = query.filter(FIR.station_id == station_id)
        elif user.role == Roles.DISTRICT_SUPERINTENDENT:
            # Enforce district limit
            query = query.filter(FIR.district_id == user.district_id)
            if station_id:
                # DS can only filter stations within their own district
                query = query.join(PoliceStation).filter(
                    FIR.station_id == station_id,
                    PoliceStation.district_id == user.district_id
                )
        elif user.role in (Roles.STATION_HOUSE_OFFICER, Roles.INVESTIGATING_OFFICER):
            # Enforce station limit
            query = query.filter(FIR.station_id == user.station_id)

        # Apply common filters
        if status:
            query = query.filter(FIR.status == status)
        if severity:
            query = query.filter(FIR.severity == severity)

        return query.all()

    def get_fir_by_id(self, db: Session, user: CurrentUser, fir_id: str) -> FIR:
        fir = db.query(FIR).filter(FIR.fir_id == fir_id).first()
        if not fir:
            raise HTTPException(status_code=404, detail="FIR not found")

        # Verify geographical permissions
        if not can_view_case(user, fir):
            raise InsufficientPermissionError("Access denied to view this FIR due to geographical scoping.")

        return fir

    # ── Crime Services ───────────────────────────────────────────────────────

    def get_crimes(
        self,
        db: Session,
        user: CurrentUser,
        category_id: Optional[str] = None,
        severity: Optional[str] = None,
    ) -> List[Crime]:
        query = db.query(Crime).join(FIR)

        # Apply geographic security filters based on user role
        if user.role in (Roles.SYSTEM_ADMIN, Roles.STATE_ADMIN):
            pass
        elif user.role == Roles.DISTRICT_SUPERINTENDENT:
            query = query.filter(FIR.district_id == user.district_id)
        elif user.role in (Roles.STATION_HOUSE_OFFICER, Roles.INVESTIGATING_OFFICER):
            query = query.filter(FIR.station_id == user.station_id)

        if category_id:
            query = query.filter(Crime.category_id == category_id)
        if severity:
            query = query.filter(Crime.severity == severity)

        return query.all()

    def get_crime_by_id(self, db: Session, user: CurrentUser, crime_id: str) -> Crime:
        crime = db.query(Crime).filter(Crime.crime_id == crime_id).first()
        if not crime:
            raise HTTPException(status_code=404, detail="Crime not found")

        # Verify access through associated FIR
        if not can_view_case(user, crime.fir):
            raise InsufficientPermissionError("Access denied to view this Crime due to geographical scoping.")

        return crime

    # ── District Services ────────────────────────────────────────────────────

    def get_districts(self, db: Session, user: CurrentUser) -> List[District]:
        query = db.query(District)

        # Enforce security constraints
        if user.role in (Roles.SYSTEM_ADMIN, Roles.STATE_ADMIN):
            pass
        else:
            # Non-admins can only see their assigned district
            query = query.filter(District.district_id == user.district_id)

        return query.all()

    def get_district_by_id(self, db: Session, user: CurrentUser, district_id: str) -> District:
        # Enforce security constraints
        if user.role not in (Roles.SYSTEM_ADMIN, Roles.STATE_ADMIN):
            if user.district_id != district_id:
                raise InsufficientPermissionError("Access denied. You can only view your own district.")

        district = db.query(District).filter(District.district_id == district_id).first()
        if not district:
            raise HTTPException(status_code=404, detail="District not found")
        return district

    # ── Officer Services ─────────────────────────────────────────────────────

    def get_officers(
        self,
        db: Session,
        user: CurrentUser,
        station_id: Optional[str] = None,
        district_id: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[Officer]:
        query = db.query(Officer)

        # Apply geographic security filters based on user role
        if user.role in (Roles.SYSTEM_ADMIN, Roles.STATE_ADMIN):
            if district_id:
                query = query.filter(Officer.district_id == district_id)
            if station_id:
                query = query.filter(Officer.station_id == station_id)
        elif user.role == Roles.DISTRICT_SUPERINTENDENT:
            query = query.filter(Officer.district_id == user.district_id)
            if station_id:
                query = query.filter(Officer.station_id == station_id)
        elif user.role in (Roles.STATION_HOUSE_OFFICER, Roles.INVESTIGATING_OFFICER):
            query = query.filter(Officer.station_id == user.station_id)

        if status:
            query = query.filter(Officer.status == status)

        return query.all()

    def get_officer_by_id(self, db: Session, user: CurrentUser, officer_id: str) -> Officer:
        officer = db.query(Officer).filter(Officer.officer_id == officer_id).first()
        if not officer:
            raise HTTPException(status_code=404, detail="Officer not found")

        # Verify access bounds
        if user.role in (Roles.SYSTEM_ADMIN, Roles.STATE_ADMIN):
            pass
        elif user.role == Roles.DISTRICT_SUPERINTENDENT:
            if officer.district_id != user.district_id:
                raise InsufficientPermissionError("Access denied to view this officer details.")
        elif user.role in (Roles.STATION_HOUSE_OFFICER, Roles.INVESTIGATING_OFFICER):
            if officer.station_id != user.station_id:
                raise InsufficientPermissionError("Access denied to view this officer details.")

        return officer

    # ── Evidence Services ────────────────────────────────────────────────────

    def get_evidence(
        self,
        db: Session,
        user: CurrentUser,
        evidence_type: Optional[str] = None,
        collected_by: Optional[str] = None,
    ) -> List[Evidence]:
        # Enforce scope via the officer who collected it
        query = db.query(Evidence).outerjoin(Officer, Evidence.collected_by == Officer.officer_id)

        if user.role in (Roles.SYSTEM_ADMIN, Roles.STATE_ADMIN):
            pass
        elif user.role == Roles.DISTRICT_SUPERINTENDENT:
            query = query.filter(Officer.district_id == user.district_id)
        elif user.role in (Roles.STATION_HOUSE_OFFICER, Roles.INVESTIGATING_OFFICER):
            query = query.filter(Officer.station_id == user.station_id)

        if evidence_type:
            query = query.filter(Evidence.evidence_type == evidence_type)
        if collected_by:
            query = query.filter(Evidence.collected_by == collected_by)

        return query.all()

    def get_evidence_by_id(self, db: Session, user: CurrentUser, evidence_id: str) -> Evidence:
        evidence = db.query(Evidence).filter(Evidence.evidence_id == evidence_id).first()
        if not evidence:
            raise HTTPException(status_code=404, detail="Evidence item not found")

        # Verify access bounds using the collecting officer's location
        collector = evidence.collected_by_officer
        if collector:
            if user.role in (Roles.SYSTEM_ADMIN, Roles.STATE_ADMIN):
                pass
            elif user.role == Roles.DISTRICT_SUPERINTENDENT:
                if collector.district_id != user.district_id:
                    raise InsufficientPermissionError("Access denied to view this evidence details.")
            elif user.role in (Roles.STATION_HOUSE_OFFICER, Roles.INVESTIGATING_OFFICER):
                if collector.station_id != user.station_id:
                    raise InsufficientPermissionError("Access denied to view this evidence details.")

        return evidence


core_service = CoreService()
