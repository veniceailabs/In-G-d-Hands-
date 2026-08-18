import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import feedbackSummaryHandler from '../api/feedback-summary.js';

function ownerCookie(username, password) {
  const expiresAt = String(Date.now() + (5 * 60 * 1000));
  const signature = createHmac('sha256', password).update(`${username}.${expiresAt}`).digest('base64url');
  return `igh_support_owner=${username}.${expiresAt}.${signature}`;
}
async function invoke(request) {
  let statusCode;
  let responseBody;
  const response = { status(code) { statusCode = code; return this; }, setHeader() { return this; }, send(serialized) { responseBody = JSON.parse(serialized); } };
  await feedbackSummaryHandler(request, response);
  return { statusCode, responseBody };
}

test('the feedback summary requires the protected owner session', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('Unauthenticated requests must not contact Supabase.'); };
  try {
    const result = await invoke({ method: 'GET', headers: {} });
    assert.equal(result.statusCode, 401);
  } finally { globalThis.fetch = originalFetch; }
});

test('the protected feedback summary returns aggregate counts only', async () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };
  const username = 'teedoteinsof';
  const password = 'a safely long owner password';
  Object.assign(process.env, { TEAM_STAFF_CREDENTIALS: `${username}:${password}`, SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key' });
  let captured;
  globalThis.fetch = async (url, init) => {
    captured = { url: String(url), init };
    return { ok: true, json: async () => [
      { practice_id: 'ground', feeling: 'a little different', response_count: 3 },
      { practice_id: 'ground', feeling: 'about the same', response_count: 1 },
      { practice_id: 'breathe', feeling: 'I want another option', response_count: 2 },
    ] };
  };
  try {
    const result = await invoke({ method: 'GET', headers: { cookie: ownerCookie(username, password) } });
    assert.equal(result.statusCode, 200);
    assert.deepEqual(result.responseBody, {
      total: 6,
      byFeeling: { 'a little different': 3, 'about the same': 1, 'I want another option': 2 },
      mostSharedPractice: 'ground',
    });
    assert.equal(captured.url, 'https://example.supabase.co/rest/v1/rpc/anonymous_practice_feedback_summary');
    assert.equal(captured.init.method, 'POST');
    assert.equal(captured.init.body, '{}');
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
    Object.assign(process.env, originalEnv);
  }
});
