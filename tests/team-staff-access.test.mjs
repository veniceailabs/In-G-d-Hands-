import assert from 'node:assert/strict';
import test from 'node:test';
import teamSessionHandler from '../api/team-session.js';
import supportQueueHandler from '../api/support-queue.js';

function withEnv(vars, fn) {
  const originalEnv = { ...process.env };
  Object.assign(process.env, vars);
  return (async () => {
    try { return await fn(); }
    finally {
      for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
      Object.assign(process.env, originalEnv);
    }
  })();
}

async function invoke(handler, request) {
  let statusCode;
  let responseBody;
  const headers = {};
  const response = {
    status(code) { statusCode = code; return this; },
    setHeader(name, value) { headers[name] = value; return this; },
    send(serialized) { responseBody = JSON.parse(serialized); },
  };
  await handler(request, response);
  return { statusCode, responseBody, headers };
}

test('each staff member signs in with their own username and password', () => withEnv(
  { TEAM_STAFF_CREDENTIALS: 'teedoteinsof:a-long-unique-password,blkgod9:another-long-unique-password' },
  async () => {
    const result = await invoke(teamSessionHandler, { method: 'POST', headers: {}, body: { username: 'blkgod9', password: 'another-long-unique-password' } });
    assert.equal(result.statusCode, 200);
    assert.equal(result.responseBody.username, 'blkgod9');
    assert.match(result.headers['Set-Cookie'], /^igh_support_owner=blkgod9\./);
  },
));

test('one staff member cannot sign in with a different staff member\'s password', () => withEnv(
  { TEAM_STAFF_CREDENTIALS: 'teedoteinsof:a-long-unique-password,blkgod9:another-long-unique-password' },
  async () => {
    const result = await invoke(teamSessionHandler, { method: 'POST', headers: {}, body: { username: 'teedoteinsof', password: 'another-long-unique-password' } });
    assert.equal(result.statusCode, 401);
  },
));

test('a status update in the queue records which staff username made it', () => withEnv(
  {
    TEAM_STAFF_CREDENTIALS: 'teedoteinsof:a-long-unique-password',
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
  },
  async () => {
    const signIn = await invoke(teamSessionHandler, { method: 'POST', headers: {}, body: { username: 'teedoteinsof', password: 'a-long-unique-password' } });
    const cookie = signIn.headers['Set-Cookie'].split(';')[0];

    const originalFetch = globalThis.fetch;
    let capturedBody;
    globalThis.fetch = async (url, init) => {
      if (init?.method === 'PATCH') {
        capturedBody = JSON.parse(init.body);
        return { ok: true, json: async () => [{ id: '11111111-1111-4111-8111-111111111111', status: 'in_progress', updated_by: 'teedoteinsof' }] };
      }
      return { ok: true, json: async () => [] };
    };
    try {
      const update = await invoke(supportQueueHandler, {
        method: 'PATCH', headers: { cookie }, body: { id: '11111111-1111-4111-8111-111111111111', status: 'in_progress' },
      });
      assert.equal(update.statusCode, 200);
      assert.equal(capturedBody.updated_by, 'teedoteinsof');
      assert.equal(update.responseBody.request.updated_by, 'teedoteinsof');
    } finally { globalThis.fetch = originalFetch; }
  },
));
