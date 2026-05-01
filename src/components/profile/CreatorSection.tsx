// src/components/profile/CreatorSection.tsx
"use client";

import { useState } from "react";
import CreatorVideos from "./CreatorVideos";
import CreatorListings from "./CreatorListings";

type Props = {
  requests: any[];
  listings: any[];
};

export default function CreatorSection({ requests, listings }: Props) {
  const [tab, setTab] = useState<"requests" | "listings">("requests");

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
      {tab === "listings" && <CreatorListings listings={listings} />}
    </div>
  );
}