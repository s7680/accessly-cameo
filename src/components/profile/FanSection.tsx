// src/components/profile/FanSection.tsx
"use client";

import { useState } from "react";
import FanVideos from "./FanVideos";
import FanBids from "./FanBids";
import FanWins from "./FanWins";

type Props = {
  videos: any[];
  bids: any[];
  wins: any[];
};

export default function FanSection({ videos, bids, wins }: Props) {
  const [tab, setTab] = useState<"videos" | "bids" | "wins">("videos");

  return (
    <div>
      {/* Tabs - horizontal scroll */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          whiteSpace: "nowrap",
          marginBottom: 16,
          borderBottom: "1px solid #333",
        }}
      >
        {["videos", "bids", "wins"].map((t) => (
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
            {t === "videos" ? "Videos" : t === "bids" ? "Bids" : "Won"}
          </button>
        ))}
      </div>

      {tab === "videos" && <FanVideos videos={videos} />}
      {tab === "bids" && <FanBids bids={bids} />}
      {tab === "wins" && <FanWins wins={wins} />}
    </div>
  );
}