"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";

export function HeroForm() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

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
        emailRedirectTo: `${baseUrl}/auth/callback`,
      },
    });

    if (error) {
      setStatus("idle");
      showToast(error.message, "error");
      return;
    }

    setStatus("sent");
    showToast("Check your email for the magic link", "success");
  };

  if (status === "sent") {
    return (
      <div
        className="flex items-center gap-3"
        style={{
          padding: "var(--s-4) var(--s-5)",
          background: "var(--color-green-muted)",
          border: "1px solid rgba(52,211,153,0.2)",
          borderRadius: "var(--r-xl)",
          maxWidth: "32rem",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <span style={{ fontSize: "0.9375rem" }}>
          Magic link sent to <strong>{email}</strong>. Check your inbox.
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2"
      style={{
        maxWidth: "28rem",
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border-strong)",
        borderRadius: "var(--r-xl)",
        padding: "var(--s-1)",
      }}
    >
      <input
        type="email"
        placeholder="Your email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "sending"}
        autoComplete="email"
        aria-label="Email address"
        style={{
          flex: 1,
          minWidth: 0,
          padding: "var(--s-3) var(--s-4)",
          background: "transparent",
          border: "none",
          outline: "none",
          color: "var(--color-fg)",
          fontFamily: "inherit",
          fontSize: "0.9375rem",
        }}
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "sending"}
        style={{ flexShrink: 0, borderRadius: "var(--r-lg)" }}
      >
        {status === "sending" ? "Sending..." : "Get started"}
      </button>
    </form>
  );
}
