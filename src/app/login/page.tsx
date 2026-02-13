"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/Button";
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

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`,
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--s-6)",
      }}
    >
      <div
        className="animate-fade-up"
        style={{ width: "100%", maxWidth: 420 }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "block",
            fontSize: "1.5rem",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "var(--color-fg)",
            textAlign: "center",
            marginBottom: "var(--s-10)",
          }}
        >
          dadz
        </Link>

        <div className="card" style={{ padding: "var(--s-8)" }}>
          {status === "sent" ? (
            <div className="text-center">
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--color-green-muted)",
                  border: "1px solid rgba(52,211,153,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto var(--s-6)",
                  fontSize: "1.5rem",
                  color: "var(--color-green)",
                }}
              >
                &#10003;
              </div>
              <h1 style={{ margin: "0 0 var(--s-3)", fontSize: "1.25rem", fontWeight: 700 }}>
                Check your email
              </h1>
              <p className="text-secondary text-sm" style={{ margin: "0 0 var(--s-6)" }}>
                We sent a magic link to <strong style={{ color: "var(--color-fg)" }}>{email}</strong>.
                Click it to sign in.
              </p>
              {resendCooldown > 0 ? (
                <p className="text-muted text-sm" style={{ margin: 0 }}>
                  Resend available in {resendCooldown}s
                </p>
              ) : (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setStatus("idle"); setResendCooldown(0); }}
                >
                  Try a different email
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="text-center" style={{ marginBottom: "var(--s-8)" }}>
                <h1 style={{ margin: "0 0 var(--s-2)", fontSize: "1.5rem", fontWeight: 700 }}>
                  Sign in
                </h1>
                <p className="text-secondary text-sm" style={{ margin: 0 }}>
                  No password needed. We will send you a magic link.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "var(--s-4)" }}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === "sending"}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full"
                  size="lg"
                >
                  {status === "sending" ? "Sending..." : "Send magic link"}
                </Button>
              </form>

              <div className="divider" style={{ margin: "var(--s-6) 0" }}>or</div>

              <Button
                variant="secondary"
                onClick={handleSteamClick}
                type="button"
                className="w-full"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1.5a8.5 8.5 0 0 0-8.46 7.64l4.56 1.88a2.41 2.41 0 0 1 1.36-.42l2.04-2.95v-.04a3.22 3.22 0 1 1 3.22 3.22h-.07l-2.9 2.07a2.42 2.42 0 0 1-4.8.34L1.7 12.1A8.5 8.5 0 1 0 10 1.5z" fill="var(--color-fg-muted)"/>
                </svg>
                Sign in with Steam (coming soon)
              </Button>
            </>
          )}
        </div>

        <p className="text-center text-muted text-xs" style={{ marginTop: "var(--s-6)" }}>
          By signing in you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p className="text-muted">Loading...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
