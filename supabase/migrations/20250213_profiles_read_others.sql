-- Allow authenticated users to read other profiles' display_name (for chat, match cards)
-- Existing "Users can view own profile" stays; this adds read access for other users
create policy "Users can view other profiles"
  on public.profiles for select
  to authenticated
  using (true);
