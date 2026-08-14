function reply(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').send(JSON.stringify(body));
}

export default async function handler(request, response) {
  if (!['POST', 'DELETE'].includes(request.method)) return reply(response, 405, { error: 'Method not allowed.' });

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return reply(response, 503, { error: 'Private spaces are being prepared. You can still use every support tool without an account.' });
  }

  const authUrl = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1`;

  try {
    if (request.method === 'DELETE') {
      const accessToken = String(request.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
      if (!accessToken) return reply(response, 401, { error: 'Your private-space session is missing. Open this space in the same browser session to delete it.' });
      const userResponse = await fetch(`${authUrl}/user`, {
        headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${accessToken}` },
      });
      const user = await userResponse.json().catch(() => ({}));
      if (!userResponse.ok || !user.id || user.is_anonymous !== true) return reply(response, 403, { error: 'This private-space session cannot be deleted here.' });
      const deletion = await fetch(`${authUrl}/admin/users/${encodeURIComponent(user.id)}`, {
        method: 'DELETE',
        headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ should_soft_delete: false }),
      });
      if (!deletion.ok) return reply(response, 502, { error: 'We could not delete your private space. Please try again.' });
      return reply(response, 200, { deleted: true });
    }

    const account = await fetch(`${authUrl}/signup`, {
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
