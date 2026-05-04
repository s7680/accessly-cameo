import { supabase } from "@/lib/supabaseClient";

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

// itemId must be the primary key from one of:
// - video_form.id
// - drops_form.id
// - experiences_form.id
// itemType must match the source table: "video", "drop", or "experience"
export async function toggleWatchlist(itemId: string, itemType: string, shouldAdd: boolean) {
  const user = await getCurrentUser();
  if (!user) throw new Error("No user");

  const validTypes = ["video", "drop", "experience"];
  if (!validTypes.includes(itemType)) {
    throw new Error(`Invalid item_type: ${itemType}`);
  }

  if (shouldAdd) {
    return supabase
      .from("watchlist")
      .upsert(
        {
          user_id: user.id,
          item_id: itemId,
          item_type: itemType,
        },
        { onConflict: "user_id,item_id,item_type" }
      );
  } else {
    return supabase
      .from("watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("item_id", itemId)
      .eq("item_type", itemType);
  }
}