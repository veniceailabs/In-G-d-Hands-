import { createHash, randomBytes } from 'node:crypto';

function reply(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').setHeader('Cache-Control', 'no-store').send(JSON.stringify(body));
}

function readBody(body) {
  if (typeof body !== 'string') return body || {};
  try { return JSON.parse(body); } catch { return {}; }
}
function intakeIsOpen() { return process.env.TEAM_SUPPORT_INTAKE !== 'paused'; }
function tokenHash(token) { return createHash('sha256').update(token).digest('hex'); }
function isRequestId(value) { return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }

export default async function handler(request, response) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (request.method === 'GET') {
    response.setHeader('Cache-Control', 'no-store');
    if (!intakeIsOpen()) return reply(response, 200, { available: false, reason: 'paused' });
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return reply(response, 200, { available: false });
    try {
      const check = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/team_support_requests?select=id&limit=1`, {
        method: 'HEAD',
        headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, Prefer: 'count=none' },
      });
      return reply(response, 200, { available: check.ok });
    } catch { return reply(response, 200, { available: false }); }
  }
  if (request.method === 'DELETE') {
    const { id, token } = readBody(request.body);
    if (!isRequestId(id) || typeof token !== 'string' || token.length < 32 || token.length > 128) return reply(response, 400, { error: 'This request cannot be withdrawn from this browser.' });
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return reply(response, 503, { error: 'The request cannot be withdrawn right now.' });
    try {
      const withdrawal = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/team_support_requests?id=eq.${encodeURIComponent(id)}&withdrawal_token_hash=eq.${tokenHash(token)}`, {
        method: 'DELETE',
        headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, Prefer: 'return=representation' },
      });
      if (!withdrawal.ok) throw new Error('Withdrawal failed.');
      const rows = await withdrawal.json();
      if (!rows[0]) return reply(response, 404, { error: 'This request cannot be withdrawn from this browser.' });
      return reply(response, 200, { withdrawn: true });
    } catch { return reply(response, 502, { error: 'The request cannot be withdrawn right now.' }); }
  }
  if (request.method !== 'POST') return reply(response, 405, { error: 'Method not allowed.' });
  if (!intakeIsOpen()) return reply(response, 503, { error: 'Team check-ins are taking a pause right now. Please use the private support tools or Find A Helpline.' });
  const { name = '', contact = '', note = '', consent = false } = readBody(request.body);
  if (!consent || typeof note !== 'string' || note.trim().length < 2 || note.length > 1000) return reply(response, 400, { error: 'Please add a brief note and acknowledge the storage notice.' });
  if (typeof name !== 'string' || name.length > 80 || typeof contact !== 'string' || contact.length > 180) return reply(response, 400, { error: 'Please shorten the details you entered.' });
  if (contact.trim().length < 3) return reply(response, 400, { error: 'Please share an email or phone number so the team can reply.' });
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return reply(response, 503, { error: 'Team requests are not configured yet.' });
  try {
    const withdrawalToken = randomBytes(32).toString('base64url');
    const insert = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/team_support_requests`, {
      method: 'POST',
      headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({ contact_name: name.trim() || null, contact_detail: contact.trim(), request_note: note.trim(), consented_at: new Date().toISOString(), withdrawal_token_hash: tokenHash(withdrawalToken) }),
    });
    if (!insert.ok) throw new Error(`Supabase returned ${insert.status}`);
    const rows = await insert.json();
    if (!isRequestId(rows[0]?.id)) throw new Error('Supabase returned no request identifier.');
    return reply(response, 201, { received: true, withdrawal: { id: rows[0].id, token: withdrawalToken } });
  } catch { return reply(response, 502, { error: 'The team request could not be saved.' }); }
}
