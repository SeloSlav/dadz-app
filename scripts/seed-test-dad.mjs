#!/usr/bin/env node
/**
 * Seeds a test dad for matchmaking.
 * Requires: NEXT_PUBLIC_SUPABASE_URL and a secret key in .env.local
 *
 * Run: npm run seed:test-dad
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
// New: SUPABASE_SECRET_KEY (sb_secret_...). Legacy: SUPABASE_SERVICE_ROLE_KEY (eyJ...)
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("\nMissing env vars. Add to .env.local:\n");
  if (!url) console.error("  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co");
  if (!serviceKey) {
    console.error("  SUPABASE_SECRET_KEY=sb_secret_... (Dashboard > Settings > API > Secret keys)");
    console.error("  Or legacy: SUPABASE_SERVICE_ROLE_KEY=eyJ... (Legacy tab)\n");
  }
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main() {
  const { data: user, error } = await supabase.auth.admin.createUser({
    email: "testdad@example.com",
    password: "testdad123",
    email_confirm: true,
    user_metadata: { display_name: "TestDad" },
  });

  if (error) {
    if (error.message?.includes("already been registered")) {
      console.log("User exists. Fetching...");
      const { data: existing } = await supabase.auth.admin.listUsers();
      const testUser = existing?.users?.find((u) => u.email === "testdad@example.com");
      if (!testUser) {
        console.error(error);
        process.exit(1);
      }
      await seedProfile(supabase, testUser.id);
      console.log("Updated existing test dad:", testUser.id);
      return;
    }
    console.error(error);
    process.exit(1);
  }

  await seedProfile(supabase, user.user.id);
  console.log("Created test dad:", user.user.id);
}

async function seedProfile(supabase, userId) {
  await supabase.from("profiles").upsert(
    {
      id: userId,
      email: "testdad@example.com",
      display_name: "TestDad",
      timezone: "America/Vancouver",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  await supabase.from("availability").delete().eq("user_id", userId);
  await supabase.from("availability").insert({
    user_id: userId,
    days_of_week: [5, 6],
    start_time: "20:00",
    end_time: "23:00",
    updated_at: new Date().toISOString(),
  });

  await supabase.from("game_preferences").delete().eq("user_id", userId);
  await supabase.from("game_preferences").insert({
    user_id: userId,
    game_titles: [
      "Call of Duty: Modern Warfare III",
      "Diablo IV",
      "Civilization VI",
      "World of Warcraft",
    ],
    updated_at: new Date().toISOString(),
  });
}

main();
