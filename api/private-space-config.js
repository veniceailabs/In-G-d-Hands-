function reply(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').setHeader('Cache-Control', 'no-store').send(JSON.stringify(body));
}

export default function handler(request, response) {
  if (request.method !== 'GET') return reply(response, 405, { error: 'Method not allowed.' });
  const { TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY } = process.env;
  const enabled = Boolean(TURNSTILE_SITE_KEY && TURNSTILE_SECRET_KEY);
  return reply(response, 200, enabled ? { enabled: true, siteKey: TURNSTILE_SITE_KEY } : { enabled: false });
}
