alter table public.team_support_requests
add column if not exists withdrawal_token_hash text;

comment on column public.team_support_requests.withdrawal_token_hash is
  'One-way hash of a browser-session withdrawal token; never exposed to the browser after submission.';
