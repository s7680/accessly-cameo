import { supabase } from "@/lib/supabaseClient";

/**
 * Fetch all messages for a listing
 */
export async function fetchMessages(listingId: string, type: string) {
  console.log("FETCH CALL:", listingId, type);

  const { data, error } = await supabase
    .from("live_chat_messages")
    .select(`
      *,
      users (
        name,
        avatar_url
      )
    `)
    .eq("listing_id", listingId)
    .eq("listing_type", type)
    .order("created_at", { ascending: true });

  console.log("FETCH RESULT:", data, error);

  if (error) throw error;

  return (data || []).map((m: any) => ({
    id: m.id,
    authorName: m.users?.name || "User",
    text: m.message,
    timestamp: new Date(m.created_at),
    type: m.type,
  }));
}

/**
 * Send a message
 */
export async function sendMessage(
  listingId: string,
  type: string,
  text: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("live_chat_messages").insert({
    listing_id: listingId,
    listing_type: type,
    user_id: user?.id,
    author_name: user?.email || "User",
    message: text,
    type: "message",
  });

  if (error) throw error;
}

/**
 * Subscribe to realtime messages
 */
export function subscribeToChat(
  listingId: string,
  type: string,
  onMessage: (msg: any) => void
) {
  const channel = supabase
    .channel(`chat-${listingId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "live_chat_messages",
        filter: `listing_id=eq.${listingId}`,
      },
      (payload) => {
        const m = payload.new;

        // ensure correct type
        if (m.listing_type !== type) return;

        onMessage({
          id: m.id,
          authorName: m.author_name?.includes("@")
            ? m.author_name.split("@")[0]
            : m.author_name || "User",
          text: m.message,
          timestamp: new Date(m.created_at),
          type: m.type,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}