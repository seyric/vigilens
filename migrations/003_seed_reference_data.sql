-- ============================================================
-- Vigilens AI — Migration 003: Seed Reference Data
-- ============================================================

-- Seed Roles
INSERT INTO roles (role_name, description, permissions, is_system_role) VALUES
('Super Admin', 'Full system access', '{"all": "rw"}', TRUE),
('Admin', 'Administrative access', '{"all": "rw"}', TRUE),
('SP', 'Superintendent of Police', '{"firs": "r", "analytics": "r"}', FALSE),
('Inspector', 'Station House Officer', '{"firs": "rw", "suspects": "rw"}', FALSE),
('SI', 'Sub-Inspector', '{"firs": "rw", "suspects": "rw"}', FALSE),
('Constable', 'Constable', '{"firs": "r", "suspects": "r"}', FALSE),
('Analyst', 'Data Analyst', '{"analytics": "rw", "firs": "r"}', FALSE),
('Viewer', 'Read-only access', '{"all": "r"}', FALSE);

-- Seed Districts (Sample of Karnataka districts)
INSERT INTO districts (district_name, district_code, division, latitude, longitude) VALUES
('Bengaluru Urban', 'BLR_U', 'Bengaluru', 12.9716, 77.5946),
('Mysuru', 'MYS', 'Mysuru', 12.2958, 76.6394),
('Belagavi', 'BGM', 'Belagavi', 15.8497, 74.4977),
('Kalaburagi', 'KLB', 'Kalaburagi', 17.3297, 76.8343);

-- Seed Crime Categories (Sample)
INSERT INTO crime_categories (category_name, category_code, ipc_section, severity_default) VALUES
('Murder', 'MURDER', '302', 'Critical'),
('Theft', 'THEFT', '379', 'Medium'),
('Robbery', 'ROBBERY', '392', 'High'),
('Kidnapping', 'KIDNAP', '363', 'High');
