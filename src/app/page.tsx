import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { FeatureGrid } from "@/components/FeatureGrid";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const features = [
    {
      title: "See who is online now",
      description:
        "No more posting in Discord and hoping someone shows up. See other dads who are free right now and jump in.",
    },
    {
      title: "Schedule when you can play",
      description:
        "Add your usual windows. Kids asleep at 9? Traveling next week? Your availability is visible so others can plan around it.",
    },
    {
      title: "Match by games and style",
      description:
        "Filter by platform, genre, voice chat preference. Find someone who actually plays what you play, how you play.",
    },
  ];

  const faqItems = [
    {
      question: "What is a magic link?",
      answer:
        "A magic link is a one-time sign-in link we send to your email. Click it and you are in. No password to remember or reset.",
    },
    {
      question: "When is Steam sign-in available?",
      answer:
        "Steam sign-in is coming soon. For now, use your email to get started. Your Steam account will connect later.",
    },
    {
      question: "Is Dadz only for dads?",
      answer:
        "Dadz is built for parents who game. If you are a dad, stepdad, or identify as one, you belong here. We keep it focused so the community stays relevant.",
    },
    {
      question: "What about timezones?",
      answer:
        "You set your timezone in your profile. When you add availability, we show it in your local time. Other dads see it in theirs. No math required.",
    },
  ];

  return (
    <div className="container">
      <Header user={user} />

      <main>
        <section className="section" id="hero">
          <div className="stack-6">
            <h1 className="text-hero">
              Gaming when life does not fit on a calendar
            </h1>
            <p className="text-muted text-xl" style={{ maxWidth: "36rem" }}>
              You have an hour. Maybe two. The kids are asleep, or the flight is delayed.
              You want to play, but nobody is around. Dadz finds you another dad who is
              online now, or helps you schedule a session in advance. No guilt, no pressure.
            </p>
            <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
              <Link href="/login">
                <Button size="lg">Get a magic link</Button>
              </Link>
              <Link href="/#how-it-works">
                <Button variant="secondary" size="lg">
                  See how it works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="section text-muted" id="pain-points">
          <h2 style={{ margin: "0 0 var(--space-6)", fontSize: "1.5rem", color: "var(--color-fg)" }}>
            Sound familiar?
          </h2>
          <ul className="list-reset stack-3">
            <li>You have no time. When you do, it is at odd hours.</li>
            <li>Your old crew has moved on or is never online when you are.</li>
            <li>Matchmaking with randoms is hit or miss. You want someone you can rely on.</li>
            <li>Scheduling feels like herding cats. Calendars and DMs never sync.</li>
          </ul>
        </section>

        <section className="section" id="how-it-works">
          <h2 style={{ margin: "0 0 var(--space-8)", fontSize: "1.5rem" }}>
            How Dadz works
          </h2>
          <FeatureGrid features={features} />
        </section>

        <section className="section">
          <div className="card container-narrow">
            <h2 style={{ margin: "0 0 var(--space-4)", fontSize: "1.5rem" }}>
              For the hours that do not fit on a calendar
            </h2>
            <p className="text-muted" style={{ margin: 0 }}>
              Newborn up every two hours. Older kids with sports and homework. Travel for work.
              Your gaming window is real but unpredictable. Dadz is built for that. Quick match
              with someone online now, or lock in a session when you know you will be free.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="card container-narrow">
            <h2 style={{ margin: "0 0 var(--space-4)", fontSize: "1.5rem" }}>
              Privacy first. No spam. Delete anytime.
            </h2>
            <p className="text-muted" style={{ margin: 0 }}>
              We do not sell your data. Magic links only, no password leaks. You control
              what you share. If you are done, delete your account and we remove everything.
            </p>
          </div>
        </section>

        <section className="section" id="faq">
          <h2 style={{ margin: "0 0 var(--space-8)", fontSize: "1.5rem" }}>
            FAQ
          </h2>
          <FAQ items={faqItems} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
