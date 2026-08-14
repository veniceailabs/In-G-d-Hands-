const urgentPattern = /\b(?:kill myself|suicide|end my life|take my life|end it all|ending it|hurt myself|self[- ]?harm|not safe|immediate danger|want to die|(?:can(?:not|'t)|can not)\s+(?:keep|stay)\s+(?:myself\s+)?safe|i\s+(?:do\s+not|don't|cannot|can't|can\s+not)\s+(?:feel|stay|keep)\s+(?:myself\s+)?safe|(?:i(?:'m| am)|feel)\s+unsafe|(?:hurt|harm)\s+(?:myself|someone|another person|them)|(?:take|took)\s+(?:an\s+)?overdose|overdos(?:e|ed|ing))\b/i;
const clinicalAdvicePattern = /\b(?:diagnos(?:e|ed|is)|do i have|medical advice|should i take (?:a |my )?(?:medication|medicine)|what medication|prescrib(?:e|ed|ing)|symptom(?:s)? of)\b/i;

function reply(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').send(JSON.stringify(body));
}

function normalizeHoneyMessage(value) {
  const clean = String(value || '').replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  const words = clean.split(/\s+/);
  if (words.length <= 110) return clean;
  const shortened = words.slice(0, 110).join(' ');
  const sentenceEnd = Math.max(shortened.lastIndexOf('.'), shortened.lastIndexOf('!'), shortened.lastIndexOf('?'));
  return sentenceEnd > 70 ? shortened.slice(0, sentenceEnd + 1) : `${shortened}…`;
}

const reassuranceOrOverstatementPattern = /\b(?:you(?:'re| are) (?:going to|gonna|will) (?:be okay|be fine)|everything (?:will|is going to) (?:be okay|be fine|work out)|nobody (?:wants|feels)|everyone (?:feels|knows|goes through)|your future depends)\b/i;
const steadyFallback = 'That sounds like a lot to carry. You do not have to solve all of it right now. If it helps, choose one small next step: take a slow breath, notice what is supporting you, or put a few words on a page.';

function safeHoneyOutput(value) {
  const clean = normalizeHoneyMessage(value);
  return clean && !reassuranceOrOverstatementPattern.test(clean) ? clean : steadyFallback;
}

function normalizeHistory(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(-6).flatMap((entry) => {
    if (!entry || !['user', 'assistant'].includes(entry.role) || typeof entry.content !== 'string') return [];
    const content = entry.content.trim();
    return content && content.length <= 800 ? [{ role: entry.role, content }] : [];
  });
}

function guidedHoneyReply(message) {
  const text = message.toLowerCase();
  if (/\b(?:anxious|anxiety|panic|panicked|nervous|racing|activated)\b/.test(text)) return 'We can make this smaller for a moment. Try placing both feet or hands somewhere supported, then let one exhale be a little longer than the inhale. You do not need to get it perfect.';
  if (/\b(?:overwhelmed|too much|can(?:not|\'t)|can not cope|behind|tasks?|to[- ]?do)\b/.test(text)) return 'When there is too much, it can help to choose only one lane. Write down the first thing asking for your attention, then decide: one small part now, put it in a plan, or let it wait.';
  if (/\b(?:lonely|alone|isolated|disconnected|miss)\b/.test(text)) return 'Wanting some warmth or company makes sense. If it feels okay, you could make a private draft to one familiar person. You stay in control of whether it is ever sent.';
  if (/\b(?:tired|exhausted|drained|burned out|burnt out|no energy)\b/.test(text)) return 'You do not have to earn a pause. See if one small shift feels available: loosen your shoulders, take a sip of water, or let one task wait until later.';
  return steadyFallback;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return reply(response, 405, { error: 'Method not allowed.' });
  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : '';
  const history = normalizeHistory(request.body?.history);
  if (!message || message.length > 800) return reply(response, 400, { error: 'Please send a message of up to 800 characters.' });
  if (urgentPattern.test(message)) return reply(response, 200, {
    type: 'urgent',
    message: 'I’m really glad you told me. Your immediate safety matters more than this chat. Please use the urgent-support option now to contact local emergency help or a trusted person nearby.',
  });
  if (clinicalAdvicePattern.test(message)) return reply(response, 200, {
    type: 'professional',
    message: 'I can’t assess symptoms, diagnose, or advise about medication. A licensed health professional can help with those questions. If you would like, I can point you toward additional support resources.',
  });

  const systemPrompt = 'You are Honey, a warm, concise, non-clinical AI support guide in In Göd Hands. Never diagnose, prescribe treatment, claim to be a therapist, or imply human availability. Offer gentle validation and at most one small, low-risk next step. Do not predict outcomes, give certainty-based reassurance, say that someone will be okay, or treat a feeling as universal. Do not shame, pressure, or overstate what you know. If a message signals immediate danger, direct the person to urgent support, local emergency help, or a trusted nearby person. Do not provide self-harm instructions. Keep responses under 110 words.';
  const provider = process.env.AI_PROVIDER || (process.env.OLLAMA_MODEL ? 'ollama' : 'openai-compatible');
  try {
    if (provider === 'ollama') {
      const baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
      const model = process.env.OLLAMA_MODEL || 'qwen3.5:4b';
      const headers = { 'Content-Type': 'application/json' };
      if (process.env.OLLAMA_BEARER_TOKEN) headers.Authorization = `Bearer ${process.env.OLLAMA_BEARER_TOKEN}`;
      const ollamaResponse = await fetch(`${baseUrl.replace(/\/$/, '')}/api/chat`, {
        method: 'POST', headers,
        body: JSON.stringify({ model, stream: false, think: false, options: { temperature: 0.55, num_predict: 180 }, messages: [
          { role: 'system', content: systemPrompt }, ...history,
          { role: 'user', content: message },
        ] }),
      });
      if (!ollamaResponse.ok) throw new Error(`Ollama returned ${ollamaResponse.status}`);
      const ollamaPayload = await ollamaResponse.json();
      const ollamaOutput = safeHoneyOutput(ollamaPayload?.message?.content);
      return reply(response, 200, { type: 'support', message: ollamaOutput });
    }

    const { AI_BASE_URL, AI_API_KEY, AI_MODEL } = process.env;
    if (!AI_BASE_URL || !AI_API_KEY || !AI_MODEL) return reply(response, 200, { type: 'support', mode: 'guided', message: guidedHoneyReply(message) });
    const providerResponse = await fetch(`${AI_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${AI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: AI_MODEL, temperature: 0.55, max_tokens: 180, messages: [
        { role: 'system', content: systemPrompt }, ...history,
        { role: 'user', content: message },
      ] }),
    });
    if (!providerResponse.ok) throw new Error(`Provider returned ${providerResponse.status}`);
    const payload = await providerResponse.json(); const output = safeHoneyOutput(payload?.choices?.[0]?.message?.content);
    return reply(response, 200, { type: 'support', message: output });
  } catch { return reply(response, 200, { type: 'support', mode: 'guided', message: guidedHoneyReply(message) }); }
}
