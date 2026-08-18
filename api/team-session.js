import { clearOwnerSession, ownerConsoleConfigured, ownerSessionUser, setOwnerSession, staffCredentialsMatch } from './_team-access.js';

function reply(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').setHeader('Cache-Control', 'no-store').send(JSON.stringify(body));
}

export default async function handler(request, response) {
  if (request.method === 'POST') {
    if (!ownerConsoleConfigured()) return reply(response, 503, { error: 'The private owner console has not been configured yet.' });
    const username = typeof request.body?.username === 'string' ? request.body.username : '';
    const password = typeof request.body?.password === 'string' ? request.body.password : '';
    const matchedUsername = staffCredentialsMatch(username, password);
    if (!matchedUsername) return reply(response, 401, { error: 'Unable to sign in.' });
    setOwnerSession(response, matchedUsername);
    return reply(response, 200, { signedIn: true, username: matchedUsername });
  }
  if (request.method === 'DELETE') {
    clearOwnerSession(response);
    return reply(response, 200, { signedOut: true });
  }
  if (request.method === 'GET') {
    const username = ownerSessionUser(request);
    return reply(response, 200, { signedIn: username !== null, username, configured: ownerConsoleConfigured() });
  }
  return reply(response, 405, { error: 'Method not allowed.' });
}
