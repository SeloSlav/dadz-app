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

  return (
    <div className="container container-narrow" style={{ paddingBlock: "var(--space-12)" }}>
      <Header user={user} />

      <main className="stack-8" style={{ marginTop: "var(--space-16)" }}>
        <h1 className="text-hero">Profile</h1>

        <ProfileForm
          initialDisplayName={profile?.display_name ?? ""}
          initialTimezone={profile?.timezone ?? ""}
          email={user.email ?? ""}
        />
      </main>
    </div>
  );
}
