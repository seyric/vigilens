"""Vigilens — SQLAlchemy ORM models for the data platform."""

from __future__ import annotations

import uuid
from datetime import datetime
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import relationship

from database.connection import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class District(Base):
    __tablename__ = "districts"

    district_id = Column(String(36), primary_key=True, default=generate_uuid)
    district_name = Column(String(100), nullable=False, unique=True)
    district_code = Column(String(10), nullable=True, unique=True)
    region = Column(String(100), nullable=True)
    headquarters = Column(String(100), nullable=True)
    boundary_geojson = Column(Text, nullable=True)

    police_stations = relationship("PoliceStation", back_populates="district", cascade="all, delete-orphan")
    officers = relationship("Officer", back_populates="district")
    firs = relationship("FIR", back_populates="district")
    suspects = relationship("Suspect", back_populates="district")
    victims = relationship("Victim", back_populates="district")
    witnesses = relationship("Witness", back_populates="district")
    users = relationship("User", back_populates="district")


class PoliceStation(Base):
    __tablename__ = "police_stations"

    station_id = Column(String(36), primary_key=True, default=generate_uuid)
    station_name = Column(String(150), nullable=False)
    station_code = Column(String(50), nullable=True, unique=True)
    station_type = Column(String(30), nullable=False)
    district_id = Column(String(36), ForeignKey("districts.district_id"), nullable=False)
    address = Column(Text, nullable=True)
    latitude = Column(String(32), nullable=True)
    longitude = Column(String(32), nullable=True)

    district = relationship("District", back_populates="police_stations")
    officers = relationship("Officer", back_populates="station")
    firs = relationship("FIR", back_populates="station")


class Role(Base):
    __tablename__ = "roles"

    role_id = Column(String(36), primary_key=True, default=generate_uuid)
    role_name = Column(String(50), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    permissions = Column(JSON, nullable=False, default={})
    is_system_role = Column(Boolean, nullable=False, default=False)

    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "users"

    user_id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), nullable=False, unique=True)
    email = Column(String(150), nullable=True)
    password_hash = Column(String(255), nullable=True)
    role_id = Column(String(36), ForeignKey("roles.role_id"), nullable=False)
    officer_id = Column(String(36), ForeignKey("officers.officer_id"), nullable=True)
    district_id = Column(String(36), ForeignKey("districts.district_id"), nullable=True)
    station_id = Column(String(36), ForeignKey("police_stations.station_id"), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    role = relationship("Role", back_populates="users")
    officer = relationship("Officer", back_populates="user")
    district = relationship("District", back_populates="users")
    activity_logs = relationship("ActivityLog", back_populates="user")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    activity_log_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(36), nullable=True)
    action = Column(String(20), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    details = Column(JSON, nullable=True)
    user_agent = Column(Text, nullable=True)

    user = relationship("User", back_populates="activity_logs")


class Officer(Base):
    __tablename__ = "officers"

    officer_id = Column(String(36), primary_key=True, default=generate_uuid)
    full_name = Column(String(150), nullable=False)
    badge_number = Column(String(50), nullable=True, unique=True)
    rank = Column(String(50), nullable=False)
    designation = Column(String(100), nullable=True)
    station_id = Column(String(36), ForeignKey("police_stations.station_id"), nullable=True)
    district_id = Column(String(36), ForeignKey("districts.district_id"), nullable=True)
    status = Column(String(50), nullable=True)
    specializations = Column(JSON, nullable=True)
    joined_at = Column(DateTime(timezone=True), nullable=True)

    station = relationship("PoliceStation", back_populates="officers")
    district = relationship("District", back_populates="officers")
    user = relationship("User", back_populates="officer", uselist=False)
    firs_investigated = relationship("FIR", back_populates="investigating_officer")
    evidence_collected = relationship("Evidence", back_populates="collected_by_officer")
    crime_assignments = relationship("CrimeOfficer", back_populates="officer")


class FIR(Base):
    __tablename__ = "firs"

    fir_id = Column(String(36), primary_key=True, default=generate_uuid)
    fir_number = Column(String(30), nullable=False, unique=True)
    fir_date = Column(DateTime(timezone=True), nullable=False)
    station_id = Column(String(36), ForeignKey("police_stations.station_id"), nullable=False)
    district_id = Column(String(36), ForeignKey("districts.district_id"), nullable=False)
    complainant_name = Column(String(150), nullable=False)
    complaint_details = Column(Text, nullable=True)
    investigating_officer_id = Column(String(36), ForeignKey("officers.officer_id"), nullable=True)
    status = Column(String(50), nullable=True)
    severity = Column(String(50), nullable=True)

    station = relationship("PoliceStation", back_populates="firs")
    district = relationship("District", back_populates="firs")
    investigating_officer = relationship("Officer", back_populates="firs_investigated")
    crimes = relationship("Crime", back_populates="fir")


class CrimeCategory(Base):
    __tablename__ = "crime_categories"

    category_id = Column(String(36), primary_key=True, default=generate_uuid)
    category_name = Column(String(150), nullable=False, unique=True)
    parent_category_id = Column(String(36), ForeignKey("crime_categories.category_id"), nullable=True)
    severity = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)

    parent_category = relationship("CrimeCategory", remote_side=[category_id], backref="subcategories")
    crimes = relationship("Crime", back_populates="category")


class Crime(Base):
    __tablename__ = "crimes"

    crime_id = Column(String(36), primary_key=True, default=generate_uuid)
    fir_id = Column(String(36), ForeignKey("firs.fir_id"), nullable=False)
    category_id = Column(String(36), ForeignKey("crime_categories.category_id"), nullable=False)
    crime_description = Column(Text, nullable=True)
    modus_operandi = Column(Text, nullable=True)
    reported_at = Column(DateTime(timezone=True), nullable=True)
    severity = Column(String(50), nullable=True)

    fir = relationship("FIR", back_populates="crimes")
    category = relationship("CrimeCategory", back_populates="crimes")
    suspects = relationship("CrimeSuspect", back_populates="crime")
    victims = relationship("CrimeVictim", back_populates="crime")
    witnesses = relationship("CrimeWitness", back_populates="crime")
    vehicles = relationship("CrimeVehicle", back_populates="crime")
    weapons = relationship("CrimeWeapon", back_populates="crime")
    evidence_items = relationship("CrimeEvidence", back_populates="crime")
    crime_officers = relationship("CrimeOfficer", back_populates="crime")


class Suspect(Base):
    __tablename__ = "suspects"

    suspect_id = Column(String(36), primary_key=True, default=generate_uuid)
    full_name = Column(String(150), nullable=False)
    date_of_birth = Column(DateTime(timezone=True), nullable=True)
    district_id = Column(String(36), ForeignKey("districts.district_id"), nullable=True)
    gender = Column(String(20), nullable=True)
    status = Column(String(50), nullable=True)
    last_known_address = Column(Text, nullable=True)

    district = relationship("District", back_populates="suspects")
    crime_associations = relationship("CrimeSuspect", back_populates="suspect")
    associates = relationship(
        "SuspectAssociate",
        foreign_keys="SuspectAssociate.suspect_id",
        back_populates="suspect",
    )
    associated_by = relationship(
        "SuspectAssociate",
        foreign_keys="SuspectAssociate.associate_id",
        back_populates="associate",
    )


class Victim(Base):
    __tablename__ = "victims"

    victim_id = Column(String(36), primary_key=True, default=generate_uuid)
    full_name = Column(String(150), nullable=False)
    date_of_birth = Column(DateTime(timezone=True), nullable=True)
    district_id = Column(String(36), ForeignKey("districts.district_id"), nullable=True)
    gender = Column(String(20), nullable=True)
    injured = Column(Boolean, nullable=False, default=False)
    hospitalized = Column(Boolean, nullable=False, default=False)
    deceased = Column(Boolean, nullable=False, default=False)

    district = relationship("District", back_populates="victims")
    crime_associations = relationship("CrimeVictim", back_populates="victim")


class Witness(Base):
    __tablename__ = "witnesses"

    witness_id = Column(String(36), primary_key=True, default=generate_uuid)
    full_name = Column(String(150), nullable=False)
    date_of_birth = Column(DateTime(timezone=True), nullable=True)
    district_id = Column(String(36), ForeignKey("districts.district_id"), nullable=True)
    witness_type = Column(String(50), nullable=True)
    protection_required = Column(Boolean, nullable=False, default=False)

    district = relationship("District", back_populates="witnesses")
    crime_associations = relationship("CrimeWitness", back_populates="witness")


class Vehicle(Base):
    __tablename__ = "vehicles"

    vehicle_id = Column(String(36), primary_key=True, default=generate_uuid)
    registration_number = Column(String(30), nullable=True, unique=True)
    vehicle_type = Column(String(30), nullable=False)
    manufacturer = Column(String(100), nullable=True)
    model = Column(String(100), nullable=True)
    color = Column(String(30), nullable=True)

    crime_associations = relationship("CrimeVehicle", back_populates="vehicle")


class Weapon(Base):
    __tablename__ = "weapons"

    weapon_id = Column(String(36), primary_key=True, default=generate_uuid)
    weapon_type = Column(String(30), nullable=False)
    weapon_subtype = Column(String(50), nullable=True)
    licensed = Column(Boolean, nullable=True)
    details = Column(Text, nullable=True)

    crime_associations = relationship("CrimeWeapon", back_populates="weapon")


class Evidence(Base):
    __tablename__ = "evidence"

    evidence_id = Column(String(36), primary_key=True, default=generate_uuid)
    evidence_type = Column(String(30), nullable=False)
    evidence_subtype = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    collected_by = Column(String(36), ForeignKey("officers.officer_id"), nullable=True)
    storage_location = Column(String(200), nullable=True)
    chain_of_custody = Column(JSON, nullable=True)

    collected_by_officer = relationship("Officer", back_populates="evidence_collected")
    crime_associations = relationship("CrimeEvidence", back_populates="evidence")


class CrimeSuspect(Base):
    __tablename__ = "crime_suspects"

    crime_suspect_id = Column(String(36), primary_key=True, default=generate_uuid)
    crime_id = Column(String(36), ForeignKey("crimes.crime_id"), nullable=False)
    suspect_id = Column(String(36), ForeignKey("suspects.suspect_id"), nullable=False)
    role = Column(String(30), nullable=True)
    status = Column(String(20), nullable=True)

    crime = relationship("Crime", back_populates="suspects")
    suspect = relationship("Suspect", back_populates="crime_associations")

    __table_args__ = (UniqueConstraint("crime_id", "suspect_id", name="uq_crime_suspect"),)


class CrimeVictim(Base):
    __tablename__ = "crime_victims"

    crime_victim_id = Column(String(36), primary_key=True, default=generate_uuid)
    crime_id = Column(String(36), ForeignKey("crimes.crime_id"), nullable=False)
    victim_id = Column(String(36), ForeignKey("victims.victim_id"), nullable=False)
    relationship_to_suspect = Column(String(50), nullable=True)

    crime = relationship("Crime", back_populates="victims")
    victim = relationship("Victim", back_populates="crime_associations")

    __table_args__ = (UniqueConstraint("crime_id", "victim_id", name="uq_crime_victim"),)


class CrimeWitness(Base):
    __tablename__ = "crime_witnesses"

    crime_witness_id = Column(String(36), primary_key=True, default=generate_uuid)
    crime_id = Column(String(36), ForeignKey("crimes.crime_id"), nullable=False)
    witness_id = Column(String(36), ForeignKey("witnesses.witness_id"), nullable=False)

    crime = relationship("Crime", back_populates="witnesses")
    witness = relationship("Witness", back_populates="crime_associations")

    __table_args__ = (UniqueConstraint("crime_id", "witness_id", name="uq_crime_witness"),)


class CrimeVehicle(Base):
    __tablename__ = "crime_vehicles"

    crime_vehicle_id = Column(String(36), primary_key=True, default=generate_uuid)
    crime_id = Column(String(36), ForeignKey("crimes.crime_id"), nullable=False)
    vehicle_id = Column(String(36), ForeignKey("vehicles.vehicle_id"), nullable=False)
    involvement_type = Column(String(30), nullable=True)

    crime = relationship("Crime", back_populates="vehicles")
    vehicle = relationship("Vehicle", back_populates="crime_associations")

    __table_args__ = (UniqueConstraint("crime_id", "vehicle_id", name="uq_crime_vehicle"),)


class CrimeWeapon(Base):
    __tablename__ = "crime_weapons"

    crime_weapon_id = Column(String(36), primary_key=True, default=generate_uuid)
    crime_id = Column(String(36), ForeignKey("crimes.crime_id"), nullable=False)
    weapon_id = Column(String(36), ForeignKey("weapons.weapon_id"), nullable=False)

    crime = relationship("Crime", back_populates="weapons")
    weapon = relationship("Weapon", back_populates="crime_associations")

    __table_args__ = (UniqueConstraint("crime_id", "weapon_id", name="uq_crime_weapon"),)


class CrimeEvidence(Base):
    __tablename__ = "crime_evidence"

    crime_evidence_id = Column(String(36), primary_key=True, default=generate_uuid)
    crime_id = Column(String(36), ForeignKey("crimes.crime_id"), nullable=False)
    evidence_id = Column(String(36), ForeignKey("evidence.evidence_id"), nullable=False)

    crime = relationship("Crime", back_populates="evidence_items")
    evidence = relationship("Evidence", back_populates="crime_associations")

    __table_args__ = (UniqueConstraint("crime_id", "evidence_id", name="uq_crime_evidence"),)


class CrimeOfficer(Base):
    __tablename__ = "crime_officers"

    crime_officer_id = Column(String(36), primary_key=True, default=generate_uuid)
    crime_id = Column(String(36), ForeignKey("crimes.crime_id"), nullable=False)
    officer_id = Column(String(36), ForeignKey("officers.officer_id"), nullable=False)
    role = Column(String(30), nullable=True)

    crime = relationship("Crime", back_populates="crime_officers")
    officer = relationship("Officer", back_populates="crime_assignments")

    __table_args__ = (UniqueConstraint("crime_id", "officer_id", name="uq_crime_officer"),)


class SuspectAssociate(Base):
    __tablename__ = "suspect_associates"

    suspect_associate_id = Column(String(36), primary_key=True, default=generate_uuid)
    suspect_id = Column(String(36), ForeignKey("suspects.suspect_id"), nullable=False)
    associate_id = Column(String(36), ForeignKey("suspects.suspect_id"), nullable=False)
    relationship_type = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)

    suspect = relationship("Suspect", foreign_keys=[suspect_id], back_populates="associates")
    associate = relationship("Suspect", foreign_keys=[associate_id], back_populates="associated_by")

    __table_args__ = (
        UniqueConstraint("suspect_id", "associate_id", name="uq_suspect_associate"),
    )
