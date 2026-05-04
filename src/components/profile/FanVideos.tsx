// src/components/profile/FanVideos.tsx
import { useState } from "react";

type Props = {
  videos: any[];
};

export default function FanVideos({ videos }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {videos.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #333",
            borderRadius: 12,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background: "#111",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18 }}>
            {item.title || "Video Request"}
          </h3>
          <p style={{ margin: 0, color: "#aaa", fontSize: 13 }}>
            Requested on: {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
          </p>

          {/* Status */}
          <p
            style={{
              marginTop: 6,
              fontWeight: 800,
              fontSize: 18,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              color:
                item.status === "completed"
                  ? "#006400"
                  : item.status === "pending"
                  ? "#8b0000"
                  : "#ccc",
            }}
          >
            Status: {item.status || "pending"}
          </p>

          {/* Who is this video for */}
          <div>
            <p style={{ margin: "4px 0 2px", fontSize: 12, color: "#888" }}>
              Who is this video for?
            </p>
            <p style={{ margin: 0, color: "#ccc" }}>
              {item.recipient || "—"}
              {item.recipientPronoun ? ` (${item.recipientPronoun})` : ""}
            </p>
          </div>

          {/* Who is this video from */}
          <div>
            <p style={{ margin: "4px 0 2px", fontSize: 12, color: "#888" }}>
              Who is this video from?
            </p>
            <p style={{ margin: 0, color: "#ccc" }}>
              {item.fromName || "—"}
              {item.fromPronoun ? ` (${item.fromPronoun})` : ""}
            </p>
          </div>

          {/* Occasion */}
          <div>
            <p style={{ margin: "4px 0 2px", fontSize: 12, color: "#888" }}>
              Occasion
            </p>
            <p style={{ margin: 0, color: "#ccc" }}>
              {item.occasion || "—"}
            </p>
          </div>

          {/* Request details */}
          <div>
            <p style={{ margin: "4px 0 2px", fontSize: 12, color: "#888" }}>
              Request details
            </p>
            <p style={{ margin: 0, color: "#ccc" }}>
              {item.instructions || "—"}
            </p>
          </div>

          {/* Payment */}
          <div>
            <p style={{ margin: "4px 0 2px", fontSize: 12, color: "#888" }}>
              Payment
            </p>
            <p style={{ margin: 0, color: "#4caf50", fontWeight: 500 }}>
              ₹{item.amountPaid ? Number(item.amountPaid).toLocaleString() : "—"}
            </p>
          </div>

          {/* Video + Download */}
          {item.videoUrl && (
            <div style={{ marginTop: 8 }}>
              <video
                src={item.videoUrl}
                controls
                style={{ width: "100%", borderRadius: 8 }}
              />

              <a
                href={item.videoUrl}
                download
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "#d4af37",
                  color: "#000",
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                Download Video
              </a>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}