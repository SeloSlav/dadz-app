import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Terms of Service | Dadz",
  description: "Terms of Service for Dadz - Find dads to play with.",
};

export default async function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-muted" style={{ marginBottom: "var(--s-8)" }}>
            Last updated: {new Date().toLocaleDateString("en-US")}
          </p>

          <div className="stack-6 text-secondary" style={{ lineHeight: 1.8 }}>
            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-fg)", marginBottom: "var(--s-3)" }}>
                1. Acceptance of Terms
              </h2>
              <p style={{ margin: 0 }}>
                By accessing or using Dadz ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-fg)", marginBottom: "var(--s-3)" }}>
                2. Description of Service
              </h2>
              <p style={{ margin: 0 }}>
                Dadz is a platform that helps dads find other dads to play video games with. We match users based on shared games and availability. The Service is provided as-is and we reserve the right to modify or discontinue it at any time.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-fg)", marginBottom: "var(--s-3)" }}>
                3. Eligibility
              </h2>
              <p style={{ margin: 0 }}>
                You must be at least 18 years old to use the Service. By using Dadz, you represent that you meet this requirement. The Service is intended for dads who want to connect with other dads for gaming.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-fg)", marginBottom: "var(--s-3)" }}>
                4. User Conduct
              </h2>
              <p style={{ margin: 0 }}>
                You agree to use the Service responsibly and respectfully. You will not harass, abuse, or harm other users. You will not use the Service for any illegal purpose. We reserve the right to suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-fg)", marginBottom: "var(--s-3)" }}>
                5. Disclaimer
              </h2>
              <p style={{ margin: 0 }}>
                Dadz is provided "as is" without warranties of any kind. We do not guarantee that the Service will be uninterrupted or error-free. Your use of the Service and any interactions with other users are at your own risk.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-fg)", marginBottom: "var(--s-3)" }}>
                6. Contact
              </h2>
              <p style={{ margin: 0 }}>
                If you have questions about these Terms, please contact us through the app or at the contact information provided on our website.
              </p>
            </section>
          </div>
        </main>
      </div>
      <Footer user={user} />
    </>
  );
}
