import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const email = data.user.email ?? "";

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("display_name, timezone")
        .eq("id", data.user.id)
        .single();

      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          email,
          display_name: existingProfile?.display_name ?? null,
          timezone: existingProfile?.timezone ?? "UTC",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      const hasDisplayName = !!existingProfile?.display_name?.trim();
      const redirectTo = hasDisplayName ? next : "/profile";
      const redirectUrl =
        redirectTo.startsWith("/")
          ? `${origin}${redirectTo}${!hasDisplayName ? `?next=${encodeURIComponent(next)}` : ""}`
          : redirectTo;

      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
