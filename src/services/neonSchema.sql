-- Faith Commune Event Operations Command Center (ApexEvents OS)
-- Production PostgreSQL Schema for Neon Serverless Database

-- 1. Attendees & Digital Passes (1,500 - 2,000 Capacity)
CREATE TABLE IF NOT EXISTS attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    age_group VARCHAR(20),
    denomination VARCHAR(100),
    home_church VARCHAR(255),
    pass_count INT NOT NULL DEFAULT 1,
    checked_in BOOLEAN NOT NULL DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ,
    checked_in_by VARCHAR(100),
    gate VARCHAR(50),
    interests TEXT[] DEFAULT '{}',
    is_volunteer_opt_in BOOLEAN DEFAULT FALSE,
    notes TEXT,
    registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Volunteers & Staff Roster (150 - 200 Staff across 8 departments)
CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    department VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    is_lead BOOLEAN DEFAULT FALSE,
    shift VARCHAR(100) NOT NULL,
    checked_in BOOLEAN NOT NULL DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ,
    emergency_contact VARCHAR(100),
    assigned_zone VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Incident Management & Safety Triage
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- medical, crowd, technical, security, facility, lost_found
    priority VARCHAR(20) NOT NULL, -- P1-CRITICAL, P2-HIGH, P3-MEDIUM, P4-LOW
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, investigating, resolved
    reported_by VARCHAR(100) NOT NULL,
    assigned_to VARCHAR(100),
    reported_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT
);

-- 4. Parking & Ground Traffic Control (4-Acre School Ground)
CREATE TABLE IF NOT EXISTS parking_zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    current_count INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'available',
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. VIP, Speakers & Performers Run-of-Show
CREATE TABLE IF NOT EXISTS vips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    church_or_org VARCHAR(255),
    scheduled_arrival_time VARCHAR(50),
    soundcheck_time VARCHAR(50),
    stage_time VARCHAR(50) NOT NULL,
    escort_volunteer_name VARCHAR(100),
    escort_phone VARCHAR(50),
    green_room_id VARCHAR(50),
    dietary_notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'expected', -- expected, in-transit, in-green-room, backstage-ready, on-stage, completed
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Commercial Stalls & Marketplace
CREATE TABLE IF NOT EXISTS stalls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stall_number VARCHAR(50) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- clothing, food-eateries, jewellery, books-merch, services
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    rent_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- paid, partial, pending
    power_required_kw NUMERIC(5,2) DEFAULT 0,
    power_inspected BOOLEAN DEFAULT FALSE,
    fire_safety_cleared BOOLEAN DEFAULT FALSE,
    vendor_passes_issued INT DEFAULT 2,
    status VARCHAR(50) NOT NULL DEFAULT 'setup',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Corporate Sponsors & Brand Marketing
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name VARCHAR(255) NOT NULL,
    tier VARCHAR(50) NOT NULL, -- Title Sponsor, Platinum, Gold, Community Partner
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    deliverables JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Broadcast Alerts
CREATE TABLE IF NOT EXISTS broadcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    target_audience VARCHAR(50) NOT NULL DEFAULT 'all',
    urgency VARCHAR(20) NOT NULL DEFAULT 'normal',
    sent_by VARCHAR(100) NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- High-performance indexes for sub-50ms query & scan responses
CREATE INDEX IF NOT EXISTS idx_attendees_ticket_id ON attendees(ticket_id);
CREATE INDEX IF NOT EXISTS idx_attendees_phone ON attendees(phone);
CREATE INDEX IF NOT EXISTS idx_attendees_checked_in ON attendees(checked_in);
CREATE INDEX IF NOT EXISTS idx_attendees_gate ON attendees(gate);
CREATE INDEX IF NOT EXISTS idx_volunteers_department ON volunteers(department);
CREATE INDEX IF NOT EXISTS idx_volunteers_code ON volunteers(volunteer_code);
CREATE INDEX IF NOT EXISTS idx_incidents_status_priority ON incidents(status, priority);
CREATE INDEX IF NOT EXISTS idx_stalls_number ON stalls(stall_number);
