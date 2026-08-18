create extension if not exists pgcrypto;

-- Journal writing that only the anonymous private-space account that wrote it
-- can ever read. Row-level security enforces this at the database level; no
-- server route or owner console in this app queries this table, and the
-- service role used elsewhere is never used against it.
create table if not exists public.private_journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.private_journal_entries enable row level security;

create index if not exists private_journal_entries_user_id_created_at_idx
  on public.private_journal_entries (user_id, created_at desc);

create policy "People can read only their own journal entries"
  on public.private_journal_entries for select
  using (auth.uid() = user_id);

create policy "People can add only their own journal entries"
  on public.private_journal_entries for insert
  with check (auth.uid() = user_id);

create policy "People can edit only their own journal entries"
  on public.private_journal_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "People can permanently delete only their own journal entries"
  on public.private_journal_entries for delete
  using (auth.uid() = user_id);

create or replace function public.set_private_journal_entries_updated_at()
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

revoke all on function public.set_private_journal_entries_updated_at() from public;

drop trigger if exists private_journal_entries_touch_updated_at on public.private_journal_entries;
create trigger private_journal_entries_touch_updated_at
before update on public.private_journal_entries
for each row execute function public.set_private_journal_entries_updated_at();

comment on table public.private_journal_entries is
  'Private journal writing. Readable only by the anonymous account that wrote it, enforced by row-level security. Deleting a private space (auth.users row) cascades and permanently deletes its journal entries.';
