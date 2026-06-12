-- Einmal im Supabase SQL Editor ausführen.

create table if not exists public.projectboard_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  board_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  revision bigint not null default 1
);

alter table public.projectboard_data add column if not exists revision bigint not null default 1;
alter table public.projectboard_data enable row level security;

grant select, insert, update on table public.projectboard_data to authenticated;
revoke all on table public.projectboard_data from anon;

drop policy if exists "Users can read own projectboard" on public.projectboard_data;
create policy "Users can read own projectboard"
on public.projectboard_data for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own projectboard" on public.projectboard_data;
create policy "Users can create own projectboard"
on public.projectboard_data for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own projectboard" on public.projectboard_data;
create policy "Users can update own projectboard"
on public.projectboard_data for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create or replace function public.save_projectboard(
  p_expected_revision bigint,
  p_board_data jsonb
)
returns table (saved boolean, current_revision bigint, current_updated_at timestamptz)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_revision bigint;
  v_updated_at timestamptz;
begin
  if p_expected_revision is null then
    insert into public.projectboard_data (user_id, board_data, revision, updated_at)
    values (auth.uid(), p_board_data, 1, now())
    on conflict (user_id) do nothing
    returning projectboard_data.revision, projectboard_data.updated_at into v_revision, v_updated_at;
  else
    update public.projectboard_data
    set board_data = p_board_data, revision = revision + 1, updated_at = now()
    where user_id = auth.uid() and revision = p_expected_revision
    returning projectboard_data.revision, projectboard_data.updated_at into v_revision, v_updated_at;
  end if;

  if found then
    return query select true, v_revision, v_updated_at;
    return;
  end if;

  select d.revision, d.updated_at into v_revision, v_updated_at
  from public.projectboard_data d where d.user_id = auth.uid();
  return query select false, v_revision, v_updated_at;
end;
$$;

revoke all on function public.save_projectboard(bigint, jsonb) from public;
grant execute on function public.save_projectboard(bigint, jsonb) to authenticated;
