import { supabase } from "@/lib/supabaseClient";

// Fetch all wins (using experiences_form)
export async function getUserWins(userId: string) {
  if (!userId) {
    console.warn("No userId provided to getUserWins");
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("buyer_id", userId)
    .eq("listing_type", "experience");

  if (error) {
    console.error("Error fetching wins:", error);
    return [];
  }

  return data || [];
}

// Update experience (MVP approach)
export async function updateExperience(id: string, updates: any) {
  if (!id) return null;

  const { data, error } = await supabase
    .from("experiences_form")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating experience:", error);
    return null;
  }

  return data;
}

// Fetch single experience by ID
export async function getExperienceById(id: string) {
  if (!id) return null;

  const { data, error } = await supabase
    .from("experiences_form")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching experience:", error);
    return null;
  }

  return data;
}

// Update order by listingId (for experiences)
export async function updateOrderByListingId(listingId: string, userId: string, updates: any) {
  if (!listingId || !userId) {
    console.error("Missing listingId or userId", { listingId, userId });
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("listing_id", listingId)
    .eq("buyer_id", userId)
    .eq("listing_type", "experience")
    .select()
    .maybeSingle();

  if (!data) {
    console.error("No matching order found for update", { listingId, userId });
  }

  if (error) {
    console.error("Error updating order:", error);
    return null;
  }

  return data;
}

// NOTE: using orders table but keyed via listing_id (experience id)

// Fetch messages for an experience (chat)
export async function getMessages(listingId: string) {
  if (!listingId) return [];

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("listing_id", listingId)
    .eq("listing_type", "experience")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data || [];
}

// Send message
export async function sendMessage({
  listingId,
  senderId,
  senderRole,
  message,
}: {
  listingId: string;
  senderId: string;
  senderRole: "buyer" | "seller";
  message: string;
}) {
  if (!listingId || !senderId || !message) return null;

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        listing_id: listingId,
        listing_type: "experience",
        sender_id: senderId,
        sender_role: senderRole,
        message,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error sending message:", error);
    return null;
  }

  return data;
}

// NOTE: messages tied via listing_id (experience id), not order_id