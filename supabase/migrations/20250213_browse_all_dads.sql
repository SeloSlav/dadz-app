-- Browse all dads with compatibility data (for UI-side scoring)
-- Run after 20250213_loosen_matching.sql

create or replace function public.get_all_dads_for_browse(me_id uuid, max_limit int default 150)
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
  my_games text[];
  my_days integer[];
begin
  select coalesce(game_titles, '{}') into my_games from game_preferences where user_id = me_id limit 1;
  select coalesce(days_of_week, '{}') into my_days from availability where user_id = me_id limit 1;

  return query
  with ranked as (
    -- Tier 1: Shared games
    select p.id, p.display_name, coalesce(nullif(trim(p.timezone), ''), 'UTC') as tz,
      (select array_agg(g) from unnest(gp.game_titles) g where g = any(my_games)) as sg,
      case when a.av_id is null then false
        when not (extract(dow from (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC')))::integer = any(a.days_of_week)) then false
        when (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC'))::time < coalesce(a.start_time, '00:00'::time) then false
        when (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC'))::time > coalesce(a.end_time, '23:59'::time) then false
        else true end as iw, 1 as ord
    from profiles p
    join game_preferences gp on gp.user_id = p.id
    left join lateral (select av.id as av_id, av.days_of_week, av.start_time, av.end_time from availability av where av.user_id = p.id limit 1) a on true
    where p.id != me_id and p.display_name is not null and trim(p.display_name) != ''
      and gp.game_titles && my_games and array_length(my_games, 1) > 0

    union all

    -- Tier 2: Availability overlap only
    select p.id, p.display_name, coalesce(nullif(trim(p.timezone), ''), 'UTC'),
      null::text[],
      case when av.id is null then false
        when not (extract(dow from (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC')))::integer = any(av.days_of_week)) then false
        when (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC'))::time < coalesce(av.start_time, '00:00'::time) then false
        when (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC'))::time > coalesce(av.end_time, '23:59'::time) then false
        else true end, 2 as ord
    from profiles p
    join availability av on av.user_id = p.id
    where p.id != me_id and p.display_name is not null and trim(p.display_name) != ''
      and av.days_of_week && my_days and array_length(my_days, 1) > 0
      and not exists (select 1 from game_preferences gp2 where gp2.user_id = p.id and gp2.game_titles && my_games and array_length(my_games, 1) > 0)

    union all

    -- Tier 3: Everyone else
    select p.id, p.display_name, coalesce(nullif(trim(p.timezone), ''), 'UTC'),
      null::text[],
      case when a.av_id is null then false
        when not (extract(dow from (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC')))::integer = any(a.days_of_week)) then false
        when (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC'))::time < coalesce(a.start_time, '00:00'::time) then false
        when (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC'))::time > coalesce(a.end_time, '23:59'::time) then false
        else true end, 3 as ord
    from profiles p
    left join lateral (select av.id as av_id, av.days_of_week, av.start_time, av.end_time from availability av where av.user_id = p.id limit 1) a on true
    where p.id != me_id and p.display_name is not null and trim(p.display_name) != ''
      and not exists (select 1 from game_preferences gp2 where gp2.user_id = p.id and gp2.game_titles && my_games and array_length(my_games, 1) > 0)
      and (a.av_id is null or not (a.days_of_week && my_days) or array_length(my_days, 1) is null)
  )
  select r.id, r.display_name, r.tz, r.sg, r.iw,
    case r.ord when 1 then 'games' when 2 then 'availability' else 'none' end
  from ranked r
  order by r.ord, r.iw desc, r.display_name
  limit max_limit;
end;
$$;
