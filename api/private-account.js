function reply(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').send(JSON.stringify(body));
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return reply(response, 405, { error: 'Method not allowed.' });

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return reply(response, 503, { error: 'Private spaces are being prepared. You can still use every support tool without an account.' });
  }

  try {
    const account = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: {} }),
    });
    const payload = await account.json().catch(() => ({}));
    if (!account.ok || !payload.access_token) {
      return reply(response, 503, { error: 'Private spaces are not enabled yet. You can still use every support tool without an account.' });
    }
    return reply(response, 201, {
      session: {
        access_token: payload.access_token,
        refresh_token: payload.refresh_token,
        expires_at: payload.expires_at,
      },
    });
  } catch {
    return reply(response, 502, { error: 'Private spaces are not available right now. You can still use every support tool without an account.' });
  }
}
