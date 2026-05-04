import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getDropOrderByListingId(listingId: string, userId: string) {
  if (!listingId || !userId) return null;

  // 1. Fetch order
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id,
      listing_id,
      listing_type,
      buyer_id,
      seller_id,
      amount,
      special_request,
      availability,
      reschedule_requested,
      reschedule_datetime,
      cancel_requested,
      status,
      reschedule_accepted,
      cancel_accepted,
      address_details,
      packaging_video_url,
      courier_details
    `)
    .eq("listing_id", listingId)
    .eq("buyer_id", userId)
    .eq("listing_type", "drop")
    .maybeSingle();

  if (error) {
    console.error("[DB] Error fetching drop order:", error);
    return null;
  }

  if (!order) {
    console.warn("[DB] No drop order found for listing_id:", listingId);
  }

  // 2. Fetch drop details from drops_form
  const { data: drop, error: dropError } = await supabase
    .from("drops_form")
    .select(`
      id,
      creator_id,
      display_name,
      display_image,
      item_name,
      category,
      pricing_mode,
      starting_bid,
      fixed_price,
      end_datetime,
      status,
      winning_bid
    `)
    .eq("id", listingId)
    .maybeSingle();

  if (dropError) {
    console.error("[DB] Error fetching drop:", dropError);
  }

  // 3. Fetch buyer
  let buyer = null;
  if (order?.buyer_id) {
    const { data } = await supabase
      .from("users")
      .select("id, name, email, mobile, instagram")
      .eq("id", order.buyer_id)
      .maybeSingle();

    buyer = data;
  }

  // 4. Fetch seller
  let seller = null;
  if (order?.seller_id) {
    const { data } = await supabase
      .from("users")
      .select("id, name, email, mobile, instagram")
      .eq("id", order.seller_id)
      .maybeSingle();

    seller = data;
  }

  // 5. Fetch messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("listing_id", listingId)
    .eq("listing_type", "drop")
    .order("created_at", { ascending: true });

  console.log("[DB DROP] Final payload:", {
    order,
    drop,
    buyer,
    seller,
    messages,
  });

  console.log("[DB DROP RETURN CHECK]:", {
    hasDrop: !!drop,
    hasOrder: !!order,
  });

  return {
    ...(drop || {}),
    order,
    status: order?.status || null,
    address_details: order?.address_details || null,
    packaging_video_url: order?.packaging_video_url || null,
    courier_details: order?.courier_details || null,
    buyer,
    seller,
    messages: messages || [],
  };
}

export async function upsertDropOrder(
  listingId: string,
  userId: string,
  payload: {
    address_details?: any;
    packaging_video_url?: string;
    courier_details?: any;
  }
) {
  if (!listingId || !userId) return null;

  // Step 1: check if order exists
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("listing_id", listingId)
    .eq("buyer_id", userId)
    .eq("listing_type", "drop")
    .maybeSingle();

  let result;

  if (!existing) {
    console.log("[DB DROP] Creating new order row");

    // fetch seller from drop
    const { data: drop } = await supabase
      .from("drops_form")
      .select("creator_id, winning_bid")
      .eq("id", listingId)
      .maybeSingle();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        listing_id: listingId,
        listing_type: "drop",
        buyer_id: userId,
        seller_id: drop?.creator_id,
        amount: drop?.winning_bid || null,
        address_details: payload.address_details || null,
        packaging_video_url: payload.packaging_video_url || null,
        courier_details: payload.courier_details || null,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("[DB DROP] Insert error:", error);
      return null;
    }

    result = data;
  } else {
    console.log("[DB DROP] Updating existing order");

    const { data, error } = await supabase
      .from("orders")
      .update({
        address_details: payload.address_details,
        packaging_video_url: payload.packaging_video_url,
        courier_details: payload.courier_details,
        updated_at: new Date().toISOString(),
      })
      .eq("listing_id", listingId)
      .eq("buyer_id", userId)
      .eq("listing_type", "drop")
      .select()
      .maybeSingle();

    if (error) {
      console.error("[DB DROP] Update error:", error);
      return null;
    }

    result = data;
  }

  console.log("[DB DROP] Upsert result:", result);
  return result;
}