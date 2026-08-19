import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('Honey-guided tour: HTML structure is complete and accessible', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="tour-invite"/);
  assert.match(html, /id="tour-invite-start"/);
  assert.match(html, /id="tour-invite-skip"/);
  assert.match(html, /id="tour-overlay"/);
  assert.match(html, /id="tour-tooltip"/);
  assert.match(html, /role="dialog"/);
  assert.match(html, /aria-labelledby="tour-tooltip-title"/);
  assert.match(html, /aria-describedby="tour-tooltip-body"/);
  assert.match(html, /id="tour-prev"/);
  assert.match(html, /id="tour-next"/);
  assert.match(html, /id="tour-end"/);
  assert.match(html, /id="tour-live"/);
  assert.match(html, /id="tour-launch-button"/);
});

test('Honey-guided tour: JS engine functions and steps are defined', async () => {
  const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(appSource, /function startTour/);
  assert.match(appSource, /function endTour/);
  assert.match(appSource, /function tourShowStep/);
  assert.match(appSource, /function tourPositionTooltip/);
  assert.match(appSource, /const TOUR_STEPS/);
  assert.match(appSource, /site-header/);
  assert.match(appSource, /journal-invite/);
  assert.match(appSource, /data-open-urgent/);
  assert.match(appSource, /tourReadTourSeen/);
  assert.match(appSource, /tourMarkSeen/);
  assert.match(appSource, /igh-tour-seen/);
  assert.match(appSource, /ArrowRight/);
  assert.match(appSource, /ArrowLeft/);
  assert.match(appSource, /preferences\.motion/);
  assert.match(appSource, /tourLive\.textContent/);
});
