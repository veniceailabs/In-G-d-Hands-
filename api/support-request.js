function reply(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').send(JSON.stringify(body));
}

export default async function handler(request, response) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (request.method === 'GET') {
    response.setHeader('Cache-Control', 'no-store');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return reply(response, 200, { available: false });
    try {
      const check = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/team_support_requests?select=id&limit=1`, {
        method: 'HEAD',
        headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, Prefer: 'count=none' },
      });
      return reply(response, 200, { available: check.ok });
    } catch { return reply(response, 200, { available: false }); }
  }
  if (request.method !== 'POST') return reply(response, 405, { error: 'Method not allowed.' });
  const { name = '', contact = '', note = '', consent = false } = request.body || {};
  if (!consent || typeof note !== 'string' || note.trim().length < 2 || note.length > 1000) return reply(response, 400, { error: 'Please add a brief note and acknowledge the storage notice.' });
  if (typeof name !== 'string' || name.length > 80 || typeof contact !== 'string' || contact.length > 180) return reply(response, 400, { error: 'Please shorten the details you entered.' });
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return reply(response, 503, { error: 'Team requests are not configured yet.' });
  try {
    const insert = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/team_support_requests`, {
      method: 'POST',
      headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ contact_name: name.trim() || null, contact_detail: contact.trim() || null, request_note: note.trim(), consented_at: new Date().toISOString() }),
    });
    if (!insert.ok) throw new Error(`Supabase returned ${insert.status}`);
    return reply(response, 201, { received: true });
  } catch { return reply(response, 502, { error: 'The team request could not be saved.' }); }
}
