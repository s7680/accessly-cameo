"use client";

import React, { useState } from "react";

type Props = {
  name: string;
  story: string;
  date?: string | Date | null;
  duration?: string;
  location?: string;
  venue?: string;
  city?: string;
  benefits?: string;
  capacity?: number;
  cuisine?: string;
  photosIncluded?: string;
  autographIncluded?: string;
  instagram_link?: string;
  instagramLink?: string;
  pricingMode?: string;
  startingBid?: number;
  fixedPrice?: number;
  faq?: any;
};

export default function ExperienceDetails({
  name, story, date, duration, location,
  venue, city,
  benefits, capacity, cuisine, photosIncluded,
  autographIncluded, instagram_link, instagramLink,
  pricingMode, startingBid, fixedPrice, faq,
}: Props) {
  const ig = instagram_link?.trim() || instagramLink?.trim() || undefined;
  const loc = location || venue || city || undefined;
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const faqEntries = faq ? Object.entries(faq) : [];

  const extras = [
    { icon: "🍽️", label: "Cuisine",   value: cuisine },
    { icon: "📸", label: "Photos",    value: photosIncluded },
    { icon: "✍️", label: "Autograph", value: autographIncluded },
  ].filter((e) => e.value) as { icon: string; label: string; value: string }[];

  return (
    <div style={s.page}>

      {/* ── META PILLS ── */}
      <div style={s.metaRow}>
        {date     && <span style={s.metaPill}>📅 {new Date(date).toDateString()}</span>}
        {duration && <span style={s.metaPill}>⏱ {duration}</span>}
        {loc && <span style={s.metaPill}>📍 {loc}</span>}
        {capacity && <span style={s.metaPill}>👥 {capacity} spots</span>}
      </div>

      {/* ── ABOUT — prominent ── */}
      <section style={s.aboutCard}>
        <p style={s.aboutLabel}>About Experience</p>
        <p style={s.aboutBody}>{story}</p>
      </section>

      {/* ── WHAT YOU GET ── */}
      {benefits && (
        <section style={s.card}>
          <p style={s.cardLabel}>What You Get</p>
          <p style={s.body}>{benefits}</p>
        </section>
      )}

      {/* ── INCLUSIONS as horizontal chips ── */}
      {extras.length > 0 && (
        <section style={s.card}>
          <p style={s.cardLabel}>Inclusions</p>
          <div style={s.chipRow}>
            {extras.map(({ icon, label, value }) => (
              <div key={label} style={s.chip}>
                <span style={s.chipIcon}>{icon}</span>
                <div>
                  <p style={s.inclKey}>{label}</p>
                  <p style={s.inclVal}>{value}</p>
                </div>
              </div>
            ))}

            {/* Instagram lives here as a chip too */}
            {ig && (
              <a href={ig} target="_blank" rel="noopener noreferrer" style={s.igChip}>
                <span style={s.chipIcon}>📸</span>
                <div>
                  <p style={s.inclKey}>Instagram</p>
                  <p style={s.inclVal}>View Post →</p>
                </div>
              </a>
            )}
          </div>
        </section>
      )}

      {/* Instagram standalone — only if no inclusions section */}
      {ig && extras.length === 0 && (
        <section style={s.card}>
          <p style={s.cardLabel}>Instagram Post</p>
          <a href={ig} target="_blank" rel="noopener noreferrer" style={s.igBtn}>
            <span>📸</span> View Original Post
          </a>
        </section>
      )}

      {/* ── FAQ ── */}
      {faqEntries.length > 0 && (
        <section style={s.card}>
          <p style={s.cardLabel}>FAQ</p>
          <div style={s.faqList}>
            {faqEntries.map(([key, val]) => (
              <div key={key} style={s.faqItem}>
                <button
                  style={s.faqQ}
                  onClick={() => setOpenFaq(openFaq === key ? null : key)}
                >
                  <span style={{ textTransform: "capitalize" }}>{key}</span>
                  <span style={s.faqChevron}>{openFaq === key ? "▲" : "▼"}</span>
                </button>
                {openFaq === key && <p style={s.faqA}>{String(val)}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

const s: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },

  metaPill: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 500,
    padding: "4px 10px",
    borderRadius: 999,
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    color: "#ccc",
  },

  aboutCard: {
    background: "#131008",
    border: "1px solid #2e2408",
    borderLeft: "4px solid #d4a843",
    borderRadius: 10,
    padding: "20px 20px",
  },

  aboutLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#d4a843",
    marginBottom: 10,
  },

  aboutBody: {
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.75,
    color: "#f0ede6",
    margin: 0,
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
    lineHeight: 1.65,
    color: "#c8c8c8",
    margin: 0,
  },

  /* Inclusions as wrapping chips */
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    background: "#161616",
    border: "1px solid #222",
    borderRadius: 8,
    minWidth: 110,
  },

  igChip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    background: "#0e0b14",
    border: "1px solid #2a1f3d",
    borderRadius: 8,
    minWidth: 110,
    textDecoration: "none",
    cursor: "pointer",
  },

  chipIcon: {
    fontSize: 18,
    flexShrink: 0,
  },

  inclKey: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#666",
    margin: 0,
  },

  inclVal: {
    fontSize: 13,
    color: "#ccc",
    margin: 0,
    textTransform: "capitalize",
  },

  igBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#d4a843",
    background: "#1a1308",
    border: "1px solid #d4a84345",
    borderRadius: 999,
    padding: "7px 14px",
    textDecoration: "none",
  },

  faqList: {
    display: "flex",
    flexDirection: "column",
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
    textAlign: "left",
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