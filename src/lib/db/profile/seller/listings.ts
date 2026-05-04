import { supabase } from "@/lib/supabaseClient";

export async function getExperienceById(experienceId: string) {
  if (!experienceId) {
    console.error("[DB] Missing experienceId");
    return null;
  }
  const { data, error } = await supabase
    .from("experiences_form")
    .select(`
      id,
      creator_id,
      display_name,
      category,
      about_experience,
      fan_benefits,
      experience_date,
      start_time,
      guests,
      duration,
      location,
      status,
      winning_bid,
      winner_id
    `)
    .eq("id", experienceId)
    .single();

  if (error) {
    console.error("[DB] Error fetching experience:", error);
    return null;
  }

  // Fetch winner details
  let winner = null;

  if (data?.winner_id) {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email, name, mobile")
      .eq("id", data.winner_id)
      .single();

    if (userError) {
      console.error("[DB] Error fetching winner:", userError);
    } else {
      winner = {
        email: userData.email,
        full_name: userData.name,
        phone: userData.mobile,
      };
    }
  }

  // Fetch order details using listing_id
  let order = null;

  console.log("[DB] Fetching order for listing_id:", experienceId);

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select(`
      id,
      listing_id,
      listing_type,
      amount,
      special_request,
      availability,
      status,
      reschedule_requested,
      reschedule_datetime,
      cancel_requested,
      reschedule_accepted,
      cancel_accepted
    `)
    .eq("listing_id", experienceId)
    .limit(1);

  if (orderError) {
    console.error("[DB] Error fetching order:", orderError);
  } else {
    console.log("[DB] Order fetched (raw):", orderData);
    order = Array.isArray(orderData) ? orderData[0] : orderData;
    console.log("[DB] Parsed order object:", order);
    console.log("[DB] reschedule_requested value:", order?.reschedule_requested, "type:", typeof order?.reschedule_requested);
    console.log("[DB] cancel_requested value:", order?.cancel_requested, "type:", typeof order?.cancel_requested);
    console.log("[DB] reschedule_accepted value:", order?.reschedule_accepted, "type:", typeof order?.reschedule_accepted);
    console.log("[DB] cancel_accepted value:", order?.cancel_accepted, "type:", typeof order?.cancel_accepted);
    console.log("[DB] status value:", order?.status, "type:", typeof order?.status);
    console.log("[DB] winning_bid (amount) value:", order?.amount);
  }

  // Fetch messages for this listing
  let messages: any[] = [];

  const { data: messagesData, error: messagesError } = await supabase
    .from("messages")
    .select(`
      id,
      listing_id,
      sender_id,
      sender_role,
      message,
      created_at
    `)
    .eq("listing_id", experienceId)
    .eq("listing_type", "experience")
    .order("created_at", { ascending: true });

  if (messagesError) {
    console.error("[DB] Error fetching messages:", messagesError);
  } else {
    console.log("[DB] Messages fetched:", messagesData);
    messages = messagesData || [];
  }

  console.log("[DB] Final payload to UI:", {
    experience: data,
    winner,
    order,
    messages,
  });

  return {
    ...data,
    winner,
    order,
    messages,
  };
}

export async function sendMessage(listingId: string, senderId: string, senderRole: "buyer" | "seller", text: string) {
  if (!listingId || !senderId || !text.trim()) return null;

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        listing_id: listingId,
        listing_type: "experience",
        sender_id: senderId,
        sender_role: senderRole,
        message: text,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("[DB] Error sending message:", error);
    return null;
  }

  return data;
}

export async function updateOrderByListingId(listingId: string, payload: any) {
  if (!listingId) return null;

  // Build safe update object (only include defined fields)
  const updateData: any = {
    ...(payload.status !== undefined && { status: payload.status }),
    ...(payload.availability !== undefined && { availability: payload.availability }),
    ...(payload.special_request !== undefined && { special_request: payload.special_request }),
    ...(payload.reschedule_requested !== undefined && {
      reschedule_requested: payload.reschedule_requested === true,
    }),
    ...(payload.reschedule_datetime !== undefined && { reschedule_datetime: payload.reschedule_datetime }),
    ...(payload.cancel_requested !== undefined && {
      cancel_requested: payload.cancel_requested === true,
    }),
    ...(payload.reschedule_accepted !== undefined && {
      reschedule_accepted: payload.reschedule_accepted === true ? "Yes" : "No",
    }),
    ...(payload.cancel_accepted !== undefined && {
      cancel_accepted: payload.cancel_accepted === true ? "Yes" : "No",
    }),
    updated_at: new Date().toISOString(),
  };

  console.log("[DB] Updating order with:", {
    listingId,
    updateData,
    cancel_requested: payload.cancel_requested,
    reschedule_requested: payload.reschedule_requested,
  });

  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("listing_id", listingId)
    .eq("listing_type", "experience")
    .select();

  console.log("[DB] Update response:", data);

  if (error) {
    console.error("[DB] Error updating order:", error);
    return null;
  }

  if (!data || data.length === 0) {
    console.warn("[DB] No rows updated for listing_id:", listingId);
    return null;
  }

  return data[0];
}