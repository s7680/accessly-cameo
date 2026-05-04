


import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getSellerDropOrderAddressByOrderId(orderId: string) {
  if (!orderId) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      listing_id,
      buyer_id,
      address_details
    `)
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    console.error("[DB SELLER DROP] Error fetching address details:", error);
    return null;
  }

  if (!data) {
    console.warn("[DB SELLER DROP] No order found for id:", orderId);
    return null;
  }

  console.log("[DB SELLER DROP] Address details:", data);

  return data;
}


export async function updateDropShipmentAndStatus(
  orderId: string,
  payload: {
    packaging_video_url?: string;
    courier_details?: any;
    status?: string;
  }
) {
  if (!orderId) return null;

  const { data, error } = await supabase
    .from("orders")
    .update({
      ...(payload.packaging_video_url !== undefined && { packaging_video_url: payload.packaging_video_url }),
      ...(payload.courier_details !== undefined && { courier_details: payload.courier_details }),
      ...(payload.status !== undefined && { status: payload.status }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .maybeSingle();

  if (error) {
    console.error("[DB SELLER DROP] Update error:", error);
    return null;
  }

  console.log("[DB SELLER DROP] Shipment/Status updated:", data);

  return data;
}