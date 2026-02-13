#!/usr/bin/env node
/**
 * Seeds ~20 test dads for matchmaking.
 * Requires: NEXT_PUBLIC_SUPABASE_URL and a secret key in .env.local
 *
 * Run: npm run seed:test-dads
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
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

const NAMES = [
  "Mike", "Chris", "Dave", "Alex", "Jordan", "Sam", "Taylor", "Jamie",
  "Casey", "Riley", "Morgan", "Quinn", "Drew", "Blake", "Cameron", "Reese",
  "Parker", "Avery", "Finley", "River",
];

const GAME_POOLS = [
  ["Call of Duty: Modern Warfare III", "Diablo IV", "Civilization VI", "World of Warcraft"],
  ["Fortnite", "Rocket League", "Apex Legends", "Call of Duty: Warzone"],
  ["Halo Infinite", "Elden Ring", "Dark Souls III", "God of War Ragnarok"],
  ["Minecraft", "Sea of Thieves", "Deep Rock Galactic", "Baldur's Gate 3"],
  ["Counter-Strike 2", "Valorant", "Rainbow Six Siege", "The Finals"],
  ["Red Dead Redemption 2", "Grand Theft Auto V", "Starfield", "Fallout 76"],
  ["Destiny 2", "World of Warcraft", "Diablo IV", "Path of Exile"],
  ["Madden NFL 25", "EA Sports FC 25", "NHL 25", "NBA 2K25"],
  ["Hell Let Loose", "Squad", "Arma 3", "Insurgency: Sandstorm"],
  ["Forza Horizon 5", "F1 24", "Rocket League", "The Finals"],
  ["Civilization VI", "Starfield", "Baldur's Gate 3", "Elden Ring"],
  ["Call of Duty: Modern Warfare III", "XDefiant", "The Finals", "Valorant"],
  ["Diablo IV", "World of Warcraft", "Destiny 2", "Baldur's Gate 3"],
  ["Fortnite", "Rocket League", "Minecraft", "Sea of Thieves"],
  ["Halo Infinite", "Halo: The Master Chief Collection", "Destiny 2"],
  ["Elden Ring", "Dark Souls III", "God of War Ragnarok", "Baldur's Gate 3"],
  ["Battlefield 2042", "Call of Duty: Warzone", "Hunt: Showdown", "Escape from Tarkov"],
  ["Deep Rock Galactic", "Sea of Thieves", "Minecraft", "Valheim"],
  ["Rocket League", "F1 24", "Forza Horizon 5", "The Finals"],
  ["Apex Legends", "Fortnite", "Valorant", "Counter-Strike 2"],
];

const AVAILABILITY_PRESETS = [
  { days: [0, 6], start: "10:00", end: "14:00" },
  { days: [5, 6], start: "20:00", end: "23:00" },
  { days: [1, 3, 5], start: "19:00", end: "22:00" },
  { days: [2, 4], start: "18:00", end: "21:00" },
  { days: [0, 1, 2, 3, 4, 5, 6], start: "20:00", end: "23:00" },
  { days: [5, 6], start: "09:00", end: "12:00" },
  { days: [3, 4, 5], start: "21:00", end: "00:00" },
  { days: [1, 2, 3], start: "19:30", end: "22:30" },
  { days: [0, 6], start: "14:00", end: "18:00" },
  { days: [4, 5, 6], start: "18:00", end: "22:00" },
];

async function main() {
  console.log("Seeding 20 test dads...\n");

  for (let i = 1; i <= 20; i++) {
    const email = `testdad${i}@example.com`;
    const displayName = NAMES[i - 1];
    const games = GAME_POOLS[i - 1];
    const avail = AVAILABILITY_PRESETS[(i - 1) % AVAILABILITY_PRESETS.length];

    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password: "testdad123",
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });

    if (error) {
      if (error.message?.includes("already been registered")) {
        const { data: existing } = await supabase.auth.admin.listUsers();
        const testUser = existing?.users?.find((u) => u.email === email);
        if (testUser) {
          await seedProfile(supabase, testUser.id, displayName, email, games, avail);
          console.log(`  ${i}. ${displayName} (exists, updated)`);
        } else {
          console.error(`  ${i}. ${displayName} - ${error.message}`);
        }
      } else {
        console.error(`  ${i}. ${displayName} - ${error.message}`);
      }
      continue;
    }

    await seedProfile(supabase, user.user.id, displayName, email, games, avail);
    console.log(`  ${i}. ${displayName} (created)`);
  }

  console.log("\nDone. Run the app and check matches.");
}

async function seedProfile(supabase, userId, displayName, email, games, avail) {
  await supabase.from("profiles").upsert(
    {
      id: userId,
      email,
      display_name: displayName,
      timezone: "America/Vancouver",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  await supabase.from("availability").delete().eq("user_id", userId);
  await supabase.from("availability").insert({
    user_id: userId,
    days_of_week: avail.days,
    start_time: avail.start,
    end_time: avail.end,
    updated_at: new Date().toISOString(),
  });

  await supabase.from("game_preferences").delete().eq("user_id", userId);
  await supabase.from("game_preferences").insert({
    user_id: userId,
    game_titles: games,
    updated_at: new Date().toISOString(),
  });
}

main();
