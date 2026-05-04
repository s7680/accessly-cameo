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
      special_request,
      availability,
      reschedule_requested,
      reschedule_datetime,
      cancel_requested
    `)
    .eq("listing_id", experienceId)
    .limit(1);

  if (orderError) {
    console.error("[DB] Error fetching order:", orderError);
  } else {
    console.log("[DB] Order fetched (raw):", orderData);
    order = Array.isArray(orderData) ? orderData[0] : orderData;
  }

  return {
    ...data,
    winner,
    order,
  };
}