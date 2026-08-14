const practiceIds = new Set(['breathe', 'ground', 'brain-dump', 'next', 'connection', 'rest', 'movement']);
const feelings = new Set(['a little different', 'about the same', 'I want another option']);

function reply(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').setHeader('Cache-Control', 'no-store').send(JSON.stringify(body));
}

function readBody(body) {
  if (typeof body !== 'string') return body || {};
  try { return JSON.parse(body); } catch { return {}; }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return reply(response, 405, { error: 'Method not allowed.' });
  const { practiceId, feeling } = readBody(request.body);
  if (!practiceIds.has(practiceId) || !feelings.has(feeling)) {
    return reply(response, 400, { error: 'This feedback response is not available.' });
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return reply(response, 503, { error: 'Anonymous feedback is not configured.' });

  try {
    const saved = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/anonymous_practice_feedback`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ practice_id: practiceId, feeling }),
    });
    if (!saved.ok) throw new Error(`Supabase returned ${saved.status}`);
    return reply(response, 202, { received: true });
  } catch {
    return reply(response, 503, { error: 'Anonymous feedback is not available right now.' });
  }
}
