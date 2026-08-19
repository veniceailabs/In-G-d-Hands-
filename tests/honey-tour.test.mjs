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

test('Honey-guided tour: JS engine functions, steps, faces, and positioning are defined', async () => {
  const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');
  // Core functions
  assert.match(appSource, /function startTour/);
  assert.match(appSource, /function endTour/);
  assert.match(appSource, /function tourShowStep/);
  assert.match(appSource, /function tourPositionTooltip/);
  assert.match(appSource, /function tourSetFace/);
  // Double rAF positioning fix
  assert.match(appSource, /requestAnimationFrame.*requestAnimationFrame/s);
  // Tour steps with face expressions
  assert.match(appSource, /const TOUR_STEPS/);
  assert.match(appSource, /face: 'wave'/);
  assert.match(appSource, /face: 'smile'/);
  assert.match(appSource, /face: 'think'/);
  assert.match(appSource, /face: 'happy'/);
  assert.match(appSource, /face: 'breathe'/);
  assert.match(appSource, /face: 'cozy'/);
  assert.match(appSource, /face: 'nod'/);
  assert.match(appSource, /face: 'wink'/);
  assert.match(appSource, /face: 'care'/);
  // Scroll then position delay
  assert.match(appSource, /positionDelay/);
  // First-visit & re-launch
  assert.match(appSource, /tourReadTourSeen/);
  assert.match(appSource, /igh-tour-seen/);
  assert.match(appSource, /ArrowRight/);
  assert.match(appSource, /ArrowLeft/);
  assert.match(appSource, /preferences\.motion/);
  assert.match(appSource, /tourLive\.textContent/);
});

test('Honey-guided tour: CSS has face animations and reduced-motion killswitch', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /honey-wave/);
  assert.match(css, /honey-bounce/);
  assert.match(css, /honey-breathe/);
  assert.match(css, /honey-cozy/);
  assert.match(css, /honey-nod/);
  assert.match(css, /honey-wink/);
  assert.match(css, /honey-care/);
  assert.match(css, /honey-think/);
  // Reduced-motion killswitch
  assert.match(css, /data-reduced-motion.*animation: none/s);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
