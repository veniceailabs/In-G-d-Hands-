create or replace function public.set_team_support_request_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_team_support_request_updated_at() from public;

drop trigger if exists team_support_requests_touch_updated_at on public.team_support_requests;
create trigger team_support_requests_touch_updated_at
before update on public.team_support_requests
for each row execute function public.set_team_support_request_updated_at();
