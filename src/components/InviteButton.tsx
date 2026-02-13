"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";

export function InviteButton() {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast("Link copied", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Couldn't copy", "error");
    }
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleShare}
      disabled={copied}
    >
      {copied ? "Copied!" : "Copy link to share"}
    </Button>
  );
}
