import assert from 'node:assert/strict';
import test from 'node:test';
import feedbackHandler from '../api/feedback.js';

async function invoke(body) {
  let statusCode;
  let responseBody;
  const response = {
    status(code) { statusCode = code; return this; },
    setHeader() { return this; },
    send(serialized) { responseBody = JSON.parse(serialized); },
  };
  await feedbackHandler({ method: 'POST', body }, response);
  return { statusCode, responseBody };
}

test('optional practice feedback stores only a category and three-choice response', async () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };
  Object.assign(process.env, { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key' });
  let captured;
  globalThis.fetch = async (url, init) => {
    captured = { url: String(url), init };
    return { ok: true };
  };

  try {
    const result = await invoke({ practiceId: 'ground', feeling: 'a little different' });
    assert.deepEqual(result, { statusCode: 202, responseBody: { received: true } });
    assert.equal(captured.url, 'https://example.supabase.co/rest/v1/anonymous_practice_feedback');
    assert.deepEqual(JSON.parse(captured.init.body), { practice_id: 'ground', feeling: 'a little different' });
    assert.equal(captured.init.headers.Prefer, 'return=minimal');
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
    Object.assign(process.env, originalEnv);
  }
});

test('feedback rejects free text and never contacts the database for it', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('Invalid feedback must not reach the database.'); };
  try {
    const result = await invoke({ practiceId: 'ground', feeling: 'Here is something private' });
    assert.equal(result.statusCode, 400);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
