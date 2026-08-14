const loginSection = document.querySelector('#owner-login');
const queueSection = document.querySelector('#owner-queue');
const loginForm = document.querySelector('#owner-login-form');
const loginStatus = document.querySelector('#owner-login-status');
const queueStatus = document.querySelector('#queue-status');
const queueSummary = document.querySelector('#queue-summary');
const queuePulse = document.querySelector('#queue-pulse');
const queueList = document.querySelector('#queue-list');
const loadMoreButton = document.querySelector('[data-load-more]');
let currentFilter = 'all';
let nextOffset = 0;
let loadedCount = 0;
let queueLoading = false;

function applySharedPreferences() {
  let preferences = {};
  try { preferences = JSON.parse(localStorage.getItem('igh-preferences')) || {}; } catch { /* The owner console remains usable without storage. */ }
  const theme = preferences.theme === 'system' || !preferences.theme ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : preferences.theme;
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.textScale = preferences.textScale || 'default';
  document.documentElement.dataset.highContrast = String(Boolean(preferences.contrast));
  document.documentElement.dataset.reducedMotion = String(Boolean(preferences.motion));
}
applySharedPreferences();

function clearQueueDetails() {
  queueList.replaceChildren();
  queueSummary.textContent = '';
  queuePulse.replaceChildren();
  queuePulse.hidden = true;
  queueStatus.textContent = '';
  loadMoreButton.hidden = true;
  nextOffset = 0;
  loadedCount = 0;
}
function showLogin(message = '') {
  clearQueueDetails();
  queueSection.hidden = true; loginSection.hidden = false;
  loginStatus.textContent = message;
  document.querySelector('#owner-password').focus();
}
function showQueue() { loginSection.hidden = true; queueSection.hidden = false; }
function requestLabel(status) { return status === 'in_progress' ? 'In progress' : status[0].toUpperCase() + status.slice(1); }
function dateLabel(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
function textElement(tag, text, className = '') {
  const element = document.createElement(tag); element.textContent = text; if (className) element.className = className; return element;
}
function queuePulseItem(label, value, detail = '') {
  const item = document.createElement('div'); item.className = 'queue-pulse-item';
  item.append(textElement('span', label, 'queue-pulse-label'), textElement('strong', value));
  if (detail) item.append(textElement('span', detail, 'queue-pulse-detail'));
  return item;
}
function renderQueuePulse(pulse) {
  if (!pulse || !Number.isSafeInteger(pulse.newCount) || !Number.isSafeInteger(pulse.inProgressCount)) {
    queuePulse.replaceChildren(); queuePulse.hidden = true; return;
  }
  const oldest = pulse.oldestNewAt ? dateLabel(pulse.oldestNewAt) : 'None waiting';
  queuePulse.replaceChildren(
    queuePulseItem('New', String(pulse.newCount), pulse.newCount === 1 ? 'Needs a first look' : 'Need a first look'),
    queuePulseItem('In progress', String(pulse.inProgressCount), pulse.inProgressCount === 1 ? 'Being reviewed' : 'Being reviewed'),
    queuePulseItem('Oldest new', oldest, pulse.oldestNewAt ? 'Received first' : 'Queue is clear'),
  );
  queuePulse.hidden = false;
}

function renderRequest(item) {
  const card = document.createElement('article'); card.className = 'queue-card';
  const header = document.createElement('div'); header.className = 'queue-card-header';
  const meta = document.createElement('div'); meta.append(textElement('strong', item.contact_name || 'No name shared'), textElement('p', `Received ${dateLabel(item.created_at)}`));
  const select = document.createElement('select'); select.className = 'queue-status-select'; select.setAttribute('aria-label', `Status for request from ${item.contact_name || 'a person'}`);
  ['new', 'in_progress', 'closed'].forEach((status) => { const option = new Option(requestLabel(status), status, false, item.status === status); select.add(option); });
  select.addEventListener('change', async () => {
    const nextStatus = select.value; select.disabled = true; queueStatus.textContent = 'Updating request status…';
    try {
      const response = await fetch('/api/support-queue', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, status: nextStatus }) });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) return showLogin('Your private session has ended. Please sign in again.');
      if (!response.ok) throw new Error(result.error || 'The status could not be updated.');
      item.status = result.request.status; queueStatus.textContent = 'Request status updated.';
    } catch (error) { select.value = item.status; queueStatus.textContent = error.message || 'The status could not be updated.'; }
    finally { select.disabled = false; }
  });
  header.append(meta, select); card.append(header);
  const contact = textElement('p', item.contact_detail || 'No contact detail shared', 'queue-contact'); card.append(contact);
  const note = textElement('p', item.request_note, 'queue-note'); card.append(note);
  card.append(textElement('p', `Consent recorded ${dateLabel(item.consented_at)}.`, 'queue-consent'));
  return card;
}

async function loadQueue({ append = false } = {}) {
  if (queueLoading) return;
  queueLoading = true; loadMoreButton.disabled = true;
  queueStatus.textContent = append ? 'Loading more requests…' : 'Loading requests…';
  if (!append) { queueList.replaceChildren(); nextOffset = 0; loadedCount = 0; }
  try {
    const response = await fetch(`/api/support-queue?status=${encodeURIComponent(currentFilter)}&offset=${nextOffset}`, { cache: 'no-store' });
    const result = await response.json().catch(() => ({}));
    if (response.status === 401) return showLogin('Your private session has ended. Please sign in again.');
    if (!response.ok || !Array.isArray(result.requests)) throw new Error(result.error || 'Requests are unavailable right now.');
    loadedCount += result.requests.length; nextOffset = result.nextOffset;
    renderQueuePulse(result.pulse);
    const totalLabel = Number.isInteger(result.total) ? `${loadedCount} of ${result.total}` : String(loadedCount);
    queueSummary.textContent = `${totalLabel} ${loadedCount === 1 ? 'request' : 'requests'} loaded · ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    queueStatus.textContent = '';
    if (!loadedCount) queueList.append(textElement('p', 'There are no requests in this view right now.', 'queue-empty'));
    else queueList.append(...result.requests.map(renderRequest));
    loadMoreButton.hidden = !result.hasMore;
  } catch (error) { queueStatus.textContent = error.message || 'Requests are unavailable right now.'; }
  finally { queueLoading = false; loadMoreButton.disabled = false; }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); const password = loginForm.password.value; const submit = loginForm.querySelector('button[type="submit"]');
  submit.disabled = true; loginStatus.textContent = 'Signing in…';
  try {
    const response = await fetch('/api/team-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Unable to sign in.');
    loginForm.reset(); showQueue(); loadQueue();
  } catch (error) { loginStatus.textContent = error.message || 'Unable to sign in.'; }
  finally { submit.disabled = false; }
});

document.querySelectorAll('[data-queue-filter]').forEach((button) => button.addEventListener('click', () => {
  currentFilter = button.dataset.queueFilter;
  document.querySelectorAll('[data-queue-filter]').forEach((option) => { const selected = option === button; option.classList.toggle('is-selected', selected); option.setAttribute('aria-pressed', String(selected)); });
  loadQueue();
}));
document.querySelector('[data-refresh-queue]').addEventListener('click', loadQueue);
loadMoreButton.addEventListener('click', () => loadQueue({ append: true }));
document.querySelector('[data-sign-out]').addEventListener('click', async () => {
  try { await fetch('/api/team-session', { method: 'DELETE' }); }
  finally { showLogin('Signed out.'); }
});

(async () => {
  try {
    const response = await fetch('/api/team-session', { cache: 'no-store' }); const result = await response.json().catch(() => ({}));
    if (response.ok && result.signedIn) { showQueue(); loadQueue(); }
    else showLogin(result.configured === false ? 'This private console still needs a Vercel owner password.' : '');
  } catch { showLogin('The private console is unavailable right now.'); }
})();
