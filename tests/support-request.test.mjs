import assert from 'node:assert/strict';
import test from 'node:test';
import supportRequestHandler from '../api/support-request.js';

async function invoke(request) {
  let statusCode;
  let responseBody;
  const response = {
    status(code) { statusCode = code; return this; },
    setHeader() { return this; },
    send(serialized) { responseBody = JSON.parse(serialized); },
  };
  await supportRequestHandler(request, response);
  return { statusCode, responseBody };
}

test('a paused team intake is honest and does not accept new personal details', async () => {
  const originalFetch = globalThis.fetch;
  const saved = process.env.TEAM_SUPPORT_INTAKE;
  process.env.TEAM_SUPPORT_INTAKE = 'paused';
  globalThis.fetch = async () => { throw new Error('A paused intake must not contact the database.'); };

  try {
    const availability = await invoke({ method: 'GET' });
    assert.deepEqual(availability, { statusCode: 200, responseBody: { available: false, reason: 'paused' } });

    const request = await invoke({ method: 'POST', body: { consent: true, contact: 'person@example.com', note: 'Please contact me.' } });
    assert.equal(request.statusCode, 503);
    assert.match(request.responseBody.error, /taking a pause/i);
  } finally {
    globalThis.fetch = originalFetch;
    if (saved === undefined) delete process.env.TEAM_SUPPORT_INTAKE;
    else process.env.TEAM_SUPPORT_INTAKE = saved;
  }
});

test('a person can still withdraw an existing request while new intake is paused', async () => {
  const envKeys = ['TEAM_SUPPORT_INTAKE', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
  const saved = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, {
    TEAM_SUPPORT_INTAKE: 'paused',
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
  });
  const id = '2a0cbaf2-a242-4c23-9dc0-4e974b5a3d04';
  let deleteCalled = false;
  globalThis.fetch = async (_url, init) => {
    deleteCalled = init.method === 'DELETE';
    return { ok: true, json: async () => [{ id }] };
  };

  try {
    const result = await invoke({ method: 'DELETE', body: { id, token: 'x'.repeat(43) } });
    assert.deepEqual(result, { statusCode: 200, responseBody: { withdrawn: true } });
    assert.equal(deleteCalled, true);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of envKeys) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
});
