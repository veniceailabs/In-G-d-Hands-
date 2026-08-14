import assert from 'node:assert/strict';
import test from 'node:test';
import chatHandler from '../api/chat.js';

async function invoke(body, headers = {}) {
  let statusCode;
  let responseBody;
  const response = {
    status(code) { statusCode = code; return this; },
    setHeader() { return this; },
    send(serialized) { responseBody = JSON.parse(serialized); },
  };
  await chatHandler({ method: 'POST', body, headers }, response);
  return { statusCode, responseBody };
}

test('urgent safety messages bypass ordinary chat pacing', async () => {
  const envKeys = ['AI_PROVIDER', 'AI_BASE_URL', 'AI_API_KEY', 'AI_MODEL'];
  const saved = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
  process.env.AI_PROVIDER = 'openai-compatible';
  delete process.env.AI_BASE_URL;
  delete process.env.AI_API_KEY;
  delete process.env.AI_MODEL;

  try {
    const headers = { 'x-forwarded-for': '203.0.113.21' };
    const normalReplies = [];
    for (let count = 0; count < 12; count += 1) normalReplies.push(await invoke({ message: 'Help me slow down.' }, headers));
    assert.ok(normalReplies.every((result) => result.statusCode === 200 && result.responseBody.type === 'support'));

    const limited = await invoke({ message: 'Help me slow down.' }, headers);
    assert.equal(limited.statusCode, 429);
    assert.match(limited.responseBody.error, /short pause/i);

    const urgent = await invoke({ message: 'I am not safe.' }, headers);
    assert.equal(urgent.statusCode, 200);
    assert.equal(urgent.responseBody.type, 'urgent');
  } finally {
    for (const key of envKeys) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
});

test('clinical requests use the resource response without invoking a model', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('The model should not be called for clinical-resource routing.'); };
  try {
    const result = await invoke({ message: 'What medication should I take?' }, { 'x-forwarded-for': '203.0.113.22' });
    assert.equal(result.statusCode, 200);
    assert.equal(result.responseBody.type, 'professional');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('an unsafe clinical model reply is replaced with the approved guided fallback', async () => {
  const envKeys = ['AI_PROVIDER', 'OLLAMA_BASE_URL', 'OLLAMA_MODEL'];
  const saved = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, { AI_PROVIDER: 'ollama', OLLAMA_BASE_URL: 'https://example.invalid', OLLAMA_MODEL: 'test-model' });
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ message: { content: 'You have anxiety and should start taking medication today.' } }) });

  try {
    const result = await invoke({ message: 'My thoughts are loud.' }, { 'x-forwarded-for': '203.0.113.23' });
    assert.equal(result.statusCode, 200);
    assert.equal(result.responseBody.type, 'support');
    assert.doesNotMatch(result.responseBody.message, /anxiety|medication/i);
    assert.match(result.responseBody.message, /one small next step/i);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of envKeys) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
});
