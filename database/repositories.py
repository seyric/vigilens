"""Vigilens - Repository layer for database entities."""

from __future__ import annotations

from typing import Any, Iterable, TypeVar

from sqlalchemy import func
from sqlalchemy.orm import Session

from database.models import (
    ActivityLog,
    Crime,
    CrimeCategory,
    CrimeEvidence,
    CrimeOfficer,
    CrimeSuspect,
    District,
    Evidence,
    FIR,
    Officer,
    PoliceStation,
    Role,
    Suspect,
    SuspectAssociate,
    User,
    Vehicle,
    Victim,
    Weapon,
    Witness,
)

ModelT = TypeVar("ModelT")


class BaseRepository:
    """Small reusable wrapper around a SQLAlchemy session."""

    model: type[Any] | None = None

    def __init__(self, session: Session) -> None:
        self.session = session

    @staticmethod
    def _role_level(current_user: Any) -> int | None:
        role = getattr(current_user, "role", None)
        value = getattr(role, "value", role)
        if isinstance(value, int):
            return value
        role_name = str(getattr(role, "role_name", value)).lower().replace("_", " ")
        if "system" in role_name:
            return 1
        if "state" in role_name:
            return 2
        if "district" in role_name or "superintendent" in role_name:
            return 3
        if "station" in role_name or "house" in role_name:
            return 4
        if "investigat" in role_name:
            return 5
        return None

    def scoped_query(self, entity_type: type[ModelT], current_user: Any | None = None):
        """Return an entity query restricted to the user's geographic scope."""
        query = self.session.query(entity_type)
        if current_user is None or self._role_level(current_user) in (None, 1, 2):
            return query

        role_level = self._role_level(current_user)
        if role_level == 3:
            scope_value = getattr(current_user, "district_id", None)
            scope_column = getattr(entity_type, "district_id", None)
            if scope_value is None:
                return query.filter(False)
            if scope_column is not None:
                return query.filter(scope_column == scope_value)
            if entity_type is Crime:
                return query.join(Crime.fir).filter(FIR.district_id == scope_value)
            if entity_type is Evidence:
                return query.join(Evidence.collected_by_officer).filter(Officer.district_id == scope_value)
        if role_level in (4, 5):
            scope_value = getattr(current_user, "station_id", None)
            scope_column = getattr(entity_type, "station_id", None)
            if scope_value is None:
                return query.filter(False)
            if scope_column is not None:
                return query.filter(scope_column == scope_value)
            if entity_type is Crime:
                return query.join(Crime.fir).filter(FIR.station_id == scope_value)
            if entity_type is Evidence:
                return query.join(Evidence.collected_by_officer).filter(Officer.station_id == scope_value)
        return query.filter(False)

    def add(self, entity: ModelT) -> ModelT:
        self.session.add(entity)
        return entity

    def add_all(self, entities: Iterable[ModelT]) -> list[ModelT]:
        items = list(entities)
        self.session.add_all(items)
        return items

    def delete(self, entity: ModelT) -> None:
        self.session.delete(entity)

    def flush(self) -> None:
        self.session.flush()

    def refresh(self, entity: ModelT) -> ModelT:
        self.session.refresh(entity)
        return entity

    def get(self, entity_type: type[ModelT], entity_id: str) -> ModelT | None:
        return self.session.get(entity_type, entity_id)

    def list_all(self, entity_type: type[ModelT]) -> list[ModelT]:
        return list(self.session.query(entity_type).all())

    def count(self, entity_type: type[ModelT]) -> int:
        return int(self.session.query(func.count()).select_from(entity_type).scalar() or 0)

    def exists(self, entity_type: type[ModelT], **filters: Any) -> bool:
        query = self.session.query(entity_type)
        for field, value in filters.items():
            query = query.filter(getattr(entity_type, field) == value)
        return bool(self.session.query(query.exists()).scalar())

    def get_by_filters(self, entity_type: type[ModelT], **filters: Any) -> list[ModelT]:
        query = self.session.query(entity_type)
        for field, value in filters.items():
            query = query.filter(getattr(entity_type, field) == value)
        return list(query.all())


class DistrictRepository(BaseRepository):
    def get_by_name(self, name: str) -> District | None:
        return self.session.query(District).filter(District.district_name == name).one_or_none()

    def get_by_code(self, code: str) -> District | None:
        return self.session.query(District).filter(District.district_code == code).one_or_none()


class PoliceStationRepository(BaseRepository):
    def get_by_code(self, code: str) -> PoliceStation | None:
        return self.session.query(PoliceStation).filter(PoliceStation.station_code == code).one_or_none()


class RoleRepository(BaseRepository):
    def get_by_name(self, name: str) -> Role | None:
        return self.session.query(Role).filter(Role.role_name == name).one_or_none()


class UserRepository(BaseRepository):
    def get_by_username(self, username: str) -> User | None:
        return self.session.query(User).filter(User.username == username).one_or_none()

    def get(self, entity_type: type[User], entity_id: str) -> User | None:
        return super().get(entity_type, entity_id)


class OfficerRepository(BaseRepository):
    def get_by_badge_number(self, badge_number: str, current_user: Any | None = None) -> Officer | None:
        return self.scoped_query(Officer, current_user).filter(Officer.badge_number == badge_number).one_or_none()

    def list_by_district(self, district_id: str, current_user: Any | None = None) -> list[Officer]:
        return list(self.scoped_query(Officer, current_user).filter(Officer.district_id == district_id).all())


class FIRRepository(BaseRepository):
    def get_by_number(self, fir_number: str, current_user: Any | None = None) -> FIR | None:
        return self.scoped_query(FIR, current_user).filter(FIR.fir_number == fir_number).one_or_none()

    def list_by_district(self, district_id: str, current_user: Any | None = None) -> list[FIR]:
        return list(self.scoped_query(FIR, current_user).filter(FIR.district_id == district_id).all())


class CrimeCategoryRepository(BaseRepository):
    def get_by_name(self, name: str) -> CrimeCategory | None:
        return self.session.query(CrimeCategory).filter(CrimeCategory.category_name == name).one_or_none()


class CrimeRepository(BaseRepository):
    def get_by_fir(self, fir_id: str, current_user: Any | None = None) -> list[Crime]:
        return list(self.scoped_query(Crime, current_user).filter(Crime.fir_id == fir_id).all())

    def get_by_category(self, category_id: str, current_user: Any | None = None) -> list[Crime]:
        return list(self.scoped_query(Crime, current_user).filter(Crime.category_id == category_id).all())

    def get_recent(self, limit: int = 50, current_user: Any | None = None) -> list[Crime]:
        return list(
            self.scoped_query(Crime, current_user)
            .order_by(Crime.reported_at.desc().nullslast(), Crime.crime_id.desc())
            .limit(limit)
            .all()
        )


class SuspectRepository(BaseRepository):
    def get_by_name(self, name: str) -> list[Suspect]:
        return list(self.session.query(Suspect).filter(Suspect.full_name == name).all())


class VictimRepository(BaseRepository):
    def get_by_name(self, name: str) -> list[Victim]:
        return list(self.session.query(Victim).filter(Victim.full_name == name).all())


class WitnessRepository(BaseRepository):
    def get_by_name(self, name: str) -> list[Witness]:
        return list(self.session.query(Witness).filter(Witness.full_name == name).all())


class VehicleRepository(BaseRepository):
    def get_by_registration(self, registration_number: str) -> Vehicle | None:
        return self.session.query(Vehicle).filter(Vehicle.registration_number == registration_number).one_or_none()


class WeaponRepository(BaseRepository):
    def get_by_type(self, weapon_type: str) -> list[Weapon]:
        return list(self.session.query(Weapon).filter(Weapon.weapon_type == weapon_type).all())


class EvidenceRepository(BaseRepository):
    def get_by_type(self, evidence_type: str, current_user: Any | None = None) -> list[Evidence]:
        return list(self.scoped_query(Evidence, current_user).filter(Evidence.evidence_type == evidence_type).all())

    def get_by_collector(self, officer_id: str, current_user: Any | None = None) -> list[Evidence]:
        return list(self.scoped_query(Evidence, current_user).filter(Evidence.collected_by == officer_id).all())


class ActivityLogRepository(BaseRepository):
    def list_by_user(self, user_id: str) -> list[ActivityLog]:
        return list(self.session.query(ActivityLog).filter(ActivityLog.user_id == user_id).all())


class SuspectAssociateRepository(BaseRepository):
    def get_associates_for_suspect(self, suspect_id: str) -> list[SuspectAssociate]:
        return list(self.session.query(SuspectAssociate).filter(SuspectAssociate.suspect_id == suspect_id).all())


class CrimeRelationshipRepository(BaseRepository):
    def list_crime_suspects(self, crime_id: str) -> list[CrimeSuspect]:
        return list(self.session.query(CrimeSuspect).filter(CrimeSuspect.crime_id == crime_id).all())

    def list_crime_officers(self, crime_id: str) -> list[CrimeOfficer]:
        return list(self.session.query(CrimeOfficer).filter(CrimeOfficer.crime_id == crime_id).all())

    def list_crime_evidence(self, crime_id: str) -> list[CrimeEvidence]:
        return list(self.session.query(CrimeEvidence).filter(CrimeEvidence.crime_id == crime_id).all())


class AnalyticsRepository(BaseRepository):
    """Reusable data-access helpers for analytics consumers."""

    def __init__(self, session: Session, current_user: Any | None = None) -> None:
        super().__init__(session)
        self.current_user = current_user

    def _case_scope(self, query):
        level = self._role_level(self.current_user) if self.current_user is not None else None
        if level not in (3, 4, 5):
            return query
        field = FIR.district_id if level == 3 else FIR.station_id
        value = getattr(self.current_user, "district_id" if level == 3 else "station_id", None)
        return query.filter(field == value) if value is not None else query.filter(False)

    def crimes_by_district(self) -> list[tuple[str, int]]:
        query = (
            self.session.query(District.district_name, func.count(Crime.crime_id))
            .join(FIR, FIR.district_id == District.district_id)
            .join(Crime, Crime.fir_id == FIR.fir_id)
            .group_by(District.district_name)
            .order_by(func.count(Crime.crime_id).desc())
        )
        rows = self._case_scope(query).all()
        return [(row[0], int(row[1])) for row in rows]

    def crimes_by_category(self) -> list[tuple[str, int]]:
        query = (
            self.session.query(CrimeCategory.category_name, func.count(Crime.crime_id))
            .join(Crime, Crime.category_id == CrimeCategory.category_id)
            .join(FIR, FIR.fir_id == Crime.fir_id)
            .group_by(CrimeCategory.category_name)
            .order_by(func.count(Crime.crime_id).desc())
        )
        rows = self._case_scope(query).all()
        return [(row[0], int(row[1])) for row in rows]

    def monthly_crime_counts(self) -> list[dict[str, Any]]:
        dialect = self.session.bind.dialect.name if self.session.bind is not None else "sqlite"
        month_expr = func.date_trunc("month", Crime.reported_at) if dialect == "postgresql" else func.strftime("%Y-%m-01", Crime.reported_at)
        query = (
            self.session.query(month_expr.label("month"), func.count(Crime.crime_id))
            .join(FIR, FIR.fir_id == Crime.fir_id)
            .group_by(month_expr)
            .order_by(month_expr)
        )
        rows = self._case_scope(query).all()
        return [{"month": row[0].isoformat() if hasattr(row[0], "isoformat") else row[0], "crime_count": int(row[1])} for row in rows]
