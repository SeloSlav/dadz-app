-- Fix: ambiguous "id" and "text = text[]" in get_matches
-- Run in Supabase SQL Editor

drop function if exists public.get_matches(uuid);

create or replace function public.get_matches(me_id uuid)
returns table (
  id uuid,
  display_name text,
  timezone text,
  shared_games text[],
  in_window boolean,
  match_type text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  user_games text[] := coalesce((select game_titles from game_preferences where user_id = me_id limit 1), '{}'::text[]);
  user_days integer[] := coalesce((select days_of_week from availability where user_id = me_id limit 1), '{}'::integer[]);
begin
  -- Tier 1: Dads who share games
  return query
  select
    p.id,
    p.display_name,
    coalesce(nullif(trim(p.timezone), ''), 'UTC'),
    (select array_agg(g) from unnest(gp.game_titles) g where g = any(user_games)),
    case
      when a.av_id is null then false
      when not (
        extract(dow from (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC')))::integer = any(a.days_of_week)
      ) then false
      when (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC'))::time < coalesce(a.start_time, '00:00'::time) then false
      when (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC'))::time > coalesce(a.end_time, '23:59'::time) then false
      else true
    end,
    'games'::text
  from profiles p
  join game_preferences gp on gp.user_id = p.id
  left join lateral (select av.id as av_id, av.days_of_week, av.start_time, av.end_time from availability av where av.user_id = p.id limit 1) a on true
  where p.id != me_id
    and p.display_name is not null
    and trim(p.display_name) != ''
    and gp.game_titles && user_games
    and array_length(user_games, 1) > 0;

  -- Tier 2: Dads with overlapping availability (same days) who aren't in tier 1
  return query
  select
    p.id,
    p.display_name,
    coalesce(nullif(trim(p.timezone), ''), 'UTC'),
    null::text[],
    case
      when not (
        extract(dow from (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC')))::integer = any(av.days_of_week)
      ) then false
      when (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC'))::time < coalesce(av.start_time, '00:00'::time) then false
      when (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC'))::time > coalesce(av.end_time, '23:59'::time) then false
      else true
    end,
    'availability'::text
  from profiles p
  join availability av on av.user_id = p.id
  where p.id != me_id
    and p.display_name is not null
    and trim(p.display_name) != ''
    and av.days_of_week && user_days
    and array_length(user_days, 1) > 0
    and not exists (
      select 1 from game_preferences gp_other
      where gp_other.user_id = p.id
        and gp_other.game_titles && user_games
        and array_length(user_games, 1) > 0
    );
end;
$$;
