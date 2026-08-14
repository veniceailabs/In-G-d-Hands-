create extension if not exists pgcrypto;

create table if not exists public.team_support_requests (
  id uuid primary key default gen_random_uuid(),
  contact_name text check (char_length(contact_name) <= 80),
  contact_detail text check (char_length(contact_detail) <= 180),
  request_note text not null check (char_length(request_note) between 2 and 1000),
  consented_at timestamptz not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.team_support_requests enable row level security;

-- No browser role receives a policy. Only the server-side support-request function,
-- using the service role stored in Vercel, can write or read these requests.
