import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { ticketId, gate = 'gate-1', operator = 'Gate Scanner' } = req.body || {};

  if (!ticketId) {
    return res.status(400).json({ error: 'ticketId is required' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(503).json({ error: 'DATABASE_URL not configured' });
  }

  try {
    const sql = neon(databaseUrl);
    const cleanId = ticketId.trim().toUpperCase();

    // 1. Fetch attendee record
    const rows = await sql`
      SELECT * FROM attendees 
      WHERE UPPER(ticket_id) = ${cleanId} 
         OR phone = ${cleanId} 
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        status: 'invalid-ticket',
        message: `Pass code "${cleanId}" not found in database.`
      });
    }

    const attendee = rows[0];

    // 2. Duplicate check
    if (attendee.checked_in) {
      return res.status(409).json({
        status: 'already-checked-in',
        attendee: {
          ticketId: attendee.ticket_id,
          name: attendee.name,
          passCount: attendee.pass_count,
          checkedInAt: attendee.checked_in_at,
          gate: attendee.gate,
          checkedInBy: attendee.checked_in_by
        },
        message: `Already checked in at ${new Date(attendee.checked_in_at).toLocaleTimeString()} at ${attendee.gate} by ${attendee.checked_in_by}.`
      });
    }

    // 3. Perform atomic update
    await sql`
      UPDATE attendees
      SET checked_in = TRUE,
          checked_in_at = NOW(),
          checked_in_by = ${operator},
          gate = ${gate}
      WHERE id = ${attendee.id};
    `;

    return res.status(200).json({
      status: 'success',
      attendee: {
        ticketId: attendee.ticket_id,
        name: attendee.name,
        passCount: attendee.pass_count,
        checkedInAt: new Date().toLocaleTimeString(),
        gate,
        checkedInBy: operator
      },
      message: `Verified pass for ${attendee.name} (${attendee.pass_count} people).`
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Check-in failed', details: message });
  }
}
