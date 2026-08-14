import { createServer } from 'node:http';
import { timingSafeEqual } from 'node:crypto';

const port = Number(process.env.OLLAMA_BRIDGE_PORT || 11435);
const token = process.env.OLLAMA_BRIDGE_TOKEN || '';
const model = process.env.OLLAMA_MODEL || 'qwen3.5:4b';
const ollamaBaseUrl = new URL(process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434');
const localHosts = new Set(['127.0.0.1', 'localhost', '::1']);

if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('OLLAMA_BRIDGE_PORT must be a valid non-privileged port.');
if (token.length < 32) throw new Error('OLLAMA_BRIDGE_TOKEN must be a private random value of at least 32 characters.');
if (!localHosts.has(ollamaBaseUrl.hostname)) throw new Error('OLLAMA_BASE_URL must point to local Ollama, not a remote host.');

function send(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(body));
}

function hasValidToken(authorization = '') {
  const expected = Buffer.from(`Bearer ${token}`);
  const received = Buffer.from(authorization);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 32_000) request.destroy(new Error('Request body is too large.'));
    });
    request.on('end', () => {
      try { resolve(JSON.parse(body)); } catch { reject(new Error('Request body must be valid JSON.')); }
    });
    request.on('error', reject);
  });
}

function messagesAreAllowed(messages) {
  return Array.isArray(messages)
    && messages.length > 0
    && messages.length <= 8
    && messages.every((entry) => entry
      && ['system', 'user', 'assistant'].includes(entry.role)
      && typeof entry.content === 'string'
      && entry.content.length > 0
      && entry.content.length <= 1_200);
}

const server = createServer(async (request, response) => {
  if (request.method !== 'POST' || request.url !== '/api/chat') return send(response, 404, { error: 'Not found.' });
  if (!hasValidToken(request.headers.authorization)) return send(response, 401, { error: 'Unauthorized.' });

  try {
    const input = await readJson(request);
    if (!messagesAreAllowed(input?.messages)) return send(response, 400, { error: 'A valid Honey chat request is required.' });
    const upstream = await fetch(new URL('/api/chat', ollamaBaseUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        think: false,
        options: { temperature: 0.45, num_predict: 100 },
        messages: input.messages,
      }),
    });
    if (!upstream.ok) return send(response, 502, { error: 'Local Honey service is unavailable.' });
    const payload = await upstream.json();
    if (typeof payload?.message?.content !== 'string') return send(response, 502, { error: 'Local Honey service returned an invalid response.' });
    return send(response, 200, { message: { content: payload.message.content } });
  } catch {
    return send(response, 502, { error: 'Local Honey service is unavailable.' });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Honey bridge listening on http://127.0.0.1:${port}.`);
});

function stop() { server.close(() => process.exit(0)); }
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
