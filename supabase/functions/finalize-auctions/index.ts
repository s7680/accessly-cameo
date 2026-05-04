import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const now = () => new Date().toISOString();

async function finalizeTable(table: "drops_form" | "experiences_form", type: "drop" | "experience") {
  const { data: auctions, error } = await supabase
    .from(table)
    .select("id, starting_bid, creator_id")
    .eq("status", "live")
    .lte("end_datetime", now());

  if (error) {
    console.error("Error fetching auctions:", error);
    return;
  }

  for (const auction of auctions || []) {
    // get highest bid
    const { data: bids, error: bidError } = await supabase
      .from("bids")
      .select("user_id, amount, created_at")
      .eq("listing_id", auction.id)
      .eq("listing_type", type)
      .order("amount", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(1);

    if (bidError) {
      console.error("Error fetching bids:", bidError);
      continue;
    }

    // no bids case
    if (!bids || bids.length === 0) {
      console.log(`No bids for ${table} ${auction.id}`);
      await supabase
        .from(table)
        .update({ status: "ended" })
        .eq("id", auction.id)
        .eq("status", "live");
      continue;
    }

    const highest = bids[0];

    // reserve check (starting_bid acts as reserve)
    if (highest.amount < auction.starting_bid) {
      console.log(`Reserve not met for ${table} ${auction.id}`);
      await supabase
        .from(table)
        .update({ status: "ended" })
        .eq("id", auction.id)
        .eq("status", "live");
      continue;
    }

    // update winner
    const { error: updateError } = await supabase
      .from(table)
      .update({
        winner_id: highest.user_id,
        winning_bid: highest.amount,
        status: "ended",
      })
      .eq("id", auction.id)
      .eq("status", "live");

    if (updateError) {
      console.error("Error updating winner:", updateError);
    } else {
      console.log(`Winner set for ${table} ${auction.id}`);

      // create order (prevent duplicates)
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("id")
        .eq("listing_id", auction.id)
        .eq("listing_type", type)
        .maybeSingle();

      if (!existingOrder) {
        const { error: orderError } = await supabase
          .from("orders")
          .insert({
            listing_id: auction.id,
            listing_type: type,
            buyer_id: highest.user_id,
            seller_id: auction.creator_id,
            amount: highest.amount,
            status: "pending",
          });

        if (orderError) {
          console.error("Error creating order:", orderError);
        } else {
          console.log(`Order created for ${table} ${auction.id}`);
        }
      }
    }
  }
}

Deno.serve(async () => {
  await finalizeTable("drops_form", "drop");
  await finalizeTable("experiences_form", "experience");

  return new Response("Auctions finalized", { status: 200 });
});