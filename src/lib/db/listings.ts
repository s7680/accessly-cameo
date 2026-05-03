import { supabase } from "@/lib/supabaseClient";

type ListingPayload = {
  type: "drop" | "experience";
  category: string;
  displayName: string;
  displayImage?: File | null;
  media?: File[];

  // common
  story?: string;
  instagramLink?: string;

  // drop
  pricingMode?: string;
  startDateTime?: string;
  endDateTime?: string;
  startingBid?: number;
  fixedPrice?: number;
  itemName?: string;
  condition?: string;
  authenticity?: string;
  shippingDetails?: string;
  productDetails?: string;
  faq?: any;

  // experience
  aboutExperience?: string;
  fanBenefits?: string;
  durationType?: string;
  experienceDate?: string;
  startTime?: string;
  durationMinutes?: number;
  startDate?: string;
  endDate?: string;
  guests?: number;
  location?: string;
  photosIncluded?: string;
  autographIncluded?: string;
  cuisine?: string;
};

export async function createListing(payload: ListingPayload) {
  console.log("CREATE LISTING CALLED");
  console.log("PAYLOAD TYPE:", payload.type);
  const normalizedType = payload.type === "drops" ? "drop" : payload.type === "experiences" ? "experience" : payload.type;
  // 1. upload display image
  let displayImageUrl = null;

  if (payload.displayImage) {
    try {
      const safeName = payload.displayImage.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filePath = `display-images/${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, payload.displayImage);

      if (error) {
        console.log("DISPLAY IMAGE UPLOAD ERROR:", error);
      } else {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        displayImageUrl = data.publicUrl;
      }
    } catch (e) {
      console.log("DISPLAY IMAGE EXCEPTION:", e);
    }
  }

  // get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("USER:", user?.id);

  if (!user) throw new Error("User not authenticated");

  // 3. upload media (optional)
  let mediaUrls: string[] = [];

  if (payload.media && payload.media.length > 0) {
    for (const file of payload.media) {
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const path = `media/${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from("media")
        .upload(path, file);

      if (error) {
        console.log("MEDIA UPLOAD ERROR:", error);
        continue;
      }

      const { data } = supabase.storage
        .from("media")
        .getPublicUrl(path);

      mediaUrls.push(data.publicUrl);
    }
  }

  // insert into correct table
  if (normalizedType === "drop") {
    try {
      console.log("INSIDE DROP BLOCK");
      const { data, error } = await supabase
        .from("drops_form")
        .insert({
        creator_id: user.id,
        display_name: payload.displayName,
        display_image: displayImageUrl,
        category: payload.category,
        media: mediaUrls ?? [],
        story: payload.story,
        instagram_link: payload.instagramLink,
        pricing_mode: payload.pricingMode,
        start_datetime: payload.startDateTime || null,
        end_datetime: payload.endDateTime || null,
        starting_bid: payload.startingBid,
        fixed_price: payload.fixedPrice,
        item_name: payload.itemName,
        condition: payload.condition,
        authenticity: payload.authenticity,
        shipping_details: payload.shippingDetails,
        product_details: payload.productDetails,
        faq: payload.faq ?? {},
      })
      .select()
      .single();

      console.log("DROP INSERT DATA:", data);
      console.log("DROP ID:", data?.id);
      console.log("DROP INSERT ERROR:", error);

      if (error) throw error;
    } catch (e) {
      console.log("DROP INSERT EXCEPTION:", e);
    }
  }

  if (normalizedType === "experience") {
    try {
      console.log("INSIDE EXPERIENCE BLOCK");
      const { data, error } = await supabase
        .from("experiences_form")
        .insert({
          creator_id: user.id,
          display_name: payload.displayName,
          display_image: displayImageUrl,
          category: payload.category,
          media: mediaUrls ?? [],
          about_experience: payload.aboutExperience,
          fan_benefits: payload.fanBenefits,
          duration_type: payload.durationType,
          experience_date: payload.experienceDate || null,
          start_time: payload.startTime || null,
          duration_minutes: payload.durationMinutes ?? null,
          start_date: payload.startDate || null,
          end_date: payload.endDate || null,
          guests: payload.guests,
          location: payload.location,
          photos_included: payload.photosIncluded,
          autograph_included: payload.autographIncluded,
          cuisine: payload.cuisine,
          faq: payload.faq ?? {},
        })
        .select()
        .single();

      console.log("EXPERIENCE INSERT DATA:", data);
      console.log("EXPERIENCE ID:", data?.id);
      console.log("EXPERIENCE INSERT ERROR:", error);

      if (error) throw error;
    } catch (e) {
      console.log("EXPERIENCE INSERT EXCEPTION:", e);
    }
  }

  return true;
}

export async function getDrops() {
  const { data, error } = await supabase
    .from("drops_form")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("FETCHING FROM TABLE: drops_form");
  console.log("DROPS DATA:", data);
  console.log("DROPS ERROR:", error);

  if (error) throw error;

  return (data ?? []).map((d: any) => ({
    id: d.id,
    item_name: d.item_name,
    display_name: d.display_name,
    display_image: d.display_image,
    category: d.category,
    starting_bid: d.starting_bid,
    fixed_price: d.fixed_price,
    pricing_mode: d.pricing_mode || "auction",
    end_datetime: d.end_datetime,
    product_details: d.product_details,
    media: (
      (typeof d.media === "string" ? JSON.parse(d.media) : d.media) || []
    ).map((m: any) => {
      if (typeof m === "string") {
        const isVideo = m.toLowerCase().endsWith(".mp4");
        return {
          type: isVideo ? "video" : "image",
          src: m,
          thumbnail: m,
          alt: d.item_name || "media",
        };
      }
      return m;
    }),
  }));
}

export async function getExperiences() {
  const { data, error } = await supabase
    .from("experiences_form")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("FETCHING FROM TABLE: experiences_form");
  console.log("EXPERIENCES DATA:", data);
  console.log("EXPERIENCES ERROR:", error);

  if (error) throw error;

  return (data ?? []).map((e: any) => ({
    id: e.id,
    about_experience: e.about_experience,
    display_name: e.display_name,
    display_image: e.display_image,
    category: e.category,
    location: e.location,
    experience_date: e.experience_date,
    start_date: e.start_date,
    duration_minutes: e.duration_minutes,
    guests: e.guests,
    media: (
      (typeof e.media === "string" ? JSON.parse(e.media) : e.media) || []
    ).map((m: any) => {
      if (typeof m === "string") {
        const isVideo = m.toLowerCase().endsWith(".mp4");
        return {
          type: isVideo ? "video" : "image",
          src: m,
          thumbnail: m,
          alt: e.about_experience || "media",
        };
      }
      return m;
    }),
  }));
}

export async function getDropById(id: string) {
  const { data, error } = await supabase
    .from("drops_form")
    .select(`
      *,
      users:creator_id (
        *
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    item_name: data.item_name,
    category: data.category,
    story: data.story || data.product_details || "",
    instagram_link: data.instagram_link,

    creator: {
      name: data.users?.username || data.users?.name || data.display_name,
      avatar: data.users?.avatar_url || data.display_image,
      instagram: data.users?.instagram_username || null,
    },

    media: (
      (typeof data.media === "string"
        ? JSON.parse(data.media)
        : data.media) || []
    )
      .map((m: any) => {
        if (typeof m === "string") {
          const isVideo = m.toLowerCase().endsWith(".mp4");
          return {
            type: isVideo ? "video" : "image",
            src: m,
            thumbnail: m,
            alt: data.item_name || "media",
          };
        }
        return {
          type: m.type || "image",
          src: m.src || m.url || null,
          thumbnail: m.thumbnail || m.src || m.url || null,
          alt: m.alt || data.item_name || "media",
        };
      })
      .filter((m: any) => m.src),

    product_details: data.product_details,
    shipping_details: data.shipping_details,
    condition: data.condition,
    starting_bid: data.starting_bid,
    fixed_price: data.fixed_price,
    end_datetime: data.end_datetime ? new Date(data.end_datetime) : null,

    faq:
      typeof data.faq === "string"
        ? JSON.parse(data.faq)
        : data.faq || {},
  };
}