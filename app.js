const supportPaths = {
  anxious: {
    orient: 'When thoughts feel loud, a short pause can create just enough distance to breathe.',
    reflection: 'It makes sense to want a little more steadiness. Would one of these feel supportive?',
    options: [
      ['breathe', '1 min', 'A slow reset', 'Let your breath settle into a kinder rhythm.', 'Slow breathing activates the body\'s natural calm response and can quiet a racing mind within minutes.'],
      ['ground', '2 min', 'Ground in the room', 'Notice a few simple things around you.', 'Grounding exercises gently redirect attention outward, which can interrupt anxious thought loops.'],
      ['next', '2 min', 'Make space for the next thing', 'Choose one gentle action before you continue.', 'Naming one small, possible step gives a busy mind something concrete to hold onto.'],
    ],
  },
  overwhelmed: {
    orient: 'Feeling overwhelmed often means you are carrying more than anyone should carry alone. These tools are here to make one small corner feel a little lighter, not to fix everything.',
    reflection: 'You do not have to solve everything right now. Let\'s make room for one manageable step.',
    options: [
      ['brain-dump', '3 min', 'A simple brain-dump', 'Put down what is circling in your mind.', 'Getting thoughts out of your head and onto a page can immediately reduce the mental pressure of holding everything at once.'],
      ['movement', '2 min', 'A gentle body shift', 'Release some tension with a small, easy movement.', 'When we\'re overwhelmed, physical tension builds without our noticing. A gentle movement can offer unexpected relief.'],
      ['breathe', '1 min', 'A slow reset', 'Make one small pocket of space.', 'Slow breathing activates the body\'s natural calm response and can quiet a racing mind within minutes.'],
    ],
  },
  lonely: {
    orient: 'Loneliness and disconnection are among the most common human experiences, and often among the quietest to name. You\'re not alone in feeling this.',
    reflection: 'Wanting connection is deeply human. You can take this at your own pace.',
    options: [
      ['check-in', '5 min', 'Request a human check-in', 'Connect with our team when you want someone to listen.', 'Sometimes nothing replaces a real person. A team check-in lets you share what\'s on your mind at a pace that feels right.'],
      ['connection', '2 min', 'Write a warm message', 'Make a draft for someone you trust. You decide whether to send it.', 'Preparing words in private first can make reaching out feel much less daunting.'],
      ['ground', '2 min', 'Feel a little less alone', 'Let the room remind you that you are here.', 'Grounding in your immediate surroundings can soften the feeling of isolation, even briefly.'],
    ],
  },
  tired: {
    orient: 'Exhaustion is your body and mind signalling that something matters and has been given a lot. These are small options, and none of them require more than you have right now.',
    reflection: 'You have been carrying a lot. Rest does not need to be earned.',
    options: [
      ['rest', '2 min', 'A permission slip to pause', 'Let yourself stop for one small breath.', 'Sometimes what we need most is explicit permission to stop, even just for a minute.'],
      ['movement', '2 min', 'Make one gentle shift', 'Move in whatever small way feels comfortable for your body.', 'A small physical shift, like softening your shoulders or unclenching a hand, can signal safety to a tired nervous system.'],
      ['next', '2 min', 'Protect your remaining energy', 'Choose one gentle boundary for today.', 'Identifying one thing you can set aside protects the energy you still have.'],
    ],
  },
  unsure: {
    orient: 'Not knowing exactly what you\'re feeling is completely valid. You don\'t need to name it perfectly to find something that helps.',
    reflection: 'You do not need the perfect words. We can begin with what feels most possible.',
    options: [
      ['breathe', '1 min', 'Arrive where you are', 'A simple pause to notice your body and breath.', 'Breathing is always a safe place to start when you\'re unsure where to begin.'],
      ['ground', '2 min', 'Follow a gentle prompt', 'Bring your attention back to the present.', 'Grounding gently anchors awareness in the present moment, which can make whatever you\'re feeling more manageable.'],
      ['brain-dump', '5 min', 'Explore a small support menu', 'Give a few words to what has been with you.', 'Free-writing without an agenda often reveals what is most present, without needing to know it in advance.'],
    ],
  },
};


const root = document.documentElement;
const connectionNotice = document.querySelector('#connection-notice');
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
const completionDialog = document.querySelector('#completion-dialog');
const completionStatus = document.querySelector('#completion-status');
const completionChoices = [...document.querySelectorAll('[data-completion-feeling]')];
const anonymousFeedbackSetting = document.querySelector('[data-setting="anonymous-feedback"]');
const completionFeedbackNote = document.querySelector('#completion-feedback-note');
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
const privateSpaceCheck = document.querySelector('#private-space-check');
const privateSpaceTurnstile = document.querySelector('#private-space-turnstile');
const cancelPrivateSpaceButton = document.querySelector('[data-cancel-private-space]');
const calmSoundButton = document.querySelector('#calm-sound-button');
const calmSoundToggle = document.querySelector('#calm-sound-toggle');
const calmSoundVolumeSlider = document.querySelector('#calm-sound-volume');
const journalDialog = document.querySelector('#journal-dialog');
const journalConfirmDialog = document.querySelector('#journal-confirm-dialog');
const journalDiscardCloseButton = document.querySelector('#journal-discard-close-button');
const journalKeepWritingButton = document.querySelector('#journal-keep-writing-button');
const journalCloseConfirmButton = document.querySelector('[data-close-confirm]');
const journalOpenButtons = [...document.querySelectorAll('[data-open-journal]')];
const journalTextarea = document.querySelector('#journal-entry');
const journalPencil = document.querySelector('#journal-pencil');
const journalCopyButton = document.querySelector('#journal-copy-button');
const journalWordCount = document.querySelector('#journal-word-count');
const journalSaveButton = document.querySelector('#journal-save-button');
const journalStatus = document.querySelector('#journal-status');
const journalLocked = document.querySelector('#journal-locked');
const journalOpenPrivacyButton = document.querySelector('#journal-open-privacy');
const journalEntriesSection = document.querySelector('#journal-entries');
const journalEntryList = document.querySelector('#journal-entry-list');
const journalEraseButton = document.querySelector('#journal-erase-button');
const journalVoiceButton = document.querySelector('#journal-voice-button');
const journalVoiceNote = document.querySelector('#journal-voice-note');
const journalSoundToggle = document.querySelector('#journal-sound-toggle');
let breathingTimer;
let activePracticeVoice;
let activePracticeVoiceButton;
let currentSupportState = 'unsure';
let currentPractice = 'next';
let completionFeeling = '';
let completionFeedbackSent = false;
let chatHistory = [];
let honeyIsResponding = false;
let teamSupportAvailable = false;
let teamRequestCreationLocked = false;
let lastChatOpener = chatOpeners[0];
let turnstileScriptPromise;
let turnstileWidgetId;
let calmAudioContext;
let calmMasterGain;
let calmOscillators = [];
let calmSoundStarted = false;
let calmSoundStarting = false;
let journalConfigPromise;
let journalEraseArmed = false;
let journalEraseResetTimer;
let journalVoiceRecognition;
let journalVoiceActive = false;
let lastPencilSoundAt = 0;
const honeyGreeting = 'Hi, I’m Honey. I can sit with you for a moment, help you find a small next step, or help you request a check-in with the team. What feels most helpful right now?';

/* ─── Tour DOM elements ─── */
const tourInvite = document.querySelector('#tour-invite');
const tourInviteStart = document.querySelector('#tour-invite-start');
const tourInviteSkip = document.querySelector('#tour-invite-skip');
const tourOverlay = document.querySelector('#tour-overlay');
const tourTooltip = document.querySelector('#tour-tooltip');
const tourStepCounter = document.querySelector('#tour-step-counter');
const tourTitle = document.querySelector('#tour-tooltip-title');
const tourBody = document.querySelector('#tour-tooltip-body');
const tourPrevBtn = document.querySelector('#tour-prev');
const tourNextBtn = document.querySelector('#tour-next');
const tourEndBtn = document.querySelector('#tour-end');
const tourLive = document.querySelector('#tour-live');
const tourLaunchButton = document.querySelector('#tour-launch-button');
let tourCurrentStep = 0;
let tourActive = false;
let tourHighlightedEl = null;

function readPreferences() {
  try { return JSON.parse(localStorage.getItem('igh-preferences')) || {}; } catch { return {}; }
}
function savePreferences(next) { localStorage.setItem('igh-preferences', JSON.stringify(next)); }
let preferences = { theme: 'system', textScale: 'default', contrast: false, motion: false, anonymousFeedback: false, calmSound: true, soundType: 'handpan', calmVolume: 22, journalSound: true, ...readPreferences() };

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
function clearPrivateSpaceCheck() {
  if (turnstileWidgetId !== undefined && window.turnstile?.remove) window.turnstile.remove(turnstileWidgetId);
  turnstileWidgetId = undefined;
  privateSpaceTurnstile.replaceChildren();
  privateSpaceCheck.hidden = true;
}

function updatePrivateSpaceControls() {
  const active = Boolean(readPrivateSpace()?.access_token);
  createPrivateSpaceButton.hidden = active;
  deletePrivateSpaceButton.hidden = !active;
  deleteSpaceConfirmRow.hidden = !active;
  if (active) clearPrivateSpaceCheck();
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
  document.querySelectorAll('button[data-theme]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.theme === preferences.theme)));
  function setChecked(selector, val) { const el = document.querySelector(selector); if (el && el.checked !== val) el.checked = val; }
  setChecked('[data-setting="contrast"]', preferences.contrast);
  setChecked('[data-setting="motion"]', preferences.motion);
  setChecked('[data-setting="anonymous-feedback"]', preferences.anonymousFeedback);
  if (calmSoundToggle && calmSoundToggle.checked !== preferences.calmSound) calmSoundToggle.checked = preferences.calmSound;
  
  completionFeedbackNote.hidden = !preferences.anonymousFeedback;
  document.querySelector('#text-size-status').textContent = preferences.textScale === 'default' ? 'Default' : preferences.textScale === 'large' ? 'Large' : 'Largest';
  if (calmSoundVolumeSlider.value !== String(preferences.calmVolume)) calmSoundVolumeSlider.value = String(preferences.calmVolume);
  document.querySelectorAll('.sound-type-btn').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.soundType === preferences.soundType)));
  calmSoundButton.setAttribute('aria-pressed', String(preferences.calmSound));
  calmSoundButton.setAttribute('aria-label', preferences.calmSound ? 'Turn off calm background sound' : 'Turn on calm background sound');
  if (calmMasterGain && calmAudioContext) {
    const target = preferences.calmSound ? (preferences.calmVolume / 100) * 0.45 : 0;
    try {
      calmMasterGain.gain.setValueAtTime(calmMasterGain.gain.value, calmAudioContext.currentTime);
      calmMasterGain.gain.linearRampToValueAtTime(target, calmAudioContext.currentTime + 0.3);
    } catch {
      calmMasterGain.gain.value = target;
    }
  }
}
applyPreferences();
updatePrivateSpaceControls();

document.querySelectorAll('.sound-type-btn').forEach((button) => {
  button.addEventListener('click', () => {
    preferences.soundType = button.dataset.soundType;
    if (!preferences.calmSound) {
      preferences.calmSound = true;
      startCalmSound();
    } else if (calmSoundStarted) {
      stopCalmSound();
      window.setTimeout(startCalmSound, 50);
    }
    savePreferences(preferences);
    applyPreferences();
  });
});

function updateConnectionNotice() {
  connectionNotice.hidden = navigator.onLine;
}
window.addEventListener('online', updateConnectionNotice);
window.addEventListener('offline', updateConnectionNotice);
updateConnectionNotice();

if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (preferences.theme === 'system') applyPreferences();
  });
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); }, { once: true });
}

function showSupport(state) {
  currentSupportState = state;
  const path = supportPaths[state];
  const orientEl = document.querySelector('#support-orient');
  if (orientEl) {
    orientEl.textContent = path.orient || '';
    orientEl.hidden = !path.orient;
  }
  supportReflection.textContent = path.reflection;
  supportOptions.replaceChildren(...path.options.map(([id, time, title, copy, reason]) => {
    const option = document.createElement('button');
    option.type = 'button'; option.className = 'support-option';
    const reasonHtml = reason ? `<span class="option-reason">${reason}</span>` : '';
    option.innerHTML = `<span class="option-time">${time}</span><span><span class="option-title">${title}</span><span class="option-copy">${copy}</span>${reasonHtml}</span><span class="option-arrow" aria-hidden="true">→</span>`;
    option.addEventListener('click', () => openPractice(id));
    return option;
  }));
  supportDialog.showModal();
}

function closePractice() {
  window.clearInterval(breathingTimer);
  stopPracticeAudio();
  if (practiceDialog.open) practiceDialog.close();
}
function completeMoment() {
  closePractice();
  if (supportDialog.open) supportDialog.close();
  completionChoices.forEach((button) => button.setAttribute('aria-pressed', 'false'));
  completionFeeling = '';
  completionFeedbackSent = false;
  completionStatus.textContent = '';
  completionDialog.showModal();
}

function stopPracticeAudio() {
  if (activePracticeVoiceButton) {
    activePracticeVoiceButton.textContent = 'Listen to this practice';
    activePracticeVoiceButton.setAttribute('aria-pressed', 'false');
  }
  activePracticeVoice = undefined;
  activePracticeVoiceButton = undefined;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function addPracticeAudio(text) {
  if (!text || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
  const listen = document.createElement('button');
  listen.type = 'button'; listen.className = 'secondary-button practice-listen'; listen.textContent = 'Listen to this practice'; listen.setAttribute('aria-pressed', 'false');
  listen.addEventListener('click', () => {
    if (activePracticeVoiceButton === listen) { stopPracticeAudio(); return; }
    stopPracticeAudio();
    const voice = new SpeechSynthesisUtterance(text);
    voice.rate = 0.9;
    activePracticeVoice = voice;
    activePracticeVoiceButton = listen;
    listen.textContent = 'Stop listening';
    listen.setAttribute('aria-pressed', 'true');
    const clear = () => {
      if (activePracticeVoice !== voice) return;
      activePracticeVoice = undefined;
      activePracticeVoiceButton = undefined;
      listen.textContent = 'Listen to this practice';
      listen.setAttribute('aria-pressed', 'false');
    };
    voice.onend = clear;
    voice.onerror = clear;
    window.speechSynthesis.speak(voice);
  });
  practiceFooter.append(listen);
}

function practiceLayout({ eyebrow = 'A quiet practice', title, lede, content, audioText = '' }) {
  stopPracticeAudio();
  practiceEyebrow.textContent = eyebrow;
  practiceTitle.textContent = title;
  practiceLede.textContent = lede;
  practiceContent.replaceChildren(content);
  practiceFooter.replaceChildren();
  const back = document.createElement('button');
  back.type = 'button'; back.className = 'secondary-button'; back.textContent = 'Back to choices';
  back.addEventListener('click', () => { closePractice(); showSupport(currentSupportState); });
  const done = document.createElement('button');
  done.type = 'button'; done.className = 'primary-button'; done.textContent = 'I\u2019m done for now';
  done.addEventListener('click', completeMoment);
  practiceFooter.append(back);
  addPracticeAudio(audioText);
  practiceFooter.append(done);
}

function createBreathingPractice({ title = 'Breathe with the room', lede = 'Let your breath be natural. This is an invitation, not a test.' } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'breathing-practice';
  wrap.innerHTML = `<div class="breathe-orb" aria-hidden="true"><strong>1:00</strong></div><p class="breathe-instruction" role="status" aria-live="polite">When you’re ready, begin.</p><div class="breathe-controls"><button class="primary-button" type="button" data-breathe-start>Begin gently</button><button class="secondary-button" type="button" data-breathe-reset>Reset</button></div>`;
  practiceLayout({ title, lede, content: wrap, audioText: `${title}. ${lede} When you are ready, let your breath be natural. Breathe in slowly, then let it go slowly. You can pause or stop at any time.` });
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
  practiceLayout({ title: 'Come back to your senses', lede: 'Move through these in any order. You do not have to complete every one.', content: wrap, audioText: 'Come back to your senses. Move through these in any order. Notice five ordinary things you can see, four things you can feel, three things you can hear, two things you can smell, and one kind thing to tell yourself. You do not have to complete every one.' });
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
  practiceLayout({ title: 'Let it out of your head', lede: 'You do not need to make this neat. Write what is here, then keep only one small thread.', content: wrap, audioText: 'Let it out of your head. You do not need to make this neat. If writing feels useful, put down what is circling in your mind. Then choose only one small thread to make smaller. Nothing you write is read aloud or sent.' });
}

function createNextStepPractice() {
  const wrap = document.createElement('div'); wrap.className = 'write-practice';
  wrap.innerHTML = `<label for="next-step-input">What is one kind, possible next step?</label><textarea id="next-step-input" rows="4" maxlength="500" placeholder="For example: drink some water, step outside, send one message, or leave one thing for tomorrow." autocomplete="off" autocorrect="off" spellcheck="false"></textarea><p class="write-note">A small step counts. This stays in the moment and is not saved.</p>`;
  practiceLayout({ title: 'One small next step', lede: 'Choose something gentle enough that it could really happen - even on a hard day.', content: wrap, audioText: 'One small next step. Choose something gentle enough that it could really happen, even on a hard day. You might drink water, step outside, send one message, or leave one thing for tomorrow.' });
}

function createConnectionPractice() {
  const wrap = document.createElement('div'); wrap.className = 'write-practice draft-practice';
  wrap.innerHTML = `<label for="connection-draft">A message draft</label><textarea id="connection-draft" rows="5" maxlength="500" autocomplete="off" autocorrect="off" spellcheck="false">Hey, I’ve been having a lot on my mind. If you have a few minutes sometime, I would really appreciate hearing a familiar voice.</textarea><p class="write-note">Edit this until it sounds like you. Copying it does not send anything.</p><button class="primary-button" type="button" data-copy-draft>Copy my draft</button><p class="copy-status" role="status" aria-live="polite"></p>`;
  wrap.querySelector('[data-copy-draft]').addEventListener('click', async () => {
    const status = wrap.querySelector('.copy-status'); const value = wrap.querySelector('textarea').value;
    try { await navigator.clipboard.writeText(value); status.textContent = 'Copied. You decide whether and when to send it.'; } catch { status.textContent = 'Select and copy the draft whenever you are ready.'; }
  });
  practiceLayout({ title: 'Write a warm message', lede: 'Connection can start quietly. This is only a draft - you remain in control.', content: wrap, audioText: 'Write a warm message. Connection can start quietly. This is only a draft, and you remain in control of whether you edit it, copy it, send it, or leave it here.' });
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
  practiceLayout({ title: 'Make one gentle shift', lede: 'This is not exercise. It is simply an invitation to notice or move in a way that feels available.', content: wrap, audioText: 'Make one gentle shift. This is not exercise. Notice the chair, floor, bed, or anything already holding you. Make one small adjustment if it feels comfortable, or stay still. Your body gets the final say.' });
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
  if (supportDialog.open) supportDialog.close();
  if (id === 'check-in') { openTeamSupport(); return; }
  currentPractice = id;
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
  let intakeReason = '';
  setTeamSupportEnabled(false);
  teamSupportStatus.textContent = 'Checking whether a team check-in is available…';
  teamDialog.showModal();
  try {
    const response = await fetch('/api/support-request', { headers: { Accept: 'application/json' }, cache: 'no-store' });
    const result = await response.json().catch(() => ({}));
    teamSupportAvailable = response.ok && result.available === true;
    intakeReason = result.reason || '';
  } catch { teamSupportAvailable = false; }
  if (teamSupportAvailable) {
    setTeamSupportEnabled(true);
    teamSupportStatus.textContent = readTeamRequest() ? 'You have a request in this browser session. You can withdraw it below; a response time is not promised.' : 'The request form is available. Share only what feels right; a response time is not promised.';
  } else {
    teamSupportStatus.textContent = intakeReason === 'paused'
      ? 'Team check-ins are taking a pause right now. You can still use the private support tools or Find A Helpline.'
      : 'Team check-ins are not available right now. You can still use the private support tools or Find A Helpline.';
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

function hasUnsavedJournalWriting() {
  return Boolean(journalTextarea?.value?.trim());
}
function showJournalDiscardConfirmation() {
  if (journalConfirmDialog && !journalConfirmDialog.open) journalConfirmDialog.showModal();
}
function forceCloseJournal() {
  if (journalTextarea) journalTextarea.value = '';
  stopJournalVoiceTyping();
  resetJournalPencil();
  if (journalConfirmDialog?.open) journalConfirmDialog.close();
  if (journalDialog?.open) journalDialog.close();
}
function requestCloseJournal() {
  if (hasUnsavedJournalWriting()) {
    showJournalDiscardConfirmation();
  } else {
    forceCloseJournal();
  }
}

document.querySelectorAll('[data-state]').forEach((button) => button.addEventListener('click', () => showSupport(button.dataset.state)));
document.querySelectorAll('[data-practice]').forEach((button) => button.addEventListener('click', () => openPractice(button.dataset.practice)));
document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => {
  const dialog = button.closest('dialog');
  if (dialog === journalDialog) {
    requestCloseJournal();
    return;
  }
  dialog?.close();
}));
document.querySelectorAll('[data-open-reflection]').forEach((button) => button.addEventListener('click', () => { urgentDialog.close(); reflectionDialog.showModal(); }));
document.querySelectorAll('[data-open-urgent]').forEach((button) => button.addEventListener('click', () => urgentDialog.showModal()));
document.querySelector('[data-back]').addEventListener('click', () => supportDialog.close());
document.querySelector('[data-reflect]').addEventListener('click', () => { const reflection = document.querySelector('#reflection-input').value.trim(); reflectionDialog.close(); showSupport('unsure'); if (reflection) supportReflection.textContent = 'Thank you for putting that into words. You do not have to carry it all at once. Which of these feels possible?'; });
[supportDialog, reflectionDialog, urgentDialog, practiceDialog, accessibilityDialog, privacyDialog, resourcesDialog, teamDialog, reminderDialog, completionDialog].forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));
journalDialog.addEventListener('click', (event) => { if (event.target === journalDialog) requestCloseJournal(); });
if (journalConfirmDialog) {
  journalConfirmDialog.addEventListener('click', (event) => {
    if (event.target === journalConfirmDialog) {
      journalConfirmDialog.close();
      journalTextarea?.focus();
    }
  });
}
journalDialog.addEventListener('cancel', (event) => {
  if (hasUnsavedJournalWriting()) {
    event.preventDefault();
    showJournalDiscardConfirmation();
  } else {
    stopJournalVoiceTyping();
    resetJournalPencil();
  }
});
practiceDialog.addEventListener('close', () => window.clearInterval(breathingTimer));

async function sendAnonymousFeedback(feeling) {
  if (!preferences.anonymousFeedback) return false;
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ practiceId: currentPractice, feeling }),
    });
    return response.status === 202;
  } catch { return false; }
}

completionChoices.forEach((button) => button.addEventListener('click', () => {
  completionChoices.forEach((choice) => choice.setAttribute('aria-pressed', String(choice === button)));
  const responses = {
    'a little different': 'Thank you for noticing. You can close for now, or choose another gentle option.',
    'about the same': 'That is okay. You can close for now, or choose another gentle option.',
    'I want another option': 'Let’s find another gentle option. You are still in control of what comes next.',
  };
  completionFeeling = button.dataset.completionFeeling;
  completionStatus.textContent = responses[button.dataset.completionFeeling];
}));
completionDialog.addEventListener('close', () => {
  if (!completionFeedbackSent && completionFeeling) {
    completionFeedbackSent = true;
    void sendAnonymousFeedback(completionFeeling);
  }
});
document.querySelector('[data-completion-more]').addEventListener('click', () => { completionDialog.close(); showSupport(currentSupportState); });
const completionReminderBtn = document.querySelector('#completion-reminder-btn');
if (completionReminderBtn) completionReminderBtn.addEventListener('click', () => { completionDialog.close(); openReminder(); });

document.querySelector('[data-open-accessibility]').addEventListener('click', () => accessibilityDialog.showModal());
document.querySelector('[data-open-privacy]').addEventListener('click', () => { updatePrivateSpaceControls(); privacyDialog.showModal(); });
document.querySelector('[data-open-resources]').addEventListener('click', () => resourcesDialog.showModal());
document.querySelector('[data-open-connection-draft]').addEventListener('click', () => { resourcesDialog.close(); openPractice('connection'); });
document.querySelector('[data-open-team-from-resources]').addEventListener('click', () => { resourcesDialog.close(); openTeamSupport(); });
document.querySelectorAll('button[data-theme]').forEach((button) => button.addEventListener('click', () => { preferences.theme = button.dataset.theme; savePreferences(preferences); applyPreferences(); }));
document.querySelectorAll('[data-text-size]').forEach((button) => button.addEventListener('click', () => {
  const scales = ['default', 'large', 'larger']; let index = scales.indexOf(preferences.textScale);
  index = Math.max(0, Math.min(scales.length - 1, index + (button.dataset.textSize === 'increase' ? 1 : -1)));
  preferences.textScale = scales[index]; savePreferences(preferences); applyPreferences();
}));
document.querySelector('[data-setting="contrast"]').addEventListener('change', (event) => { preferences.contrast = event.target.checked; savePreferences(preferences); applyPreferences(); });
document.querySelector('[data-setting="motion"]').addEventListener('change', (event) => { preferences.motion = event.target.checked; savePreferences(preferences); applyPreferences(); });
anonymousFeedbackSetting.addEventListener('change', (event) => { preferences.anonymousFeedback = event.target.checked; savePreferences(preferences); applyPreferences(); });

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
chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    document.querySelector('#chat-form').requestSubmit();
  }
});

document.querySelector('#chat-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const text = chatInput.value.trim(); if (!text || honeyIsResponding) return;
  honeyIsResponding = true; sendChatButton.disabled = true;
  addMessage(text, 'user'); chatInput.value = ''; const pending = addMessage('Honey is thinking…', 'loading');
  const gentleWait = window.setTimeout(() => { if (pending.isConnected) pending.textContent = 'Honey is taking a little longer. A gentle next step is on its way…'; }, 7000);
  try {
    const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, history: chatHistory.slice(-6) }) });
    const result = await response.json(); pending.remove();
    if (!response.ok) {
      if (response.status === 429) {
        const pauseMessage = 'Honey is taking a short pause between messages. You can try again in a moment, choose a gentle support path, or request a check-in with the team.';
        addMessage(pauseMessage); chatHistory.push({ role: 'user', content: text }, { role: 'assistant', content: pauseMessage }); chatHistory = chatHistory.slice(-8);
        return;
      }
      throw new Error(result.error || 'Chat is unavailable.');
    }
    addMessage(result.message);
    chatHistory.push({ role: 'user', content: text }, { role: 'assistant', content: result.message });
    chatHistory = chatHistory.slice(-8);
    if (result.type === 'urgent') { closeChat({ restoreFocus: false }); urgentDialog.showModal(); }
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

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!turnstileScriptPromise) {
    turnstileScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = () => window.turnstile ? resolve(window.turnstile) : reject(new Error('The security check did not load. Please try again.'));
      script.onerror = () => reject(new Error('The security check did not load. Please try again.'));
      document.head.append(script);
    });
  }
  return turnstileScriptPromise;
}

async function createPrivateSpace(turnstileToken) {
  const status = document.querySelector('#private-space-status');
  createPrivateSpaceButton.disabled = true;
  status.textContent = 'Creating your private space…';
  try {
    const response = await fetch('/api/private-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ turnstileToken }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.session?.access_token) throw new Error(result.error || 'Private spaces are not available yet.');
    try { sessionStorage.setItem('igh-private-space', JSON.stringify(result.session)); } catch { throw new Error('Your browser is blocking the private-space session. You can still use every support tool without an account.'); }
    updatePrivateSpaceControls();
    status.textContent = 'Your private space is ready for this browser session. No name, email, phone number, or wellness profile was requested.';
  } catch (error) {
    status.textContent = error.message || 'Private spaces are not available yet. You can still use every support tool without an account.';
    createPrivateSpaceButton.disabled = false;
    if (turnstileWidgetId !== undefined && window.turnstile?.reset) window.turnstile.reset(turnstileWidgetId);
  }
}

createPrivateSpaceButton.addEventListener('click', async () => {
  const status = document.querySelector('#private-space-status');
  if (readPrivateSpace()?.access_token) {
    status.textContent = 'Your private space is already ready in this browser session.';
    return;
  }
  createPrivateSpaceButton.disabled = true;
  status.textContent = 'Preparing a quick security check…';
  try {
    const configResponse = await fetch('/api/private-space-config', { cache: 'no-store' });
    const config = await configResponse.json().catch(() => ({}));
    if (!configResponse.ok || !config.enabled || !config.siteKey) throw new Error('Private spaces are being prepared. You can still use every support tool without an account.');
    privateSpaceCheck.hidden = false;
    const turnstile = await loadTurnstile();
    if (turnstileWidgetId !== undefined) turnstile.remove(turnstileWidgetId);
    privateSpaceTurnstile.replaceChildren();
    turnstileWidgetId = turnstile.render(privateSpaceTurnstile, {
      sitekey: config.siteKey,
      theme: root.dataset.theme === 'dark' ? 'dark' : 'light',
      size: 'flexible',
      callback: createPrivateSpace,
      'expired-callback': () => { status.textContent = 'That security check expired. Please complete the new one when you are ready.'; },
      'error-callback': () => { status.textContent = 'The security check needs another moment. Please try again or come back later.'; createPrivateSpaceButton.disabled = false; },
    });
    status.textContent = 'Complete the quick security check when you are ready.';
  } catch (error) {
    status.textContent = error.message || 'Private spaces are not available yet. You can still use every support tool without an account.';
    createPrivateSpaceButton.disabled = false;
    clearPrivateSpaceCheck();
  }
});

cancelPrivateSpaceButton.addEventListener('click', () => {
  clearPrivateSpaceCheck();
  createPrivateSpaceButton.disabled = false;
  document.querySelector('#private-space-status').textContent = 'No problem. Every support tool remains available without a private space.';
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

const exportPrivateSpaceButton = document.querySelector('[data-export-private-space]');
if (exportPrivateSpaceButton) {
  exportPrivateSpaceButton.addEventListener('click', async () => {
    const status = document.querySelector('#private-space-status');
    const space = readPrivateSpace();
    if (!space?.access_token) { status.textContent = 'There is no active private space in this browser session to export.'; return; }
    exportPrivateSpaceButton.disabled = true;
    status.textContent = 'Preparing your export\u2026';
    try {
      const response = await fetch('/api/private-account', { headers: { Authorization: `Bearer ${space.access_token}` } });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not prepare your export right now.');
      const exportData = {
        exported_at: new Date().toISOString(),
        note: 'In G\u00f6d Hands stores only an anonymous account identifier and creation date. No wellness data, journal entries, chat messages, or personal details are ever saved to your private space.',
        space: result.space || {},
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = 'in-god-hands-private-space-export.json';
      document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'Your export has downloaded. It contains only your anonymous account ID and creation date \u2014 nothing about what you\u2019ve written or shared.';
    } catch (error) {
      status.textContent = error.message || 'We could not prepare your export right now. Please try again.';
    } finally { exportPrivateSpaceButton.disabled = false; }
  });
}

let handpanTimer;
const handpanScale432 = [
  144.18, // D3 (Ding center fundamental)
  216.00, // A3 (pure 432/2 fifth)
  228.84, // Bb3
  256.87, // C4
  288.35, // D4
  323.63, // E4
  342.86, // F4
  384.87, // G4
  432.00, // A4 (432 Hz tuning standard)
  513.74, // C5
  576.70  // D5
];

function playHandpanNote(frequency, velocity = 0.55) {
  if (!calmAudioContext || calmAudioContext.state !== 'running' || !calmMasterGain || !preferences.calmSound || preferences.soundType !== 'handpan') return;
  const ctx = calmAudioContext;
  const now = ctx.currentTime;

  const noteGain = ctx.createGain();
  noteGain.gain.setValueAtTime(0.0001, now);
  noteGain.gain.exponentialRampToValueAtTime(0.38 * velocity, now + 0.015);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
  noteGain.connect(calmMasterGain);

  // Fundamental Handpan tone (warm resonant sine)
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(frequency, now);

  // Octave Harmonic (Helmholtz cavity mode)
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(frequency * 2, now);
  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.35 * velocity, now);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
  osc2.connect(gain2);
  gain2.connect(noteGain);

  // Compound 5th Harmonic (Transverse mode)
  const osc3 = ctx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(frequency * 3.003, now);
  const gain3 = ctx.createGain();
  gain3.gain.setValueAtTime(0.18 * velocity, now);
  gain3.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
  osc3.connect(gain3);
  gain3.connect(noteGain);

  // Gentle mallet contact resonance
  const malletFilter = ctx.createBiquadFilter();
  malletFilter.type = 'bandpass';
  malletFilter.frequency.setValueAtTime(frequency * 1.6, now);
  malletFilter.Q.setValueAtTime(4, now);

  const malletOsc = ctx.createOscillator();
  malletOsc.type = 'triangle';
  malletOsc.frequency.setValueAtTime(frequency * 0.5, now);

  const malletGain = ctx.createGain();
  malletGain.gain.setValueAtTime(0.22 * velocity, now);
  malletGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

  malletOsc.connect(malletFilter);
  malletFilter.connect(malletGain);
  malletGain.connect(noteGain);

  osc1.connect(noteGain);

  osc1.start(now);
  osc2.start(now);
  osc3.start(now);
  malletOsc.start(now);

  osc1.stop(now + 3.4);
  osc2.stop(now + 2.2);
  osc3.stop(now + 1.6);
  malletOsc.stop(now + 0.06);
}

function scheduleNextHandpanNote() {
  if (!calmSoundStarted || !preferences.calmSound || preferences.soundType !== 'handpan') return;
  const delay = 2800 + Math.random() * 2600;
  handpanTimer = window.setTimeout(() => {
    if (!calmSoundStarted || !preferences.calmSound || preferences.soundType !== 'handpan') return;
    const idx = Math.floor(Math.random() * handpanScale432.length);
    const velocity = 0.5 + Math.random() * 0.35;
    playHandpanNote(handpanScale432[idx], velocity);

    if (Math.random() < 0.35) {
      window.setTimeout(() => {
        if (!calmSoundStarted || !preferences.calmSound || preferences.soundType !== 'handpan') return;

        const harmonyIdx = (idx + (Math.random() < 0.5 ? 2 : 4)) % handpanScale432.length;
        playHandpanNote(handpanScale432[harmonyIdx], velocity * 0.7);
      }, 280 + Math.random() * 120);
    }

    scheduleNextHandpanNote();
  }, delay);
}

/* Calm background sound: a 432 Hz handpan and warm ambient music soundscape.
   Generated on-device with the Web Audio API on first tap, click, or keypress. */
function startCalmSound() {
  if (calmSoundStarted || calmSoundStarting || !preferences.calmSound) return;
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return;
  calmSoundStarting = true;
  const context = calmAudioContext || (calmAudioContext = new AudioContextCtor());
  const ready = context.state === 'suspended' ? context.resume() : Promise.resolve();
  ready.then(() => {
    if (!preferences.calmSound) {
      calmSoundStarting = false;
      return;
    }
    window.clearTimeout(handpanTimer);
    calmOscillators.forEach(({ oscillator, lfo }) => { try { oscillator.stop(); lfo.stop(); } catch {} });
    calmOscillators = [];

    calmMasterGain = context.createGain();
    const targetVolume = (preferences.calmVolume / 100) * 0.45;
    calmMasterGain.gain.setValueAtTime(0, context.currentTime);
    calmMasterGain.connect(context.destination);

    const soundType = preferences.soundType || 'handpan';

    if (soundType === 'handpan') {
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 1100;
      filter.connect(calmMasterGain);
      const voices = [
        { frequency: 108.00, level: 0.45, lfoRate: 0.03, type: 'sine' },
        { frequency: 144.18, level: 0.48, lfoRate: 0.04, type: 'sine' },
        { frequency: 216.00, level: 0.38, lfoRate: 0.06, type: 'sine' },
        { frequency: 288.35, level: 0.30, lfoRate: 0.05, type: 'triangle' },
        { frequency: 432.00, level: 0.18, lfoRate: 0.08, type: 'sine' },
      ];
      calmOscillators = voices.map(({ frequency, level, lfoRate, type }) => {
        const oscillator = context.createOscillator();
        oscillator.type = type || 'sine'; oscillator.frequency.value = frequency;
        const voiceGain = context.createGain(); voiceGain.gain.setValueAtTime(level, context.currentTime);
        const lfo = context.createOscillator(); lfo.frequency.value = lfoRate;
        const lfoGain = context.createGain(); lfoGain.gain.setValueAtTime(level * 0.28, context.currentTime);
        lfo.connect(lfoGain); lfoGain.connect(voiceGain.gain);
        oscillator.connect(voiceGain); voiceGain.connect(filter);
        oscillator.start(); lfo.start();
        return { oscillator, lfo };
      });
      playHandpanNote(432.00, 0.6);
      scheduleNextHandpanNote();
    } else {
      const bufferSize = context.sampleRate * 2;
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      const noise = context.createBufferSource();
      noise.buffer = buffer; noise.loop = true;
      
      const filter1 = context.createBiquadFilter();
      const filter2 = context.createBiquadFilter();
      noise.connect(filter1); filter1.connect(filter2); filter2.connect(calmMasterGain);
      
      let lfo = null;
      if (soundType === 'rain') {
        filter1.type = 'lowpass'; filter1.frequency.value = 1800; filter1.Q.value = 0.5;
        filter2.type = 'highpass'; filter2.frequency.value = 400; filter2.Q.value = 0.5;
      } else if (soundType === 'ocean') {
        filter1.type = 'lowpass'; filter1.frequency.value = 500; filter1.Q.value = 0.8;
        filter2.type = 'highpass'; filter2.frequency.value = 100;
        lfo = context.createOscillator(); lfo.frequency.value = 0.08;
        const lfoGain = context.createGain(); lfoGain.gain.value = 400;
        lfo.connect(lfoGain); lfoGain.connect(filter1.frequency);
        lfo.start();
      } else if (soundType === 'wind') {
        filter1.type = 'bandpass'; filter1.frequency.value = 600; filter1.Q.value = 0.8;
        filter2.type = 'lowpass'; filter2.frequency.value = 1200;
        lfo = context.createOscillator(); lfo.frequency.value = 0.05;
        const lfoGain = context.createGain(); lfoGain.gain.value = 350;
        lfo.connect(lfoGain); lfoGain.connect(filter1.frequency);
        lfo.start();
      } else { // whitenoise
        filter1.type = 'lowpass'; filter1.frequency.value = 1200;
        filter2.type = 'highpass'; filter2.frequency.value = 200;
      }
      noise.start();
      calmOscillators = [{ oscillator: noise, lfo }];
    }

    calmMasterGain.gain.linearRampToValueAtTime(targetVolume, context.currentTime + 1.2);
    calmSoundStarted = true;
  }).catch(() => {}).finally(() => {
    calmSoundStarting = false;
  });
}

function stopCalmSound() {
  window.clearTimeout(handpanTimer);
  if (!calmSoundStarted && !calmSoundStarting) return;
  const context = calmAudioContext;
  if (calmMasterGain && context && context.state === 'running') {
    try {
      calmMasterGain.gain.setValueAtTime(calmMasterGain.gain.value, context.currentTime);
      calmMasterGain.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
    } catch {}
  }
  const oscillatorsToStop = calmOscillators;
  calmOscillators = [];
  calmSoundStarted = false;
  calmSoundStarting = false;
  window.setTimeout(() => {
    oscillatorsToStop.forEach(({ oscillator, lfo }) => {
      try { oscillator.stop(); lfo.stop(); } catch {}
    });
  }, 600);
}

calmSoundButton.addEventListener('click', () => {
  preferences.calmSound = !preferences.calmSound;
  savePreferences(preferences);
  applyPreferences();
  if (preferences.calmSound) startCalmSound();
  else stopCalmSound();
});

calmSoundToggle.addEventListener('change', () => {
  preferences.calmSound = calmSoundToggle.checked;
  savePreferences(preferences);
  applyPreferences();
  if (preferences.calmSound) startCalmSound();
  else stopCalmSound();
});

calmSoundVolumeSlider.addEventListener('input', () => {
  preferences.calmVolume = Number(calmSoundVolumeSlider.value);
  savePreferences(preferences);
  if (calmMasterGain && calmAudioContext) {
    try {
      const target = preferences.calmSound ? (preferences.calmVolume / 100) * 0.45 : 0;
      calmMasterGain.gain.setValueAtTime(calmMasterGain.gain.value, calmAudioContext.currentTime);
      calmMasterGain.gain.linearRampToValueAtTime(target, calmAudioContext.currentTime + 0.1);
    } catch {}
  }
});

function tryStartAudioOnUserGesture(event) {
  if (event?.target?.closest('#calm-sound-button, #calm-sound-toggle, [data-setting="calmSound"]')) return;
  if (preferences.calmSound && !calmSoundStarted && !calmSoundStarting) {
    startCalmSound();
  }
}
['pointerdown', 'touchstart', 'touchend', 'keydown', 'click'].forEach((eventName) => {
  document.addEventListener(eventName, tryStartAudioOnUserGesture, { passive: true });
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (calmAudioContext && calmAudioContext.state === 'running' && calmMasterGain) {
      try {
        calmMasterGain.gain.setValueAtTime(calmMasterGain.gain.value, calmAudioContext.currentTime);
        calmMasterGain.gain.linearRampToValueAtTime(0, calmAudioContext.currentTime + 0.3);
      } catch {}
    }
  } else {
    if (preferences.calmSound && calmSoundStarted && calmAudioContext && calmMasterGain) {
      if (calmAudioContext.state === 'suspended') calmAudioContext.resume();
      try {
        calmMasterGain.gain.setValueAtTime(calmMasterGain.gain.value, calmAudioContext.currentTime);
        calmMasterGain.gain.linearRampToValueAtTime((preferences.calmVolume / 100) * 0.45, calmAudioContext.currentTime + 0.4);
      } catch {}
    }
  }
});

/* Private journal: writing is saved only through the browser's own,
   RLS-protected connection to the person's private-space account. No server
   route in this app ever reads or writes journal entries. */
function decodeJwtUserId(accessToken) {
  try {
    const payload = accessToken.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')));
    return typeof decoded.sub === 'string' ? decoded.sub : null;
  } catch { return null; }
}
async function journalConfig() {
  if (!journalConfigPromise) {
    journalConfigPromise = fetch('/api/private-space-config', { cache: 'no-store' })
      .then((response) => response.json())
      .then((result) => (result?.journal?.enabled ? result.journal : null))
      .catch(() => null);
  }
  return journalConfigPromise;
}
function journalRestUrl(baseUrl) { return `${baseUrl.replace(/\/$/, '')}/rest/v1/private_journal_entries`; }
function journalHeaders(config, accessToken, extra = {}) {
  return { apikey: config.anonKey, Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', ...extra };
}
function journalEntryDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
function renderJournalEntry(entry, config, accessToken) {
  const card = document.createElement('article'); card.className = 'journal-entry-card';
  const header = document.createElement('div'); header.className = 'journal-entry-card-header';
  const date = document.createElement('span'); date.className = 'journal-entry-date'; date.textContent = journalEntryDate(entry.created_at);
  const deleteButton = document.createElement('button'); deleteButton.type = 'button'; deleteButton.className = 'text-button journal-entry-delete'; deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', async () => {
    deleteButton.disabled = true;
    try {
      const response = await fetch(`${journalRestUrl(config.url)}?id=eq.${encodeURIComponent(entry.id)}`, { method: 'DELETE', headers: journalHeaders(config, accessToken) });
      if (!response.ok) throw new Error();
      card.remove();
      if (!journalEntryList.children.length) journalEntryList.append(Object.assign(document.createElement('p'), { className: 'queue-empty', textContent: 'No saved entries yet.' }));
    } catch { journalStatus.textContent = 'That entry could not be deleted right now.'; deleteButton.disabled = false; }
  });
  header.append(date, deleteButton); card.append(header);
  const body = document.createElement('p'); body.className = 'journal-entry-body'; body.textContent = entry.body; card.append(body);
  return card;
}
async function loadJournalEntries() {
  const space = readPrivateSpace();
  if (!space?.access_token) { journalLocked.hidden = false; journalEntriesSection.hidden = true; return; }
  journalLocked.hidden = true;
  const config = await journalConfig();
  if (!config) { journalEntriesSection.hidden = true; return; }
  journalEntriesSection.hidden = false;
  journalEntryList.replaceChildren(Object.assign(document.createElement('p'), { className: 'queue-empty', textContent: 'Loading your entries…' }));
  try {
    const response = await fetch(`${journalRestUrl(config.url)}?select=id,body,created_at&order=created_at.desc&limit=100`, { headers: journalHeaders(config, space.access_token) });
    if (response.status === 401) { removePrivateSpace(); updatePrivateSpaceControls(); journalLocked.hidden = false; journalEntriesSection.hidden = true; return; }
    if (!response.ok) throw new Error();
    const rows = await response.json();
    journalEntryList.replaceChildren();
    if (!Array.isArray(rows) || !rows.length) journalEntryList.append(Object.assign(document.createElement('p'), { className: 'queue-empty', textContent: 'No saved entries yet.' }));
    else journalEntryList.append(...rows.map((entry) => renderJournalEntry(entry, config, space.access_token)));
  } catch {
    journalEntryList.replaceChildren(Object.assign(document.createElement('p'), { className: 'queue-empty', textContent: 'Your saved entries could not be loaded right now.' }));
  }
}
async function saveJournalEntry() {
  const text = journalTextarea.value.trim();
  if (!text) { journalStatus.textContent = 'Write something first, or clear without saving.'; return; }
  const space = readPrivateSpace();
  if (!space?.access_token) { journalLocked.hidden = false; journalStatus.textContent = 'Create a private space to save entries privately.'; return; }
  const config = await journalConfig();
  if (!config) { journalStatus.textContent = 'Saving is not available yet. You can still write and clear without saving.'; return; }
  const userId = decodeJwtUserId(space.access_token);
  if (!userId) { journalStatus.textContent = 'Your private-space session could not be read. Please try again.'; return; }
  journalSaveButton.disabled = true; journalStatus.textContent = 'Saving privately…';
  try {
    const response = await fetch(journalRestUrl(config.url), {
      method: 'POST', headers: journalHeaders(config, space.access_token, { Prefer: 'return=representation' }),
      body: JSON.stringify([{ user_id: userId, body: text }]),
    });
    if (response.status === 401) { removePrivateSpace(); updatePrivateSpaceControls(); journalLocked.hidden = false; throw new Error('Your private-space session ended. Please create a new one to keep saving.'); }
    if (!response.ok) throw new Error();
    journalTextarea.value = '';
    journalStatus.textContent = 'Saved privately. Only you can read this.';
    await loadJournalEntries();
  } catch (error) { journalStatus.textContent = error.message || 'That entry could not be saved right now.'; }
  finally { journalSaveButton.disabled = false; }
}
journalSaveButton.addEventListener('click', saveJournalEntry);
journalOpenPrivacyButton.addEventListener('click', () => { journalDialog.close(); updatePrivateSpaceControls(); privacyDialog.showModal(); });
journalEraseButton.addEventListener('click', async () => {
  if (!journalEraseArmed) {
    journalEraseArmed = true; journalEraseButton.textContent = 'Click again to erase everything';
    journalEraseResetTimer = window.setTimeout(() => { journalEraseArmed = false; journalEraseButton.textContent = 'Erase all entries'; }, 4000);
    return;
  }
  window.clearTimeout(journalEraseResetTimer); journalEraseArmed = false; journalEraseButton.textContent = 'Erase all entries';
  const space = readPrivateSpace();
  const config = await journalConfig();
  if (!space?.access_token || !config) { journalStatus.textContent = 'There is nothing saved to erase right now.'; return; }
  const userId = decodeJwtUserId(space.access_token);
  journalEraseButton.disabled = true;
  try {
    const response = await fetch(`${journalRestUrl(config.url)}?user_id=eq.${encodeURIComponent(userId)}`, { method: 'DELETE', headers: journalHeaders(config, space.access_token) });
    if (!response.ok) throw new Error();
    journalStatus.textContent = 'All saved journal entries have been erased.';
    await loadJournalEntries();
  } catch { journalStatus.textContent = 'Your entries could not be erased right now.'; }
  finally { journalEraseButton.disabled = false; }
});

/* A pencil that visibly moves with the caret as a person writes, plus an
   optional, on-device paper-writing sound - purely decorative, neither reads
   nor transmits what is typed. */
let pencilTiltFlip = false;
function nudgeJournalPencil() {
  const value = journalTextarea.value;
  const caret = journalTextarea.selectionStart ?? value.length;
  const linesBeforeCaret = value.slice(0, caret).split('\n');
  const line = linesBeforeCaret.length - 1;
  const column = linesBeforeCaret[linesBeforeCaret.length - 1].length;
  const charWidth = 7.4;
  const lineHeight = 24;
  const maxX = Math.max(journalTextarea.clientWidth - 44, 0);
  const maxY = Math.max(journalTextarea.clientHeight - 34, 0);
  const x = Math.min(column * charWidth, maxX);
  const y = Math.min(line * lineHeight, maxY);
  pencilTiltFlip = !pencilTiltFlip;
  journalPencil.style.transform = `translate(${x}px, ${y}px) rotate(${pencilTiltFlip ? -24 : -14}deg)`;
}
function resetJournalPencil() { journalPencil.style.transform = 'translate(0, 0) rotate(-18deg)'; }
function playPencilScratch() {
  if (!preferences.journalSound) return;
  const now = performance.now();
  if (now - lastPencilSoundAt < 45) return;
  lastPencilSoundAt = now;
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return;
  const context = calmAudioContext || (calmAudioContext = new AudioContextCtor());
  const duration = 0.045;
  const bufferSize = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const noise = context.createBufferSource(); noise.buffer = buffer;
  const filter = context.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 2200 + Math.random() * 900; filter.Q.value = 0.7;
  const gain = context.createGain(); gain.gain.value = 0.05;
  noise.connect(filter); filter.connect(gain); gain.connect(context.destination);
  noise.start(); noise.stop(context.currentTime + duration);
}
function updateJournalWordCount() {
  if (!journalWordCount) return;
  const text = journalTextarea.value.trim();
  if (!text) {
    journalWordCount.textContent = '';
    return;
  }
  const words = text.split(/\s+/).filter(Boolean).length;
  journalWordCount.textContent = `${words} ${words === 1 ? 'word' : 'words'}`;
}
journalTextarea.addEventListener('input', () => { nudgeJournalPencil(); playPencilScratch(); updateJournalWordCount(); });
journalSoundToggle.addEventListener('click', () => {
  preferences.journalSound = !preferences.journalSound;
  savePreferences(preferences);
  journalSoundToggle.setAttribute('aria-pressed', String(preferences.journalSound));
  journalSoundToggle.textContent = preferences.journalSound ? '🔊 Writing sound on' : '🔈 Writing sound off';
});

/* Voice typing uses the browser's own built-in dictation, not a feature this
   app builds or hosts. On some browsers that dictation sends audio to a
   cloud speech service, which is why the disclosure below stays visible. */
const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
function stopJournalVoiceTyping() { if (journalVoiceRecognition && journalVoiceActive) journalVoiceRecognition.stop(); }
if (SpeechRecognitionCtor) {
  journalVoiceButton.hidden = false;
  journalVoiceNote.hidden = false;
  journalVoiceButton.addEventListener('click', () => {
    if (journalVoiceActive) { stopJournalVoiceTyping(); return; }
    journalVoiceRecognition = new SpeechRecognitionCtor();
    journalVoiceRecognition.continuous = true;
    journalVoiceRecognition.interimResults = false;
    journalVoiceRecognition.lang = navigator.language || 'en-US';
    journalVoiceRecognition.onresult = (event) => {
      let addition = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) if (event.results[i].isFinal) addition += `${event.results[i][0].transcript} `;
      if (addition) {
        journalTextarea.value = `${journalTextarea.value}${journalTextarea.value && !journalTextarea.value.endsWith(' ') ? ' ' : ''}${addition}`.trimStart();
        nudgeJournalPencil();
        updateJournalWordCount();
      }
    };
    journalVoiceRecognition.onerror = () => { journalVoiceActive = false; journalVoiceButton.textContent = '🎙 Start voice typing'; journalVoiceButton.setAttribute('aria-pressed', 'false'); };
    journalVoiceRecognition.onend = () => { journalVoiceActive = false; journalVoiceButton.textContent = '🎙 Start voice typing'; journalVoiceButton.setAttribute('aria-pressed', 'false'); };
    journalVoiceRecognition.start();
    journalVoiceActive = true; journalVoiceButton.textContent = '⏹ Stop voice typing'; journalVoiceButton.setAttribute('aria-pressed', 'true');
  });
}

journalOpenButtons.forEach((button) => button.addEventListener('click', () => {
  journalStatus.textContent = '';
  journalEraseArmed = false; journalEraseButton.textContent = 'Erase all entries';
  resetJournalPencil();
  updateJournalWordCount();
  journalDialog.showModal();
  loadJournalEntries();
}));
document.querySelector('[data-clear-journal]').addEventListener('click', () => {
  stopJournalVoiceTyping();
  journalTextarea.value = '';
  journalStatus.textContent = 'Cleared. Nothing was saved.';
  resetJournalPencil();
  updateJournalWordCount();
});
journalCopyButton?.addEventListener('click', async () => {
  const text = journalTextarea.value.trim();
  if (!text) {
    journalStatus.textContent = 'Write something first to copy.';
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    journalStatus.textContent = 'Copied writing to clipboard.';
  } catch {
    journalStatus.textContent = 'Could not copy to clipboard.';
  }
});
journalDiscardCloseButton?.addEventListener('click', () => {
  forceCloseJournal();
  updateJournalWordCount();
});
journalKeepWritingButton?.addEventListener('click', () => {
  journalConfirmDialog?.close();
  journalTextarea?.focus();
});
journalCloseConfirmButton?.addEventListener('click', () => {
  journalConfirmDialog?.close();
  journalTextarea?.focus();
});
journalDialog.addEventListener('close', () => { stopJournalVoiceTyping(); resetJournalPencil(); updateJournalWordCount(); });

/* ══════════════════════════════════════════════════════════════════
   HONEY-GUIDED TOUR
   Walks first-time (and returning) visitors through every surface.
   Fully keyboard-navigable, screen-reader friendly, respects all
   accessibility preferences. Nothing is tracked or sent.
   ══════════════════════════════════════════════════════════════════ */

const TOUR_STEPS = [
  {
    selector: '.site-header',
    title: 'Welcome to In Göd Hands',
    body: 'This is the header. At the top you\'ll find the calm sound toggle (🎵), the Accessibility panel (Aa) where you can adjust text size, contrast, motion, and colour, and an Urgent support button if you ever need immediate help.',
    face: 'wave',
  },
  {
    selector: '.check-in',
    title: 'Check in with yourself',
    body: 'Start by choosing how you\'re feeling right now. Tap or click a card: Anxious, Overwhelmed, Disconnected, Tired, or "I\'m not sure." Each one opens a set of gentle next steps chosen just for that feeling.',
    face: 'smile',
  },
  {
    selector: '[data-open-reflection]',
    title: 'Put words to it',
    body: 'If you\'d rather write a sentence or two first, use this link. A small private text box opens. Nothing you write is sent or saved anywhere outside your browser.',
    face: 'think',
  },
  {
    selector: '.bear-launcher.mobile-chat-launcher, .bear-launcher.desktop-chat-launcher',
    title: 'Talk with Honey',
    body: 'I\'m always here in the corner. Tap or click the bear icon to open a gentle chat. I can help you slow down, think through what you need, or connect you with the team. I\'m not a therapist and this isn\'t emergency support, just a quiet companion.',
    face: 'happy',
  },
  {
    selector: '.quiet-tools:not(.journal-invite)',
    title: 'Quiet private practices',
    body: 'These tools work completely inside your browser. Nothing is saved or sent. Try a 1-minute breathing exercise, a 5-4-3-2-1 grounding check-in, or a free-write brain dump to get thoughts out of your head.',
    face: 'breathe',
  },
  {
    selector: '.journal-invite',
    title: 'Your private journal',
    body: 'Your journal is a safe, private space to write freely. By default nothing is saved. You decide whether to keep an entry. You can also use voice typing if your browser supports it.',
    face: 'cozy',
  },
  {
    selector: '.promise',
    title: 'Our promise to you',
    body: 'You\'ll always find the privacy policy and extra resources here. No account or personal information is ever required to use the check-in, practices, or chat with me.',
    face: 'nod',
  },
  {
    selector: '[data-open-accessibility]',
    title: 'Accessibility options',
    body: 'Tap the "Aa" button anytime to adjust text size, switch between Light and Dark mode, enable High Contrast, reduce motion, or control the 432 Hz calm sound. All settings are stored only on your device.',
    face: 'wink',
  },
  {
    selector: '[data-open-urgent]',
    title: 'Urgent support, always visible',
    body: 'If you or someone else is in immediate danger, this button is always in the header. It opens a direct link to find verified crisis helplines near you by country. Please reach out. You don\'t have to be alone.',
    face: 'care',
  },
];

function tourReadTourSeen() {
  try { return JSON.parse(localStorage.getItem('igh-tour-seen')) === true; } catch { return false; }
}
function tourMarkSeen() {
  try { localStorage.setItem('igh-tour-seen', 'true'); } catch {}
}

function tourClearHighlight() {
  if (tourHighlightedEl) {
    tourHighlightedEl.classList.remove('tour-target-highlight');
    tourHighlightedEl = null;
  }
}

/* ── Honey face animator ──
   Each tour step has a named expression. We render it by setting a data-face
   attribute on the tooltip bear, which CSS keyframes and pseudo-elements pick up.
   When reduced-motion is enabled we skip all animation and just show the base face. */
function tourSetFace(face) {
  const bearEl = tourTooltip?.querySelector('.tour-tooltip-bear');
  if (!bearEl) return;
  bearEl.dataset.face = face || 'smile';
}

/* ── Fixed tooltip positioning ──
   Uses double requestAnimationFrame so the tooltip has fully reflowed (content
   changed + scrollIntoView settled) before we measure its actual dimensions. */
function tourPositionTooltip(targetEl) {
  if (!targetEl || !tourTooltip) return;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const rect = targetEl.getBoundingClientRect();
      const tooltipW = tourTooltip.getBoundingClientRect().width || 440;
      const tooltipH = tourTooltip.getBoundingClientRect().height || 220;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 14;

      let top;
      // Prefer below, then above, then centred in viewport
      if (rect.bottom + tooltipH + margin <= vh) {
        top = rect.bottom + margin;
      } else if (rect.top - tooltipH - margin >= 0) {
        top = rect.top - tooltipH - margin;
      } else {
        // Target fills most of viewport — centre the tooltip
        top = Math.max(margin, Math.round((vh - tooltipH) / 2));
      }

      // Clamp vertically
      top = Math.max(margin, Math.min(top, vh - tooltipH - margin));

      // Centre horizontally over target, clamped inside viewport
      let left = rect.left + rect.width / 2 - tooltipW / 2;
      left = Math.max(margin, Math.min(left, vw - tooltipW - margin));

      tourTooltip.style.top = `${Math.round(top)}px`;
      tourTooltip.style.left = `${Math.round(left)}px`;
      tourTooltip.style.bottom = 'auto';
      tourTooltip.style.right = 'auto';
    });
  });
}

function tourShowStep(index) {
  if (!tourActive) return;
  tourCurrentStep = Math.max(0, Math.min(index, TOUR_STEPS.length - 1));
  const step = TOUR_STEPS[tourCurrentStep];

  // Resolve selector — steps may have a comma-separated fallback
  const selectors = step.selector.split(',').map((s) => s.trim());
  let targetEl = null;
  for (const sel of selectors) {
    targetEl = document.querySelector(sel);
    if (targetEl) break;
  }

  // Clear previous highlight
  tourClearHighlight();

  // Update tooltip content first (so it can reflow before positioning)
  if (tourStepCounter) tourStepCounter.textContent = `Step ${tourCurrentStep + 1} of ${TOUR_STEPS.length}`;
  if (tourTitle) tourTitle.textContent = step.title;
  if (tourBody) tourBody.textContent = step.body;
  tourSetFace(step.face);

  // Prev / Next button state
  if (tourPrevBtn) tourPrevBtn.hidden = tourCurrentStep === 0;
  if (tourNextBtn) {
    if (tourCurrentStep === TOUR_STEPS.length - 1) {
      tourNextBtn.textContent = 'Finish ✓';
      tourNextBtn.setAttribute('aria-label', 'Finish tour');
    } else {
      tourNextBtn.textContent = 'Next →';
      tourNextBtn.setAttribute('aria-label', 'Next step');
    }
  }

  // Highlight and scroll target into view, then position tooltip after settle
  if (targetEl) {
    tourHighlightedEl = targetEl;
    targetEl.classList.add('tour-target-highlight');
    const scrollBehavior = preferences.motion ? 'auto' : 'smooth';
    targetEl.scrollIntoView({ block: 'center', behavior: scrollBehavior });
  }

  // Wait for scroll + content reflow before measuring
  const positionDelay = preferences.motion ? 50 : 380;
  window.setTimeout(() => { tourPositionTooltip(targetEl); }, positionDelay);

  // Announce to screen readers
  if (tourLive) {
    tourLive.textContent = '';
    window.setTimeout(() => {
      tourLive.textContent = `Tour step ${tourCurrentStep + 1} of ${TOUR_STEPS.length}: ${step.title}. ${step.body}`;
    }, 80);
  }

  // Focus the Next button for keyboard users
  window.setTimeout(() => { if (tourNextBtn) tourNextBtn.focus(); }, 140);
}

function startTour() {
  if (tourActive) return;
  tourActive = true;
  tourCurrentStep = 0;

  // Hide invite strip
  if (tourInvite) tourInvite.hidden = true;

  // Show overlay and tooltip
  if (tourOverlay) { tourOverlay.hidden = false; tourOverlay.classList.add('is-active'); }
  if (tourTooltip) tourTooltip.hidden = false;

  tourShowStep(0);
  tourMarkSeen();
}

function endTour() {
  tourActive = false;
  tourClearHighlight();

  if (tourOverlay) { tourOverlay.classList.remove('is-active'); tourOverlay.hidden = true; }
  if (tourTooltip) tourTooltip.hidden = true;
  if (tourInvite) tourInvite.hidden = true;

  if (tourLive) tourLive.textContent = 'Tour ended. You can restart it anytime from the Accessibility panel.';
}

// Wire up tour buttons
if (tourNextBtn) {
  tourNextBtn.addEventListener('click', () => {
    if (tourCurrentStep >= TOUR_STEPS.length - 1) { endTour(); } else { tourShowStep(tourCurrentStep + 1); }
  });
}
if (tourPrevBtn) tourPrevBtn.addEventListener('click', () => { tourShowStep(tourCurrentStep - 1); });
if (tourEndBtn) tourEndBtn.addEventListener('click', endTour);

// Overlay click ends tour
if (tourOverlay) {
  tourOverlay.addEventListener('click', (event) => { if (event.target === tourOverlay) endTour(); });
}

// Keyboard navigation: Arrow keys step, Escape ends
document.addEventListener('keydown', (event) => {
  if (!tourActive) return;
  if (event.key === 'Escape') { event.preventDefault(); endTour(); }
  if (event.key === 'ArrowRight') { event.preventDefault(); if (tourCurrentStep < TOUR_STEPS.length - 1) tourShowStep(tourCurrentStep + 1); else endTour(); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); if (tourCurrentStep > 0) tourShowStep(tourCurrentStep - 1); }
});

// Reposition on resize
window.addEventListener('resize', () => {
  if (!tourActive) return;
  const step = TOUR_STEPS[tourCurrentStep];
  const selectors = step.selector.split(',').map((s) => s.trim());
  let el = null;
  for (const sel of selectors) { el = document.querySelector(sel); if (el) break; }
  if (el) tourPositionTooltip(el);
}, { passive: true });

// Invite strip buttons
if (tourInviteStart) tourInviteStart.addEventListener('click', startTour);
if (tourInviteSkip) {
  tourInviteSkip.addEventListener('click', () => { tourMarkSeen(); if (tourInvite) tourInvite.hidden = true; });
}

// Re-launch from accessibility panel
if (tourLaunchButton) {
  tourLaunchButton.addEventListener('click', () => {
    document.querySelector('#accessibility-dialog')?.close();
    window.setTimeout(startTour, 220);
  });
}

// Show invite on first visit after a short composure delay
if (!tourReadTourSeen()) {
  window.setTimeout(() => {
    if (tourInvite) tourInvite.hidden = false;
    if (tourLive) tourLive.textContent = 'A site tour is available. Honey can walk you through In Göd Hands. Look for the banner at the bottom of the page.';
  }, 2200);
}

