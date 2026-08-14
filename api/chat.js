const urgentPattern = /\b(?:kill myself|suicide|end my life|take my life|end it all|ending it|hurt myself|self[- ]?harm|not safe|immediate danger|want to die|(?:can(?:not|'t)|can not)\s+(?:keep|stay)\s+(?:myself\s+)?safe|(?:i(?:'m| am)|feel)\s+unsafe|(?:hurt|harm)\s+(?:myself|someone|another person|them)|(?:take|took)\s+(?:an\s+)?overdose|overdos(?:e|ed|ing))\b/i;

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

function normalizeHistory(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(-6).flatMap((entry) => {
    if (!entry || !['user', 'assistant'].includes(entry.role) || typeof entry.content !== 'string') return [];
    const content = entry.content.trim();
    return content && content.length <= 800 ? [{ role: entry.role, content }] : [];
  });
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

  const systemPrompt = 'You are Honey, a warm, concise, non-clinical support guide in In Göd Hands. Never diagnose, prescribe treatment, claim to be a therapist, or imply human availability. Offer validation and one small, low-risk next step. If a message signals immediate danger, tell the person to use urgent support and contact local emergency help or a trusted nearby person. Do not provide self-harm instructions. Keep responses under 110 words.';
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
      const ollamaOutput = normalizeHoneyMessage(ollamaPayload?.message?.content);
      if (!ollamaOutput) throw new Error('Ollama returned no message.');
      return reply(response, 200, { type: 'support', message: ollamaOutput });
    }

    const { AI_BASE_URL, AI_API_KEY, AI_MODEL } = process.env;
    if (!AI_BASE_URL || !AI_API_KEY || !AI_MODEL) return reply(response, 503, { error: 'Honey is not configured yet.' });
    const providerResponse = await fetch(`${AI_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${AI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: AI_MODEL, temperature: 0.55, max_tokens: 180, messages: [
        { role: 'system', content: systemPrompt }, ...history,
        { role: 'user', content: message },
      ] }),
    });
    if (!providerResponse.ok) throw new Error(`Provider returned ${providerResponse.status}`);
    const payload = await providerResponse.json(); const output = normalizeHoneyMessage(payload?.choices?.[0]?.message?.content);
    if (!output) throw new Error('Provider returned no message.');
    return reply(response, 200, { type: 'support', message: output });
  } catch { return reply(response, 502, { error: 'Honey could not reach the support service.' }); }
}
