const supportPaths = {
  anxious: {
    reflection: 'It makes sense to want a little more steadiness. Would one of these feel supportive?',
    options: [
      ['breathe', '1 min', 'A slow reset', 'Let your breath settle into a kinder rhythm.'],
      ['ground', '2 min', 'Ground in the room', 'Notice a few simple things around you.'],
      ['next', '2 min', 'Make space for the next thing', 'Choose one gentle action before you continue.'],
    ],
  },
  overwhelmed: {
    reflection: 'You do not have to solve everything right now. Let’s make room for one manageable step.',
    options: [
      ['brain-dump', '3 min', 'A simple brain-dump', 'Put down what is circling in your mind.'],
      ['next', '2 min', 'One next step', 'Name one thing that would ease the weight a little.'],
      ['breathe', '1 min', 'A slow reset', 'Make one small pocket of space.'],
    ],
  },
  lonely: {
    reflection: 'Wanting connection is deeply human. You can take this at your own pace.',
    options: [
      ['connection', '2 min', 'Write a warm message', 'Make a draft for someone you trust - you decide whether to send it.'],
      ['ground', '2 min', 'Feel a little less alone', 'Let the room remind you that you are here.'],
      ['next', '5 min', 'Find your support circle', 'Choose one person or place that could feel caring.'],
    ],
  },
  tired: {
    reflection: 'You have been carrying a lot. Rest does not need to be earned.',
    options: [
      ['rest', '2 min', 'A permission slip to pause', 'Let yourself stop for one small breath.'],
      ['brain-dump', '4 min', 'Check in with your needs', 'Make room for what is asking for care.'],
      ['next', '2 min', 'Protect your remaining energy', 'Choose one gentle boundary for today.'],
    ],
  },
  unsure: {
    reflection: 'You do not need the perfect words. We can begin with what feels most possible.',
    options: [
      ['breathe', '1 min', 'Arrive where you are', 'A simple pause to notice your body and breath.'],
      ['ground', '2 min', 'Follow a gentle prompt', 'Bring your attention back to the present.'],
      ['brain-dump', '5 min', 'Explore a small support menu', 'Give a few words to what has been with you.'],
    ],
  },
};

const root = document.documentElement;
const supportDialog = document.querySelector('#support-dialog');
const reflectionDialog = document.querySelector('#reflection-dialog');
const urgentDialog = document.querySelector('#urgent-dialog');
const practiceDialog = document.querySelector('#practice-dialog');
const accessibilityDialog = document.querySelector('#accessibility-dialog');
const privacyDialog = document.querySelector('#privacy-dialog');
const teamDialog = document.querySelector('#team-dialog');
const supportReflection = document.querySelector('#support-reflection');
const supportOptions = document.querySelector('#support-options');
const practiceEyebrow = document.querySelector('#practice-eyebrow');
const practiceTitle = document.querySelector('#practice-title');
const practiceLede = document.querySelector('#practice-lede');
const practiceContent = document.querySelector('#practice-content');
const practiceFooter = document.querySelector('#practice-footer');
const completion = document.querySelector('#completion');
const chatDrawer = document.querySelector('#chat-drawer');
const chatMessages = document.querySelector('#chat-messages');
const chatInput = document.querySelector('#chat-input');
const createPrivateSpaceButton = document.querySelector('[data-create-private-space]');
const deletePrivateSpaceButton = document.querySelector('[data-delete-private-space]');
const confirmDeleteSpace = document.querySelector('[data-confirm-delete-space]');
const deleteSpaceConfirmRow = document.querySelector('.delete-space-confirm');
let breathingTimer;
let currentSupportState = 'unsure';

function readPreferences() {
  try { return JSON.parse(localStorage.getItem('igh-preferences')) || {}; } catch { return {}; }
}
function savePreferences(next) { localStorage.setItem('igh-preferences', JSON.stringify(next)); }
let preferences = { theme: 'system', textScale: 'default', contrast: false, motion: false, ...readPreferences() };

function readPrivateSpace() {
  try { return JSON.parse(sessionStorage.getItem('igh-private-space') || 'null'); } catch { return null; }
}
function removePrivateSpace() {
  try { sessionStorage.removeItem('igh-private-space'); } catch { /* The user still receives the server-side deletion result. */ }
}
function updatePrivateSpaceControls() {
  const active = Boolean(readPrivateSpace()?.access_token);
  createPrivateSpaceButton.hidden = active;
  deletePrivateSpaceButton.hidden = !active;
  deleteSpaceConfirmRow.hidden = !active;
  if (!active) confirmDeleteSpace.checked = false;
}

function applyPreferences() {
  const resolvedTheme = preferences.theme === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : preferences.theme;
  root.dataset.theme = resolvedTheme;
  root.dataset.textScale = preferences.textScale;
  root.dataset.highContrast = String(preferences.contrast);
  root.dataset.reducedMotion = String(preferences.motion);
  document.querySelectorAll('[data-theme]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.theme === preferences.theme)));
  document.querySelector('[data-setting="contrast"]').checked = preferences.contrast;
  document.querySelector('[data-setting="motion"]').checked = preferences.motion;
  document.querySelector('#text-size-status').textContent = preferences.textScale === 'default' ? 'Default' : preferences.textScale === 'large' ? 'Large' : 'Largest';
}
applyPreferences();
updatePrivateSpaceControls();

function showSupport(state) {
  currentSupportState = state;
  const path = supportPaths[state];
  supportReflection.textContent = path.reflection;
  supportOptions.replaceChildren(...path.options.map(([id, time, title, copy]) => {
    const option = document.createElement('button');
    option.type = 'button'; option.className = 'support-option';
    option.innerHTML = `<span class="option-time">${time}</span><span><span class="option-title">${title}</span><span class="option-copy">${copy}</span></span><span class="option-arrow" aria-hidden="true">→</span>`;
    option.addEventListener('click', () => openPractice(id));
    return option;
  }));
  supportDialog.showModal();
}

function closePractice() {
  window.clearInterval(breathingTimer);
  if (practiceDialog.open) practiceDialog.close();
}
function completeMoment() {
  closePractice(); supportDialog.close(); completion.hidden = false;
  window.setTimeout(() => { completion.hidden = true; }, 5000);
}

function practiceLayout({ eyebrow = 'A quiet practice', title, lede, content }) {
  practiceEyebrow.textContent = eyebrow;
  practiceTitle.textContent = title;
  practiceLede.textContent = lede;
  practiceContent.replaceChildren(content);
  practiceFooter.replaceChildren();
  const back = document.createElement('button');
  back.type = 'button'; back.className = 'secondary-button'; back.textContent = 'Back to choices';
  back.addEventListener('click', () => { closePractice(); showSupport(currentSupportState); });
  const done = document.createElement('button');
  done.type = 'button'; done.className = 'primary-button'; done.textContent = 'I’m done for now';
  done.addEventListener('click', completeMoment);
  practiceFooter.append(back, done);
}

function createBreathingPractice({ title = 'Breathe with the room', lede = 'Let your breath be natural. This is an invitation, not a test.' } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'breathing-practice';
  wrap.innerHTML = `<div class="breathe-orb" aria-hidden="true"><strong>1:00</strong></div><p class="breathe-instruction" role="status" aria-live="polite">When you’re ready, begin.</p><div class="breathe-controls"><button class="primary-button" type="button" data-breathe-start>Begin gently</button><button class="secondary-button" type="button" data-breathe-reset>Reset</button></div>`;
  practiceLayout({ title, lede, content: wrap });
  const orb = wrap.querySelector('.breathe-orb'); const time = orb.querySelector('strong'); const message = wrap.querySelector('.breathe-instruction'); const start = wrap.querySelector('[data-breathe-start]');
  let remaining = 60; let running = false;
  const display = () => { time.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`; };
  const reset = () => { window.clearInterval(breathingTimer); running = false; remaining = 60; display(); orb.classList.remove('is-breathing'); start.textContent = 'Begin gently'; message.textContent = 'When you’re ready, begin.'; };
  start.addEventListener('click', () => {
    if (running) { window.clearInterval(breathingTimer); running = false; orb.classList.remove('is-breathing'); start.textContent = 'Continue'; message.textContent = 'Pausing is okay.'; return; }
    running = true; orb.classList.add('is-breathing'); start.textContent = 'Pause'; message.textContent = 'Breathe in, slowly.';
    breathingTimer = window.setInterval(() => {
      remaining -= 1; display(); const phase = (60 - remaining) % 8;
      message.textContent = phase < 4 ? 'Breathe in, slowly.' : 'Let it go, slowly.';
      if (remaining <= 0) { window.clearInterval(breathingTimer); running = false; orb.classList.remove('is-breathing'); start.disabled = true; message.textContent = 'You gave yourself a minute. That matters.'; }
    }, 1000);
  });
  wrap.querySelector('[data-breathe-reset]').addEventListener('click', reset);
}

function createGroundingPractice() {
  const wrap = document.createElement('div'); wrap.className = 'grounding-practice';
  const steps = [[5, 'things you can see', 'Let your eyes rest on five ordinary things.'], [4, 'things you can feel', 'Notice texture, temperature, or support.'], [3, 'things you can hear', 'Listen without needing to name every sound.'], [2, 'things you can smell', 'Even clean air counts.'], [1, 'kind thing to tell yourself', 'Try words you would offer someone you care about.']];
  steps.forEach(([count, title, note]) => {
    const step = document.createElement('button'); step.type = 'button'; step.className = 'grounding-step'; step.setAttribute('aria-pressed', 'false');
    step.innerHTML = `<span class="grounding-count">${count}</span><span><strong>${title}</strong><small>${note}</small></span><span class="grounding-check" aria-hidden="true"></span>`;
    step.addEventListener('click', () => { const done = step.classList.toggle('is-complete'); step.setAttribute('aria-pressed', String(done)); step.querySelector('.grounding-check').textContent = done ? '✓' : ''; });
    wrap.append(step);
  });
  practiceLayout({ title: 'Come back to your senses', lede: 'Move through these in any order. You do not have to complete every one.', content: wrap });
}

function createBrainDumpPractice() {
  const wrap = document.createElement('div'); wrap.className = 'write-practice';
  wrap.innerHTML = `<label for="brain-dump-input">Let it spill out</label><textarea id="brain-dump-input" rows="6" maxlength="1600" placeholder="You can write in fragments. Nothing here leaves this browser."></textarea><p class="write-note">This writing is not saved when you close this practice.</p><button class="primary-button" type="button" data-sort-thoughts>Choose one gentle next step</button><div class="sort-result" hidden><span class="sort-label">One thing to hold softly</span><p class="next-step-output"></p><p class="write-note">You can leave the rest here for now.</p></div>`;
  wrap.querySelector('[data-sort-thoughts]').addEventListener('click', () => {
    const input = wrap.querySelector('textarea').value.trim(); const result = wrap.querySelector('.sort-result');
    const firstThought = input.split(/\n|[.!?]+/).map((item) => item.trim()).find(Boolean);
    result.querySelector('.next-step-output').textContent = firstThought ? `For now: ${firstThought}` : 'Try naming one thing that could wait until tomorrow.';
    result.hidden = false;
  });
  practiceLayout({ title: 'Let it out of your head', lede: 'You do not need to make this neat. Write what is here, then keep only one small thread.', content: wrap });
}

function createNextStepPractice() {
  const wrap = document.createElement('div'); wrap.className = 'write-practice';
  wrap.innerHTML = `<label for="next-step-input">What is one kind, possible next step?</label><textarea id="next-step-input" rows="4" maxlength="500" placeholder="For example: drink some water, step outside, send one message, or leave one thing for tomorrow."></textarea><p class="write-note">A small step counts. This stays in the moment and is not saved.</p>`;
  practiceLayout({ title: 'One small next step', lede: 'Choose something gentle enough that it could really happen - even on a hard day.', content: wrap });
}

function createConnectionPractice() {
  const wrap = document.createElement('div'); wrap.className = 'write-practice draft-practice';
  wrap.innerHTML = `<label for="connection-draft">A message draft</label><textarea id="connection-draft" rows="5" maxlength="500">Hey, I’ve been having a lot on my mind. If you have a few minutes sometime, I would really appreciate hearing a familiar voice.</textarea><p class="write-note">Edit this until it sounds like you. Copying it does not send anything.</p><button class="primary-button" type="button" data-copy-draft>Copy my draft</button><p class="copy-status" role="status" aria-live="polite"></p>`;
  wrap.querySelector('[data-copy-draft]').addEventListener('click', async () => {
    const status = wrap.querySelector('.copy-status'); const value = wrap.querySelector('textarea').value;
    try { await navigator.clipboard.writeText(value); status.textContent = 'Copied. You decide whether and when to send it.'; } catch { status.textContent = 'Select and copy the draft whenever you are ready.'; }
  });
  practiceLayout({ title: 'Write a warm message', lede: 'Connection can start quietly. This is only a draft - you remain in control.', content: wrap });
}

function openPractice(id) {
  supportDialog.close();
  if (id === 'breathe') createBreathingPractice();
  else if (id === 'ground') createGroundingPractice();
  else if (id === 'brain-dump') createBrainDumpPractice();
  else if (id === 'connection') createConnectionPractice();
  else if (id === 'rest') createBreathingPractice({ title: 'A permission slip to pause', lede: 'For the next minute, nothing needs to be solved. Let this be a small place to rest.' });
  else createNextStepPractice();
  practiceDialog.showModal();
}

function closeChat() { chatDrawer.hidden = true; document.querySelector('[data-open-chat]').focus(); }
function openChat() { chatDrawer.hidden = false; chatInput.focus(); }
function addMessage(text, kind = 'assistant') { const message = document.createElement('article'); message.className = `message ${kind}`; message.textContent = text; chatMessages.append(message); chatMessages.scrollTop = chatMessages.scrollHeight; return message; }

document.querySelectorAll('[data-state]').forEach((button) => button.addEventListener('click', () => showSupport(button.dataset.state)));
document.querySelectorAll('[data-practice]').forEach((button) => button.addEventListener('click', () => openPractice(button.dataset.practice)));
document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('[data-open-reflection]').forEach((button) => button.addEventListener('click', () => { urgentDialog.close(); reflectionDialog.showModal(); }));
document.querySelectorAll('[data-open-urgent]').forEach((button) => button.addEventListener('click', () => urgentDialog.showModal()));
document.querySelector('[data-back]').addEventListener('click', () => supportDialog.close());
document.querySelector('[data-reflect]').addEventListener('click', () => { const reflection = document.querySelector('#reflection-input').value.trim(); reflectionDialog.close(); showSupport('unsure'); if (reflection) supportReflection.textContent = 'Thank you for putting that into words. You do not have to carry it all at once. Which of these feels possible?'; });
[supportDialog, reflectionDialog, urgentDialog, practiceDialog, accessibilityDialog, privacyDialog, teamDialog].forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));
practiceDialog.addEventListener('close', () => window.clearInterval(breathingTimer));

document.querySelector('[data-open-accessibility]').addEventListener('click', () => accessibilityDialog.showModal());
document.querySelector('[data-open-privacy]').addEventListener('click', () => { updatePrivateSpaceControls(); privacyDialog.showModal(); });
document.querySelectorAll('[data-theme]').forEach((button) => button.addEventListener('click', () => { preferences.theme = button.dataset.theme; savePreferences(preferences); applyPreferences(); }));
document.querySelectorAll('[data-text-size]').forEach((button) => button.addEventListener('click', () => {
  const scales = ['default', 'large', 'larger']; let index = scales.indexOf(preferences.textScale);
  index = Math.max(0, Math.min(scales.length - 1, index + (button.dataset.textSize === 'increase' ? 1 : -1)));
  preferences.textScale = scales[index]; savePreferences(preferences); applyPreferences();
}));
document.querySelector('[data-setting="contrast"]').addEventListener('change', (event) => { preferences.contrast = event.target.checked; savePreferences(preferences); applyPreferences(); });
document.querySelector('[data-setting="motion"]').addEventListener('change', (event) => { preferences.motion = event.target.checked; savePreferences(preferences); applyPreferences(); });

document.querySelector('[data-open-chat]').addEventListener('click', openChat);
document.querySelector('[data-close-chat]').addEventListener('click', closeChat);
document.querySelectorAll('[data-open-team]').forEach((button) => button.addEventListener('click', () => { closeChat(); teamDialog.showModal(); }));
document.querySelectorAll('[data-chat-prompt]').forEach((button) => button.addEventListener('click', () => { chatInput.value = button.dataset.chatPrompt; document.querySelector('#chat-form').requestSubmit(); }));

document.querySelector('#chat-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const text = chatInput.value.trim(); if (!text) return;
  addMessage(text, 'user'); chatInput.value = ''; const pending = addMessage('Honey is thinking…', 'loading');
  try {
    const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text }) });
    const result = await response.json(); pending.remove();
    if (!response.ok) throw new Error(result.error || 'Chat is unavailable.');
    addMessage(result.message);
    if (result.type === 'urgent') urgentDialog.showModal();
  } catch { pending.remove(); addMessage('Honey’s live chat connection is not available just yet. You can still choose a gentle support path here or request a check-in with the team.'); }
});

document.querySelector('#team-support-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget; const status = document.querySelector('#team-form-status'); const submit = form.querySelector('[type="submit"]');
  const payload = { name: form.name.value.trim(), contact: form.contact.value.trim(), note: form.note.value.trim(), consent: form.consent.checked };
  submit.disabled = true; status.textContent = 'Sending your request…';
  try {
    const response = await fetch('/api/support-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json(); if (!response.ok) throw new Error(result.error || 'We could not send your request.');
    form.reset(); status.textContent = 'Your request is received. A team member will respond through the contact method you shared, when available.';
  } catch { status.textContent = 'Requests are not connected yet. Please try again later or use the support tools in the app.'; }
  finally { submit.disabled = false; }
});

createPrivateSpaceButton.addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const status = document.querySelector('#private-space-status');
  if (readPrivateSpace()?.access_token) {
    status.textContent = 'Your private space is already ready in this browser session.';
    return;
  }
  button.disabled = true; status.textContent = 'Creating your private space…';
  try {
    const response = await fetch('/api/private-account', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.session?.access_token) throw new Error(result.error || 'Private spaces are not available yet.');
    try { sessionStorage.setItem('igh-private-space', JSON.stringify(result.session)); } catch { throw new Error('Your browser is blocking the private-space session. You can still use every support tool without an account.'); }
    updatePrivateSpaceControls();
    status.textContent = 'Your private space is ready for this browser session. No name, email, phone number, or wellness profile was requested.';
  } catch (error) {
    status.textContent = error.message || 'Private spaces are not available yet. You can still use every support tool without an account.';
    button.disabled = false;
  }
});

deletePrivateSpaceButton.addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const status = document.querySelector('#private-space-status');
  const space = readPrivateSpace();
  if (!confirmDeleteSpace.checked) { status.textContent = 'Please confirm that you understand deletion cannot be undone.'; return; }
  if (!space?.access_token) { updatePrivateSpaceControls(); status.textContent = 'There is no private space in this browser session.'; return; }
  button.disabled = true; status.textContent = 'Deleting your private space…';
  try {
    const response = await fetch('/api/private-account', { method: 'DELETE', headers: { Authorization: `Bearer ${space.access_token}` } });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'We could not delete your private space.');
    removePrivateSpace(); updatePrivateSpaceControls();
    status.textContent = 'Your private space has been deleted. The support tools remain available without an account.';
  } catch (error) {
    status.textContent = error.message || 'We could not delete your private space. Please try again.';
  } finally { button.disabled = false; }
});
