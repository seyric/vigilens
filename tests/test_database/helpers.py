from __future__ import annotations

from datetime import datetime

from database.models import (
    Crime,
    CrimeCategory,
    CrimeEvidence,
    CrimeOfficer,
    CrimeSuspect,
    CrimeVehicle,
    CrimeVictim,
    CrimeWeapon,
    District,
    Evidence,
    FIR,
    Officer,
    PoliceStation,
    Role,
    Suspect,
    SuspectAssociate,
    Vehicle,
    Victim,
    Weapon,
)


def seed_minimum_crime_graph(session) -> dict[str, object]:
    district = District(district_name="Central", district_code="CTR", region="Metro", headquarters="HQ")
    role = Role(role_name="Inspector", description="Investigative role", permissions={"firs": "rw"})
    station = PoliceStation(station_name="Central Station", station_code="CTR-001", station_type="HQ", district=district)
    officer = Officer(
        full_name="Asha Kumar",
        badge_number="B-100",
        rank="Inspector",
        designation="SHO",
        station=station,
        district=district,
    )
    category = CrimeCategory(category_name="Theft", severity="Medium", description="Property crime")
    fir = FIR(
        fir_number="FIR-2024-001",
        fir_date=datetime(2024, 4, 10, 9, 0, 0),
        station=station,
        district=district,
        complainant_name="Ravi",
        complaint_details="Reported theft from market road",
        investigating_officer=officer,
        status="Registered",
        severity="Medium",
    )
    crime = Crime(
        fir=fir,
        category=category,
        crime_description="Wallet theft",
        modus_operandi="Pickpocketing",
        reported_at=datetime(2024, 4, 10, 10, 0, 0),
        severity="Medium",
    )

    session.add_all([district, role, station, officer, category, fir, crime])
    session.commit()
    return {
        "district": district,
        "role": role,
        "station": station,
        "officer": officer,
        "category": category,
        "fir": fir,
        "crime": crime,
    }


def seed_sprint5_delivery_graph(session) -> dict[str, object]:
    central = District(
        district_name="Central",
        district_code="CTR",
        region="Metro",
        headquarters="HQ",
        boundary_geojson='{"type":"Feature","properties":{"name":"Central"}}',
    )
    south = District(
        district_name="South",
        district_code="STH",
        region="Metro",
        headquarters="South HQ",
        boundary_geojson='{"type":"Feature","properties":{"name":"South"}}',
    )
    role = Role(role_name="Inspector", description="Investigative role", permissions={"firs": "rw"})
    central_station = PoliceStation(
        station_name="Central Station",
        station_code="CTR-001",
        station_type="HQ",
        district=central,
        latitude="12.9716",
        longitude="77.5946",
    )
    south_station = PoliceStation(
        station_name="South Station",
        station_code="STH-001",
        station_type="PS",
        district=south,
        latitude="12.9000",
        longitude="77.6000",
    )
    officer_a = Officer(
        full_name="Asha Kumar",
        badge_number="B-100",
        rank="Inspector",
        designation="SHO",
        station=central_station,
        district=central,
    )
    officer_b = Officer(
        full_name="Meera Patil",
        badge_number="B-200",
        rank="Sub Inspector",
        designation="IO",
        station=south_station,
        district=south,
    )
    theft = CrimeCategory(category_name="Theft", severity="Medium", description="Property crime")
    assault = CrimeCategory(category_name="Assault", severity="High", description="Violent crime")
    fir_one = FIR(
        fir_number="FIR-2024-001",
        fir_date=datetime(2024, 4, 10, 9, 0, 0),
        station=central_station,
        district=central,
        complainant_name="Ravi",
        complaint_details="Reported theft from market road",
        investigating_officer=officer_a,
        status="Registered",
        severity="Medium",
    )
    fir_two = FIR(
        fir_number="FIR-2025-014",
        fir_date=datetime(2025, 5, 12, 15, 30, 0),
        station=south_station,
        district=south,
        complainant_name="Sita",
        complaint_details="Assault near bus stop with weapon",
        investigating_officer=officer_b,
        status="Closed",
        severity="High",
    )
    crime_one = Crime(
        fir=fir_one,
        category=theft,
        crime_description="Wallet theft",
        modus_operandi="Pickpocketing",
        reported_at=datetime(2024, 4, 10, 10, 0, 0),
        severity="Medium",
    )
    crime_two = Crime(
        fir=fir_two,
        category=assault,
        crime_description="Street assault",
        modus_operandi="Blunt force",
        reported_at=datetime(2025, 5, 12, 16, 0, 0),
        severity="High",
    )
    suspect_one = Suspect(
        full_name="Imran Khan",
        district=central,
        gender="Male",
        status="Arrested",
        last_known_address="Central Market",
    )
    suspect_two = Suspect(
        full_name="Rohit Shetty",
        district=south,
        gender="Male",
        status="At Large",
        last_known_address="South Circle",
    )
    victim_one = Victim(
        full_name="Lakshmi",
        district=south,
        gender="Female",
        injured=True,
        hospitalized=False,
        deceased=False,
    )
    vehicle_one = Vehicle(
        registration_number="KA01AB1234",
        vehicle_type="Scooter",
        manufacturer="Honda",
        model="Activa",
        color="Black",
    )
    weapon_one = Weapon(weapon_type="Knife", weapon_subtype="Kitchen Knife", licensed=False, details="Recovered blade")
    evidence_one = Evidence(
        evidence_type="Documentary",
        evidence_subtype="CCTV Clip",
        description="Video from bus stop",
        collected_by=officer_b.officer_id,
        storage_location="Evidence Locker 2",
        chain_of_custody={"status": "sealed"},
    )

    session.add_all(
        [
            central,
            south,
            role,
            central_station,
            south_station,
            officer_a,
            officer_b,
            theft,
            assault,
            fir_one,
            fir_two,
            crime_one,
            crime_two,
            suspect_one,
            suspect_two,
            victim_one,
            vehicle_one,
            weapon_one,
            evidence_one,
        ]
    )
    session.flush()
    session.add_all(
        [
            CrimeSuspect(crime=crime_one, suspect=suspect_one, role="Primary", status="Arrested"),
            CrimeSuspect(crime=crime_two, suspect=suspect_two, role="Primary", status="Wanted"),
            CrimeVictim(crime=crime_two, victim=victim_one, relationship_to_suspect="Unknown"),
            CrimeVehicle(crime=crime_two, vehicle=vehicle_one, involvement_type="Escape"),
            CrimeWeapon(crime=crime_two, weapon=weapon_one),
            CrimeEvidence(crime=crime_two, evidence=evidence_one),
            CrimeOfficer(crime=crime_one, officer=officer_a, role="Investigating Officer"),
            CrimeOfficer(crime=crime_two, officer=officer_b, role="Investigating Officer"),
            SuspectAssociate(suspect=suspect_one, associate=suspect_two, relationship_type="Accomplice", notes="Observed together"),
        ]
    )
    session.commit()
    return {
        "districts": [central, south],
        "stations": [central_station, south_station],
        "officers": [officer_a, officer_b],
        "categories": [theft, assault],
        "firs": [fir_one, fir_two],
        "crimes": [crime_one, crime_two],
    }
