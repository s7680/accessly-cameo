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
      creator_id: payload.creator_id,
      fan_name: payload.fan_name,
      occasion: payload.occasion ?? null,
      recipient_name: payload.recipient_name ?? null,
      recipient_type: payload.recipient_type ?? null,
      request_details: payload.request_details,
      from_name: payload.from_name ?? null,
      language: payload.language,
      price: payload.price,
      hide_from_profile: payload.hide_from_profile ?? false,
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


export async function getFanVideoRequests(userId: string) {
  const { data, error } = await supabase
    .from("video_requests")
    .select(`
      *
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getFanVideoRequests error:", error);
    return [];
  }

  return data;
}
export async function getCreatorVideoRequests(creatorId: string) {
  const { data, error } = await supabase
    .from("video_requests")
    .select(`
      *
    `)
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCreatorVideoRequests error:", error);
    return [];
  }

  return data;
}


export async function uploadVideoForRequest(id: string, file: File) {
  const filePath = `videos/${id}-${Date.now()}.mp4`;

  const { error: uploadError } = await supabase.storage
    .from("videos")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("videos")
    .getPublicUrl(filePath);

  const videoUrl = data.publicUrl;

  const { error: updateError } = await supabase
    .from("video_requests")
    .update({
      video_url: videoUrl,
      status: "completed",
    })
    .eq("id", id);

  if (updateError) throw updateError;

  return videoUrl;
}