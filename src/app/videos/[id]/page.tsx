// src/app/videos/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { getVideoByCreatorId } from "@/lib/db/videos";

import Button from "@/components/ui/Button";
import { createVideoRequest } from "@/lib/db/videoRequests";
import { supabase } from "@/lib/supabaseClient";


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

  const [selectedLanguage, setSelectedLanguage] = useState<string>("Hindi");

  const [creatorData, setCreatorData] = useState<any>(null);
  const params = useParams();
  const languageSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function load() {
      if (!params?.id) return;

      try {
        const data = await getVideoByCreatorId(params.id as string);

        console.log("VIDEO DATA:", data);
        if (data) {
          const user = Array.isArray(data.users) ? data.users[0] : data.users;
          setCreatorData({
            name: user?.name,
            avatar: user?.avatar_url,
            instagram: user?.instagram,
            category: data.category,
            currentPrice: data.price,
            deliveryText: data.delivery_time,
            videos: data.sample_video_urls || [],
            bio: data.bio,

            // added fields
            language: data.language,
            max_duration: data.max_duration,
            occasions: data.occasions,
            instructions: data.instructions,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    load();
  }, [params.id]);

  // Toggle reason chip
  const toggleReason = (reason: string) => {
    setSelectedReason((prev) => (prev === reason ? null : reason));
  };

  const handleSubmit = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("AUTH USER:", user);

      if (!user) {
        alert("Please login first");
        return;
      }

      await createVideoRequest({
        user_id: user.id,
        creator_id: params.id as string,
        fan_name: user.user_metadata?.name || "User",
        occasion: selectedReason || "",
        recipient_name: recipient,
        recipient_type: recipientType,
        request_details: instructions,
        from_name: fromName,
        language: selectedLanguage,
        price: creatorData.currentPrice,
        hide_from_profile: hideVideo,
      });

      alert("Request submitted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to submit request");
    }
  };

  if (!creatorData) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

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
              width: 96,
              height: 96,
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
            {creatorData.instagram && (
              <button
                onClick={() => window.open(`https://instagram.com/${creatorData.instagram}`, "_blank")}
                style={{
                  marginTop: 6,
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "1px solid #8b5cf6",
                  background: "transparent",
                  color: "#8b5cf6",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                View Instagram Profile
              </button>
            )}
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
            {creatorData.videos?.map((url: string, index: number) => (
              <div
                key={index}
                style={{
                  flexShrink: 0,
                  width: 180,
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "#222",
                }}
              >
                <video
                  src={url}
                  style={{ width: "100%", height: 240, objectFit: "cover" }}
                  controls
                />
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
              20% off
            </span>
            {(() => {
              const discounted = Number(creatorData.currentPrice) || 0;
              const original = Math.round(discounted / 0.8); // reverse 20% discount
              return (
                <>
                  <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>
                    ₹{discounted}
                  </div>
                  <div style={{ color: "#888", textDecoration: "line-through" }}>
                    ₹{original}
                  </div>
                </>
              );
            })()}
          </div>

          <div style={{ textAlign: "right", color: "#aaa", fontSize: 14 }}>
            <p style={{ margin: 0 }}>
              ⚡ {creatorData.deliveryText} delivery
            </p>
            {/* rating/reviewCount removed */}
          </div>
        </div>

        {/* 4. PRIMARY CTA */}
        <Button
          variant="primary"
          onClick={() => {
            languageSectionRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          style={{
            width: "100%",
            minHeight: 52,
            borderRadius: 16,
            background: "linear-gradient(135deg, #d4af37, #a8843f)",
            border: "none",
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 4,
          }}
        >
          Book a personal video ₹{creatorData.currentPrice?.toLocaleString?.()}+
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
            marginBottom: 6,
          }}
        >
          Book a business video ₹47,000+
        </Button>

        {/* 7. DESCRIPTION + STATS */}

        {/* BIO + DETAILS (combined card) */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: 16,
            padding: 16,
            marginTop: 4,
            marginBottom: 24,
            border: "1px solid #2a2a2a",
          }}
        >
          {/* BIO */}
          <div style={{ marginBottom: 16 }}>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 0.5,
                marginBottom: 8,
                color: "#aaa",
              }}
            >
              BIO
            </h3>
            <p style={{ color: "#ccc", lineHeight: 1.5, margin: 0 }}>
              {showFullDesc
                ? creatorData.bio
                : (creatorData.bio?.slice(0, 120) || "")}
              {creatorData.bio && creatorData.bio.length > 120 && (
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
              )}
            </p>
          </div>

          {/* DETAILS */}
          <div>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 0.5,
                marginBottom: 12,
                color: "#aaa",
              }}
            >
              DETAILS
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "20px auto 1fr",
                rowGap: 8,
                columnGap: 6,
                alignItems: "start",
                fontSize: 14
              }}
            >

              {creatorData.language && (
                <>
                  <span>🌐</span>
                  <span style={{ color: "#aaa" }}>Language</span>
                  <span style={{ color: "#fff" }}>{creatorData.language}</span>
                </>
              )}

              {creatorData.max_duration && (
                <>
                  <span>⏱</span>
                  <span style={{ color: "#aaa" }}>Max duration</span>
                  <span style={{ color: "#fff" }}>{creatorData.max_duration}</span>
                </>
              )}

              {creatorData.occasions && creatorData.occasions.length > 0 && (
                <>
                  <span>🎉</span>
                  <span style={{ color: "#aaa" }}>Occasions</span>
                  <span style={{ color: "#fff" }}>{creatorData.occasions.join(", ")}</span>
                </>
              )}

              {creatorData.instructions && (
                <>
                  <span>📝</span>
                  <span style={{ color: "#aaa" }}>Instructions</span>
                  <span style={{ color: "#fff" }}>{creatorData.instructions}</span>
                </>
              )}

            </div>
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

          {/* Language selection */}
          <div
            ref={languageSectionRef}
            style={{
              background: "#1a1a1a",
              padding: 16,
              borderRadius: 16,
              marginBottom: 16
            }}>
            <h3 style={{ marginBottom: 12 }}>Select language</h3>

            <div style={{ display: "flex", gap: 12 }}>
              {["Hindi", "English"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    border: "1px solid",
                    borderColor: selectedLanguage === lang ? "#d4af37" : "#333",
                    background: selectedLanguage === lang ? "rgba(212,175,55,0.15)" : "transparent",
                    color: selectedLanguage === lang ? "#d4af37" : "#ccc",
                    cursor: "pointer"
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

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
            onClick={handleSubmit}
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