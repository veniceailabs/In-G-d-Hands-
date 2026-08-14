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
      ['movement', '2 min', 'Make one gentle shift', 'Move in whatever small way feels comfortable for your body.'],
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
const resourcesDialog = document.querySelector('#resources-dialog');
const teamDialog = document.querySelector('#team-dialog');
const teamSupportForm = document.querySelector('#team-support-form');
const teamSupportStatus = document.querySelector('#team-form-status');
const teamSupportSubmit = document.querySelector('[data-team-submit]');
const withdrawTeamRequestButton = document.querySelector('[data-withdraw-team-request]');
const supportReflection = document.querySelector('#support-reflection');
const supportOptions = document.querySelector('#support-options');
const practiceEyebrow = document.querySelector('#practice-eyebrow');
const practiceTitle = document.querySelector('#practice-title');
const practiceLede = document.querySelector('#practice-lede');
const practiceContent = document.querySelector('#practice-content');
const practiceFooter = document.querySelector('#practice-footer');
const completion = document.querySelector('#completion');
const reminderDialog = document.querySelector('#reminder-dialog');
const reminderForm = document.querySelector('#reminder-form');
const reminderDateTime = document.querySelector('#reminder-date-time');
const reminderStatus = document.querySelector('#reminder-status');
const chatDrawer = document.querySelector('#chat-drawer');
const chatOpeners = [...document.querySelectorAll('[data-open-chat]')];
const chatMessages = document.querySelector('#chat-messages');
const chatInput = document.querySelector('#chat-input');
const sendChatButton = document.querySelector('[data-send-chat]');
const createPrivateSpaceButton = document.querySelector('[data-create-private-space]');
const deletePrivateSpaceButton = document.querySelector('[data-delete-private-space]');
const confirmDeleteSpace = document.querySelector('[data-confirm-delete-space]');
const deleteSpaceConfirmRow = document.querySelector('.delete-space-confirm');
let breathingTimer;
let currentSupportState = 'unsure';
let chatHistory = [];
let honeyIsResponding = false;
let teamSupportAvailable = false;
let teamRequestCreationLocked = false;
let lastChatOpener = chatOpeners[0];
const honeyGreeting = 'Hi, I’m Honey. I can sit with you for a moment, help you find a small next step, or help you request a check-in with the team. What feels most helpful right now?';

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
function readTeamRequest() {
  try { return JSON.parse(sessionStorage.getItem('igh-team-request') || 'null'); } catch { return null; }
}
function removeTeamRequest() {
  try { sessionStorage.removeItem('igh-team-request'); } catch { /* The request remains protected by its server-side token. */ }
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
  root.style.colorScheme = resolvedTheme;
  root.dataset.textScale = preferences.textScale;
  root.dataset.highContrast = String(preferences.contrast);
  root.dataset.reducedMotion = String(preferences.motion);
  const themeColor = preferences.contrast ? (resolvedTheme === 'dark' ? '#000000' : '#ffffff') : (resolvedTheme === 'dark' ? '#13242d' : '#f5f1ea');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
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
  const reminder = document.createElement('button');
  reminder.type = 'button'; reminder.className = 'secondary-button practice-reminder'; reminder.textContent = 'Set a private reminder';
  reminder.addEventListener('click', openReminder);
  practiceFooter.append(back, reminder, done);
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
  wrap.innerHTML = `<label for="brain-dump-input">Let it spill out</label><textarea id="brain-dump-input" rows="6" maxlength="1600" placeholder="You can write in fragments. Nothing here leaves this browser." autocomplete="off" autocorrect="off" spellcheck="false"></textarea><p class="write-note">This writing is not saved when you close this practice.</p><button class="primary-button" type="button" data-sort-thoughts>Make one thing smaller</button><div class="sort-result" hidden><span class="sort-label">Choose a lane for one thought</span><p class="next-step-output"></p><div class="thought-actions" role="group" aria-label="Choose what to do with this thought"><button type="button" data-thought-path="now" aria-pressed="false">Do one small part</button><button type="button" data-thought-path="plan" aria-pressed="false">Put it in a plan</button><button type="button" data-thought-path="release" aria-pressed="false">Let it wait</button></div><p class="copy-status" role="status" aria-live="polite"></p><p class="write-note">This choice stays here. You can leave everything else for now.</p></div>`;
  wrap.querySelector('[data-sort-thoughts]').addEventListener('click', () => {
    const input = wrap.querySelector('textarea').value.trim(); const result = wrap.querySelector('.sort-result');
    const firstThought = input.split(/\n|[.!?]+/).map((item) => item.trim()).find(Boolean);
    result.querySelector('.next-step-output').textContent = firstThought ? `For now: ${firstThought}` : 'Try naming one thing that could wait until tomorrow.';
    result.querySelector('.copy-status').textContent = '';
    result.hidden = false;
  });
  wrap.querySelectorAll('[data-thought-path]').forEach((button) => button.addEventListener('click', () => {
    const choices = { now: 'You chose one small part. Let that be enough for this moment.', plan: 'You chose to put it in a plan. It does not all need your attention right now.', release: 'You chose to let it wait. You are allowed to set something down for now.' };
    wrap.querySelectorAll('[data-thought-path]').forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
    wrap.querySelector('.copy-status').textContent = choices[button.dataset.thoughtPath];
  }));
  practiceLayout({ title: 'Let it out of your head', lede: 'You do not need to make this neat. Write what is here, then keep only one small thread.', content: wrap });
}

function createNextStepPractice() {
  const wrap = document.createElement('div'); wrap.className = 'write-practice';
  wrap.innerHTML = `<label for="next-step-input">What is one kind, possible next step?</label><textarea id="next-step-input" rows="4" maxlength="500" placeholder="For example: drink some water, step outside, send one message, or leave one thing for tomorrow." autocomplete="off" autocorrect="off" spellcheck="false"></textarea><p class="write-note">A small step counts. This stays in the moment and is not saved.</p>`;
  practiceLayout({ title: 'One small next step', lede: 'Choose something gentle enough that it could really happen - even on a hard day.', content: wrap });
}

function createConnectionPractice() {
  const wrap = document.createElement('div'); wrap.className = 'write-practice draft-practice';
  wrap.innerHTML = `<label for="connection-draft">A message draft</label><textarea id="connection-draft" rows="5" maxlength="500" autocomplete="off" autocorrect="off" spellcheck="false">Hey, I’ve been having a lot on my mind. If you have a few minutes sometime, I would really appreciate hearing a familiar voice.</textarea><p class="write-note">Edit this until it sounds like you. Copying it does not send anything.</p><button class="primary-button" type="button" data-copy-draft>Copy my draft</button><p class="copy-status" role="status" aria-live="polite"></p>`;
  wrap.querySelector('[data-copy-draft]').addEventListener('click', async () => {
    const status = wrap.querySelector('.copy-status'); const value = wrap.querySelector('textarea').value;
    try { await navigator.clipboard.writeText(value); status.textContent = 'Copied. You decide whether and when to send it.'; } catch { status.textContent = 'Select and copy the draft whenever you are ready.'; }
  });
  practiceLayout({ title: 'Write a warm message', lede: 'Connection can start quietly. This is only a draft - you remain in control.', content: wrap });
}

function createMovementPractice() {
  const wrap = document.createElement('div'); wrap.className = 'movement-practice';
  const steps = [
    ['Notice your support', 'Feel the chair, floor, bed, or anything already holding you.'],
    ['Make one small adjustment', 'Soften your jaw, lower your shoulders, or shift your hands if that feels comfortable.'],
    ['Choose your own motion', 'Stretch, reach, roll a shoulder, move a finger, or stay still. Your body gets the final say.'],
  ];
  steps.forEach(([title, note]) => {
    const step = document.createElement('button'); step.type = 'button'; step.className = 'movement-step'; step.setAttribute('aria-pressed', 'false');
    step.innerHTML = `<span class="movement-check" aria-hidden="true"></span><span><strong>${title}</strong><small>${note}</small></span>`;
    step.addEventListener('click', () => { const done = step.classList.toggle('is-complete'); step.setAttribute('aria-pressed', String(done)); step.querySelector('.movement-check').textContent = done ? '✓' : ''; });
    wrap.append(step);
  });
  const note = document.createElement('p'); note.className = 'write-note'; note.textContent = 'Skip any prompt that does not feel right for your body. Nothing needs to be completed.'; wrap.append(note);
  practiceLayout({ title: 'Make one gentle shift', lede: 'This is not exercise. It is simply an invitation to notice or move in a way that feels available.', content: wrap });
}

function localCalendarTime(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}
function openReminder() {
  const tomorrowEvening = new Date(); tomorrowEvening.setDate(tomorrowEvening.getDate() + 1); tomorrowEvening.setHours(19, 0, 0, 0);
  const pad = (value) => String(value).padStart(2, '0');
  reminderDateTime.value = `${tomorrowEvening.getFullYear()}-${pad(tomorrowEvening.getMonth() + 1)}-${pad(tomorrowEvening.getDate())}T${pad(tomorrowEvening.getHours())}:${pad(tomorrowEvening.getMinutes())}`;
  reminderStatus.textContent = '';
  reminderDialog.showModal();
}

function openPractice(id) {
  supportDialog.close();
  if (id === 'breathe') createBreathingPractice();
  else if (id === 'ground') createGroundingPractice();
  else if (id === 'brain-dump') createBrainDumpPractice();
  else if (id === 'connection') createConnectionPractice();
  else if (id === 'movement') createMovementPractice();
  else if (id === 'rest') createBreathingPractice({ title: 'A permission slip to pause', lede: 'For the next minute, nothing needs to be solved. Let this be a small place to rest.' });
  else createNextStepPractice();
  practiceDialog.showModal();
}

function closeChat({ restoreFocus = true } = {}) {
  chatDrawer.hidden = true;
  chatOpeners.forEach((button) => button.setAttribute('aria-expanded', 'false'));
  if (restoreFocus) lastChatOpener?.focus();
}
function openChat(event) {
  lastChatOpener = event.currentTarget;
  chatDrawer.hidden = false;
  chatOpeners.forEach((button) => button.setAttribute('aria-expanded', 'true'));
  chatInput.focus();
}
function setTeamSupportEnabled(enabled) {
  const hasPendingRequest = Boolean(readTeamRequest()?.id && readTeamRequest()?.token);
  teamSupportForm.querySelectorAll('input, textarea').forEach((field) => { field.disabled = !enabled || hasPendingRequest || teamRequestCreationLocked; });
  teamSupportSubmit.disabled = !enabled || hasPendingRequest || teamRequestCreationLocked;
  withdrawTeamRequestButton.hidden = !hasPendingRequest;
}
async function openTeamSupport() {
  teamSupportAvailable = false;
  setTeamSupportEnabled(false);
  teamSupportStatus.textContent = 'Checking whether a team check-in is available…';
  teamDialog.showModal();
  try {
    const response = await fetch('/api/support-request', { headers: { Accept: 'application/json' }, cache: 'no-store' });
    const result = await response.json().catch(() => ({}));
    teamSupportAvailable = response.ok && result.available === true;
  } catch { teamSupportAvailable = false; }
  if (teamSupportAvailable) {
    setTeamSupportEnabled(true);
    teamSupportStatus.textContent = readTeamRequest() ? 'You have a request in this browser session. You can withdraw it below; a response time is not promised.' : 'The request form is available. Share only what feels right; a response time is not promised.';
  } else {
    teamSupportStatus.textContent = 'Team check-ins are not available right now. You can still use the private support tools or Find A Helpline.';
  }
}
function addMessage(text, kind = 'assistant') { const message = document.createElement('article'); message.className = `message ${kind}`; message.textContent = text; chatMessages.append(message); chatMessages.scrollTop = chatMessages.scrollHeight; return message; }
function addProfessionalResourceAction() {
  const action = document.createElement('button'); action.type = 'button'; action.className = 'chat-resource-action'; action.textContent = 'Find more support';
  action.addEventListener('click', () => { closeChat(); resourcesDialog.showModal(); });
  chatMessages.append(action); chatMessages.scrollTop = chatMessages.scrollHeight;
}
function clearChat() {
  chatHistory = [];
  chatMessages.replaceChildren();
  addMessage(honeyGreeting);
  chatInput.value = '';
  addMessage('This conversation has been cleared from this page.', 'loading');
}

document.querySelectorAll('[data-state]').forEach((button) => button.addEventListener('click', () => showSupport(button.dataset.state)));
document.querySelectorAll('[data-practice]').forEach((button) => button.addEventListener('click', () => openPractice(button.dataset.practice)));
document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('[data-open-reflection]').forEach((button) => button.addEventListener('click', () => { urgentDialog.close(); reflectionDialog.showModal(); }));
document.querySelectorAll('[data-open-urgent]').forEach((button) => button.addEventListener('click', () => urgentDialog.showModal()));
document.querySelector('[data-back]').addEventListener('click', () => supportDialog.close());
document.querySelector('[data-reflect]').addEventListener('click', () => { const reflection = document.querySelector('#reflection-input').value.trim(); reflectionDialog.close(); showSupport('unsure'); if (reflection) supportReflection.textContent = 'Thank you for putting that into words. You do not have to carry it all at once. Which of these feels possible?'; });
[supportDialog, reflectionDialog, urgentDialog, practiceDialog, accessibilityDialog, privacyDialog, resourcesDialog, teamDialog, reminderDialog].forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));
practiceDialog.addEventListener('close', () => window.clearInterval(breathingTimer));

document.querySelector('[data-open-accessibility]').addEventListener('click', () => accessibilityDialog.showModal());
document.querySelector('[data-open-privacy]').addEventListener('click', () => { updatePrivateSpaceControls(); privacyDialog.showModal(); });
document.querySelector('[data-open-resources]').addEventListener('click', () => resourcesDialog.showModal());
document.querySelector('[data-open-connection-draft]').addEventListener('click', () => { resourcesDialog.close(); openPractice('connection'); });
document.querySelector('[data-open-team-from-resources]').addEventListener('click', () => { resourcesDialog.close(); openTeamSupport(); });
document.querySelectorAll('[data-theme]').forEach((button) => button.addEventListener('click', () => { preferences.theme = button.dataset.theme; savePreferences(preferences); applyPreferences(); }));
document.querySelectorAll('[data-text-size]').forEach((button) => button.addEventListener('click', () => {
  const scales = ['default', 'large', 'larger']; let index = scales.indexOf(preferences.textScale);
  index = Math.max(0, Math.min(scales.length - 1, index + (button.dataset.textSize === 'increase' ? 1 : -1)));
  preferences.textScale = scales[index]; savePreferences(preferences); applyPreferences();
}));
document.querySelector('[data-setting="contrast"]').addEventListener('change', (event) => { preferences.contrast = event.target.checked; savePreferences(preferences); applyPreferences(); });
document.querySelector('[data-setting="motion"]').addEventListener('change', (event) => { preferences.motion = event.target.checked; savePreferences(preferences); applyPreferences(); });

reminderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const date = new Date(reminderDateTime.value);
  if (Number.isNaN(date.getTime())) { reminderStatus.textContent = 'Choose a time that works for you.'; return; }
  const endsAt = new Date(date.getTime() + (15 * 60 * 1000));
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const uid = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const calendar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//In Göd Hands//A quiet moment//EN', 'BEGIN:VEVENT', `UID:igh-${uid}@in-god-hands`, `DTSTAMP:${stamp}`, `DTSTART:${localCalendarTime(date)}`, `DTEND:${localCalendarTime(endsAt)}`, 'SUMMARY:A quiet moment', 'DESCRIPTION:A private reminder you chose for yourself.', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
  const download = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a'); link.href = download; link.download = 'a-quiet-moment.ics'; document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(download), 1000);
  reminderStatus.textContent = 'Your private calendar reminder is ready to add. In Göd Hands did not save it.';
});

chatOpeners.forEach((button) => button.addEventListener('click', openChat));
document.querySelector('[data-close-chat]').addEventListener('click', closeChat);
document.querySelector('[data-clear-chat]').addEventListener('click', clearChat);
document.querySelectorAll('[data-open-team]').forEach((button) => button.addEventListener('click', () => { closeChat({ restoreFocus: false }); openTeamSupport(); }));
document.querySelectorAll('[data-chat-prompt]').forEach((button) => button.addEventListener('click', () => { chatInput.value = button.dataset.chatPrompt; document.querySelector('#chat-form').requestSubmit(); }));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !chatDrawer.hidden) closeChat(); });

document.querySelector('#chat-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const text = chatInput.value.trim(); if (!text || honeyIsResponding) return;
  honeyIsResponding = true; sendChatButton.disabled = true;
  addMessage(text, 'user'); chatInput.value = ''; const pending = addMessage('Honey is thinking…', 'loading');
  const gentleWait = window.setTimeout(() => { if (pending.isConnected) pending.textContent = 'Honey is taking a little longer. A gentle next step is on its way…'; }, 7000);
  try {
    const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, history: chatHistory.slice(-6) }) });
    const result = await response.json(); pending.remove();
    if (!response.ok) throw new Error(result.error || 'Chat is unavailable.');
    addMessage(result.message);
    chatHistory.push({ role: 'user', content: text }, { role: 'assistant', content: result.message });
    chatHistory = chatHistory.slice(-8);
    if (result.type === 'urgent') urgentDialog.showModal();
    if (result.type === 'professional') addProfessionalResourceAction();
  } catch { pending.remove(); const fallback = 'Honey’s live chat connection is not available just yet. You can still choose a gentle support path here or request a check-in with the team.'; addMessage(fallback); chatHistory.push({ role: 'user', content: text }, { role: 'assistant', content: fallback }); chatHistory = chatHistory.slice(-8); }
  finally { window.clearTimeout(gentleWait); honeyIsResponding = false; sendChatButton.disabled = false; }
});

teamSupportForm.addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget; const status = teamSupportStatus; const submit = teamSupportSubmit;
  if (!teamSupportAvailable || readTeamRequest() || teamRequestCreationLocked) { status.textContent = 'This request form is not available right now. Please use the support tools in the app or Find A Helpline.'; return; }
  const payload = { name: form.name.value.trim(), contact: form.contact.value.trim(), note: form.note.value.trim(), consent: form.consent.checked };
  submit.disabled = true; status.textContent = 'Sending your request…';
  try {
    const response = await fetch('/api/support-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json(); if (!response.ok) throw new Error(result.error || 'We could not send your request.');
    if (!result.withdrawal?.id || !result.withdrawal?.token) throw new Error('Your request could not be prepared for withdrawal control.');
    teamRequestCreationLocked = true;
    try { sessionStorage.setItem('igh-team-request', JSON.stringify(result.withdrawal)); } catch {
      setTeamSupportEnabled(true);
      status.textContent = 'Your request is received. This browser could not keep the withdrawal control, so please do not submit another request from this browser.';
      return;
    }
    form.reset(); setTeamSupportEnabled(true); status.textContent = 'Your request is received. A team member may respond through the contact method you shared. You can withdraw this request from this browser session.';
  } catch (error) { status.textContent = error.message || 'Requests are not connected yet. Please try again later or use the support tools in the app.'; }
  finally { setTeamSupportEnabled(teamSupportAvailable); }
});

withdrawTeamRequestButton.addEventListener('click', async () => {
  const request = readTeamRequest();
  if (!request?.id || !request?.token) { removeTeamRequest(); teamRequestCreationLocked = false; setTeamSupportEnabled(teamSupportAvailable); teamSupportStatus.textContent = 'There is no request from this browser session to withdraw.'; return; }
  withdrawTeamRequestButton.disabled = true; teamSupportStatus.textContent = 'Withdrawing your request…';
  try {
    const response = await fetch('/api/support-request', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.withdrawn) throw new Error(result.error || 'Your request could not be withdrawn.');
    removeTeamRequest(); teamRequestCreationLocked = false; setTeamSupportEnabled(teamSupportAvailable); teamSupportStatus.textContent = 'Your request has been withdrawn from the team queue.';
  } catch (error) { teamSupportStatus.textContent = error.message || 'Your request could not be withdrawn right now.'; }
  finally { withdrawTeamRequestButton.disabled = false; }
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
