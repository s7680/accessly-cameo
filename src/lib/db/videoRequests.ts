import { supabase } from "@/lib/supabaseClient";

export async function createVideoRequest(payload: {
  creator_id: string;
  fan_name: string;
  occasion?: string;
  recipient_name?: string;
  recipient_type?: string;
  request_details: string;
  from_name?: string;
  language: string;
  price: number;
  hide_from_profile?: boolean;
}) {
  const { data, error } = await supabase
    .from("video_requests")
    .insert({
      ...payload,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("createVideoRequest error:", error);
    throw error;
  }

  return data;
}