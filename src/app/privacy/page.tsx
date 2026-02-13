import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Privacy Policy | Dadz",
  description: "Privacy Policy for Dadz - Find dads to play with.",
};

export default async function PrivacyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Header user={user} />
      <div className="container container-narrow" style={{ paddingBlock: "var(--s-12)" }}>
        <main>
          <Link
            href="/"
            className="btn btn-ghost btn-outline btn-sm"
            style={{ marginBottom: "var(--s-6)" }}
          >
            ← Back
          </Link>
          <h1 className="text-hero" style={{ margin: "0 0 var(--s-6)" }}>
            Privacy Policy
          </h1>
          <p className="text-muted" style={{ marginBottom: "var(--s-8)" }}>
            Last updated: {new Date().toLocaleDateString("en-US")}
          </p>

          <div className="stack-6 text-secondary" style={{ lineHeight: 1.8 }}>
            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-fg)", marginBottom: "var(--s-3)" }}>
                1. Information We Collect
              </h2>
              <p style={{ margin: 0 }}>
                We collect information you provide when you sign up and use Dadz: your email address, display name, timezone, gaming preferences (games you play, when you're available), and messages you send to other users. We use Supabase for authentication and data storage.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-fg)", marginBottom: "var(--s-3)" }}>
                2. How We Use Your Information
              </h2>
              <p style={{ margin: 0 }}>
                We use your information to match you with other dads who share your games and availability. Your display name and gaming preferences are shown to other users to facilitate connections. We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-fg)", marginBottom: "var(--s-3)" }}>
                3. Data Sharing
              </h2>
              <p style={{ margin: 0 }}>
                Your profile information (display name, games, availability) is visible to other Dadz users for matchmaking. Your email is not shared. Messages you send are stored and visible only to you and the recipient.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-fg)", marginBottom: "var(--s-3)" }}>
                4. Data Security
              </h2>
              <p style={{ margin: 0 }}>
                We use industry-standard practices to protect your data. Authentication is handled by Supabase. Passwords are hashed and we use secure connections (HTTPS). You are responsible for keeping your account credentials secure.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-fg)", marginBottom: "var(--s-3)" }}>
                5. Your Rights
              </h2>
              <p style={{ margin: 0 }}>
                You can update or delete your profile at any time. You may request deletion of your account and associated data by contacting us. We will process such requests within a reasonable timeframe.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-fg)", marginBottom: "var(--s-3)" }}>
                6. Contact
              </h2>
              <p style={{ margin: 0 }}>
                If you have questions about this Privacy Policy or your data, please contact us through the app or at the contact information provided on our website.
              </p>
            </section>
          </div>
        </main>
      </div>
      <Footer user={user} />
    </>
  );
}
