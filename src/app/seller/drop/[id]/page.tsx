"use client";

import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export default function DropSellerPage() {
  const params = useParams();
  const id = params?.id as string;

  const [drop, setDrop] = React.useState<any>(null);
  const [bids, setBids] = React.useState<any[]>([]);
  const [order, setOrder] = React.useState<any>(null);

  const [shipping, setShipping] = React.useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  const [orderStatus, setOrderStatus] = React.useState("pending");

  React.useEffect(() => {
    if (!id) return;

    async function fetchData() {
      const { data: dropData } = await supabase
        .from("drops_form")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      const { data: bidsData } = await supabase
        .from("bids")
        .select("*")
        .eq("listing_id", id)
        .eq("listing_type", "drop")
        .order("amount", { ascending: false });

      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("listing_id", id)
        .eq("listing_type", "drop")
        .maybeSingle();

      setDrop(dropData);
      setBids(bidsData || []);
      setOrder(orderData);
    }

    fetchData();
  }, [id]);

  if (!drop) return <div>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>{drop.item_name}</h1>

      <p>Status: {drop.status}</p>
      <p>Winning Bid: ₹{drop.winning_bid || "Not decided"}</p>
      <p>Winner ID: {drop.winner_id || "No winner"}</p>

      <h2 style={{ marginTop: 20 }}>Order Details</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}>
        <input placeholder="Customer Name" value={order?.shipping_details?.name || ""} disabled />
        <input placeholder="Address" value={order?.shipping_details?.address || ""} disabled />
        <input placeholder="City" value={order?.shipping_details?.city || ""} disabled />
        <input placeholder="Pincode" value={order?.shipping_details?.pincode || ""} disabled />
        <input placeholder="Phone" value={order?.shipping_details?.phone || ""} disabled />
      </div>

      <h2 style={{ marginTop: 20 }}>Order Status</h2>

      <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>

      <button
        style={{ marginTop: 12, padding: "10px", background: "black", color: "white", cursor: "pointer" }}
        onClick={async () => {
          if (!order?.id) return;

          await supabase
            .from("orders")
            .update({ status: orderStatus })
            .eq("id", order.id);

          console.log("Order updated");
        }}
      >
        Update Order Status
      </button>

      <h2 style={{ marginTop: 20 }}>All Bids</h2>

      {bids.map((b) => (
        <div key={b.id} style={{ marginBottom: 8 }}>
          ₹{b.amount} — {b.user_id}
        </div>
      ))}
    </div>
  );
}