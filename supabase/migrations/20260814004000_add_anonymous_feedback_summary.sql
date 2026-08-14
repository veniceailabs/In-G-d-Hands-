-- The owner console receives aggregate counts only. This function never
-- returns an event ID, timestamp, browser detail, or any personal content.
create or replace function public.anonymous_practice_feedback_summary()
returns table (
  practice_id text,
  feeling text,
  response_count bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  select practice_id, feeling, count(*) as response_count
  from public.anonymous_practice_feedback
  group by practice_id, feeling
  order by practice_id, feeling;
$$;

revoke all on function public.anonymous_practice_feedback_summary() from public;
grant execute on function public.anonymous_practice_feedback_summary() to service_role;

comment on function public.anonymous_practice_feedback_summary() is
  'Returns only aggregate, opt-in anonymous practice-feedback counts for the protected owner console.';
