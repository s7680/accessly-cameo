"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export default function DropWinnerPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchOrder() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setOrder(data);
    }

    fetchOrder();
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Complete Your Order</h1>

      <h3>Winning Amount: ₹{order.amount}</h3>

      <h2 style={{ marginTop: 20 }}>Delivery Details</h2>

      <input
        placeholder="Name"
        value={order.shipping_details?.name || ""}
        onChange={(e) =>
          setOrder({
            ...order,
            shipping_details: {
              ...order.shipping_details,
              name: e.target.value,
            },
          })
        }
      />

      <input
        placeholder="Address"
        value={order.shipping_details?.address || ""}
        onChange={(e) =>
          setOrder({
            ...order,
            shipping_details: {
              ...order.shipping_details,
              address: e.target.value,
            },
          })
        }
      />

      <input
        placeholder="City"
        value={order.shipping_details?.city || ""}
        onChange={(e) =>
          setOrder({
            ...order,
            shipping_details: {
              ...order.shipping_details,
              city: e.target.value,
            },
          })
        }
      />

      <input
        placeholder="Pincode"
        value={order.shipping_details?.pincode || ""}
        onChange={(e) =>
          setOrder({
            ...order,
            shipping_details: {
              ...order.shipping_details,
              pincode: e.target.value,
            },
          })
        }
      />

      <input
        placeholder="Phone"
        value={order.shipping_details?.phone || ""}
        onChange={(e) =>
          setOrder({
            ...order,
            shipping_details: {
              ...order.shipping_details,
              phone: e.target.value,
            },
          })
        }
      />

      <button
        style={{
          marginTop: 12,
          padding: "10px",
          background: "black",
          color: "white",
          cursor: "pointer",
        }}
        onClick={async () => {
          await supabase
            .from("orders")
            .update({
              shipping_details: order.shipping_details,
              status: "confirmed",
            })
            .eq("id", order.id);
        }}
      >
        Submit Details
      </button>
    </div>
  );
}