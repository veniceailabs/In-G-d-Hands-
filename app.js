const supportPaths = {
  anxious: { reflection: "It makes sense to want a little more steadiness. Would one of these feel supportive?", options: [["2 min", "A slow reset", "Let your breath settle into a kinder rhythm."], ["3 min", "Ground in the room", "Notice a few simple things around you."], ["5 min", "Make space for the next thing", "Choose one gentle action before you continue."]] },
  overwhelmed: { reflection: "You do not have to solve everything right now. Let’s make room for one manageable step.", options: [["3 min", "A simple brain-dump", "Put down what is circling in your mind."], ["5 min", "Sort what is here", "Choose: now, later, or let it go."], ["2 min", "One next step", "Name one thing that would ease the weight a little."]] },
  lonely: { reflection: "Wanting connection is deeply human. You can take this at your own pace.", options: [["2 min", "Write a warm message", "Start a note to someone you trust - you decide whether to send it."], ["3 min", "Feel a little less alone", "A gentle reminder of the people and places that have held you."], ["5 min", "Find your support circle", "Think through who could be a caring next contact."]] },
  tired: { reflection: "You have been carrying a lot. Rest does not need to be earned.", options: [["2 min", "A permission slip to pause", "Let yourself stop for one small breath."], ["4 min", "Check in with your needs", "Water, food, quiet, movement, or rest - what feels possible?"], ["5 min", "Close the day gently", "Make a tiny plan that protects your remaining energy."]] },
  unsure: { reflection: "You do not need the perfect words. We can begin with what feels most possible.", options: [["2 min", "Arrive where you are", "A simple pause to notice your body and breath."], ["3 min", "Follow a gentle prompt", "Give a few words to what has been with you."], ["5 min", "Explore a small support menu", "See a handful of ideas without having to choose a label."]] },
};

const root = document.documentElement;
const supportDialog = document.querySelector('#support-dialog');
const reflectionDialog = document.querySelector('#reflection-dialog');
const urgentDialog = document.querySelector('#urgent-dialog');
const accessibilityDialog = document.querySelector('#accessibility-dialog');
const teamDialog = document.querySelector('#team-dialog');
const supportReflection = document.querySelector('#support-reflection');
const supportOptions = document.querySelector('#support-options');
const completion = document.querySelector('#completion');
const chatDrawer = document.querySelector('#chat-drawer');
const chatMessages = document.querySelector('#chat-messages');
const chatInput = document.querySelector('#chat-input');

function readPreferences() {
  try { return JSON.parse(localStorage.getItem('igh-preferences')) || {}; } catch { return {}; }
}
function savePreferences(next) { localStorage.setItem('igh-preferences', JSON.stringify(next)); }
let preferences = { theme: 'system', textScale: 'default', contrast: false, motion: false, ...readPreferences() };

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

function showSupport(state) {
  const path = supportPaths[state];
  supportReflection.textContent = path.reflection;
  supportOptions.replaceChildren(...path.options.map(([time, title, copy]) => {
    const option = document.createElement('button');
    option.type = 'button'; option.className = 'support-option';
    option.innerHTML = `<span class="option-time">${time}</span><span><span class="option-title">${title}</span><span class="option-copy">${copy}</span></span><span class="option-arrow" aria-hidden="true">→</span>`;
    option.addEventListener('click', completeMoment); return option;
  }));
  supportDialog.showModal();
}
function completeMoment() { supportDialog.close(); completion.hidden = false; window.setTimeout(() => { completion.hidden = true; }, 5000); }
function closeChat() { chatDrawer.hidden = true; document.querySelector('[data-open-chat]').focus(); }
function openChat() { chatDrawer.hidden = false; chatInput.focus(); }
function addMessage(text, kind = 'assistant') { const message = document.createElement('article'); message.className = `message ${kind}`; message.textContent = text; chatMessages.append(message); chatMessages.scrollTop = chatMessages.scrollHeight; return message; }

document.querySelectorAll('[data-state]').forEach((button) => button.addEventListener('click', () => showSupport(button.dataset.state)));
document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('[data-open-reflection]').forEach((button) => button.addEventListener('click', () => { urgentDialog.close(); reflectionDialog.showModal(); }));
document.querySelectorAll('[data-open-urgent]').forEach((button) => button.addEventListener('click', () => urgentDialog.showModal()));
document.querySelector('[data-back]').addEventListener('click', () => supportDialog.close());
document.querySelector('[data-reflect]').addEventListener('click', () => { const reflection = document.querySelector('#reflection-input').value.trim(); reflectionDialog.close(); showSupport('unsure'); if (reflection) supportReflection.textContent = "Thank you for putting that into words. You do not have to carry it all at once. Which of these feels possible?"; });
[supportDialog, reflectionDialog, urgentDialog, accessibilityDialog, teamDialog].forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));

document.querySelector('[data-open-accessibility]').addEventListener('click', () => accessibilityDialog.showModal());
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
  } catch (error) { pending.remove(); addMessage('Honey’s live chat connection is not available just yet. You can still choose a gentle support path here or request a check-in with the team.'); }
});

document.querySelector('#team-support-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget; const status = document.querySelector('#team-form-status'); const submit = form.querySelector('[type="submit"]');
  const payload = { name: form.name.value.trim(), contact: form.contact.value.trim(), note: form.note.value.trim(), consent: form.consent.checked };
  submit.disabled = true; status.textContent = 'Sending your request…';
  try {
    const response = await fetch('/api/support-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json(); if (!response.ok) throw new Error(result.error || 'We could not send your request.');
    form.reset(); status.textContent = 'Your request is received. A team member will respond through the contact method you shared, when available.';
  } catch (error) { status.textContent = 'Requests are not connected yet. Please try again later or use the support tools in the app.'; }
  finally { submit.disabled = false; }
});
