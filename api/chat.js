const urgentPattern = /\b(kill myself|suicide|end my life|hurt myself|self[- ]?harm|not safe|immediate danger|want to die)\b/i;

function reply(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').send(JSON.stringify(body));
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return reply(response, 405, { error: 'Method not allowed.' });
  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : '';
  if (!message || message.length > 800) return reply(response, 400, { error: 'Please send a message of up to 800 characters.' });
  if (urgentPattern.test(message)) return reply(response, 200, {
    type: 'urgent',
    message: 'I’m really glad you told me. Your immediate safety matters more than this chat. Please use the urgent-support option now to contact local emergency help or a trusted person nearby.',
  });

  const { AI_BASE_URL, AI_API_KEY, AI_MODEL } = process.env;
  if (!AI_BASE_URL || !AI_API_KEY || !AI_MODEL) return reply(response, 503, { error: 'Honey is not configured yet.' });
  try {
    const providerResponse = await fetch(`${AI_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${AI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: AI_MODEL, temperature: 0.55, max_tokens: 180, messages: [
        { role: 'system', content: 'You are Honey, a warm, concise, non-clinical support guide in In Göd Hands. Never diagnose, prescribe treatment, claim to be a therapist, or imply human availability. Offer validation and one small, low-risk next step. If a message signals immediate danger, tell the person to use urgent support and contact local emergency help or a trusted nearby person. Do not provide self-harm instructions. Keep responses under 110 words.' },
        { role: 'user', content: message },
      ] }),
    });
    if (!providerResponse.ok) throw new Error(`Provider returned ${providerResponse.status}`);
    const payload = await providerResponse.json(); const output = payload?.choices?.[0]?.message?.content?.trim();
    if (!output) throw new Error('Provider returned no message.');
    return reply(response, 200, { type: 'support', message: output });
  } catch { return reply(response, 502, { error: 'Honey could not reach the support service.' }); }
}
