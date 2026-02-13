# Dadz

Gaming when life does not fit on a calendar. Find another dad who is online now, or schedule a session in advance. No guilt, no pressure.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (from Dashboard > Settings > API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### 3. Apply the database schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Create a new query and paste the contents of `supabase/schema.sql`
4. Run the query

This creates the `profiles`, `availability`, and `game_preferences` tables with RLS policies, plus a trigger that auto-creates a profile when a new user signs up.

### 4. Configure Supabase Auth

In Supabase Dashboard > Authentication > Providers, ensure **Email** is enabled (magic link uses the Email provider).

In Authentication > URL Configuration:

- **Site URL**: `http://localhost:3000` (for local dev)
- **Redirect URLs**: Add `http://localhost:3000/auth/callback`

For production, add your production URL and callback.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How magic link redirect works

1. User enters email on `/login` and clicks "Send magic link"
2. Supabase sends an email with a link like `https://yoursite.com/auth/callback?code=xxx`
3. User clicks the link; browser hits `/auth/callback?code=xxx`
4. The callback route exchanges the `code` for a session via `supabase.auth.exchangeCodeForSession(code)`
5. Supabase sets session cookies; the route upserts a profile row
6. User is redirected to `/app` (or the `next` param if provided)

## Project structure

```
src/
  app/           # Routes and pages
  components/    # Reusable UI components
  lib/           # Supabase clients, auth helpers
supabase/
  schema.sql     # Database schema
```

## Routes

- `/` - Landing (public)
- `/login` - Magic link sign-in (public)
- `/auth/callback` - Handles magic link redirect
- `/app` - App home (protected)
- `/profile` - Profile settings (protected)
