# In Göd Hands

A calm, non-clinical first-step experience for people who feel anxious, overwhelmed, disconnected, mentally exhausted, or unsure where to begin.

## Current prototype

The first interactive surface is intentionally local-only:

- state-based, user-selected support paths;
- brief, non-diagnostic reflection prompts;
- no data collection or network submission;
- visible urgent-support entry point;
- keyboard-friendly dialogs and phone-responsive layout.
- a persistent dark mode, text-size controls, high-contrast option, and reduced-motion option;
- Honey, a clearly disclosed automated support guide, plus a private request-to-speak-with-the-team path.

It is not therapy, diagnosis, treatment, or an emergency service.

## Run locally

Open `index.html` in a static local server. For example:

```sh
python3 -m http.server 4474 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:4474`.

## Vercel

This folder can be imported as a static Vercel project without a build command. `vercel.json` adds a small baseline of browser security headers. Deployment is intentionally not initiated from this workspace.

## Supabase - planned integration boundary

Do not connect Supabase until the product has an approved data inventory, retention schedule, and consent wording. The initial safe storage scope should be limited to the user's explicit choices:

1. account and authentication only when an account is chosen by the user;
2. consent records, including scope, version, and withdrawal;
3. optional saved reflections and selected support-tool feedback;
4. user-controlled export and deletion.

The browser must use only the Supabase project URL and publishable/anon key. Keep service-role credentials server-only. Before any live storage is enabled, define row-level security, account deletion, retention, support-resource jurisdiction, and the crisis escalation experience with qualified privacy, legal, and clinical advisors.

The first migration, [`supabase/migrations/20260814000000_team_support_requests.sql`](supabase/migrations/20260814000000_team_support_requests.sql), creates the minimal server-only queue for consented requests to speak with the team. It deliberately creates no browser-access policy.

## Honey chat configuration

Honey is a server-side API route (`/api/chat`) designed for an OpenAI-compatible provider. To activate it, add these production environment variables in Vercel:

```text
AI_BASE_URL
AI_API_KEY
AI_MODEL
```

Honey also supports local Ollama. For local development, use:

```text
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3.5:4b
```

The public Vercel deployment cannot connect directly to Ollama on a private Mac address. Production Ollama therefore needs a dedicated, authenticated HTTPS bridge or a private VPS endpoint; `OLLAMA_BEARER_TOKEN` is supported for that boundary. Do not expose Ollama directly to the public internet.

For team check-in requests, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel, then apply the migration to the dedicated In Göd Hands Supabase project. Do not use an existing unrelated project for this sensitive data.
