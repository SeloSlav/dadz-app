import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { SetupForm } from "@/app/app/SetupForm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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

  return (
    <>
      <Header user={user} />
      <div className="container container-narrow" style={{ paddingBlock: "var(--s-12)" }}>
        <main>
          <div style={{ marginBottom: "var(--s-8)" }}>
            <Link
              href="/app"
              className="btn btn-ghost btn-outline btn-sm"
              style={{ marginBottom: "var(--s-4)" }}
            >
              ← Back to dashboard
            </Link>
            <h1 className="text-hero" style={{ margin: 0 }}>
              Edit profile
            </h1>
            <p className="text-secondary" style={{ marginTop: "var(--s-2)" }}>
              Update your display name, hours, and games.
            </p>
          </div>

          <SetupForm
            initialDisplayName={profile?.display_name ?? ""}
            initialTimezone={profile?.timezone ?? ""}
            initialDays={availability?.days_of_week ?? []}
            initialStart={availability?.start_time ?? ""}
            initialEnd={availability?.end_time ?? ""}
            initialGames={gamePrefs?.game_titles ?? []}
            email={user.email ?? ""}
            redirectOnSave="/app"
          />
        </main>
      </div>
    </>
  );
}
