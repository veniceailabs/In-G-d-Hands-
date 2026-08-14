import assert from 'node:assert/strict';
import test from 'node:test';
import privateAccountHandler from '../api/private-account.js';
import privateSpaceConfigHandler from '../api/private-space-config.js';

async function invoke(handler, request) {
  let statusCode;
  let responseBody;
  const response = {
    status(code) { statusCode = code; return this; },
    setHeader() { return this; },
    send(serialized) { responseBody = JSON.parse(serialized); },
  };
  await handler(request, response);
  return { statusCode, responseBody };
}

function response(ok, body) {
  return { ok, json: async () => body };
}

test('a private space is created only after server-side Turnstile verification', async () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };
  Object.assign(process.env, {
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
  });
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).includes('siteverify')) return response(true, { success: true });
    if (String(url).endsWith('/signup')) return response(true, { access_token: 'test-access', refresh_token: 'test-refresh', expires_at: 123 });
    throw new Error(`Unexpected request: ${url}`);
  };

  try {
    const created = await invoke(privateAccountHandler, {
      method: 'POST',
      headers: { 'x-forwarded-for': '203.0.113.31' },
      body: { turnstileToken: 'a'.repeat(40) },
    });
    assert.equal(created.statusCode, 201);
    assert.equal(created.responseBody.session.access_token, 'test-access');
    assert.equal(calls.length, 2);

    calls.length = 0;
    const blocked = await invoke(privateAccountHandler, {
      method: 'POST',
      headers: {},
      body: { turnstileToken: 'short' },
    });
    assert.equal(blocked.statusCode, 403);
    assert.equal(calls.length, 0);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
    Object.assign(process.env, originalEnv);
  }
});

test('private-space configuration exposes only the public site key', async () => {
  const originalEnv = { ...process.env };
  Object.assign(process.env, { TURNSTILE_SITE_KEY: 'public-site-key', TURNSTILE_SECRET_KEY: 'test-turnstile-secret' });
  try {
    const configured = await invoke(privateSpaceConfigHandler, { method: 'GET' });
    assert.equal(configured.statusCode, 200);
    assert.deepEqual(configured.responseBody, { enabled: true, siteKey: 'public-site-key' });
    assert.ok(!JSON.stringify(configured.responseBody).includes('test-turnstile-secret'));
  } finally {
    for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
    Object.assign(process.env, originalEnv);
  }
});
