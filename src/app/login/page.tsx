"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useToast } from "@/components/Toast";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/app";
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("sending");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setStatus("error");
      showToast(error.message, "error");
      return;
    }

    setStatus("sent");
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSteamClick = () => {
    showToast("Steam sign-in coming soon");
  };

  return (
    <div className="container container-narrow" style={{ paddingBlock: "var(--space-12)" }}>
      <Header />

      <main className="stack-8" style={{ marginTop: "var(--space-16)" }}>
        <div>
          <h1 className="text-hero">Sign in</h1>
          <p className="text-muted text-lg" style={{ marginTop: "var(--space-4)" }}>
            Get a magic link sent to your email. No password needed.
          </p>
        </div>

        {status === "sent" ? (
          <div className="card stack-4">
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Check your email</h2>
            <p className="text-muted" style={{ margin: 0 }}>
              We sent a sign-in link to <strong>{email}</strong>. Click it to continue.
            </p>
            {resendCooldown > 0 ? (
              <p className="text-subtle" style={{ fontSize: "0.875rem", margin: 0 }}>
                Resend available in {resendCooldown}s
              </p>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  setStatus("idle");
                  setResendCooldown(0);
                }}
              >
                Use a different email
              </Button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="stack-6">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "sending"}
              autoComplete="email"
            />
            <Button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send magic link"}
            </Button>
          </form>
        )}

        <div className="stack-4">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
            <span className="text-subtle" style={{ fontSize: "0.875rem" }}>
              or
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
          </div>
          <Button variant="secondary" onClick={handleSteamClick} type="button">
            Sign in with Steam (coming soon)
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container container-narrow" style={{ paddingBlock: "var(--space-12)" }}>
        <Header />
        <main style={{ marginTop: "var(--space-16)" }}>
          <div className="text-muted">Loading...</div>
        </main>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
