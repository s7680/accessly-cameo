// src/app/videos/[id]/page.tsx
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

// ---------- Mock data for the creator page ----------
const creatorData = {
  name: "DJ Ravi",
  category: "Music & Comedy",
  avatar: "/images/dj-ravi.jpg",
  discountPercent: 60,
  currentPrice: 4740,
  oldPrice: 11850,
  deliveryText: "24hr delivery",
  rating: 4.82,
  reviewCount: 421,
  description:
    "I create personalized video shoutouts for birthdays, roasts, pep talks, and more. Just tell me what you need and I'll make it unforgettable! Perfect for any occasion.",
  averageVideoLength: "30:42",
  lastCompleted: "today at 10:23 AM",
  videoPreviews: [
    { id: 1, label: "Intro", thumbnail: "/images/preview-intro.jpg" },
    { id: 2, label: "Birthday", thumbnail: "/images/preview-birthday.jpg" },
    { id: 3, label: "Roast", thumbnail: "/images/preview-roast.jpg" },
    { id: 4, label: "Pep Talk", thumbnail: "/images/preview-peptalk.jpg" },
    { id: 5, label: "Advice", thumbnail: "/images/preview-advice.jpg" },
  ],
};

const reasons = [
  "❤️ Mother's Day",
  "🎂 Say happy birthday",
  "🎓 Graduation",
  "🤗 Send a pep talk",
  "🔥 Roast someone",
  "💜 Get advice",
  "🤷 Ask a question",
  "💭 Other",
];

export default function VideoRequestPage() {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [recipient, setRecipient] = useState("");

  const [recipientType, setRecipientType] = useState<"someone" | "self">("someone");
  const [fromName, setFromName] = useState("");
  const [hideVideo, setHideVideo] = useState(false);

  // Toggle reason chip
  const toggleReason = (reason: string) => {
    setSelectedReason((prev) => (prev === reason ? null : reason));
  };

  return (
    <div className="flow-page">
      <div
        className="container--wide"
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        {/* 1. FAN FAVORITE + CREATOR HEADER */}
        <div style={{ textAlign: "left", marginTop: 24, marginBottom: 24 }}>
          <span
            style={{
              background: "linear-gradient(135deg, #d4af37, #b8962e)",
              color: "#fff",
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              boxShadow: "0 2px 8px rgba(212,175,55,0.18)",
            }}
          >
            Top Creator
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "#333",
              backgroundImage: `url(${creatorData.avatar})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
              {creatorData.name}
            </h2>
            <p style={{ margin: 0, color: "#aaa", fontSize: 14 }}>
              {creatorData.category}
            </p>
          </div>
        </div>

        {/* 2. HORIZONTAL VIDEO PREVIEW STRIP */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              paddingBottom: 8,
            }}
          >
            {creatorData.videoPreviews.map((preview) => (
              <div
                key={preview.id}
                style={{
                  flexShrink: 0,
                  width: 140,
                  borderRadius: 16,
                  overflow: "hidden",
                  position: "relative",
                  backgroundColor: "#222",
                  boxShadow: "0 4px 16px rgba(212,175,55,0.10)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 180,
                    backgroundImage: `url(${preview.thumbnail})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 20,
                    }}
                  >
                    ▶
                  </div>
                </div>
                <div style={{ padding: "8px 12px", fontSize: 12, color: "#ccc" }}>
                  {preview.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. PRICING + META */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <span
              style={{
                background: "#4caf50",
                color: "#fff",
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {creatorData.discountPercent}% off
            </span>
            <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>
              ₹{creatorData.currentPrice}
            </div>
            <div style={{ color: "#888", textDecoration: "line-through" }}>
              ₹{creatorData.oldPrice}
            </div>
          </div>

          <div style={{ textAlign: "right", color: "#aaa", fontSize: 14 }}>
            <p style={{ margin: 0 }}>
              ⚡ {creatorData.deliveryText}
            </p>
            <p style={{ margin: 0 }}>
              ⭐ {creatorData.rating} ({creatorData.reviewCount})
            </p>
          </div>
        </div>

        {/* 4. PRIMARY CTA */}
        <Button
          variant="primary"
          style={{
            width: "100%",
            minHeight: 52,
            borderRadius: 16,
            background: "linear-gradient(135deg, #d4af37, #a8843f)",
            border: "none",
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 12,
          }}
        >
          Book a personal video ₹{creatorData.currentPrice.toLocaleString()}+
        </Button>

        {/* 5. SECONDARY CTA */}
        <Button
          variant="outline"
          style={{
            width: "100%",
            minHeight: 52,
            borderRadius: 16,
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 24,
          }}
        >
          Book a business video ₹47,000+
        </Button>

        {/* 7. DESCRIPTION + STATS */}

        {/* 7. DESCRIPTION + STATS */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: "#ccc", lineHeight: 1.5, margin: 0 }}>
            {showFullDesc
              ? creatorData.description
              : `${creatorData.description.slice(0, 150)}...`}
            <button
              onClick={() => setShowFullDesc(!showFullDesc)}
              style={{
                background: "none",
                border: "none",
                color: "#8b5cf6",
                cursor: "pointer",
                fontWeight: 600,
                padding: 0,
                marginLeft: 4,
              }}
            >
              {showFullDesc ? "Show less" : "Read more"}
            </button>
          </p>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 16,
              color: "#888",
              fontSize: 13,
            }}
          >
            <span>Avg. length: {creatorData.averageVideoLength}</span>
            <span>Last completed: {creatorData.lastCompleted}</span>
          </div>
        </div>

        {/* 8. WHAT TO EXPECT */}
        <div style={{ marginBottom: 32 }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 0.5,
              marginBottom: 12,
              color: "#aaa",
            }}
          >
            WHAT TO EXPECT
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span>✏️</span>
              <span>Write instructions</span>
            </li>
            <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span>🎥</span>
              <span>Get your video</span>
            </li>
            <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span>🎉</span>
              <span>Share the magic</span>
            </li>
          </ul>
        </div>

        {/* 9. FORM START */}
        <div style={{ marginBottom: 48 }}>

          {/* Select Occasion */}
          <div style={{
            background: "#1a1a1a",
            padding: 16,
            borderRadius: 16,
            marginBottom: 16
          }}>
            <h3 style={{ marginBottom: 12 }}>Select an occasion</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {reasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => toggleReason(reason)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: "1px solid",
                    borderColor: selectedReason === reason ? "#d4af37" : "#333",
                    background: selectedReason === reason ? "rgba(212,175,55,0.15)" : "transparent",
                    color: selectedReason === reason ? "#d4af37" : "#ccc",
                    fontSize: 13,
                    cursor: "pointer"
                  }}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {/* Who is the video for */}
          <div style={{
            background: "#1a1a1a",
            padding: 16,
            borderRadius: 16,
            marginBottom: 16
          }}>
            <h3 style={{ marginBottom: 12 }}>Who is the video for?</h3>

            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="radio"
                  checked={recipientType === "someone"}
                  onChange={() => setRecipientType("someone")}
                />
                Someone else
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="radio"
                  checked={recipientType === "self"}
                  onChange={() => setRecipientType("self")}
                />
                Myself
              </label>
            </div>

            <input
              placeholder="Name"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #333",
                background: "#121212",
                color: "#fff"
              }}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {["He/Him", "She/Her", "They/Them"].map((g) => (
                <button key={g} style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "1px solid #333",
                  background: "transparent",
                  color: "#ccc"
                }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Request details */}
          <div style={{
            background: "#1a1a1a",
            padding: 16,
            borderRadius: 16,
            marginBottom: 16
          }}>
            <h3 style={{ marginBottom: 12 }}>Request details</h3>

            <textarea
              placeholder="Tell the creator what you want..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              maxLength={250}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #333",
                background: "#121212",
                color: "#fff"
              }}
            />

            <div style={{ marginTop: 8, color: "#888", fontSize: 12 }}>
              {instructions.length}/250 characters
            </div>

            <button style={{
              marginTop: 8,
              background: "#222",
              border: "none",
              padding: "8px 12px",
              borderRadius: 999,
              color: "#ccc"
            }}>
              Write something for me
            </button>
          </div>

          {/* Who is the video from */}
          <div style={{
            background: "#1a1a1a",
            padding: 16,
            borderRadius: 16,
            marginBottom: 16
          }}>
            <h3 style={{ marginBottom: 12 }}>Who’s this video from?</h3>

            <input
              placeholder="Name"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #333",
                background: "#121212",
                color: "#fff"
              }}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {["He/Him", "She/Her", "They/Them"].map((g) => (
                <button key={g} style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "1px solid #333",
                  background: "transparent",
                  color: "#ccc"
                }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Hide video */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
            color: "#ccc"
          }}>
            <input
              type="checkbox"
              checked={hideVideo}
              onChange={() => setHideVideo(!hideVideo)}
            />
            <span>Hide this video from creator’s profile</span>
          </div>

          <Button
            variant="primary"
            style={{
              width: "100%",
              minHeight: 52,
              borderRadius: 16,
              fontWeight: 600,
              fontSize: 16,
              background: "linear-gradient(135deg, #d4af37, #a8843f)"
            }}
          >
            Continue to payment
          </Button>

        </div>
      </div>
    </div>
  );
}