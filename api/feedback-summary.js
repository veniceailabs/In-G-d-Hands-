import { ownerSessionIsValid } from './_team-access.js';

const practiceIds = new Set(['breathe', 'ground', 'brain-dump', 'next', 'connection', 'rest', 'movement']);
const feelings = new Set(['a little different', 'about the same', 'I want another option']);

function reply(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').setHeader('Cache-Control', 'no-store').send(JSON.stringify(body));
}

function nonNegativeInteger(value) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

function summarize(rows) {
  const byFeeling = Object.fromEntries([...feelings].map((feeling) => [feeling, 0]));
  const byPractice = Object.fromEntries([...practiceIds].map((practice) => [practice, 0]));
  for (const row of rows) {
    if (!practiceIds.has(row?.practice_id) || !feelings.has(row?.feeling)) continue;
    const count = nonNegativeInteger(row.response_count);
    if (count === null) continue;
    byFeeling[row.feeling] += count;
    byPractice[row.practice_id] += count;
  }
  const total = Object.values(byFeeling).reduce((sum, count) => sum + count, 0);
  const rankedPractices = Object.entries(byPractice).filter(([, count]) => count > 0).sort(([leftId, leftCount], [rightId, rightCount]) => rightCount - leftCount || leftId.localeCompare(rightId));
  return { total, byFeeling, mostSharedPractice: rankedPractices[0]?.[0] || null };
}

export default async function handler(request, response) {
  if (request.method !== 'GET') return reply(response, 405, { error: 'Method not allowed.' });
  if (!ownerSessionIsValid(request)) return reply(response, 401, { error: 'Sign in is required.' });
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return reply(response, 503, { error: 'Anonymous feedback is not available.' });

  try {
    const summary = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/rpc/anonymous_practice_feedback_summary`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
    });
    if (!summary.ok) throw new Error(`Supabase returned ${summary.status}`);
    const rows = await summary.json();
    if (!Array.isArray(rows)) throw new Error('Summary response was invalid.');
    return reply(response, 200, summarize(rows));
  } catch {
    return reply(response, 502, { error: 'Anonymous feedback is unavailable right now.' });
  }
}
