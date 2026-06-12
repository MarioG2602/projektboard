-- Einmal im Supabase SQL Editor ausführen.

create table if not exists public.projectboard_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  board_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  revision bigint not null default 1
);

alter table public.projectboard_data add column if not exists revision bigint not null default 1;
alter table public.projectboard_data enable row level security;

create table if not exists public.projectboard_backups (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  board_data jsonb not null,
  revision bigint not null,
  created_at timestamptz not null default now()
);

create index if not exists projectboard_backups_user_created_idx
on public.projectboard_backups (user_id, created_at desc);

alter table public.projectboard_backups enable row level security;

revoke insert, update, delete on table public.projectboard_data from authenticated;
grant select on table public.projectboard_data to authenticated;
revoke all on table public.projectboard_backups from authenticated;
grant select on table public.projectboard_backups to authenticated;
revoke all on table public.projectboard_data from anon;
revoke all on table public.projectboard_backups from anon;

drop policy if exists "Users can read own projectboard" on public.projectboard_data;
create policy "Users can read own projectboard"
on public.projectboard_data for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own projectboard" on public.projectboard_data;
drop policy if exists "Users can update own projectboard" on public.projectboard_data;

drop policy if exists "Users can read own projectboard backups" on public.projectboard_backups;
create policy "Users can read own projectboard backups"
on public.projectboard_backups for select to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.save_projectboard(
  p_expected_revision bigint,
  p_board_data jsonb
)
returns table (saved boolean, current_revision bigint, current_updated_at timestamptz)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_revision bigint;
  v_updated_at timestamptz;
begin
  if v_user_id is null then
    raise exception 'Anmeldung erforderlich';
  end if;
  if p_board_data is null
     or jsonb_typeof(p_board_data) <> 'object'
     or jsonb_typeof(p_board_data -> 'projects') <> 'array'
     or coalesce((p_board_data ->> 'schemaVersion')::integer, 0) <> 2 then
    raise exception 'Ungültige Projektboard-Daten';
  end if;
  if pg_column_size(p_board_data) > 5242880 then
    raise exception 'Projektboard-Daten überschreiten 5 MB';
  end if;

  if p_expected_revision is null then
    insert into public.projectboard_data (user_id, board_data, revision, updated_at)
    values (v_user_id, p_board_data, 1, now())
    on conflict (user_id) do nothing
    returning projectboard_data.revision, projectboard_data.updated_at into v_revision, v_updated_at;
  else
    insert into public.projectboard_backups (user_id, board_data, revision)
    select user_id, board_data, revision
    from public.projectboard_data
    where user_id = v_user_id and revision = p_expected_revision;

    update public.projectboard_data
    set board_data = p_board_data, revision = revision + 1, updated_at = now()
    where user_id = v_user_id and revision = p_expected_revision
    returning projectboard_data.revision, projectboard_data.updated_at into v_revision, v_updated_at;

    if found then
      delete from public.projectboard_backups
      where id in (
        select id from public.projectboard_backups
        where user_id = v_user_id
        order by created_at desc
        offset 20
      );
    end if;
  end if;

  if found then
    return query select true, v_revision, v_updated_at;
    return;
  end if;

  select d.revision, d.updated_at into v_revision, v_updated_at
  from public.projectboard_data d where d.user_id = v_user_id;
  return query select false, v_revision, v_updated_at;
end;
$$;

revoke all on function public.save_projectboard(bigint, jsonb) from public;
grant execute on function public.save_projectboard(bigint, jsonb) to authenticated;
