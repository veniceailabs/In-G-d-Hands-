alter table public.team_support_requests
add column if not exists updated_by text check (char_length(updated_by) <= 40);

comment on column public.team_support_requests.updated_by is
  'Username of the signed-in staff member who last changed this request''s status. Set only by the server-side support-queue function.';
