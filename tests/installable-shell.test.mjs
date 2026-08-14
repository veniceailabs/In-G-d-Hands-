import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('the installable shell uses native mobile icons and never caches API routes', async () => {
  const [manifestText, appSource, workerSource] = await Promise.all([
    readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8'),
    readFile(new URL('../app.js', import.meta.url), 'utf8'),
    readFile(new URL('../sw.js', import.meta.url), 'utf8'),
  ]);
  const manifest = JSON.parse(manifestText);

  assert.equal(manifest.display, 'standalone');
  assert.deepEqual(manifest.icons.map((icon) => icon.src), ['/icons/icon-192.png', '/icons/icon-512.png']);
  assert.match(appSource, /serviceWorker\.register\('\/sw\.js'\)/);
  assert.match(workerSource, /url\.pathname\.startsWith\('\/api\/'\)/);
});
