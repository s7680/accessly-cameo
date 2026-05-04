import { supabase } from "@/lib/supabaseClient";

export async function getListings(userId: string) {
  console.log("USER ID:", userId);
  const { data: drops } = await supabase
    .from("drops_form")
    .select(`
      id,
      item_name,
      start_datetime,
      end_datetime,
      fixed_price,
      display_name,
      display_image,
      category,
      story,
      pricing_mode,
      winner_id,
      winning_bid,
      status,
      users ( avatar_url )
    `)
    .eq("creator_id", userId);

  const { data: experiences, error: expError } = await supabase
    .from("experiences_form")
    .select(`
      id,
      creator_id,
      start_datetime,
      end_datetime,
      experience_date,
      fixed_price,
      display_name,
      display_image,
      category,
      about_experience,
      location,
      duration,
      guests,
      pricing_mode,
      winner_id,
      winning_bid,
      status,
      users ( avatar_url )
    `)
    .eq("creator_id", userId);

  if (expError) {
    console.log("EXPERIENCE FETCH ERROR:", expError);
  }
  console.log("EXPERIENCES RAW:", experiences);

  async function getHighestBid(id: string, type: "drop" | "experience") {
    const { data } = await supabase
      .from("bids")
      .select("amount")
      .eq("listing_id", id)
      .eq("listing_type", type)
      .order("amount", { ascending: false })
      .limit(1)
      .single();

    return data?.amount || 0;
  }

  const formattedDrops = await Promise.all(
    (drops || []).map(async (d: any) => ({
      ...d,
      type: "drop",
      current_bid: await getHighestBid(d.id, "drop"),
    }))
  );

  const formattedExperiences = await Promise.all(
    (experiences || []).map(async (e: any) => ({
      ...e,
      type: "experience",

      // normalize experience-specific fields
      story: e.about_experience,
      location: e.location,
      duration: e.duration,

      current_bid: await getHighestBid(e.id, "experience"),
    }))
  );
  console.log("FORMATTED EXPERIENCES:", formattedExperiences);

  return [...formattedDrops, ...formattedExperiences];
}

export async function getUserBids(userId: string) {
  // fetch bids by user
  const { data: bids } = await supabase
    .from("bids")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!bids || bids.length === 0) return [];

  const { data: highestBids } = await supabase
    .from("bids")
    .select("listing_id, listing_type, amount")
    .in("listing_id", bids.map((b: any) => b.listing_id))
    .order("amount", { ascending: false });

  const highestMap: Record<string, number> = {};

  (highestBids || []).forEach((b: any) => {
    const key = `${b.listing_id}-${b.listing_type}`;
    if (!highestMap[key]) {
      highestMap[key] = b.amount;
    }
  });

  // Separate drop and experience IDs
  const dropIds = bids
    .filter((b: any) => b.listing_type === "drop")
    .map((b: any) => b.listing_id);

  const experienceIds = bids
    .filter((b: any) => b.listing_type === "experience")
    .map((b: any) => b.listing_id);

  // Fetch drops in one query
  const { data: drops } = await supabase
    .from("drops_form")
    .select("id, item_name, display_name, display_image, category, end_datetime")
    .in("id", dropIds.length ? dropIds : ["00000000-0000-0000-0000-000000000000"]);

  // Fetch experiences in one query
  const { data: experiences } = await supabase
    .from("experiences_form")
    .select("id, display_name, display_image, category, start_datetime, end_datetime")
    .in("id", experienceIds.length ? experienceIds : ["00000000-0000-0000-0000-000000000000"]);

  const dropMap = Object.fromEntries((drops || []).map((d: any) => [d.id, d]));
  const expMap = Object.fromEntries((experiences || []).map((e: any) => [e.id, e]));

  const enriched = bids.map((b: any) => {
    if (b.listing_type === "drop") {
      const d = dropMap[b.listing_id];
      return {
        id: b.id,
        listing_id: b.listing_id,
        listing_type: b.listing_type,
        amount: b.amount,
        created_at: b.created_at,
        title: d?.item_name,
        creator: d?.display_name,
        image: d?.display_image,
        category: d?.category,
        end_datetime: d?.end_datetime,
        highest_bid: highestMap[`${b.listing_id}-${b.listing_type}`] || 0,
        isWinning: b.amount === highestMap[`${b.listing_id}-${b.listing_type}`],
      };
    }

    if (b.listing_type === "experience") {
      const e = expMap[b.listing_id];
      return {
        id: b.id,
        listing_id: b.listing_id,
        listing_type: b.listing_type,
        amount: b.amount,
        created_at: b.created_at,
        title: e?.display_name,
        creator: e?.display_name,
        image: e?.display_image,
        category: e?.category,
        start_datetime: e?.start_datetime,
        end_datetime: e?.end_datetime,
        highest_bid: highestMap[`${b.listing_id}-${b.listing_type}`] || 0,
        isWinning: b.amount === highestMap[`${b.listing_id}-${b.listing_type}`],
      };
    }

    return null;
  });

  return enriched;
}

export async function getUserWins(userId: string) {
  // fetch drops won by user
  const { data: drops } = await supabase
    .from("drops_form")
    .select("id, item_name, display_name, display_image, category, end_datetime, winning_bid")
    .eq("winner_id", userId);

  // fetch experiences won by user
  const { data: experiences } = await supabase
    .from("experiences_form")
    .select("id, display_name, display_image, category, start_datetime, end_datetime, winning_bid")
    .eq("winner_id", userId);

  const formattedDrops = (drops || []).map((d: any) => ({
    id: d.id,
    listing_id: d.id,
    listing_type: "drop",
    title: d.item_name,
    creator: d.display_name,
    image: d.display_image,
    category: d.category,
    end_datetime: d.end_datetime,
    winning_bid: d.winning_bid,
  }));

  const formattedExperiences = (experiences || []).map((e: any) => ({
    id: e.id,
    listing_id: e.id,
    listing_type: "experience",
    title: e.display_name,
    creator: e.display_name,
    image: e.display_image,
    category: e.category,
    start_datetime: e.start_datetime,
    end_datetime: e.end_datetime,
    winning_bid: e.winning_bid,
  }));

  return [...formattedDrops, ...formattedExperiences];
}

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
  console.log("INSTAGRAM IN PAYLOAD:", payload.instagramLink);
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
      console.log("INSTAGRAM BEFORE INSERT:", payload.instagramLink);
      const startDateTime =
        payload.startDateTime ||
        (payload.startDate && payload.startTime
          ? new Date(`${payload.startDate}T${payload.startTime}`).toISOString()
          : null);

      const endDateTime =
        payload.endDateTime ||
        (payload.startDate && payload.startTime && payload.durationMinutes
          ? new Date(
              new Date(`${payload.startDate}T${payload.startTime}`).getTime() +
                payload.durationMinutes * 60 * 1000
            ).toISOString()
          : null);

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
          duration: payload.durationMinutes ?? null,
          start_datetime: startDateTime,
          end_datetime: endDateTime,
          guests: payload.guests,
          location: payload.location,
          photos_included: payload.photosIncluded,
          autograph_included: payload.autographIncluded,
          cuisine: payload.cuisine,
          instagram_link: payload.instagramLink,
          faq: payload.faq ?? {},
          pricing_mode: payload.pricingMode,
          starting_bid: payload.startingBid ?? null,
          fixed_price: payload.fixedPrice ?? null,
        })
        .select()
        .single();

      console.log("EXPERIENCE INSERT DATA:", data);
      console.log("EXPERIENCE ID:", data?.id);
      console.log("EXPERIENCE INSERT ERROR:", error);
      console.log("INSTAGRAM SAVED IN DB:", data?.instagram_link);

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

    display_name: e.display_name,
    display_image: e.display_image,
    category: e.category,

    about_experience: e.about_experience,
    fan_benefits: e.fan_benefits,

    duration_type: e.duration_type,
    experience_date: e.experience_date,
    start_time: e.start_time,
    duration: e.duration,
    start_datetime: e.start_datetime,
    end_datetime: e.end_datetime,

    guests: e.guests,
    location: e.location,

    photos_included: e.photos_included,
    autograph_included: e.autograph_included,
    cuisine: e.cuisine,

    instagram_link: e.instagram_link,

    faq:
      typeof e.faq === "string"
        ? JSON.parse(e.faq)
        : e.faq || {},

    pricing_mode: e.pricing_mode,
    starting_bid: e.starting_bid,
    fixed_price: e.fixed_price,

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

    // Match DropDetails expected prop names
    itemName: data.item_name,
    category: data.category,
    story: data.story || data.product_details || "",
    instagramLink: data.instagram_link,

    condition: data.condition,
    authenticity: data.authenticity,
    shippingDetails: data.shipping_details,
    productDetails: data.product_details,

    fixed_price: data.fixed_price,
    starting_bid: data.starting_bid,

    faq:
      typeof data.faq === "string"
        ? JSON.parse(data.faq)
        : data.faq || {},

    // Keep media normalized
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

    // Optional creator (if used elsewhere)
    creator: {
      name: data.users?.username || data.users?.name || data.display_name,
      avatar: data.users?.avatar_url || data.display_image,
    },
  };
}

export async function getExperienceById(id: string) {
  const { data, error } = await supabase
    .from("experiences_form")
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

    title: data.display_name,
    category: data.category,
    about_experience: data.about_experience,
    location: data.location,
    duration: data.duration,

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
            alt: data.display_name || "media",
          };
        }
        return {
          type: m.type || "image",
          src: m.src || m.url || null,
          thumbnail: m.thumbnail || m.src || m.url || null,
          alt: m.alt || data.display_name || "media",
        };
      })
      .filter((m: any) => m.src),

    fixed_price: data.fixed_price,
    starting_bid: data.starting_bid,
    start_datetime: data.start_datetime ? new Date(data.start_datetime) : null,
    end_datetime: data.end_datetime ? new Date(data.end_datetime) : null,

    faq:
      typeof data.faq === "string"
        ? JSON.parse(data.faq)
        : data.faq || {},
  };
}