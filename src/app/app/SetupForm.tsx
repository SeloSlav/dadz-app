"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Amsterdam",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
];

const DAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

const POPULAR_GAMES = [
  "Call of Duty: Warzone",
  "Call of Duty: Modern Warfare III",
  "Battlefield 2042",
  "Halo Infinite",
  "Halo: The Master Chief Collection",
  "Madden NFL 25",
  "EA Sports FC 25",
  "Elden Ring",
  "Dark Souls III",
  "God of War Ragnarok",
  "Red Dead Redemption 2",
  "Grand Theft Auto V",
  "Fortnite",
  "Rocket League",
  "Apex Legends",
  "Diablo IV",
  "Civilization VI",
  "World of Warcraft",
  "Counter-Strike 2",
  "Valorant",
  "Hell Let Loose",
  "Squad",
  "Arma 3",
  "Insurgency: Sandstorm",
  "Hunt: Showdown",
  "Escape from Tarkov",
  "Rainbow Six Siege",
  "Forza Horizon 5",
  "F1 24",
  "NHL 25",
  "NBA 2K25",
  "Minecraft",
  "Sea of Thieves",
  "Deep Rock Galactic",
  "Baldur's Gate 3",
  "Starfield",
  "Fallout 76",
  "Destiny 2",
  "The Finals",
  "XDefiant",
];

interface SetupFormProps {
  initialDisplayName: string;
  initialTimezone: string;
  initialDays: number[];
  initialStart: string;
  initialEnd: string;
  initialGames: string[];
  email: string;
  /** Redirect to this path after successful save (e.g. /app when on profile page) */
  redirectOnSave?: string;
}

export function SetupForm({
  initialDisplayName,
  initialTimezone,
  initialDays,
  initialStart,
  initialEnd,
  initialGames,
  email,
  redirectOnSave,
}: SetupFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [timezone, setTimezone] = useState(initialTimezone || "UTC");
  const [days, setDays] = useState<Set<number>>(new Set(initialDays));
  const formatTime = (t: string) => (t ? t.slice(0, 5) : "");
  const [startTime, setStartTime] = useState(formatTime(initialStart) || "20:00");
  const [endTime, setEndTime] = useState(formatTime(initialEnd) || "23:00");
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set(initialGames));
  const [saving, setSaving] = useState(false);

  const toggleDay = (d: number) => {
    setDays((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  };

  const toggleGame = (game: string) => {
    setSelectedGames((prev) => {
      const next = new Set(prev);
      if (next.has(game)) next.delete(game);
      else next.add(game);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      showToast("Display name is required", "error");
      setSaving(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        display_name: trimmedName,
        timezone: timezone || "UTC",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (profileError) {
      showToast(profileError.message, "error");
      setSaving(false);
      return;
    }

    const { data: existingAvail } = await supabase
      .from("availability")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    const availabilityPayload = {
      user_id: user.id,
      days_of_week: Array.from(days).sort((a, b) => a - b),
      start_time: startTime || null,
      end_time: endTime || null,
      updated_at: new Date().toISOString(),
    };

    const { error: availabilityError } = existingAvail
      ? await supabase.from("availability").update(availabilityPayload).eq("id", existingAvail.id)
      : await supabase.from("availability").insert(availabilityPayload);

    if (availabilityError) {
      showToast(availabilityError.message, "error");
      setSaving(false);
      return;
    }

    const { data: existingGames } = await supabase
      .from("game_preferences")
      .select("id")
      .eq("user_id", user.id)
      .single();

    const gamesPayload = {
      user_id: user.id,
      game_titles: Array.from(selectedGames),
      updated_at: new Date().toISOString(),
    };

    const { error: gamesError } = existingGames
      ? await supabase.from("game_preferences").update(gamesPayload).eq("user_id", user.id)
      : await supabase.from("game_preferences").insert(gamesPayload);

    setSaving(false);

    if (gamesError) {
      showToast(gamesError.message, "error");
      return;
    }

    showToast("Saved", "success");
    if (redirectOnSave) {
      router.push(redirectOnSave);
    } else {
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card animate-fade-up" style={{ padding: "var(--s-8)" }}>
        <div className="stack-8">
          {/* Profile */}
          <div className="stack-6">
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                value={email}
                disabled
                readOnly
                style={{ opacity: 0.5 }}
              />
              <p className="text-muted text-xs" style={{ marginTop: "var(--s-1)" }}>
                Managed by your auth account. Can't be changed here.
              </p>
            </div>
            <div>
              <label htmlFor="display_name">Display name *</label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                className="input"
                placeholder="What other dads will see"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label htmlFor="timezone">Timezone</label>
              <select
                id="timezone"
                name="timezone"
                className="input"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hours */}
          <div className="stack-6" style={{ paddingTop: "var(--s-6)", borderTop: "1px solid var(--color-border)" }}>
            <div>
              <h3 style={{ margin: "0 0 var(--s-2)", fontSize: "1rem", fontWeight: 600 }}>
                Usual hours
              </h3>
              <p className="text-secondary text-sm" style={{ margin: "0 0 var(--s-4)" }}>
                When are you typically free to play? We use this to match you with dads in similar windows.
              </p>
            </div>
            <div>
              <label style={{ marginBottom: "var(--s-2)", display: "block" }}>Days</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-2)" }}>
                {DAYS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => toggleDay(d.value)}
                    style={{
                      padding: "var(--s-2) var(--s-3)",
                      borderRadius: "var(--r-md)",
                      border: days.has(d.value)
                        ? "1px solid var(--color-accent)"
                        : "1px solid var(--color-border)",
                      background: days.has(d.value)
                        ? "var(--color-accent-muted)"
                        : "var(--color-bg-card)",
                      color: days.has(d.value)
                        ? "var(--color-accent-light)"
                        : "var(--color-fg-muted)",
                      fontSize: "0.875rem",
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap" }}>
              <div>
                <label htmlFor="start_time" style={{ marginBottom: "var(--s-2)", display: "block" }}>
                  From
                </label>
                <input
                  id="start_time"
                  type="time"
                  className="input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="end_time" style={{ marginBottom: "var(--s-2)", display: "block" }}>
                  To
                </label>
                <input
                  id="end_time"
                  type="time"
                  className="input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Games */}
          <div className="stack-6" style={{ paddingTop: "var(--s-6)", borderTop: "1px solid var(--color-border)" }}>
            <div>
              <h3 style={{ margin: "0 0 var(--s-2)", fontSize: "1rem", fontWeight: 600 }}>
                Games you play
              </h3>
              <p className="text-secondary text-sm" style={{ margin: "0 0 var(--s-4)" }}>
                Click to select. We'll match you with dads who play the same.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--s-2)",
              }}
            >
              {POPULAR_GAMES.map((game) => (
                <button
                  key={game}
                  type="button"
                  onClick={() => toggleGame(game)}
                  style={{
                    padding: "var(--s-2) var(--s-3)",
                    borderRadius: "var(--r-md)",
                    border: selectedGames.has(game)
                      ? "1px solid var(--color-accent)"
                      : "1px solid var(--color-border)",
                    background: selectedGames.has(game)
                      ? "var(--color-accent-muted)"
                      : "var(--color-bg-card)",
                    color: selectedGames.has(game)
                      ? "var(--color-accent-light)"
                      : "var(--color-fg-secondary)",
                    fontSize: "0.875rem",
                    fontFamily: "inherit",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {game}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={saving} size="lg">
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
