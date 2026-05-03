import { supabase } from "@/lib/supabaseClient";

export async function placeBid(listingId: string, type: "drop" | "experience", amount: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase.from("bids").insert({
    listing_id: listingId,
    listing_type: type,
    user_id: user.id,
    amount,
  });

  if (error) throw error;
}

export async function getHighestBid(listingId: string, type: string) {
  const { data, error } = await supabase
    .from("bids")
    .select("amount")
    .eq("listing_id", listingId)
    .eq("listing_type", type)
    .order("amount", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data?.amount || 0;
}

export function subscribeToBids(listingId: string, type: string, onNewBid: (bid: any) => void) {
  const channel = supabase
    .channel(`bids-${listingId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "bids",
        filter: `listing_id=eq.${listingId}`,
      },
      (payload) => {
        const b = payload.new;
        if (b.listing_type !== type) return;
        onNewBid(b);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

export async function getLeaderboard(
  listingId: string,
  type: string
) {
  const { data, error } = await supabase
    .from("bids")
    .select(`
      id,
      amount,
      created_at,
      users ( name )
    `)
    .eq("listing_id", listingId)
    .eq("listing_type", type)
    .order("amount", { ascending: false });

  if (error) throw error;

  return (data || []).map((b: any, index: number) => ({
    rank: index + 1,
    bidderName: b.users?.name || "User",
    amount: b.amount,
    timestamp: new Date(b.created_at),
  }));
}