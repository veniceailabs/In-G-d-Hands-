create extension if not exists pgcrypto;

-- This is deliberately not a wellness profile. Each row is an optional,
-- unlinked count of one completed practice and one three-choice response.
create table if not exists public.anonymous_practice_feedback (
  id uuid primary key default gen_random_uuid(),
  practice_id text not null check (practice_id in ('breathe', 'ground', 'brain-dump', 'next', 'connection', 'rest', 'movement')),
  feeling text not null check (feeling in ('a little different', 'about the same', 'I want another option')),
  created_at timestamptz not null default now()
);

alter table public.anonymous_practice_feedback enable row level security;

-- No browser role can read or write feedback directly. The server route uses
-- the service role only after the person has explicitly enabled this setting.
revoke all on table public.anonymous_practice_feedback from anon, authenticated;

comment on table public.anonymous_practice_feedback is
  'Optional anonymous practice feedback. Contains no user ID, contact information, chat, reflection, IP address, or device identifier.';
