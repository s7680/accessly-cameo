"use client";

import React, { useState } from "react";

interface FAQItem {
  answer: string;
}

interface DropDetailsProps {
  itemName?: string;
  category?: string;

  story?: string;
  instagramLink?: string;

  pricingMode?: string;
  startDateTime?: string | Date | null;
  endDateTime?: string | Date | null;
  startingBid?: number | null;
  fixedPrice?: number | null;

  condition?: string;
  productDetails?: string;
  shippingDetails?: string;
  authenticity?: string;

  faq?: FAQItem[];
  createdAt?: string | Date | null;
}

export default function DropDetails({
  itemName,
  category,
  story,
  instagramLink,
  pricingMode,
  startDateTime,
  endDateTime,
  startingBid,
  fixedPrice,
  condition,
  productDetails,
  shippingDetails,
  authenticity,
  faq = [],
  createdAt,
}: DropDetailsProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const safeFaq = [
    { q: "Is this item authentic?",                  a: (faq as any)?.authenticity || "-" },
    { q: "What is the shipping timeline?",           a: (faq as any)?.shipping     || "-" },
    { q: "Are returns or cancellations allowed?",    a: (faq as any)?.returns      || "-" },
    { q: "Any additional information?",              a: (faq as any)?.extra        || "-" },
  ];

  const mode =
    pricingMode === "Bid"    || pricingMode === "bid"                    ? "Bid"      :
    pricingMode === "buyNow" || pricingMode === "Buy Now"                ? "Buy Now"  :
    pricingMode === "Both"   || pricingMode === "hybrid"                 ? "Both"     : "-";

  return (
    <div style={s.page}>

      {/* ── BASIC INFO ── */}
      <section style={s.card}>
        <p style={s.cardLabel}>Item Info</p>
        <div style={s.pillRow}>
          <span style={s.pill}>📦 {itemName || "—"}</span>
          <span style={{ ...s.pill, ...s.pillAccent }}>{category || "—"}</span>
        </div>
      </section>

      {/* ── STORY ── */}
      {story && (
        <section style={s.card}>
          <p style={s.cardLabel}>Story</p>
          <p style={s.body}>{story}</p>
        </section>
      )}

      {/* ── INSTAGRAM ── */}
      <section style={s.card}>
        <p style={s.cardLabel}>Instagram Post</p>
        {instagramLink ? (
          <a href={instagramLink} target="_blank" rel="noopener noreferrer" style={s.igBtn}>
            <span>📸</span> View Original Post
          </a>
        ) : (
          <p style={{ ...s.body, ...s.muted }}>No Instagram post provided</p>
        )}
      </section>

      {/* ── PRODUCT SPECIFICATIONS ── */}
      <section style={s.card}>
        <p style={s.cardLabel}>Product Specifications</p>
        <div style={s.specGrid}>
          <div style={s.specItem}>
            <span style={s.specIcon}>🏷️</span>
            <div>
              <p style={s.specKey}>Condition</p>
              <p style={s.specVal}>{condition || "—"}</p>
            </div>
          </div>
          <div style={s.specItem}>
            <span style={s.specIcon}>📋</span>
            <div>
              <p style={s.specKey}>Details</p>
              <p style={s.specVal}>{productDetails || "—"}</p>
            </div>
          </div>
          <div style={s.specItem}>
            <span style={s.specIcon}>🚚</span>
            <div>
              <p style={s.specKey}>Shipping</p>
              <p style={s.specVal}>{shippingDetails || "—"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUTHENTICITY ── */}
      {authenticity && (
        <section style={{ ...s.card, ...s.authenticityCard }}>
          <div style={s.authInner}>
            <span style={s.authBadge}>✓</span>
            <div>
              <p style={s.cardLabel}>Authenticity</p>
              <p style={s.body}>{authenticity}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section style={s.card}>
        <p style={s.cardLabel}>FAQ</p>
        <div style={s.faqList}>
          {safeFaq.map((item, i) => (
            <div key={i} style={s.faqItem}>
              <button
                style={s.faqQ}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{item.q}</span>
                <span style={s.faqChevron}>{openFaq === i ? "▲" : "▼"}</span>
              </button>
              {openFaq === i && (
                <p style={s.faqA}>{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

/* ── STYLES ── */
const s: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  card: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 10,
    padding: "14px 16px",
  },

  cardLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#d4a843",
    marginBottom: 10,
  },

  body: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "#c8c8c8",
    margin: 0,
  },

  muted: {
    color: "#555",
    fontStyle: "italic",
  },

  pillRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 6,
  },

  pill: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 500,
    padding: "4px 10px",
    borderRadius: 999,
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    color: "#ddd",
  },

  pillAccent: {
    background: "#1a1308",
    border: "1px solid #d4a84340",
    color: "#d4a843",
  },

  igBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#d4a843",
    background: "#1a1308",
    border: "1px solid #d4a84340",
    borderRadius: 999,
    padding: "6px 14px",
    textDecoration: "none",
  },

  specGrid: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  },

  specItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "10px 12px",
    background: "#161616",
    borderRadius: 8,
    border: "1px solid #1e1e1e",
  },

  specIcon: {
    fontSize: 14,
    lineHeight: 1,
    marginTop: 1,
  },

  specKey: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#666",
    margin: "0 0 3px",
  },

  specVal: {
    fontSize: 13,
    color: "#ccc",
    margin: 0,
    lineHeight: 1.5,
  },

  authenticityCard: {
    background: "#0b160b",
    border: "1px solid #1a3d1a",
  },

  authInner: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },

  authBadge: {
    fontSize: 14,
    fontWeight: 700,
    color: "#4caf50",
    background: "#162016",
    border: "2px solid #2a5a2a",
    borderRadius: "50%",
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  faqList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 6,
  },

  faqItem: {
    border: "1px solid #1e1e1e",
    borderRadius: 8,
    overflow: "hidden",
  },

  faqQ: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    background: "#161616",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    color: "#ddd",
    textAlign: "left" as const,
    gap: 8,
  },

  faqChevron: {
    fontSize: 9,
    color: "#d4a843",
    flexShrink: 0,
  },

  faqA: {
    padding: "10px 14px",
    fontSize: 13,
    color: "#aaa",
    lineHeight: 1.6,
    background: "#111",
    margin: 0,
    borderTop: "1px solid #1e1e1e",
  },
};