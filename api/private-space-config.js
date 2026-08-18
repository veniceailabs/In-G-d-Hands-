function reply(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').setHeader('Cache-Control', 'no-store').send(JSON.stringify(body));
}

export default function handler(request, response) {
  if (request.method !== 'GET') return reply(response, 405, { error: 'Method not allowed.' });
  const { TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY, SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  const turnstileEnabled = Boolean(TURNSTILE_SITE_KEY && TURNSTILE_SECRET_KEY);
  const journalEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
  const body = {
    enabled: turnstileEnabled,
    ...(turnstileEnabled ? { siteKey: TURNSTILE_SITE_KEY } : {}),
    journal: journalEnabled ? { enabled: true, url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY } : { enabled: false },
  };
  return reply(response, 200, body);
}
