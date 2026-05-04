"use client";

"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { getDropById, getExperienceById } from "@/lib/db/listings";
import { requireOnboarding } from "@/lib/guards/requireOnboarding";

import MediaCarousel from "@/components/bid/MediaCarousel";
import DropDetails from "@/components/bid/DropDetails";
import ExperienceDetails from "@/components/bid/ExperienceDetails";
import CreatorHeader from "@/components/CreatorHeader";


// ─── Tag config ───────────────────────────────────────────────────────────────

const TAG_MAP = {
  video:      { label: "Personalized Video", icon: "▶" },
  drop:       { label: "Collectible",         icon: "◆" },
  experience: { label: "Experience",          icon: "✦" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

// ─── Reusable Button ─────────────────────────────────────────────────────────

function Button({
  children,
  onClick,
  loading = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      className="pay-btn"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="pay-btn-shimmer" />}
      {loading && <span className="pay-btn-spinner" />}
      <span>{loading ? "Processing..." : children}</span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CheckoutContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const typeParam = searchParams.get("type");
  
type CheckoutData = {
  type: "drop" | "experience";
  raw: any;
};

const [data, setData] = useState<CheckoutData | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id || !typeParam) return;

      if (typeParam === "drop") {
        const drop = await getDropById(id);
        if (!drop) return;

        setData({
          type: "drop",
          raw: drop,
        });
        console.log("[CHECKOUT DROP DATA]", drop);
      }

      if (typeParam === "experience") {
        const exp = await getExperienceById(id);
        if (!exp) return;

        setData({
          type: "experience",
          raw: exp,
        });
        console.log("[CHECKOUT EXPERIENCE DATA]", exp);
      }
    }

    fetchData();
  }, [id, typeParam]);

  const tag = data ? TAG_MAP[data.type] : null;

  const handlePay = async () => {
    const allowed = await requireOnboarding(router);
    if (!allowed) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/orders");
  };

  console.log("[CHECKOUT STATE DATA]", data);
  if (!data) return <div style={{ padding: 20, color: "white" }}>Loading...</div>;

  return (
    <>
      {/* ── All styles self-contained ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          color: #e8e6e0;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Subtle noise grain overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* ── Container ── */
        .co-page {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .co-container {
          max-width: 640px;
          margin: 0 auto;
          padding: 16px;
          width: 100%;
          flex: 1;
        }

        /* ── Header ── */
        .co-header {
          padding: 20px 0 18px;
          border-bottom: 1px solid #1d1d1d;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: fadeUp 0.4s ease both;
        }

        .co-header-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px;
          font-weight: 400;
          letter-spacing: -0.01em;
          color: #f0ece4;
          margin: 0;
          line-height: 1;
        }

        .co-header-step {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #444;
          font-weight: 500;
        }

        /* ── Card ── */
        .co-card {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 12px;
          animation: fadeUp 0.4s ease 0.08s both;
        }

        .co-card-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
        }

        .co-card-image-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(10,10,10,0.7) 100%
          );
        }

        .co-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 0;
          transition: transform 0.5s ease;
        }

        .co-card:hover .co-card-img {
          transform: scale(1.03);
        }

        .co-card-body {
          padding: 14px 16px 16px;
        }

        .co-card-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #c9a96e;
          border: 1px solid rgba(201,169,110,0.25);
          background: rgba(201,169,110,0.07);
          padding: 3px 9px;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .co-card-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 400;
          color: #f0ece4;
          margin: 0 0 10px;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        .co-card-creator {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .co-creator-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #2a2a2a;
          flex-shrink: 0;
        }

        .co-creator-label {
          font-size: 11px;
          color: #555;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1;
          margin-bottom: 2px;
        }

        .co-creator-name {
          font-size: 13px;
          font-weight: 500;
          color: #aaa;
          line-height: 1;
        }

        /* ── Price Section ── */
        .co-price-section {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 12px;
          animation: fadeUp 0.4s ease 0.16s both;
        }

        .co-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .co-price-label {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #555;
          font-weight: 500;
        }

        .co-price-amount {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 32px;
          font-weight: 600;
          color: #f0ece4;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .co-price-divider {
          height: 1px;
          background: #1a1a1a;
          margin: 12px 0;
        }

        .co-price-sub {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #444;
        }

        /* ── Trust badges ── */
        .co-trust {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          animation: fadeUp 0.4s ease 0.22s both;
        }

        .co-trust-badge {
          flex: 1;
          background: #0e0e0e;
          border: 1px solid #1a1a1a;
          border-radius: 10px;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-align: center;
        }

        .co-trust-icon {
          font-size: 14px;
          line-height: 1;
        }

        .co-trust-text {
          font-size: 10px;
          color: #444;
          letter-spacing: 0.05em;
          line-height: 1.3;
        }

        /* ── Sticky footer ── */
        .co-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: linear-gradient(to top, #0a0a0a 60%, transparent);
          padding: 20px 16px 28px;
          animation: fadeUp 0.4s ease 0.3s both;
        }

        .co-footer-inner {
          max-width: 420px;
          margin: 0 auto;
        }

        .co-footer-hint {
          text-align: center;
          font-size: 11px;
          color: #333;
          margin-bottom: 10px;
          letter-spacing: 0.04em;
        }

        /* ── Button ── */
        .pay-btn {
          width: 100%;
          padding: 15px 24px;
          border-radius: 8px;
          background: #f0ece4;
          color: #0a0a0a;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s ease, transform 0.15s ease, background 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 52px;
        }

        .pay-btn:not(:disabled):hover {
          background: #fff;
          transform: translateY(-1px);
        }

        .pay-btn:not(:disabled):active {
          transform: translateY(0);
          opacity: 0.9;
        }

        .pay-btn:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .pay-btn-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255,255,255,0.5) 50%,
            transparent 60%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }

        .pay-btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(0,0,0,0.15);
          border-top-color: #0a0a0a;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
          flex-shrink: 0;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ── Entry animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="co-page">
        <div className="co-container">

          {/* Header */}
          <header className="co-header">
            <h1 className="co-header-title">Checkout</h1>
            <span className="co-header-step">Step 1 of 1</span>
          </header>

          {/* Item preview card */}
          <div className="co-card">
            <div className="co-card-image-wrap">
              <MediaCarousel media={Array.isArray(data.raw?.media) ? data.raw.media : []} />
            </div>

            <div className="co-card-body">
              {tag && (
                <div className="co-card-tag">
                  <span>{tag.icon}</span>
                  {tag.label}
                </div>
              )}

              <h2 className="co-card-title">
                {data.type === "drop"
                  ? data.raw?.item_name || data.raw?.display_name
                  : data.raw?.title || data.raw?.display_name}
              </h2>

              {data.raw?.creator && (
                <div style={{ marginBottom: 12 }}>
                  <CreatorHeader
                    creator={{
                      name: data.raw.creator?.name || "Unknown",
                      avatar: data.raw.creator?.avatar || data.raw?.display_image || "",
                      image: data.raw.creator?.avatar || data.raw?.display_image || "",
                    }}
                  />
                </div>
              )}

              {data.type === "drop" && (
                <DropDetails {...data.raw} />
              )}

              {data.type === "experience" && (
                <ExperienceDetails {...data.raw} />
              )}
            </div>
          </div>

          {/* Price section */}
          <div className="co-price-section">
            <div className="co-price-row">
              <span className="co-price-label">Total</span>
              <span className="co-price-amount">
                {formatINR(
                  data.type === "drop"
                    ? data.raw?.winning_bid || data.raw?.fixed_price || data.raw?.starting_bid || 0
                    : data.raw?.fixed_price || data.raw?.starting_bid || 0
                )}
              </span>
            </div>
            <div className="co-price-divider" />
            <div className="co-price-sub">
              <span>Taxes &amp; fees included</span>
              <span>INR ₹</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="co-trust">
            {[
              { icon: "🔒", text: "Secure payment" },
              { icon: "✓",  text: "Verified creator" },
              { icon: "↩",  text: "Easy refunds" },
            ].map((b) => (
              <div key={b.text} className="co-trust-badge">
                <span className="co-trust-icon">{b.icon}</span>
                <span className="co-trust-text">{b.text}</span>
              </div>
            ))}
          </div>

          {/* Purchase Button Section */}
          <div style={{ marginTop: 20 }}>
            <p style={{ textAlign: "center", fontSize: 11, color: "#333", marginBottom: 10 }}>
              By continuing you agree to our Terms
            </p>
            <Button onClick={handlePay} loading={loading}>
              Purchase {formatINR(
                data.type === "drop"
                  ? data.raw?.winning_bid || data.raw?.fixed_price || data.raw?.starting_bid || 0
                  : data.raw?.fixed_price || data.raw?.starting_bid || 0
              )}
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20, color: "white" }}>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}