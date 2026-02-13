"use client";

import { useRouter } from "next/navigation";

const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

interface MessageLinkProps {
  userId: string;
  children?: React.ReactNode;
  className?: string;
  iconOnly?: boolean;
}

export function MessageLink({ userId, children, className, iconOnly }: MessageLinkProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => router.push(`/app/chat/${userId}`)}
      title="Message"
      aria-label="Message"
    >
      {iconOnly ? <MessageIcon /> : children ?? <MessageIcon />}
    </button>
  );
}
