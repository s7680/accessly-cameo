import React from "react";

type Deliverable = {
  label: string;
  detail: string;
};

type Props = {
  description: string;
  highlights: string[];
  deliverables: Deliverable[];
  tags?: string[];
  faq?: { question: string; answer: string }[];
};

export default function ExperienceStorySection({
  description,
  highlights,
  deliverables,
  tags = [],
  faq = [],
}: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      
      {/* Description */}
      <section>
        <h3 style={{ marginBottom: 8 }}>About this Experience</h3>
        <p style={{ color: "#ccc", lineHeight: 1.6 }}>{description}</p>
      </section>

      {/* Highlights */}
      <section>
        <h3 style={{ marginBottom: 8 }}>What you’ll experience</h3>
        <ul style={{ paddingLeft: 16, color: "#ccc" }}>
          {highlights.map((item, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Deliverables (Experience-specific details) */}
      <section>
        <h3 style={{ marginBottom: 8 }}>Experience Details</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 10,
          }}
        >
          {deliverables.map((d, i) => (
            <div
              key={i}
              style={{
                background: "#1a1a1a",
                padding: 12,
                borderRadius: 10,
              }}
            >
              <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                {d.label}
              </p>
              <p style={{ color: "#fff", fontWeight: 500 }}>{d.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tags */}
      {tags.length > 0 && (
        <section>
          <h3 style={{ marginBottom: 8 }}>Tags</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "#222",
                  color: "#aaa",
                  fontSize: 12,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section>
          <h3 style={{ marginBottom: 8 }}>FAQs</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faq.map((f, i) => (
              <div
                key={i}
                style={{
                  background: "#1a1a1a",
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <p style={{ fontWeight: 500, marginBottom: 4 }}>
                  {f.question ?? (f as any).q}
                </p>
                <p style={{ color: "#aaa", fontSize: 14 }}>
                  {f.answer ?? (f as any).a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}