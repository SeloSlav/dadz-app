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
      const displayName = email ? email.split("@")[0] : "Dad";

      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          email,
          display_name: displayName,
          timezone: "UTC",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      const redirectUrl = next.startsWith("/") ? `${origin}${next}` : next;
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
