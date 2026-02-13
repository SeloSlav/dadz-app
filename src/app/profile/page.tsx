import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
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

  const needsDisplayName = !profile?.display_name?.trim();

  return (
    <>
      <Header user={user} />
      <div className="container container-narrow" style={{ paddingBlock: "var(--s-12)" }}>
        <main>
          <div className="animate-fade-up" style={{ marginBottom: "var(--s-10)" }}>
            <h1 className="text-hero" style={{ margin: 0 }}>
              {needsDisplayName ? "Choose your display name" : "Profile"}
            </h1>
            <p className="text-secondary" style={{ marginTop: "var(--s-2)" }}>
              {needsDisplayName
                ? "Pick a name other dads will see. You can change it anytime."
                : "How other dads will see you."}
            </p>
          </div>

          <Suspense fallback={<div className="card" style={{ padding: "var(--s-8)" }}><div className="text-muted">Loading...</div></div>}>
            <ProfileForm
            initialDisplayName={profile?.display_name ?? ""}
            initialTimezone={profile?.timezone ?? ""}
            email={user.email ?? ""}
          />
          </Suspense>
        </main>
      </div>
    </>
  );
}
