-- Dadz schema for Supabase
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- Profiles: one per auth user
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  timezone text default 'UTC',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Availability: when the user is typically free (for future matchmaking)
create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  days_of_week integer[] default '{}',
  start_time time,
  end_time time,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Game preferences: platforms, genres, game titles, play style (for future matchmaking)
create table if not exists public.game_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  platforms text[] default '{}',
  genres text[] default '{}',
  game_titles text[] default '{}',
  voice_chat boolean default true,
  play_style text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add game_titles if table already exists (run separately if needed)
-- alter table public.game_preferences add column if not exists game_titles text[] default '{}';

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.availability enable row level security;
alter table public.game_preferences enable row level security;

-- Profiles: users can read and update only their own row
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Availability: users can manage only their own rows
create policy "Users can view own availability"
  on public.availability for select
  using (auth.uid() = user_id);

create policy "Users can insert own availability"
  on public.availability for insert
  with check (auth.uid() = user_id);

create policy "Users can update own availability"
  on public.availability for update
  using (auth.uid() = user_id);

create policy "Users can delete own availability"
  on public.availability for delete
  using (auth.uid() = user_id);

-- Game preferences: users can manage only their own rows
create policy "Users can view own game preferences"
  on public.game_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert own game preferences"
  on public.game_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own game preferences"
  on public.game_preferences for update
  using (auth.uid() = user_id);

create policy "Users can delete own game preferences"
  on public.game_preferences for delete
  using (auth.uid() = user_id);

-- Trigger: auto-create profile when a new auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, null);
  return new;
end;
$$;

-- Drop existing trigger if it exists (for re-runs)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
