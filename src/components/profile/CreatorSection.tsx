// src/components/profile/CreatorSection.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getCreatorVideoRequests } from "@/lib/db/videoRequests";
import CreatorVideos from "./CreatorVideos";
import CreatorListings from "./CreatorListings";

type Props = {
  listings: any[];
};

export default function CreatorSection({ listings }: Props) {
  const [requests, setRequests] = useState<any[]>([]);
  const [tab, setTab] = useState<"requests" | "listings">("requests");

  useEffect(() => {
    const fetchRequests = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const res = await getCreatorVideoRequests(user.id);

      const formatted = res.map((r: any) => ({
        id: r.id,
        fanName: r.fan_name,
        recipientName: r.recipient_name,
        recipientType: r.recipient_type,
        occasion: r.occasion,
        instructions: r.request_details,
        fromName: r.from_name,
        language: r.language,
        price: r.price,
        status: r.status,
        videoUrl: r.video_url,
        created_at: r.created_at,
      }));

      setRequests(formatted);
    };

    fetchRequests();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          marginBottom: 16,
          borderBottom: "1px solid #333",
        }}
      >
        {["requests", "listings"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            style={{
              padding: "10px 20px",
              background: "none",
              border: "none",
              borderBottom: tab === t ? "2px solid #ff4d6d" : "2px solid transparent",
              color: tab === t ? "#fff" : "#888",
              fontWeight: tab === t ? 600 : 400,
              fontSize: 16,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {t === "requests" ? "Video Requests" : "Listings"}
          </button>
        ))}
      </div>

      {tab === "requests" && <CreatorVideos requests={requests} />}
      {tab === "listings" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <CreatorListings listings={listings} />
        </div>
      )}
    </div>
  );
}