import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";

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

  const steps = [
    {
      icon: "&#128100;",
      title: "Set your profile",
      desc: "Add your display name and timezone so other dads can find you.",
      href: "/profile",
      done: !!profile?.display_name,
    },
    {
      icon: "&#128336;",
      title: "Add your usual hours",
      desc: "When are you typically free? We will use this for matchmaking.",
      href: "/profile",
      done: false,
    },
    {
      icon: "&#127918;",
      title: "Pick games you play",
      desc: "Platforms, genres, voice chat preference. Coming soon.",
      href: "/profile",
      done: false,
    },
  ];

  return (
    <>
      <Header user={user} />
      <div className="container" style={{ paddingBlock: "var(--s-12)" }}>
        <main>
          <div
            className="animate-fade-up"
            style={{ maxWidth: "42rem", marginBottom: "var(--s-12)" }}
          >
            <p className="badge" style={{ marginBottom: "var(--s-4)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)", display: "inline-block" }} />
              You are in
            </p>
            <h1 className="text-hero" style={{ margin: 0 }}>
              Welcome back, {displayName}
            </h1>
            <p className="text-secondary text-lg" style={{ marginTop: "var(--s-3)" }}>
              Get set up so we can start matching you with other dads.
            </p>
          </div>

          <div className="stack-3" style={{ maxWidth: "42rem" }}>
            {steps.map((step, i) => (
              <Link
                key={i}
                href={step.href}
                className="card card-hover flex gap-5 items-start"
                style={{
                  padding: "var(--s-5) var(--s-6)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    borderRadius: "var(--r-lg)",
                    background: step.done ? "var(--color-green-muted)" : "var(--color-accent-muted)",
                    border: step.done
                      ? "1px solid rgba(52,211,153,0.15)"
                      : "1px solid rgba(79,143,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                  }}
                  dangerouslySetInnerHTML={{ __html: step.done ? "&#10003;" : step.icon }}
                />
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ margin: "0 0 var(--s-1)", fontSize: "1.0625rem", fontWeight: 600 }}>
                    {step.title}
                  </h3>
                  <p className="text-secondary text-sm" style={{ margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{ flexShrink: 0, marginLeft: "auto", alignSelf: "center" }}
                >
                  <path
                    d="M7.5 5l5 5-5 5"
                    stroke="var(--color-fg-subtle)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
