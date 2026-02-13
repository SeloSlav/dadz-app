import { Suspense } from "react";
import Link from "next/link";
import { ChatErrorHandler } from "@/components/ChatErrorHandler";
import { MatchesList } from "@/app/app/MatchesList";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { SetupForm } from "@/app/app/SetupForm";

export default async function AppHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, timezone")
    .eq("id", user.id)
    .single();

  const { data: gamePrefs } = await supabase
    .from("game_preferences")
    .select("game_titles")
    .eq("user_id", user.id)
    .single();

  const { data: availability } = await supabase
    .from("availability")
    .select("days_of_week, start_time, end_time")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  const displayName = profile?.display_name?.trim() || null;
  const hasGames = !!gamePrefs?.game_titles?.length;
  const hasAvailability = !!availability;
  const allComplete = !!displayName && hasAvailability && hasGames;

  type Dad = { id: string; display_name: string; timezone: string; shared_games: string[] | null; in_window: boolean; match_type: string };
  let dads: Dad[] = [];
  if (allComplete) {
    const { data, error } = await supabase.rpc("get_all_dads_for_browse", { me_id: user.id, max_limit: 150 });
    if (error) {
      console.error("[Dadz] get_all_dads_for_browse error:", error.message);
    } else {
      dads = (data ?? []) as Dad[];
    }
  }

  return (
    <>
      <Header user={user} />
      <div className={dads.length > 0 ? "container" : "container container-narrow"} style={{ paddingBlock: "var(--s-12)" }}>
        <Suspense fallback={null}>
          <ChatErrorHandler />
        </Suspense>
        <main>
          <div className="animate-fade-up" style={{ marginBottom: dads.length > 0 ? "var(--s-6)" : "var(--s-8)" }}>
            <p className="badge" style={{ marginBottom: "var(--s-4)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)", display: "inline-block" }} />
              You're in
            </p>
            <h1 className="text-hero" style={{ margin: 0 }}>
              {displayName ? `Welcome back, ${displayName}` : "Welcome"}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-4)", flexWrap: "wrap", marginTop: "var(--s-2)" }}>
              <p className="text-secondary" style={{ margin: 0 }}>
                {allComplete
                  ? (dads.length > 0 ? "Here's who you can play with." : "You're set up. Dads will show here when they join.")
                  : "Set your display name, hours, and games to get started."}
              </p>
              {dads.length > 0 && (
                <Link href="/profile" className="btn btn-ghost btn-outline btn-sm">
                  Edit profile
                </Link>
              )}
            </div>
          </div>

          {/* Matches first when set up—the main reason to visit */}
          {allComplete && (
            <>
              {dads.length > 0 ? (
                <div className="animate-fade-up" style={{ marginBottom: "var(--s-10)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-4)", flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
                      Lobby
                    </h2>
                    <span
                      className="badge"
                      style={{ fontSize: "0.75rem", background: "var(--color-bg-muted)", color: "var(--color-fg-muted)", borderColor: "var(--color-border)" }}
                    >
                      {dads.length} {dads.length === 1 ? "dad" : "dads"}
                    </span>
                  </div>
                  <p className="text-secondary text-sm" style={{ margin: "0 0 var(--s-4)" }}>
                    Compatibility based on shared games and schedule. "Available" = in their usual window.
                  </p>
                  <MatchesList dads={dads} />
                </div>
              ) : (
                <div
                  className="card card-accent animate-fade-up"
                  style={{ marginBottom: "var(--s-10)", padding: "var(--s-8)" }}
                >
                  <h2 style={{ margin: "0 0 var(--s-3)", fontSize: "1.25rem", fontWeight: 700 }}>
                    You're all set
                  </h2>
                  <p className="text-secondary" style={{ margin: "0 0 var(--s-6)" }}>
                    Profile, hours, and games are set. No matches yet—we match you with dads you don't know who share your games and schedule. The network's still growing.
                  </p>
                  <h3 style={{ margin: "0 0 var(--s-2)", fontSize: "1rem", fontWeight: 600 }}>
                    What now?
                  </h3>
                  <ul className="text-secondary text-sm" style={{ margin: 0, paddingLeft: "var(--s-5)", lineHeight: 1.7 }}>
                    <li><strong>Add more games</strong> below—wider pool, more overlap.</li>
                    <li><strong>Check back</strong>—new dads join every day. You'll see matches when someone shares your games and availability.</li>
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Profile form—only when no matches (onboarding or no matches yet) */}
          {dads.length === 0 && (
            <div>
              <h2 style={{ margin: "0 0 var(--s-4)", fontSize: "1.125rem", fontWeight: 600 }}>
                {allComplete ? "Your profile" : "Get set up"}
              </h2>
              <SetupForm
                initialDisplayName={profile?.display_name ?? ""}
                initialTimezone={profile?.timezone ?? ""}
                initialDays={availability?.days_of_week ?? []}
                initialStart={availability?.start_time ?? ""}
                initialEnd={availability?.end_time ?? ""}
                initialGames={gamePrefs?.game_titles ?? []}
                email={user.email ?? ""}
              />
            </div>
          )}
        </main>
      </div>
      <Footer user={user} />
    </>
  );
}
