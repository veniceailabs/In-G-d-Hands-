import { createHmac, timingSafeEqual } from 'node:crypto';

const cookieName = 'igh_support_owner';
const sessionSeconds = 15 * 60;
const usernamePattern = /^[a-z0-9_-]{1,40}$/i;

function staffAccounts() {
  const raw = process.env.TEAM_STAFF_CREDENTIALS || '';
  const accounts = new Map();
  for (const entry of raw.split(',')) {
    const separator = entry.indexOf(':');
    if (separator < 1) continue;
    const username = entry.slice(0, separator).trim();
    const password = entry.slice(separator + 1).trim();
    if (!usernamePattern.test(username) || password.length < 12) continue;
    accounts.set(username.toLowerCase(), { username, password });
  }
  return accounts;
}

function sign(username, expiresAt, password) { return createHmac('sha256', password).update(`${username}.${expiresAt}`).digest('base64url'); }
function cookieValue(request) {
  const cookies = String(request.headers?.cookie || '').split(';').map((part) => part.trim());
  return cookies.find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1) || '';
}
function sameSecret(left, right) {
  const a = Buffer.from(left); const b = Buffer.from(right);
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

export function ownerConsoleConfigured() { return staffAccounts().size > 0; }

export function staffCredentialsMatch(username, password) {
  if (typeof username !== 'string' || typeof password !== 'string' || password.length > 512) return null;
  const account = staffAccounts().get(username.trim().toLowerCase());
  if (!account || !sameSecret(password, account.password)) return null;
  return account.username;
}

export function ownerSessionUser(request) {
  const [username, expiresAt, signature, ...extra] = cookieValue(request).split('.');
  if (extra.length || !username || !usernamePattern.test(username) || !/^\d{13}$/.test(expiresAt) || !signature) return null;
  const account = staffAccounts().get(username.toLowerCase());
  if (!account) return null;
  if (Number(expiresAt) <= Date.now()) return null;
  return sameSecret(signature, sign(account.username, expiresAt, account.password)) ? account.username : null;
}

export function ownerSessionIsValid(request) { return ownerSessionUser(request) !== null; }

export function setOwnerSession(response, username) {
  const expiresAt = String(Date.now() + (sessionSeconds * 1000));
  const account = staffAccounts().get(String(username).toLowerCase());
  if (!account) return;
  response.setHeader('Set-Cookie', `${cookieName}=${account.username}.${expiresAt}.${sign(account.username, expiresAt, account.password)}; Max-Age=${sessionSeconds}; Path=/; HttpOnly; Secure; SameSite=Strict`);
}
export function clearOwnerSession(response) {
  response.setHeader('Set-Cookie', `${cookieName}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`);
}
