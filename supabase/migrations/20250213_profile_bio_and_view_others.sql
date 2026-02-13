-- Add bio to profiles, allow viewing other users' availability and game preferences
-- Run after 20250213_profiles_read_others.sql

-- Add bio column
alter table public.profiles add column if not exists bio text;

-- Allow authenticated users to view other users' availability (for profile display)
create policy "Users can view other availability"
  on public.availability for select
  to authenticated
  using (true);

-- Allow authenticated users to view other users' game preferences (for profile display)
create policy "Users can view other game preferences"
  on public.game_preferences for select
  to authenticated
  using (true);
