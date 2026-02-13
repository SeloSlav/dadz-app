import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { HeroForm } from "@/components/HeroForm";
import { FeatureGrid } from "@/components/FeatureGrid";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Header user={user} variant="transparent" />

      <main>
        {/* ═══════════════════════════════════════════
            1. HERO
            Job: Get email or get scroll
            ═══════════════════════════════════════════ */}
        <section className="section-lg section-glow" style={{ overflow: "hidden" }}>
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "var(--s-12)",
                alignItems: "center",
              }}
              className="hero-grid"
            >
              <div className="animate-fade-up" style={{ maxWidth: "42rem" }}>
                <span className="badge" style={{ marginBottom: "var(--s-6)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)", display: "inline-block" }} />
                  Dads only
                </span>

                <h1 className="text-display text-balance" style={{ margin: 0 }}>
                  Your hour to play just got{" "}
                  <span className="text-gradient">a whole lot better</span>
                </h1>

                <p
                  className="text-xl text-secondary"
                  style={{ marginTop: "var(--s-6)", maxWidth: "36rem", lineHeight: 1.6 }}
                >
                  Kids are finally asleep. You have maybe 90 minutes. Dadz finds you dads
                  to play with—online right now—or lets you lock in a session for later. No bullshit.
                </p>

                <div style={{ marginTop: "var(--s-8)" }}>
                  <HeroForm />
                </div>

                {/* Trust signals */}
                <div
                  className="flex flex-wrap gap-6 text-sm text-muted"
                  style={{ marginTop: "var(--s-6)" }}
                >
                  <span className="flex items-center gap-2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 1l2.35 4.76 5.25.77-3.8 3.7.9 5.24L8 13.27l-4.7 2.47.9-5.24-3.8-3.7 5.25-.77L8 1z" fill="var(--color-accent)"/></svg>
                    Free
                  </span>
                  <span className="flex items-center gap-2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M13.3 4.3a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4L6.7 9.6l5.3-5.3a1 1 0 0 1 1.3 0z" fill="var(--color-accent)"/></svg>
                    No spam
                  </span>
                  <span className="flex items-center gap-2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12.5A5.5 5.5 0 1 1 8 2.5a5.5 5.5 0 0 1 0 11zM5 7a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-3.5 3a.5.5 0 0 1 .4-.2h4.2a.5.5 0 0 1 .4.8A3.5 3.5 0 0 1 8 12a3.5 3.5 0 0 1-2.5-1.4.5.5 0 0 1 0-.6z" fill="var(--color-accent)"/></svg>
                    Delete anytime
                  </span>
                </div>
              </div>

              {/* Hero image - visible on desktop */}
              <div
                className="animate-fade-up animate-delay-2 hero-image-wrap"
                style={{
                  display: "none",
                  position: "relative",
                  borderRadius: "var(--r-2xl)",
                  overflow: "hidden",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(79,143,255,0.08)",
                  border: "1px solid var(--color-border-accent)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(79,143,255,0.08) 0%, transparent 50%)",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
                <Image
                  src="/hero-dad-gaming-baby.png"
                  alt="Dad gaming late at night with a baby in the background"
                  width={600}
                  height={400}
                  priority
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    aspectRatio: "4/3",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            3. PROBLEM-AGITATE
            Job: Make status quo painful
            ═══════════════════════════════════════════ */}
        <section className="section section-lines section-alt" id="problems">
          <div className="container container-mid">
            <p className="badge" style={{ marginBottom: "var(--s-6)" }}>Sound familiar?</p>

            <div className="grid-3" style={{ marginBottom: "var(--s-12)" }}>
              {[
                {
                  title: "You finally have an hour. Nobody is online.",
                  body: "The window closes fast. By the time someone responds to your Discord ping, it's gone. Another night of solo queuing or scrolling your phone.",
                },
                {
                  title: "Your old crew moved on.",
                  body: "Different schedules. Different games. Different priorities. You're not gonna organize a group chat at 11pm on a Tuesday to see who's free.",
                },
                {
                  title: "Scheduling across bedtimes and timezones? Forget it.",
                  body: "You need something that understands your life. Not another calendar invite that gets cancelled because someone's kid woke up.",
                },
              ].map((problem, i) => (
                <div key={i} className={`card animate-fade-up animate-delay-${i + 1}`}>
                  <div
                    className="step-number"
                    style={{ marginBottom: "var(--s-3)" }}
                  >
                    {i + 1}
                  </div>
                  <h3 style={{ margin: "0 0 var(--s-2)", fontSize: "1.0625rem", fontWeight: 600 }}>
                    {problem.title}
                  </h3>
                  <p className="text-secondary text-sm" style={{ margin: 0, lineHeight: 1.65 }}>
                    {problem.body}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="card card-accent"
              style={{ padding: "var(--s-8)", textAlign: "center" }}
            >
              <p className="text-lg" style={{ margin: 0, maxWidth: "34rem", marginInline: "auto" }}>
                We built this because we lived it. Every feature exists because a dad said:{" "}
                <em style={{ color: "var(--color-accent-light)" }}>
                  &quot;I want to play when I can. With someone who gets it. No bullshit.&quot;
                </em>
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            4. VALUE STACK (How it works)
            Job: Make saying no feel stupid
            ═══════════════════════════════════════════ */}
        <section className="section" id="how-it-works">
          <div className="container">
            <div className="text-center" style={{ marginBottom: "var(--s-12)" }}>
              <p className="badge" style={{ marginBottom: "var(--s-4)" }}>How it works</p>
              <h2 className="text-h2 text-balance">
                Three steps. Zero friction.
              </h2>
            </div>

            <FeatureGrid
              features={[
                {
                  step: 1,
                  title: "Drop your email, get a magic link",
                  description:
                    "No passwords. No app downloads. Click the link, you're in. Takes about 10 seconds.",
                },
                {
                  step: 2,
                  title: "Set your hours and your games",
                  description:
                    "Tell us when you're usually free and what you play. We do the rest. Your schedule, your rules.",
                },
                {
                  step: 3,
                  title: "Play now or lock in a session",
                  description:
                    "See who's online right now and jump in. Or schedule a session with dads for a time that works.",
                },
              ]}
            />

            <div
              className="text-center card-accent"
              style={{
                marginTop: "var(--s-12)",
                padding: "var(--s-10) var(--s-8)",
                borderRadius: "var(--r-2xl)",
              }}
            >
              <p className="text-h3" style={{ margin: "0 0 var(--s-1)" }}>Free. No subscriptions.</p>
              <p className="text-secondary text-sm" style={{ margin: 0 }}>
                No premium tiers. No pay-to-match. No ads. We built it because we needed it.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            5. SOCIAL PROOF
            Job: Let others convince them
            ═══════════════════════════════════════════ */}
        <section className="section section-lines section-alt">
          <div className="container">
            <div className="text-center" style={{ marginBottom: "var(--s-12)" }}>
              <h2 className="text-h2 text-balance">What dads are saying</h2>
              <p className="text-secondary" style={{ marginTop: "var(--s-3)" }}>
                Real feedback. No fluff.
              </p>
            </div>

            <div className="grid-3">
              {[
                {
                  quote: "I played more this week than the last two months combined. Having someone who's actually online when I'm free changes everything.",
                  name: "Mark, 38",
                  detail: "Dad of 2, EST timezone",
                },
                {
                  quote: "I travel for work and end up in hotel rooms with a laptop and nobody to play with. Found a session within 5 minutes on Dadz.",
                  name: "James, 41",
                  detail: "Dad of 1, GMT timezone",
                },
                {
                  quote: "My gaming crew dissolved when we all had kids. Dadz gave me a new one within a week. These guys actually get it.",
                  name: "Carlos, 35",
                  detail: "Dad of 3, CST timezone",
                },
              ].map((testimonial, i) => (
                <div key={i} className={`card animate-fade-up animate-delay-${i + 1}`}>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "var(--s-4)" }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} width="16" height="16" fill="none" viewBox="0 0 16 16">
                        <path d="M8 1l2.35 4.76 5.25.77-3.8 3.7.9 5.24L8 13.27l-4.7 2.47.9-5.24-3.8-3.7 5.25-.77L8 1z" fill="var(--color-accent)" />
                      </svg>
                    ))}
                  </div>
                  <p style={{ margin: "0 0 var(--s-4)", fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--color-fg-secondary)" }}>
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div>
                    <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600 }}>{testimonial.name}</p>
                    <p className="text-muted text-xs" style={{ margin: 0 }}>{testimonial.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            6. TRANSFORMATION
            Job: Make outcome tangible
            ═══════════════════════════════════════════ */}
        <section className="section">
          <div className="container container-mid">
            <div className="text-center" style={{ marginBottom: "var(--s-12)" }}>
              <p className="badge" style={{ marginBottom: "var(--s-4)" }}>The outcome</p>
              <h2 className="text-h2 text-balance">
                Gaming fits your life instead of fighting it
              </h2>
            </div>

            <div className="stack-4">
              {[
                {
                  stage: "Week 1",
                  title: "Play tonight. Not next month.",
                  desc: "Find dads to play with, online now. One session's all it takes to see the difference.",
                  color: "var(--color-accent-light)",
                },
                {
                  stage: "Week 2",
                  title: "Build a regular crew.",
                  desc: "Add your usual hours. The same dads start showing up. Familiar faces, reliable sessions.",
                  color: "var(--color-green)",
                },
                {
                  stage: "Month 1",
                  title: "Know exactly when your people are free.",
                  desc: "No more guessing. Your schedule and theirs overlap. Sessions happen naturally.",
                  color: "var(--color-amber)",
                },
                {
                  stage: "Ongoing",
                  title: "Gaming is part of your life again.",
                  desc: "Not squeezed in. Not negotiated. Just part of the routine, like it should be.",
                  color: "var(--color-accent)",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="card card-hover flex gap-6 items-start"
                  style={{ padding: "var(--s-5) var(--s-6)" }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: 48,
                      height: 48,
                      borderRadius: "var(--r-lg)",
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}25`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: item.color,
                    }}
                  >
                    {item.stage.split(" ")[0]}
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 var(--s-1)", fontSize: "1.0625rem", fontWeight: 600 }}>
                      {item.title}
                    </h3>
                    <p className="text-secondary text-sm" style={{ margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FAQ
            ═══════════════════════════════════════════ */}
        <section className="section section-lines section-alt" id="faq">
          <div className="container container-mid">
            <div className="text-center" style={{ marginBottom: "var(--s-12)" }}>
              <h2 className="text-h2">Questions</h2>
            </div>

            <FAQ
              items={[
                {
                  question: "What's a magic link?",
                  answer:
                    "A magic link's a one-time sign-in link we send to your email. Click it and you're in. No password to remember, no password to leak. If you've used Slack sign-in, same idea.",
                },
                {
                  question: "When will Steam sign-in be available?",
                  answer:
                    "Steam integration's coming soon. For now, use your email to get started. When Steam's ready, you'll be able to link your account and import your library automatically.",
                },
                {
                  question: "Is this only for dads?",
                  answer:
                    "Dads only. Fathers. Stepdads. No exceptions. We keep the community tight so the matchmaking actually works.",
                },
                {
                  question: "How do timezones work?",
                  answer:
                    "You set your timezone in your profile. When you add availability, we show it in your local time. Other dads see it converted to theirs. No math. No confusion.",
                },
                {
                  question: "Is it really free?",
                  answer:
                    "Yes. No premium tiers. No ads. No selling your data. We built this because we needed it. If costs grow, we'll figure it out without making you pay to find someone to play with.",
                },
                {
                  question: "What if nobody's online when I am?",
                  answer:
                    "That's exactly what scheduling fixes. Add your usual windows and we'll match you with dads in overlapping timezones. The more dads join, the more likely someone's always on.",
                },
              ]}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            7. SECONDARY CTA
            Job: Catch the scrollers
            ═══════════════════════════════════════════ */}
        <section className="section-lg section-glow" style={{ overflow: "hidden" }}>
          <div
            className="container text-center"
            style={{ position: "relative", zIndex: 1 }}
          >
            <div style={{ maxWidth: "32rem", marginInline: "auto" }}>
              {/* Avatar stack */}
              <div
                className="flex justify-center"
                style={{ marginBottom: "var(--s-6)" }}
              >
                <div className="flex" style={{ marginLeft: "-4px" }}>
                  {["#4f8fff", "#5b6b7d", "#3d4f5f", "#6b7d8f", "#4f8fff"].map(
                    (color, i) => (
                      <div
                        key={i}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: `${color}30`,
                          border: "2px solid var(--color-bg)",
                          marginLeft: i > 0 ? "-8px" : 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color,
                        }}
                      >
                        D
                      </div>
                    )
                  )}
                </div>
              </div>

              <h2 className="text-h2 text-balance" style={{ margin: "0 0 var(--s-4)" }}>
                Ready to stop gaming alone?
              </h2>
              <p className="text-secondary" style={{ margin: "0 0 var(--s-8)" }}>
                Get in. Find a session. Play. Takes 10 seconds.
              </p>
              <Link href="/login" className="btn btn-primary btn-lg" style={{ display: "inline-flex" }}>
                Get a magic link
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════
          8. FOOTER
          Job: Professional legitimacy
          ═══════════════════════════════════════════ */}
      <Footer user={user} />
    </>
  );
}
