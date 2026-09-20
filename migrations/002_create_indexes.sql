-- ============================================================
-- Vigilens AI — Migration 002: Create Indexes
-- ============================================================

-- ── FIRs ──
CREATE INDEX idx_firs_fir_number ON firs (fir_number);
CREATE INDEX idx_firs_district_id ON firs (district_id);
CREATE INDEX idx_firs_station_id ON firs (police_station_id);
CREATE INDEX idx_firs_incident_date ON firs (incident_date);
CREATE INDEX idx_firs_status ON firs (status);
CREATE INDEX idx_firs_priority ON firs (priority);
CREATE INDEX idx_firs_investigating_officer_id ON firs (investigating_officer_id);
CREATE INDEX idx_firs_location_gist ON firs USING gist (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));

-- ── Crimes ──
CREATE INDEX idx_crimes_fir_id ON crimes (fir_id);
CREATE INDEX idx_crimes_category_id ON crimes (category_id);
CREATE INDEX idx_crimes_severity ON crimes (severity);

-- ── Suspects ──
CREATE INDEX idx_suspects_full_name_trgm ON suspects USING gin (full_name gin_trgm_ops);
CREATE INDEX idx_suspects_district_id ON suspects (district_id);
CREATE INDEX idx_suspects_status ON suspects (status);
CREATE INDEX idx_suspects_known_offender ON suspects (known_offender) WHERE known_offender = TRUE;

-- ── Police Stations ──
CREATE INDEX idx_police_stations_district_id ON police_stations (district_id);
CREATE INDEX idx_police_stations_location_gist ON police_stations USING gist (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));

-- ── Vehicles ──
CREATE UNIQUE INDEX idx_vehicles_registration_number ON vehicles (registration_number);

-- ── Activity Logs ──
CREATE INDEX idx_activity_logs_timestamp ON activity_logs (timestamp);
CREATE INDEX idx_activity_logs_user_id ON activity_logs (user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs (entity_type, entity_id);

-- ── Junction Tables ──
CREATE INDEX idx_crime_suspects_suspect_id ON crime_suspects (suspect_id);
CREATE INDEX idx_crime_victims_victim_id ON crime_victims (victim_id);
CREATE INDEX idx_crime_witnesses_witness_id ON crime_witnesses (witness_id);
CREATE INDEX idx_crime_vehicles_vehicle_id ON crime_vehicles (vehicle_id);
CREATE INDEX idx_crime_weapons_weapon_id ON crime_weapons (weapon_id);
CREATE INDEX idx_crime_evidence_evidence_id ON crime_evidence (evidence_id);
CREATE INDEX idx_crime_officers_officer_id ON crime_officers (officer_id);
CREATE INDEX idx_suspect_associates_associate_id ON suspect_associates (associate_id);
