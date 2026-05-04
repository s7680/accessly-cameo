"use client";

import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { getSellerDropOrderAddressByOrderId, updateDropShipmentAndStatus } from "@/lib/db/profile/seller/drops";
import Button from "@/components/ui/Button";

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

  const [packagingVideo, setPackagingVideo] = React.useState<string>("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [courierCompany, setCourierCompany] = React.useState("");
  const [trackingId, setTrackingId] = React.useState("");

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
        .select("id")
        .eq("listing_id", id)
        .eq("listing_type", "drop")
        .maybeSingle();

      let fullOrder = null;
      if (orderData?.id) {
        fullOrder = await getSellerDropOrderAddressByOrderId(orderData.id);
      }

      setDrop(dropData);
      setBids(bidsData || []);
      setOrder(fullOrder);
    }

    fetchData();
  }, [id]);

  if (!drop) return <div>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>{drop.item_name}</h1>

      <p>Winning Bid: ₹{drop.winning_bid || "Not decided"}</p>
      <p>Winner ID: {drop.winner_id || "No winner"}</p>

      <p style={{ color: "green", fontWeight: 600 }}>
        Payment Status: Paid by Buyer
      </p>

      <h2 style={{ marginTop: 20 }}>Order Details</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div><strong>Name:</strong> {order?.address_details?.name || "N/A"}</div>
        <div><strong>Address:</strong> {order?.address_details?.address || "N/A"}</div>
        <div><strong>City:</strong> {order?.address_details?.city || "N/A"}</div>
        <div><strong>State:</strong> {order?.address_details?.state || "N/A"}</div>
        <div><strong>Pincode:</strong> {order?.address_details?.pincode || "N/A"}</div>
        <div><strong>Phone:</strong> {order?.address_details?.phone || "N/A"}</div>
      </div>


      <h2 style={{ marginTop: 30 }}>Packaging Video</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 400 }}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            console.log("Selected video file:", file);
            setSelectedFile(file);
          }}
          style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
        />
        <Button
          style={{ padding: "10px" }}
          onClick={async () => {
            if (!selectedFile || !order?.id) return;

            const filePath = `packaging/${order.id}-${Date.now()}-${selectedFile.name}`;

            const { error } = await supabase.storage
              .from("packaging-videos")
              .upload(filePath, selectedFile);

            if (error) {
              console.error("Upload failed:", error);
              return;
            }

            const { data } = supabase.storage
              .from("packaging-videos")
              .getPublicUrl(filePath);

            const publicUrl = data.publicUrl;

            setPackagingVideo(publicUrl);

            console.log("Uploaded video URL:", publicUrl);
          }}
        >
          Upload Video
        </Button>
      </div>

      <h2 style={{ marginTop: 30 }}>Courier Details</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 400 }}>
        <input
          placeholder="Courier Company"
          value={courierCompany}
          onChange={(e) => setCourierCompany(e.target.value)}
          style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          placeholder="Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          style={{ padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
        />
      </div>
      <p style={{ marginTop: 10, color: "green", fontWeight: 600 }}>
        Status: {order?.status === "completed" ? "Completed" : "Pending"}
      </p>

      <Button
        style={{ marginTop: 12 }}
        onClick={async () => {
          if (!order?.id) return;

          await updateDropShipmentAndStatus(order.id, {
            packaging_video_url: packagingVideo,
            courier_details: {
              company: courierCompany,
              tracking_id: trackingId,
            },
          });

          console.log("Shipment details updated");
        }}
      >
        Submit
      </Button>

      <p style={{ marginTop: 12, fontWeight: 600 }}>
        Order Status: {order?.status === "completed" ? "Completed" : "Pending"}
      </p>

      <Button
        style={{ marginTop: 8 }}
        onClick={async () => {
          if (!order?.id) return;

          await updateDropShipmentAndStatus(order.id, {
            status: "completed",
          });

          console.log("Order marked as completed");
        }}
      >
        Mark as Completed
      </Button>

      <h2 style={{ marginTop: 20 }}>All Bids</h2>

      {bids.map((b) => (
        <div key={b.id} style={{ marginBottom: 8 }}>
          ₹{b.amount} — {b.user_id}
        </div>
      ))}
    </div>
  );
}