import { supabase } from '@/lib/supabaseClient';

export type VideoFormPayload = {
  type: string; // required
  category: string;
  price: number;
  delivery_time: string;
  language: string;
  max_duration?: string;
  occasions?: string[];
  files?: File[]; // real video files
  instructions?: string;
  bio?: string;
  displayImage?: File;
};

async function uploadVideos(files: File[], userId: string) {
  const urls: string[] = [];

  for (const file of files) {
    const cleanName = file.name
      .replace(/[^a-zA-Z0-9.]/g, "-")
      .toLowerCase();

    const fileName = `${userId}/${Date.now()}-${cleanName}`;

    const { error } = await supabase.storage
      .from('creator-videos')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('creator-videos')
      .getPublicUrl(fileName);

    urls.push(data.publicUrl);
  }

  return urls;
}

export async function createVideoForm(payload: VideoFormPayload) {
  // 1. get logged-in user
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    throw new Error('User not authenticated');
  }

  const creator_id = authData.user.id;

  let videoUrls: string[] = [];

  if (payload.files && payload.files.length > 0) {
    if (payload.files.length > 5) {
      throw new Error('Maximum 5 videos allowed');
    }

    videoUrls = await uploadVideos(payload.files, creator_id);
  }

  let displayImageUrl: string | null = null;

  if ((payload as any).displayImage) {
    const file = (payload as any).displayImage as File;
    const cleanName = file.name
      .replace(/[^a-zA-Z0-9.]/g, "-")
      .toLowerCase();

    const filePath = `display-images/${creator_id}/${Date.now()}-${cleanName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    displayImageUrl = urlData.publicUrl;
  }

  // 2. insert into video_form table
  const { data, error } = await supabase
    .from('video_form')
    .insert({
      creator_id,
      type: payload.type || 'video',
      category: payload.category,
      price: payload.price,
      delivery_time: payload.delivery_time,
      language: payload.language,
      max_duration: payload.max_duration || null,
      occasions: payload.occasions || [],
      sample_video_urls: videoUrls,
      instructions: payload.instructions || null,
      bio: payload.bio || null,
      display_image: displayImageUrl,
    })
    .select()
    .single();

  if (error) {
    console.error('createVideoForm error:', error);

    // handle duplicate video submission (unique constraint)
    if (error.code === '23505') {
      throw new Error('You have already submitted a video application');
    }

    // fallback to Supabase error message
    throw new Error(error.message || 'Failed to submit application');
  }

  return data;
}

export async function getCreatorCards() {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      name,
      avatar_url,
      video_form!inner (
        price,
        type,
        category,
        delivery_time,
        display_image
      )
    `)
    .eq('video_form.type', 'video');

  if (error) {
    console.error('getCreatorCards error:', error);
    throw new Error(error.message || 'Failed to fetch creators');
  }

  // normalize data for UI
  return data.map((user: any) => {
    const video = user.video_form?.[0];

    return {
      id: user.id,
      name: user.name,
      avatar_url: user.avatar_url,
      display_image: video?.display_image || null,
      price: video?.price || null,
      category: video?.category || null,
      delivery_time: video?.delivery_time || null,
    };
  });
}

export async function getVideoByCreatorId(creatorId: string) {
  const { data, error } = await supabase
    .from("video_form")
    .select(`
      *,
      users!video_form_creator_id_fkey (
        name,
        avatar_url,
        instagram
      )
    `)
    .eq("creator_id", creatorId)
    .eq("type", "video")
    .single();

  if (error) {
    console.error("getVideoByCreatorId error:", error);
    return null;
  }

  return data;
}