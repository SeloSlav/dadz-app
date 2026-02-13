"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";

export function ChatErrorHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [dismissed, setDismissed] = useState(false);

  const chatError = searchParams.get("chat_error");

  const messages: Record<string, string> = {
    "1": "Couldn't open chat. Run the chat migration in Supabase.",
    "2": "You can't message yourself.",
    "3": "User not found.",
  };
  useEffect(() => {
    if (chatError && messages[chatError]) {
      showToast(messages[chatError], "error");
    }
  }, [chatError, showToast]);

  const handleDismiss = () => {
    setDismissed(true);
    router.replace("/app", { scroll: false });
  };

  if (!chatError || dismissed) return null;

  const isMigrationError = chatError === "1";

  return (
    <div
      className="card"
      style={{
        marginBottom: "var(--s-6)",
        padding: "var(--s-4) var(--s-5)",
        border: "1px solid var(--color-red)",
        background: "var(--color-red-muted)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--s-4)" }}>
        <div>
          <strong style={{ color: "var(--color-red)" }}>Couldn't open chat</strong>
          <p className="text-secondary text-sm" style={{ margin: "var(--s-2) 0 0" }}>
            {isMigrationError
              ? "Run the chat migration in Supabase SQL Editor: supabase/migrations/20250213_chat.sql"
              : chatError === "2"
                ? "You can't message yourself."
                : chatError === "3"
                  ? "That user wasn't found."
                  : "Something went wrong. Try again."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="btn btn-ghost btn-sm"
          style={{ flexShrink: 0 }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
