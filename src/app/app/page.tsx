import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";

export default async function AppHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const displayName = profile?.display_name || user.email?.split("@")[0] || "there";

  return (
    <div className="container" style={{ paddingBlock: "var(--space-12)" }}>
      <Header user={user} />

      <main className="stack-8" style={{ marginTop: "var(--space-16)" }}>
        <h1 className="text-hero">Welcome back, {displayName}</h1>

        <Card title="Next steps">
          <ul className="list-reset stack-4">
            <li>
              <Link href="/profile" className="text-xl">
                Set your profile
              </Link>
              <p className="text-muted" style={{ margin: "var(--space-1) 0 0", fontSize: "0.9375rem" }}>
                Add your display name and timezone so other dads can find you.
              </p>
            </li>
            <li>
              <Link href="/profile" className="text-xl">
                Add your usual hours
              </Link>
              <p className="text-muted" style={{ margin: "var(--space-1) 0 0", fontSize: "0.9375rem" }}>
                When are you typically free? We will use this for matchmaking.
              </p>
            </li>
            <li>
              <Link href="/profile" className="text-xl">
                Pick games you play
              </Link>
              <p className="text-muted" style={{ margin: "var(--space-1) 0 0", fontSize: "0.9375rem" }}>
                Platforms, genres, voice chat preference. Coming soon.
              </p>
            </li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
