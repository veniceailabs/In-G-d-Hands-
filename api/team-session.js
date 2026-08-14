import { clearOwnerSession, ownerConsoleConfigured, ownerPasswordMatches, ownerSessionIsValid, setOwnerSession } from './_team-access.js';

function reply(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').setHeader('Cache-Control', 'no-store').send(JSON.stringify(body));
}

export default async function handler(request, response) {
  if (request.method === 'POST') {
    if (!ownerConsoleConfigured()) return reply(response, 503, { error: 'The private owner console has not been configured yet.' });
    const password = typeof request.body?.password === 'string' ? request.body.password : '';
    if (!ownerPasswordMatches(password)) return reply(response, 401, { error: 'Unable to sign in.' });
    setOwnerSession(response);
    return reply(response, 200, { signedIn: true });
  }
  if (request.method === 'DELETE') {
    clearOwnerSession(response);
    return reply(response, 200, { signedOut: true });
  }
  if (request.method === 'GET') return reply(response, 200, { signedIn: ownerSessionIsValid(request), configured: ownerConsoleConfigured() });
  return reply(response, 405, { error: 'Method not allowed.' });
}
