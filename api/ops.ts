import type { VercelRequest, VercelResponse } from '@vercel/node';
import { queryNeon } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for local testing
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action as string || req.body?.action as string;

  try {
    // 1. AUTHENTICATION & LOGIN
    if (action === 'login') {
      const { type, pin, code, phone } = req.body || {};

      // Director / Operations Head login
      if (type === 'director') {
        if (pin === '2026' || pin === 'faith2026' || pin === 'admin') {
          return res.status(200).json({
            success: true,
            user: {
              role: 'director',
              isDirector: true,
              displayName: 'Command Director (Super Admin)',
              assignedApp: 'war-room',
              assignedZone: 'All Event Zones (4-Acre Command)',
              token: 'fc-dir-' + Date.now()
            }
          });
        }
        return res.status(401).json({ success: false, error: 'Invalid Director Passcode. Try PIN: 2026' });
      }

      // Field Volunteer login by volunteer code or phone number
      const cleanIdentifier = String(code || phone || '').trim();
      if (!cleanIdentifier) {
        return res.status(400).json({ success: false, error: 'Volunteer Code or Mobile Phone is required' });
      }

      const rows = await queryNeon(`
        SELECT * FROM volunteers 
        WHERE UPPER(volunteer_code) = UPPER($1) 
           OR phone = $1 
           OR phone = $2
        LIMIT 1;
      `, [cleanIdentifier, cleanIdentifier.replace(/\D/g, '')]);

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: `Volunteer "${cleanIdentifier}" not found. Please contact the Operations Head in the War Room for assignment.`
        });
      }

      const volunteer = rows[0];

      // Mark volunteer as checked in
      await queryNeon(`
        UPDATE volunteers 
        SET checked_in = TRUE, checked_in_at = NOW() 
        WHERE id = $1;
      `, [volunteer.id]);

      return res.status(200).json({
        success: true,
        user: {
          role: 'volunteer',
          isDirector: false,
          volunteerId: volunteer.id,
          volunteerCode: volunteer.volunteer_code,
          displayName: volunteer.full_name,
          phone: volunteer.phone,
          department: volunteer.department,
          assignedRole: volunteer.role,
          assignedApp: volunteer.assigned_app || 'scanner',
          assignedZone: volunteer.assigned_zone || 'Gate 1 - North Main',
          token: 'fc-vol-' + volunteer.volunteer_code + '-' + Date.now()
        }
      });
    }

    // 2. VOLUNTEERS: LIST & DUTY ASSIGNMENT
    if (action === 'get_volunteers') {
      const rows = await queryNeon(`
        SELECT id, volunteer_code, full_name, phone, email, department, role, 
               is_lead, shift, checked_in, checked_in_at, emergency_contact, 
               assigned_zone, assigned_app 
        FROM volunteers 
        ORDER BY department, full_name ASC;
      `);
      return res.status(200).json({ volunteers: rows });
    }

    if (action === 'assign_duty') {
      const { volunteerId, assignedApp, assignedZone, role } = req.body || {};
      if (!volunteerId || !assignedApp) {
        return res.status(400).json({ error: 'volunteerId and assignedApp are required' });
      }

      await queryNeon(`
        UPDATE volunteers 
        SET assigned_app = $1,
            assigned_zone = COALESCE($2, assigned_zone),
            role = COALESCE($3, role)
        WHERE id::text = $4 OR volunteer_code = $4;
      `, [assignedApp, assignedZone, role, volunteerId]);

      return res.status(200).json({ success: true, message: 'Duty station assigned successfully' });
    }

    // 3. WAR ROOM METRICS & AGGREGATE STATS
    if (action === 'get_stats') {
      const [attRes, volRes, incRes, parkRes] = await Promise.all([
        queryNeon(`
          SELECT 
            COUNT(*) as total_registered,
            COUNT(*) FILTER (WHERE checked_in = TRUE) as total_checked_in,
            COALESCE(SUM(pass_count) FILTER (WHERE checked_in = TRUE), 0) as total_footfall
          FROM attendees;
        `),
        queryNeon(`
          SELECT 
            COUNT(*) as total_volunteers,
            COUNT(*) FILTER (WHERE checked_in = TRUE) as active_on_duty
          FROM volunteers;
        `),
        queryNeon(`
          SELECT 
            COUNT(*) as total_incidents,
            COUNT(*) FILTER (WHERE status = 'open' OR status = 'investigating') as active_incidents,
            COUNT(*) FILTER (WHERE priority = 'P1-CRITICAL' AND status != 'resolved') as critical_p1
          FROM incidents;
        `),
        queryNeon(`
          SELECT 
            COALESCE(SUM(capacity), 0) as total_capacity,
            COALESCE(SUM(current_count), 0) as total_parked
          FROM parking_zones;
        `)
      ]);

      return res.status(200).json({
        attendees: {
          totalRegistered: parseInt(attRes[0]?.total_registered || '0'),
          totalCheckedIn: parseInt(attRes[0]?.total_checked_in || '0'),
          footfall: parseInt(attRes[0]?.total_footfall || '0')
        },
        volunteers: {
          total: parseInt(volRes[0]?.total_volunteers || '0'),
          activeOnDuty: parseInt(volRes[0]?.active_on_duty || '0')
        },
        incidents: {
          total: parseInt(incRes[0]?.total_incidents || '0'),
          active: parseInt(incRes[0]?.active_incidents || '0'),
          criticalP1: parseInt(incRes[0]?.critical_p1 || '0')
        },
        parking: {
          capacity: parseInt(parkRes[0]?.total_capacity || '0'),
          parked: parseInt(parkRes[0]?.total_parked || '0')
        }
      });
    }

    // 4. PARKING: GET & UPDATE
    if (action === 'get_parking') {
      const rows = await queryNeon(`SELECT * FROM parking_zones ORDER BY id;`);
      return res.status(200).json({ zones: rows });
    }

    if (action === 'update_parking') {
      const { zoneId, delta } = req.body || {};
      if (!zoneId || delta === undefined) {
        return res.status(400).json({ error: 'zoneId and delta required' });
      }

      await queryNeon(`
        UPDATE parking_zones 
        SET current_count = GREATEST(0, LEAST(capacity, current_count + $1)),
            status = CASE 
              WHEN current_count + $1 >= capacity THEN 'full'
              WHEN current_count + $1 >= capacity * 0.85 THEN 'almost-full'
              ELSE 'available'
            END,
            updated_at = NOW()
        WHERE id = $2;
      `, [delta, zoneId]);

      const updated = await queryNeon(`SELECT * FROM parking_zones WHERE id = $1;`, [zoneId]);
      return res.status(200).json({ success: true, zone: updated[0] });
    }

    // 5. INCIDENTS: GET & REPORT
    if (action === 'get_incidents') {
      const rows = await queryNeon(`
        SELECT * FROM incidents ORDER BY reported_at DESC LIMIT 50;
      `);
      return res.status(200).json({ incidents: rows });
    }

    if (action === 'report_incident') {
      const { title, category, priority, location, description, reportedBy } = req.body || {};
      if (!title || !category || !location) {
        return res.status(400).json({ error: 'title, category, location required' });
      }

      const rows = await queryNeon(`
        INSERT INTO incidents (title, category, priority, location, description, reported_by, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'open')
        RETURNING *;
      `, [title, category, priority || 'P3-MEDIUM', location, description || '', reportedBy || 'Field Volunteer']);

      return res.status(201).json({ success: true, incident: rows[0] });
    }

    // 6. ATTENDEES & CRM (Director only)
    if (action === 'get_attendees') {
      const isDirector = req.headers['x-director-pin'] === '2026' || req.query.isDirector === 'true';
      if (!isDirector) {
        return res.status(403).json({ error: 'Access denied: CRM is restricted to Operations Head / Command Director.' });
      }

      const rows = await queryNeon(`SELECT * FROM attendees ORDER BY registered_at DESC LIMIT 200;`);
      return res.status(200).json({ attendees: rows });
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });
  } catch (error: any) {
    console.error('API /api/ops error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
