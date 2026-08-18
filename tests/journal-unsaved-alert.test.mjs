import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('journal close warns about unsaved writing before erasing or closing', async () => {
  const [html, appSource] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../app.js', import.meta.url), 'utf8'),
  ]);

  assert.match(html, /id="journal-confirm-dialog"/);
  assert.match(html, /Leave without saving\?/);
  assert.match(html, /this entry will be erased/);
  assert.match(html, /id="journal-discard-close-button"/);
  assert.match(html, /id="journal-keep-writing-button"/);

  assert.match(appSource, /hasUnsavedJournalWriting/);
  assert.match(appSource, /showJournalDiscardConfirmation/);
  assert.match(appSource, /forceCloseJournal/);
  assert.match(appSource, /requestCloseJournal/);
  assert.match(appSource, /journalDiscardCloseButton/);
  assert.match(appSource, /journalKeepWritingButton/);
});

test('calm ambient sound is on-device, toggleable, and responsive to user interaction', async () => {
  const [html, appSource] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../app.js', import.meta.url), 'utf8'),
  ]);

  assert.match(html, /id="calm-sound-button"/);
  assert.match(html, /id="calm-sound-toggle"/);
  assert.match(html, /id="calm-sound-volume"/);

  assert.match(appSource, /startCalmSound/);
  assert.match(appSource, /stopCalmSound/);
  assert.match(appSource, /AudioContext/);
  assert.match(appSource, /tryStartAudioOnUserGesture/);
  assert.match(appSource, /calmMasterGain/);
  assert.match(appSource, /handpanScale432/);
  assert.match(appSource, /playHandpanNote/);
  assert.match(appSource, /scheduleNextHandpanNote/);
});

