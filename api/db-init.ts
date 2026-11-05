import type { VercelRequest, VercelResponse } from '@vercel/node';
import { queryNeon } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Attendees
    await queryNeon(`
      CREATE TABLE IF NOT EXISTS attendees (
        id VARCHAR(64) PRIMARY KEY,
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
    `);

    // 2. Volunteers
    await queryNeon(`
      CREATE TABLE IF NOT EXISTS volunteers (
        id VARCHAR(64) PRIMARY KEY,
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
        assigned_app VARCHAR(50) DEFAULT 'scanner',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Incidents
    await queryNeon(`
      CREATE TABLE IF NOT EXISTS incidents (
        id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        priority VARCHAR(20) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'open',
        reported_by VARCHAR(100) NOT NULL,
        assigned_to VARCHAR(100),
        reported_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMPTZ,
        resolution_notes TEXT
      );
    `);

    // 4. Parking
    await queryNeon(`
      CREATE TABLE IF NOT EXISTS parking_zones (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        vehicle_type VARCHAR(100) NOT NULL,
        capacity INT NOT NULL,
        current_count INT NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'available',
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. VIPs
    await queryNeon(`
      CREATE TABLE IF NOT EXISTS vips (
        id VARCHAR(64) PRIMARY KEY,
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
        status VARCHAR(50) NOT NULL DEFAULT 'expected',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Stalls
    await queryNeon(`
      CREATE TABLE IF NOT EXISTS stalls (
        id VARCHAR(64) PRIMARY KEY,
        stall_number VARCHAR(50) UNIQUE NOT NULL,
        business_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        rent_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
        payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
        power_required_kw NUMERIC(5,2) DEFAULT 0,
        power_inspected BOOLEAN DEFAULT FALSE,
        fire_safety_cleared BOOLEAN DEFAULT FALSE,
        vendor_passes_issued INT DEFAULT 2,
        status VARCHAR(50) NOT NULL DEFAULT 'setup',
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Sponsors
    await queryNeon(`
      CREATE TABLE IF NOT EXISTS sponsors (
        id VARCHAR(64) PRIMARY KEY,
        brand_name VARCHAR(255) NOT NULL,
        tier VARCHAR(50) NOT NULL,
        contact_person VARCHAR(255),
        contact_phone VARCHAR(50),
        deliverables JSONB DEFAULT '[]'::jsonb,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. Broadcasts
    await queryNeon(`
      CREATE TABLE IF NOT EXISTS broadcasts (
        id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid(),
        message TEXT NOT NULL,
        target_audience VARCHAR(50) NOT NULL DEFAULT 'all',
        urgency VARCHAR(20) NOT NULL DEFAULT 'normal',
        sent_by VARCHAR(100) NOT NULL,
        sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return res.status(200).json({
      success: true,
      message: 'All 8 database tables verified and migrated successfully on Neon!'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Database migration failed'
    });
  }
}
