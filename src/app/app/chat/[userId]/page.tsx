import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { redirect } from "next/navigation";
import { ChatView } from "@/app/app/chat/ChatView";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Don't chat with yourself
  if (userId === user.id) redirect("/app?chat_error=2");

  // Get other user's profile
  const { data: otherProfile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single();

  if (!otherProfile?.display_name) redirect("/app?chat_error=3");

  // Get or create conversation
  const { data: convId, error } = await supabase.rpc("get_or_create_conversation", {
    me_id: user.id,
    other_id: userId,
  });

  if (error || !convId) {
    console.error("[Dadz] get_or_create_conversation error:", error?.message ?? "No convId");
    redirect("/app?chat_error=1");
  }

  return (
    <>
      <Header user={user} />
      <div className="container container-narrow" style={{ paddingBlock: "var(--s-8)" }}>
        <ChatView
          conversationId={convId}
          otherUserId={userId}
          otherDisplayName={otherProfile.display_name}
          currentUserId={user.id}
        />
      </div>
    </>
  );
}
