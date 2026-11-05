import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(503).json({ error: 'DATABASE_URL not configured' });
  }

  const sql = neon(databaseUrl);

  // GET: List, search, or filter attendees
  if (req.method === 'GET') {
    const { search = '', filter = 'all', limit = '100' } = req.query;

    try {
      let query;
      const parsedLimit = Math.min(Number(limit) || 100, 500);
      const searchPattern = `%${String(search).trim()}%`;

      if (search) {
        query = sql`
          SELECT * FROM attendees 
          WHERE name ILIKE ${searchPattern} 
             OR ticket_id ILIKE ${searchPattern} 
             OR phone ILIKE ${searchPattern} 
             OR denomination ILIKE ${searchPattern}
          ORDER BY registered_at DESC 
          LIMIT ${parsedLimit};
        `;
      } else if (filter === 'checked-in') {
        query = sql`
          SELECT * FROM attendees 
          WHERE checked_in = TRUE 
          ORDER BY checked_in_at DESC 
          LIMIT ${parsedLimit};
        `;
      } else if (filter === 'pending') {
        query = sql`
          SELECT * FROM attendees 
          WHERE checked_in = FALSE 
          ORDER BY registered_at DESC 
          LIMIT ${parsedLimit};
        `;
      } else {
        query = sql`
          SELECT * FROM attendees 
          ORDER BY registered_at DESC 
          LIMIT ${parsedLimit};
        `;
      }

      const rows = await query;
      return res.status(200).json({ attendees: rows });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return res.status(500).json({ error: 'Failed to fetch attendees', details: message });
    }
  }

  // POST: Create attendee
  if (req.method === 'POST') {
    const {
      ticketId,
      name,
      email,
      phone,
      ageGroup,
      denomination,
      homeChurch,
      passCount = 1,
      interests = [],
      isVolunteerOptIn = false,
      notes
    } = req.body || {};

    if (!ticketId || !name || !phone) {
      return res.status(400).json({ error: 'ticketId, name, and phone are required.' });
    }

    try {
      const id = 'att-' + Math.random().toString(36).substring(2, 9);
      await sql`
        INSERT INTO attendees (
          id, ticket_id, name, email, phone, age_group, denomination, 
          home_church, pass_count, checked_in, interests, is_volunteer_opt_in, notes
        ) VALUES (
          ${id}, ${ticketId}, ${name}, ${email || null}, ${phone}, ${ageGroup || null}, 
          ${denomination || null}, ${homeChurch || null}, ${passCount}, FALSE, 
          ${interests}, ${isVolunteerOptIn}, ${notes || null}
        );
      `;
      return res.status(201).json({ success: true, id, ticketId });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return res.status(500).json({ error: 'Failed to create attendee', details: message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
