import { createHmac, timingSafeEqual } from 'node:crypto';

const cookieName = 'igh_support_owner';
const sessionSeconds = 15 * 60;

function ownerPassword() { return process.env.SUPPORT_QUEUE_PASSWORD || ''; }
function sign(value) { return createHmac('sha256', ownerPassword()).update(value).digest('base64url'); }
function cookieValue(request) {
  const cookies = String(request.headers?.cookie || '').split(';').map((part) => part.trim());
  return cookies.find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1) || '';
}
function sameSecret(left, right) {
  const a = Buffer.from(left); const b = Buffer.from(right);
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

export function ownerConsoleConfigured() { return ownerPassword().length >= 16; }
export function ownerPasswordMatches(value) { return ownerConsoleConfigured() && typeof value === 'string' && value.length <= 512 && sameSecret(value, ownerPassword()); }
export function ownerSessionIsValid(request) {
  if (!ownerConsoleConfigured()) return false;
  const [expiresAt, signature, ...extra] = cookieValue(request).split('.');
  if (extra.length || !/^\d{13}$/.test(expiresAt) || !signature) return false;
  return Number(expiresAt) > Date.now() && sameSecret(signature, sign(expiresAt));
}
export function setOwnerSession(response) {
  const expiresAt = String(Date.now() + (sessionSeconds * 1000));
  response.setHeader('Set-Cookie', `${cookieName}=${expiresAt}.${sign(expiresAt)}; Max-Age=${sessionSeconds}; Path=/; HttpOnly; Secure; SameSite=Strict`);
}
export function clearOwnerSession(response) {
  response.setHeader('Set-Cookie', `${cookieName}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`);
}
