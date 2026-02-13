"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
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

    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        display_name: displayName.trim() || user.email?.split("@")[0] || "Dad",
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <div className="stack-6">
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            disabled
            readOnly
          />

          <Input
            label="Display name"
            name="display_name"
            placeholder="What other dads will see"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
          />

          <div className="stack-2">
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
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
