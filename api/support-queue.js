import { ownerSessionIsValid } from './_team-access.js';

const allowedStatuses = new Set(['new', 'in_progress', 'closed']);
const selectFields = 'id,contact_name,contact_detail,request_note,consented_at,status,created_at,updated_at';
const pageSize = 50;

function reply(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').setHeader('Cache-Control', 'no-store').send(JSON.stringify(body));
}
function readBody(body) {
  if (typeof body !== 'string') return body || {};
  try { return JSON.parse(body); } catch { return {}; }
}
function supabaseHeaders(serviceRole, prefer = '') {
  return { apikey: serviceRole, Authorization: `Bearer ${serviceRole}`, 'Content-Type': 'application/json', ...(prefer ? { Prefer: prefer } : {}) };
}

export default async function handler(request, response) {
  if (!ownerSessionIsValid(request)) return reply(response, 401, { error: 'Sign in is required.' });
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return reply(response, 503, { error: 'The secure support queue is not available.' });
  const baseUrl = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/team_support_requests`;

  try {
    if (request.method === 'GET') {
      const requestedStatus = typeof request.query?.status === 'string' ? request.query.status : 'all';
      if (requestedStatus !== 'all' && !allowedStatuses.has(requestedStatus)) return reply(response, 400, { error: 'Unknown queue filter.' });
      const rawOffset = typeof request.query?.offset === 'string' ? request.query.offset : '0';
      const offset = /^\d{1,5}$/.test(rawOffset) ? Number(rawOffset) : NaN;
      if (!Number.isSafeInteger(offset) || offset < 0) return reply(response, 400, { error: 'Unknown queue page.' });
      const query = new URLSearchParams({ select: selectFields, order: 'created_at.desc', limit: String(pageSize + 1), offset: String(offset) });
      if (requestedStatus !== 'all') query.set('status', `eq.${requestedStatus}`);
      const queue = await fetch(`${baseUrl}?${query}`, { headers: supabaseHeaders(SUPABASE_SERVICE_ROLE_KEY, 'count=exact') });
      if (!queue.ok) throw new Error('Queue read failed.');
      const rows = await queue.json();
      const total = Number(queue.headers.get('content-range')?.split('/').pop());
      return reply(response, 200, { requests: rows.slice(0, pageSize), hasMore: rows.length > pageSize, nextOffset: offset + pageSize, total: Number.isSafeInteger(total) ? total : null });
    }
    if (request.method === 'PATCH') {
      const { id, status } = readBody(request.body);
      if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) || !allowedStatuses.has(status)) return reply(response, 400, { error: 'A valid request and status are required.' });
      const update = await fetch(`${baseUrl}?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH', headers: supabaseHeaders(SUPABASE_SERVICE_ROLE_KEY, 'return=representation'), body: JSON.stringify({ status }),
      });
      if (!update.ok) throw new Error('Queue update failed.');
      const rows = await update.json();
      if (!rows[0]) return reply(response, 404, { error: 'That request no longer exists.' });
      return reply(response, 200, { request: rows[0] });
    }
    return reply(response, 405, { error: 'Method not allowed.' });
  } catch { return reply(response, 502, { error: 'The secure support queue is unavailable right now.' }); }
}
