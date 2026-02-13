import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MessageLink } from "@/components/MessageLink";
import { redirect } from "next/navigation";

const DAY_LABELS: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

function formatTime(t: string | null): string {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function computeMatchScore(
  myGames: string[],
  myDays: number[],
  theirGames: string[],
  theirDays: number[],
  inWindow: boolean
): { score: number; label: string } {
  const sharedGames = theirGames.filter((g) => myGames.includes(g)).length;
  const hasGames = sharedGames > 0;
  const overlapDays = theirDays.filter((d) => myDays.includes(d)).length;
  const hasAvailability = overlapDays > 0;

  if (hasGames && inWindow) return { score: Math.min(95 + sharedGames * 2, 99), label: "Great match" };
  if (hasGames) return { score: Math.min(75 + sharedGames * 5, 94), label: "Shared games" };
  if (hasAvailability && inWindow) return { score: 55, label: "Available now" };
  if (hasAvailability) return { score: 40, label: "Similar schedule" };
  if (inWindow) return { score: 25, label: "Online" };
  return { score: 10, label: "New dad" };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) redirect("/login");

  // Redirect /profile/self to edit page
  if (userId === currentUser.id) {
    redirect("/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, timezone, bio")
    .eq("id", userId)
    .single();

  if (!profile?.display_name) {
    return (
      <>
        <Header user={currentUser} />
        <div className="container container-narrow" style={{ paddingBlock: "var(--s-12)" }}>
          <p className="text-muted">Profile not found.</p>
          <Link href="/app" className="btn btn-ghost btn-sm" style={{ marginTop: "var(--s-4)" }}>
            ← Back to dashboard
          </Link>
        </div>
      </>
    );
  }

  const { data: availability } = await supabase
    .from("availability")
    .select("days_of_week, start_time, end_time")
    .eq("user_id", userId)
    .limit(1)
    .single();

  const { data: gamePrefs } = await supabase
    .from("game_preferences")
    .select("game_titles")
    .eq("user_id", userId)
    .single();

  const { data: myPrefs } = await supabase
    .from("game_preferences")
    .select("game_titles")
    .eq("user_id", currentUser.id)
    .single();

  const { data: myAvail } = await supabase
    .from("availability")
    .select("days_of_week")
    .eq("user_id", currentUser.id)
    .limit(1)
    .single();

  const games = gamePrefs?.game_titles ?? [];
  const myGames = myPrefs?.game_titles ?? [];
  const days = availability?.days_of_week ?? [];
  const myDays = myAvail?.days_of_week ?? [];

  const tz = profile.timezone || "UTC";
  const dt = new Date();
  const dowStr = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(dt);
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const currentDow = dayMap[dowStr] ?? 0;
  const timeStr = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(dt);
  const [h, m] = timeStr.split(":").map(Number);
  const currentTime = h * 60 + m;
  const startMins = availability?.start_time
    ? parseInt(availability.start_time.slice(0, 2), 10) * 60 +
      parseInt(availability.start_time.slice(3, 5), 10)
    : 0;
  const endMins = availability?.end_time
    ? parseInt(availability.end_time.slice(0, 2), 10) * 60 +
      parseInt(availability.end_time.slice(3, 5), 10)
    : 24 * 60;
  const inWindow =
    days.includes(currentDow) && currentTime >= startMins && currentTime <= endMins;

  const { score, label } = computeMatchScore(
    myGames,
    myDays,
    games,
    days,
    inWindow
  );

  const sharedGames = games.filter((g: string) => myGames.includes(g));

  return (
    <>
      <Header user={currentUser} />
      <div className="container container-narrow" style={{ paddingBlock: "var(--s-12)" }}>
        <main>
          <Link
            href="/app"
            className="btn btn-ghost btn-outline btn-sm"
            style={{ marginBottom: "var(--s-6)" }}
          >
            ← Back to lobby
          </Link>

          <div
            className="card"
            style={{
              padding: "var(--s-8)",
              marginBottom: "var(--s-6)",
              borderLeft: inWindow ? "4px solid var(--color-green)" : undefined,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "var(--s-4)",
                flexWrap: "wrap",
                marginBottom: "var(--s-6)",
              }}
            >
              <div>
                <h1 className="text-hero" style={{ margin: "0 0 var(--s-2)" }}>
                  {profile.display_name}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", flexWrap: "wrap" }}>
                  {inWindow && (
                    <span
                      className="badge"
                      style={{
                        fontSize: "0.75rem",
                        background: "var(--color-green-muted)",
                        color: "var(--color-green)",
                        border: "1px solid rgba(52,211,153,0.3)",
                      }}
                    >
                      Available now
                    </span>
                  )}
                  <span
                    className="badge"
                    style={{
                      fontSize: "0.75rem",
                      background: "var(--color-bg-muted)",
                      color: score >= 70 ? "var(--color-green)" : score >= 40 ? "var(--color-accent-light)" : "var(--color-fg-muted)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    {score}% match — {label}
                  </span>
                </div>
              </div>
              <MessageLink userId={userId} className="btn btn-primary btn-sm">
                Message
              </MessageLink>
            </div>

            {profile.bio?.trim() && (
              <div style={{ marginBottom: "var(--s-6)" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 600, margin: "0 0 var(--s-2)", color: "var(--color-fg-muted)" }}>
                  Bio
                </h3>
                <p className="text-secondary" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {profile.bio.trim()}
                </p>
              </div>
            )}

            <div style={{ marginBottom: "var(--s-6)" }}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 600, margin: "0 0 var(--s-2)", color: "var(--color-fg-muted)" }}>
                Availability
              </h3>
              {days.length > 0 ? (
                <p className="text-secondary" style={{ margin: 0 }}>
                  {days
                    .sort((a: number, b: number) => a - b)
                    .map((d: number) => DAY_LABELS[d as keyof typeof DAY_LABELS])
                    .join(", ")}
                  {availability?.start_time && availability?.end_time && (
                    <> · {formatTime(availability.start_time)} – {formatTime(availability.end_time)}</>
                  )}
                  {profile.timezone && (
                    <span className="text-muted" style={{ fontSize: "0.8125rem" }}>
                      {" "}({profile.timezone})
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-muted" style={{ margin: 0 }}>Not set</p>
              )}
            </div>

            <div>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 600, margin: "0 0 var(--s-2)", color: "var(--color-fg-muted)" }}>
                Games
              </h3>
              {games.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-2)" }}>
                  {games.map((g: string) => (
                    <span
                      key={g}
                      style={{
                        padding: "var(--s-1) var(--s-3)",
                        borderRadius: "var(--r-full)",
                        fontSize: "0.8125rem",
                        background: sharedGames.includes(g)
                          ? "var(--color-green-muted)"
                          : "var(--color-bg-muted)",
                        color: sharedGames.includes(g)
                          ? "var(--color-green)"
                          : "var(--color-fg-secondary)",
                        border: sharedGames.includes(g)
                          ? "1px solid rgba(52,211,153,0.3)"
                          : "1px solid var(--color-border)",
                      }}
                    >
                      {g}
                      {sharedGames.includes(g) && " ✓"}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted" style={{ margin: 0 }}>No games added</p>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer user={currentUser} />
    </>
  );
}
