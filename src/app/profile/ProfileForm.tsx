"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Amsterdam",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
];

interface ProfileFormProps {
  initialDisplayName: string;
  initialTimezone: string;
  email: string;
}

export function ProfileForm({
  initialDisplayName,
  initialTimezone,
  email,
}: ProfileFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [timezone, setTimezone] = useState(initialTimezone || "UTC");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      showToast("Display name is required", "error");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        display_name: trimmedName,
        timezone: timezone || "UTC",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    setSaving(false);

    if (error) {
      showToast(error.message, "error");
      return;
    }

    showToast("Profile saved", "success");

    const next = searchParams.get("next");
    if (next && next.startsWith("/")) {
      router.push(next);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card animate-fade-up" style={{ padding: "var(--s-8)" }}>
        <div className="stack-6">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              value={email}
              disabled
              readOnly
              style={{ opacity: 0.5 }}
            />
            <p className="text-muted text-xs" style={{ marginTop: "var(--s-1)" }}>
              Managed by your auth account. Cannot be changed here.
            </p>
          </div>

          <div>
            <label htmlFor="display_name">Display name *</label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              className="input"
              placeholder="What other dads will see"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label htmlFor="timezone">Timezone</label>
            <select
              id="timezone"
              name="timezone"
              className="input"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" disabled={saving} size="lg">
            {saving ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </div>
    </form>
  );
}
