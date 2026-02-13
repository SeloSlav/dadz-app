-- In-app chat: conversations and messages
-- Run after main schema

-- 1:1 conversations (user_a < user_b for consistent lookup)
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references public.profiles (id) on delete cascade,
  user_b_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_a_id, user_b_id),
  check (user_a_id < user_b_id)
);

create index if not exists idx_conversations_user_a on public.conversations (user_a_id);
create index if not exists idx_conversations_user_b on public.conversations (user_b_id);

-- Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_messages_conversation on public.messages (conversation_id);
create index if not exists idx_messages_created on public.messages (created_at);

-- Enable RLS
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Conversations: users can only see conversations they're in
create policy "Users can view own conversations"
  on public.conversations for select
  using (auth.uid() = user_a_id or auth.uid() = user_b_id);

create policy "Users can create conversations"
  on public.conversations for insert
  with check (auth.uid() = user_a_id or auth.uid() = user_b_id);

-- Messages: users can only see messages in their conversations
create policy "Users can view messages in own conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.user_a_id = auth.uid() or c.user_b_id = auth.uid())
    )
  );

create policy "Users can send messages in own conversations"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.user_a_id = auth.uid() or c.user_b_id = auth.uid())
    )
  );

-- Function: get or create conversation between two users
create or replace function public.get_or_create_conversation(me_id uuid, other_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  conv_id uuid;
  uid_a uuid;
  uid_b uuid;
begin
  uid_a := least(me_id, other_id);
  uid_b := greatest(me_id, other_id);

  select id into conv_id
  from conversations
  where user_a_id = uid_a and user_b_id = uid_b;

  if conv_id is null then
    insert into conversations (user_a_id, user_b_id)
    values (uid_a, uid_b)
    returning id into conv_id;
  end if;

  return conv_id;
end;
$$;

-- Enable Realtime for live message updates
alter publication supabase_realtime add table public.messages;
