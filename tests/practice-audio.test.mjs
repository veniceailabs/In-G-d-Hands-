import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('practice audio is optional, device-side, and never reads private writing', async () => {
  const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(source, /'speechSynthesis' in window/);
  assert.match(source, /Listen to this practice/);
  assert.match(source, /Stop listening/);
  assert.match(source, /Nothing you write is read aloud or sent/);
  assert.doesNotMatch(source, /\/api\/audio/);
});
