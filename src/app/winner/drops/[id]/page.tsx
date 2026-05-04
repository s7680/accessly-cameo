"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { upsertDropOrder } from "@/lib/profile/won/drops";

export default function DropWinnerPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  console.log("[DROP PAGE ID]:", id);

  const [order, setOrder] = useState<any>({
    id: "demo-order-id",
    listing_id: "demo-listing-id",
    amount: 125000,
    address_details: {
      name: "Rahul Sharma",
      address: "221B Baker Street",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      phone: "9876543210",
    },
  });

  useEffect(() => {
    if (!id) return;

    async function fetchOrder() {
      console.log("[DROP PAGE] Fetching for listing_id:", id);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("listing_id", id)
        .maybeSingle();

      console.log("[DROP PAGE RESULT]:", data);

      if (error) {
        console.error("[DROP PAGE ERROR]:", error);
        return;
      }

      if (!data) {
        console.warn("[DROP PAGE] No order found, fetching drop instead:", id);

        const { data: drop } = await supabase
          .from("drops_form")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        console.log("[DROP FALLBACK]:", drop);

        if (!drop) {
          console.error("[DROP PAGE] No drop found either:", id);
          return;
        }

        // create temporary order-like object so UI doesn't break
        setOrder({
          id: null,
          listing_id: drop.id,
          amount: drop.winning_bid || drop.starting_bid,
          address_details: { state: "" },
        });

        return;
      }

      setOrder(data);
    }

    fetchOrder();
  }, [id]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Complete Your Order</h1>

      <h3>Winning Amount: ₹{order.amount}</h3>

      <h2 style={{ marginTop: 20 }}>Delivery Details</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>

        <input
          placeholder="Name"
          value={order.address_details?.name || ""}
          onChange={(e) =>
            setOrder({
              ...order,
              address_details: {
                ...order.address_details,
                name: e.target.value,
              },
            })
          }
          style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
        />

        <input
          placeholder="Address"
          value={order.address_details?.address || ""}
          onChange={(e) =>
            setOrder({
              ...order,
              address_details: {
                ...order.address_details,
                address: e.target.value,
              },
            })
          }
          style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
        />

        <input
          placeholder="City"
          value={order.address_details?.city || ""}
          onChange={(e) =>
            setOrder({
              ...order,
              address_details: {
                ...order.address_details,
                city: e.target.value,
              },
            })
          }
          style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
        />

        <input
          placeholder="State"
          value={order.address_details?.state || ""}
          onChange={(e) =>
            setOrder({
              ...order,
              address_details: {
                ...order.address_details,
                state: e.target.value,
              },
            })
          }
          style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
        />

        <input
          placeholder="Pincode"
          value={order.address_details?.pincode || ""}
          onChange={(e) =>
            setOrder({
              ...order,
              address_details: {
                ...order.address_details,
                pincode: e.target.value,
              },
            })
          }
          style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
        />

        <input
          placeholder="Phone"
          value={order.address_details?.phone || ""}
          onChange={(e) =>
            setOrder({
              ...order,
              address_details: {
                ...order.address_details,
                phone: e.target.value,
              },
            })
          }
          style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
        />

      </div>

      <Button
        style={{ marginTop: 12 }}
        onClick={async () => {
          const user = await supabase.auth.getUser();
          const userId = user.data.user?.id;

          if (!userId) {
            alert("User not logged in");
            return;
          }

          const result = await upsertDropOrder(
            order.listing_id,
            userId,
            {
              address_details: order.address_details,
            }
          );

          if (!result) {
            alert("Failed to save address");
            return;
          }

          alert("Address saved successfully");
        }}
      >
        Submit Details
      </Button>

      {/* Packaging Video Section */}
      <h2 style={{ marginTop: 30 }}>Packaging Video</h2>
      {order.packaging_video_url ? (
        <video
          controls
          style={{
            width: "100%",
            maxWidth: 400,
            height: 200,
            borderRadius: 8,
            background: "#000",
            marginTop: 10,
          }}
        >
          <source src={order.packaging_video_url} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p style={{ marginTop: 10, color: "#888" }}>Packaging video not uploaded yet</p>
      )}

      {/* Courier Details */}
      <h2 style={{ marginTop: 30 }}>Courier Details</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div>
          <strong>Courier Company:</strong> {order.courier_details?.company || "Not available"}
        </div>
        <div>
          <strong>Tracking ID:</strong> {order.courier_details?.tracking_id || "Not available"}
        </div>
      </div>
      <p style={{ marginTop: 10, color: "green", fontWeight: 600 }}>
        Status: {order?.status === "completed" ? "Completed" : "Pending"}
      </p>
    </div>
  );
}