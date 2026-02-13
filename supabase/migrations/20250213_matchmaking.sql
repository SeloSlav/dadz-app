-- Matchmaking: allow users to discover other dads to play with
-- Run this in Supabase SQL Editor after the main schema

-- Function to get potential matches (shared games)
-- Returns only safe fields: id, display_name, timezone, shared_games, in_window (available now)
-- Uses SECURITY DEFINER so it can read other users' data
create or replace function public.get_matches(me_id uuid)
returns table (
  id uuid,
  display_name text,
  timezone text,
  shared_games text[],
  in_window boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  user_games text[];
begin
  -- Get current user's games
  select coalesce(gp.game_titles, '{}')
  into user_games
  from game_preferences gp
  where gp.user_id = me_id;

  if user_games is null or array_length(user_games, 1) is null then
    return;
  end if;

  return query
  select
    p.id,
    p.display_name,
    coalesce(nullif(trim(p.timezone), ''), 'UTC'),
    (select array_agg(g) from unnest(gp.game_titles) g where g = any(user_games)),
    -- in_window: is it currently within their availability window (in their timezone)?
    case
      when a.id is null then false
      when not (
        extract(dow from (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC')))::integer = any(a.days_of_week)
      ) then false
      when (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC'))::time < coalesce(a.start_time, '00:00'::time) then false
      when (now() at time zone coalesce(nullif(trim(p.timezone), ''), 'UTC'))::time > coalesce(a.end_time, '23:59'::time) then false
      else true
    end
  from profiles p
  join game_preferences gp on gp.user_id = p.id
  left join lateral (
    select id, days_of_week, start_time, end_time
    from availability
    where user_id = p.id
    limit 1
  ) a on true
  where p.id != me_id
    and p.display_name is not null
    and trim(p.display_name) != ''
    and gp.game_titles && user_games;
end;
$$;
