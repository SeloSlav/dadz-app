# Seed a test dad for matchmaking

1. Add to `.env.local` (same folder as package.json):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SECRET_KEY=sb_secret_...
   ```
   - URL: you likely have this already
   - Secret key: Dashboard → **Settings** → **API** → **Secret keys** (default). Copy the `sb_secret_...` key.
   - Legacy: use `SUPABASE_SERVICE_ROLE_KEY` with the key from the Legacy tab if you prefer.

2. Run:
   ```bash
   npm run seed:test-dad
   ```

Creates `testdad@example.com` / `testdad123` with your matching preferences.

---

**No matches showing?** Check:

1. **Same Supabase** – Deployed app (Vercel) must use the same `NEXT_PUBLIC_SUPABASE_URL` as where you ran the seed. Add it to Vercel env vars.
2. **Migrations run** – In Supabase SQL Editor, run these on that project:
   - `20250213_matchmaking.sql`
   - `20250213_loosen_matching.sql`
   - `20250213_fix_ambiguous_id.sql`
   - `20250213_chat.sql` (for Message button to work)
3. **Shared games** – You and TestDad must share at least one game (e.g. World of Warcraft). Add WoW to your profile if needed.
4. **Console** – Check the browser console for `[Dadz] get_matches error` if the RPC fails.
