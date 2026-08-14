# In Göd Hands

A calm, non-clinical first-step experience for people who feel anxious, overwhelmed, disconnected, mentally exhausted, or unsure where to begin.

## Current private MVP

The self-guided core is intentionally local to the person's browser. The connected scope is deliberately narrow:

- state-based, user-selected support paths;
- brief, non-diagnostic reflection prompts;
- private practices and Honey conversation history remain on the current page only;
- an optional, consented request for a team check-in is sent only to the protected server queue after the app confirms that queue is available;
- visible urgent-support entry point;
- keyboard-friendly dialogs and phone-responsive layout.
- a persistent dark mode, text-size controls, high-contrast option, and reduced-motion option;
- Honey, a clearly disclosed automated support guide, plus a private request-to-speak-with-the-team path.
- an off-by-default, anonymous practice-feedback choice that sends only a practice category and optional three-choice response - never writing, chat, account ID, or contact details.
- optional on-device audio for each practice when a browser supports built-in speech; it starts only when chosen, can be stopped at any time, and never records or transmits voice or writing.

It is not therapy, diagnosis, treatment, or an emergency service.

For the precise boundary between the live private MVP and the human governance required before a wider launch, read [MVP readiness](MVP_READINESS.md).

The resource layer intentionally links to the independently maintained [Find A Helpline](https://findahelpline.com/) directory rather than guessing a visitor's country or emergency number. It opens separately and does not require an In Göd Hands account.

## Run locally

Open `index.html` in a static local server. For example:

```sh
python3 -m http.server 4474 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:4474`.

## Vercel

This folder deploys as a static Vercel project without a build command. `vercel.json` adds a small baseline of browser security headers, and the connected GitHub `main` branch supplies production deployments.

## Supabase - privacy-first storage boundary

The live Supabase project is limited to three explicitly bounded uses:

1. an optional anonymous Auth account, created only after a security check;
2. a server-only queue for a person who consents to send a contact method and a team-check-in request;
3. off-by-default aggregate practice feedback containing only a practice category and one fixed response.

Reflections, selected feelings, private writing, Honey transcripts, contacts not submitted to the team, and a browser or device identifier are not stored as part of the product's wellness experience. The browser uses no Supabase service-role credential; that credential stays server-only. Any new category of storage requires an approved data inventory, retention/deletion procedure, consent language, row-level security, and qualified privacy, legal, and clinical review.

### Optional private spaces

The site supports an optional anonymous Supabase Auth account. It asks for no name, email, phone number, health profile, contacts, or location; it creates only a random technical account identifier and keeps the issued session in browser session storage. The account is not recoverable after browser data is cleared or on another device, and the user can delete the anonymous account from the privacy panel.

Private-space setup requires **Anonymous Sign-Ins** in Supabase Auth and Cloudflare Turnstile with `TURNSTILE_SITE_KEY` and the sensitive `TURNSTILE_SECRET_KEY` in Vercel. The widget is loaded only after a person asks to create a private space, and the server validates every token before it asks Supabase to create an anonymous account. The site safely shows a setup message if these requirements are unavailable. Do not claim that no technical information is ever processed: hosting and security services may process limited operational information such as IP address and browser data.

### Honey availability protection

Honey keeps a short, in-memory pace limit for ordinary messages from the same technical connection. It is not a profile, database record, or chat history, and urgent-safety and professional-resource responses bypass it. This protects a small local model from bursts while preserving the immediate safety path.

### Installable, private offline shell

The public app is installable from supported browsers. Its shell and self-guided practices can open during a temporary connection loss; Honey, private-space creation/deletion, Turnstile, team check-ins, and external resources remain online-only. The app does not queue messages, contact details, or private writing for later transmission.

The team-support migrations create the minimal server-only queue for consented requests to speak with the team; they deliberately create no browser-access policy. [`20260814003000_add_anonymous_practice_feedback.sql`](supabase/migrations/20260814003000_add_anonymous_practice_feedback.sql) creates the separate aggregate-only feedback table, also with no browser policy.

### Private owner support queue

`/team-queue` is an intentionally unlinked owner console for reviewing only the requests a person consented to share. A person must provide an email or phone number and expressly consent before a request is stored, so the team has a way to reply; that contact detail is not used to create a wellness profile. After submitting, they can withdraw that request from the same browser session using a random one-time token; only a one-way hash of the token reaches the database. The console is not public, does not persist a password in the browser, uses a secure HTTP-only 15-minute session, and supports `new`, `in progress`, and `closed` triage states. Before using it, set a long, unique `SUPPORT_QUEUE_PASSWORD` in Vercel for Production and Preview. Never use the Supabase service-role key as this password or place either value in frontend code.

The console is a private owner tool, not team identity or audit logging. Before giving more people access, replace the shared-password gate with approved staff authentication, role-based access, response-time ownership, and an incident process. The queue does not send notifications or imply that someone is monitoring it continuously.

### Capacity control

Set `TEAM_SUPPORT_INTAKE=paused` in Vercel whenever the team cannot truthfully take new requests. The app will say that check-ins are taking a pause and will keep the private tools and independent support directory available. Set it back to `open` when covered capacity returns. This does not prevent someone from withdrawing a request they already submitted.

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

### Local Ollama production bridge

This repository includes a deliberately narrow local gateway at `scripts/ollama-bridge.mjs`. It listens only on `127.0.0.1`, accepts only authenticated `POST /api/chat` requests, fixes the local model, limits request shape and size, and does not log message content. It is the only local service that should ever sit behind a tunnel; do **not** tunnel Ollama's own port.

1. Generate a private random `OLLAMA_BRIDGE_TOKEN` (at least 32 characters) outside the repository.
2. Run `OLLAMA_BRIDGE_TOKEN=... npm run ollama:bridge` on the Mac that runs Ollama.
3. Put an authenticated HTTPS route in front of `http://127.0.0.1:11435` (for example, a Tailscale Funnel or Cloudflare Tunnel). The gateway's bearer token remains required even behind that route.
4. In Vercel, set `AI_PROVIDER=ollama`, `OLLAMA_BASE_URL` to the tunnel's HTTPS URL, `OLLAMA_MODEL=qwen3.5:4b`, and `OLLAMA_BEARER_TOKEN` to the same private token.

The Mac must remain online for Honey to answer. The bridge handles only one model request at a time and returns quickly when it is busy or the local model takes too long; the Vercel route then gives the person a safe guided alternative. A managed VPS running the same constrained gateway is the more reliable long-term production option.

Honey keeps a short recent conversation only in the current open page so it can respond coherently. The browser does not persist the conversation, and the person can clear it immediately. Do not state that an AI provider never logs data; the in-product disclosure correctly limits the promise to In Göd Hands' own profile and transcript storage.

For team check-in requests, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel, then apply the migration to the dedicated In Göd Hands Supabase project. Do not use an existing unrelated project for this sensitive data.
