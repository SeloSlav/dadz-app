"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";

interface ChatViewProps {
  conversationId: string;
  otherUserId: string;
  otherDisplayName: string;
  currentUserId: string;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export function ChatView({
  conversationId,
  otherUserId,
  otherDisplayName,
  currentUserId,
}: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      setMessages((data ?? []) as Message[]);
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length === 1 && !e.key.startsWith("Arrow") && e.key !== "Tab" && e.key !== "Escape") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setSending(true);
    const { data: newMsg, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: trimmed,
      })
      .select("id, sender_id, content, created_at")
      .single();
    setSending(false);

    if (error) {
      console.error("[Dadz] send message error:", error);
      showToast("Couldn't send message. Try again.", "error");
      return;
    }
    setInput("");
    if (newMsg) {
      setMessages((prev) => [...prev, newMsg as Message]);
    }
  };

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: "var(--s-4) var(--s-5)",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          gap: "var(--s-4)",
        }}
      >
        <Link href="/app" className="btn btn-ghost btn-sm" style={{ padding: "var(--s-1) var(--s-2)" }}>
          ← Back
        </Link>
        <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>
          {otherDisplayName}
        </h2>
      </div>

      <div
        className="scrollbar-styled"
        style={{
          height: 360,
          overflowY: "auto",
          padding: "var(--s-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--s-3)",
        }}
      >
        {messages.length === 0 && (
          <p className="text-muted text-sm" style={{ margin: "auto 0", textAlign: "center" }}>
            No messages yet. Say hi.
          </p>
        )}
        {[...messages]
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.sender_id === currentUserId ? "flex-end" : "flex-start",
              maxWidth: "80%",
              padding: "var(--s-2) var(--s-4)",
              borderRadius: "var(--r-lg)",
              background: m.sender_id === currentUserId ? "var(--color-accent-muted)" : "var(--color-bg-muted)",
              border: m.sender_id === currentUserId ? "1px solid rgba(79,143,255,0.2)" : "1px solid var(--color-border)",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.9375rem", whiteSpace: "pre-wrap" }}>
              {m.content}
            </p>
            <p className="text-muted text-xs" style={{ margin: "var(--s-1) 0 0" }}>
              {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        style={{
          padding: "var(--s-4)",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          gap: "var(--s-2)",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          className="input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
          style={{ flex: 1 }}
        />
        <Button type="submit" disabled={sending || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
