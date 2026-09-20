-- Align existing PostgreSQL installations with the backend authentication contract.

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Older database builds used this name for the same relationship.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'police_station_id'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'station_id'
    ) THEN
        ALTER TABLE users RENAME COLUMN police_station_id TO station_id;
    END IF;
END $$;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS station_id UUID REFERENCES police_stations(station_id);
