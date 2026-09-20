-- ============================================================
-- Vigilens AI — Migration 001: Create Tables
-- ============================================================

-- ── Extensions ──
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ── Reference Tables ──

CREATE TABLE districts (
    district_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_name VARCHAR(100) NOT NULL UNIQUE,
    district_code VARCHAR(10) UNIQUE,
    division VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'Karnataka',
    headquarters VARCHAR(100),
    population INTEGER CHECK (population > 0),
    area_sq_km DECIMAL(10,2) CHECK (area_sq_km > 0),
    literacy_rate DECIMAL(5,2) CHECK (literacy_rate >= 0 AND literacy_rate <= 100),
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    boundary_geojson GEOMETRY(MultiPolygon, 4326),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}',
    is_system_role BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE crime_categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) NOT NULL UNIQUE,
    category_code VARCHAR(20) NOT NULL UNIQUE,
    parent_category_id UUID REFERENCES crime_categories(category_id),
    ipc_section VARCHAR(20),
    bns_section VARCHAR(20),
    act_name VARCHAR(100) NOT NULL DEFAULT 'IPC',
    severity_default VARCHAR(10) NOT NULL,
    is_cognizable BOOLEAN NOT NULL DEFAULT TRUE,
    is_bailable BOOLEAN,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Primary Tables ──

CREATE TABLE police_stations (
    station_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_name VARCHAR(150) NOT NULL,
    station_code VARCHAR(20) UNIQUE,
    station_type VARCHAR(30) NOT NULL,
    district_id UUID NOT NULL REFERENCES districts(district_id),
    subdivision VARCHAR(100),
    circle VARCHAR(100),
    address TEXT,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    jurisdiction_area_sq_km DECIMAL(10,2) CHECK (jurisdiction_area_sq_km > 0),
    jurisdiction_geojson GEOMETRY(MultiPolygon, 4326),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE officers (
    officer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    badge_number VARCHAR(30) NOT NULL UNIQUE,
    rank VARCHAR(50) NOT NULL,
    designation VARCHAR(100),
    station_id UUID REFERENCES police_stations(station_id),
    district_id UUID REFERENCES districts(district_id),
    phone VARCHAR(20),
    email VARCHAR(100),
    date_of_joining DATE,
    specialization TEXT[],
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE firs (
    fir_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_number VARCHAR(30) NOT NULL,
    fir_date TIMESTAMPTZ NOT NULL,
    police_station_id UUID NOT NULL REFERENCES police_stations(station_id),
    district_id UUID NOT NULL REFERENCES districts(district_id),
    complainant_name VARCHAR(150) NOT NULL,
    complainant_contact VARCHAR(20),
    complainant_address TEXT,
    incident_date DATE NOT NULL,
    incident_time TIME,
    incident_location TEXT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Registered',
    investigating_officer_id UUID REFERENCES officers(officer_id),
    priority VARCHAR(10) NOT NULL DEFAULT 'Medium',
    closure_date DATE,
    closure_reason TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (fir_date);

CREATE TABLE firs_2022 PARTITION OF firs FOR VALUES FROM ('2022-01-01') TO ('2023-01-01');
CREATE TABLE firs_2023 PARTITION OF firs FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
CREATE TABLE firs_2024 PARTITION OF firs FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE crimes (
    crime_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_id UUID NOT NULL REFERENCES firs(fir_id),
    category_id UUID NOT NULL REFERENCES crime_categories(category_id),
    crime_description TEXT,
    severity VARCHAR(10) NOT NULL,
    modus_operandi TEXT,
    attempted BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE suspects (
    suspect_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    alias TEXT[],
    date_of_birth DATE,
    age INTEGER CHECK (age >= 0 AND age <= 120),
    gender VARCHAR(10) NOT NULL,
    father_name VARCHAR(150),
    address TEXT,
    district_id UUID REFERENCES districts(district_id),
    phone VARCHAR(20),
    id_type VARCHAR(30),
    id_number VARCHAR(50),
    nationality VARCHAR(50) NOT NULL DEFAULT 'Indian',
    occupation VARCHAR(100),
    physical_description TEXT,
    known_offender BOOLEAN NOT NULL DEFAULT FALSE,
    criminal_history TEXT,
    risk_score DECIMAL(5,2) CHECK (risk_score >= 0 AND risk_score <= 100),
    photo_url VARCHAR(500),
    fingerprint_id VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE victims (
    victim_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE,
    age INTEGER CHECK (age >= 0 AND age <= 120),
    gender VARCHAR(10) NOT NULL,
    father_name VARCHAR(150),
    address TEXT,
    district_id UUID REFERENCES districts(district_id),
    phone VARCHAR(20),
    occupation VARCHAR(100),
    injury_type VARCHAR(50),
    injury_severity VARCHAR(20),
    hospitalized BOOLEAN NOT NULL DEFAULT FALSE,
    deceased BOOLEAN NOT NULL DEFAULT FALSE,
    statement_recorded BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE witnesses (
    witness_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE,
    age INTEGER CHECK (age >= 0 AND age <= 120),
    gender VARCHAR(10) NOT NULL,
    address TEXT,
    district_id UUID REFERENCES districts(district_id),
    phone VARCHAR(20),
    occupation VARCHAR(100),
    witness_type VARCHAR(30) NOT NULL,
    statement_recorded BOOLEAN NOT NULL DEFAULT FALSE,
    statement_date DATE,
    reliability_score DECIMAL(3,2) CHECK (reliability_score >= 0 AND reliability_score <= 1),
    protection_required BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'Available',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vehicles (
    vehicle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_number VARCHAR(20) UNIQUE,
    vehicle_type VARCHAR(30) NOT NULL,
    make VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(30),
    year_of_manufacture INTEGER,
    owner_name VARCHAR(150),
    owner_address TEXT,
    chassis_number VARCHAR(30) UNIQUE,
    engine_number VARCHAR(30) UNIQUE,
    insurance_status VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE weapons (
    weapon_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    weapon_type VARCHAR(30) NOT NULL,
    weapon_subtype VARCHAR(50),
    description TEXT,
    make VARCHAR(50),
    serial_number VARCHAR(50),
    license_number VARCHAR(50),
    licensed BOOLEAN,
    owner_name VARCHAR(150),
    recovery_status VARCHAR(20) NOT NULL DEFAULT 'Not Recovered',
    recovery_date DATE,
    recovery_location TEXT,
    forensic_status VARCHAR(20),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE evidence (
    evidence_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_type VARCHAR(30) NOT NULL,
    evidence_subtype VARCHAR(50),
    description TEXT NOT NULL,
    collection_date TIMESTAMPTZ NOT NULL,
    collection_location TEXT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    collected_by UUID REFERENCES officers(officer_id),
    storage_location VARCHAR(200),
    chain_of_custody JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'Collected',
    forensic_report_url VARCHAR(500),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(role_id),
    officer_id UUID REFERENCES officers(officer_id),
    police_station_id UUID REFERENCES police_stations(station_id),
    district_id UUID REFERENCES districts(district_id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE activity_logs (
    log_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    action VARCHAR(30) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (log_id, timestamp)
) PARTITION BY RANGE (timestamp);

CREATE TABLE activity_logs_2024_01 PARTITION OF activity_logs FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE activity_logs_2024_02 PARTITION OF activity_logs FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
CREATE TABLE activity_logs_2024_03 PARTITION OF activity_logs FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

-- ── Junction Tables ──

CREATE TABLE crime_suspects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crime_id UUID NOT NULL REFERENCES crimes(crime_id),
    suspect_id UUID NOT NULL REFERENCES suspects(suspect_id),
    role VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Suspected',
    arrest_date DATE,
    bail_status VARCHAR(20),
    UNIQUE(crime_id, suspect_id)
);

CREATE TABLE crime_victims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crime_id UUID NOT NULL REFERENCES crimes(crime_id),
    victim_id UUID NOT NULL REFERENCES victims(victim_id),
    relationship_to_suspect VARCHAR(50),
    UNIQUE(crime_id, victim_id)
);

CREATE TABLE crime_witnesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crime_id UUID NOT NULL REFERENCES crimes(crime_id),
    witness_id UUID NOT NULL REFERENCES witnesses(witness_id),
    testimony_status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    UNIQUE(crime_id, witness_id)
);

CREATE TABLE crime_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crime_id UUID NOT NULL REFERENCES crimes(crime_id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id),
    involvement_type VARCHAR(30) NOT NULL,
    UNIQUE(crime_id, vehicle_id)
);

CREATE TABLE crime_weapons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crime_id UUID NOT NULL REFERENCES crimes(crime_id),
    weapon_id UUID NOT NULL REFERENCES weapons(weapon_id),
    usage_type VARCHAR(30),
    UNIQUE(crime_id, weapon_id)
);

CREATE TABLE crime_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crime_id UUID NOT NULL REFERENCES crimes(crime_id),
    evidence_id UUID NOT NULL REFERENCES evidence(evidence_id),
    relevance VARCHAR(20),
    UNIQUE(crime_id, evidence_id)
);

CREATE TABLE crime_officers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crime_id UUID NOT NULL REFERENCES crimes(crime_id),
    officer_id UUID NOT NULL REFERENCES officers(officer_id),
    role VARCHAR(30) NOT NULL,
    assigned_date DATE,
    UNIQUE(crime_id, officer_id)
);

CREATE TABLE suspect_associates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suspect_id UUID NOT NULL REFERENCES suspects(suspect_id),
    associate_id UUID NOT NULL REFERENCES suspects(suspect_id),
    relationship_type VARCHAR(30) NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    notes TEXT,
    UNIQUE(suspect_id, associate_id),
    CHECK (suspect_id != associate_id)
);
