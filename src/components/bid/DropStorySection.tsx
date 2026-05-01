"use client";

import { useState } from "react";

interface StorySectionProps {
  type: "experience" | "drop";
  description: string;
  highlights?: string[];
  tags?: string[];
  deliverables?: { label: string; detail: string }[];
  faq?: { q: string; a: string }[];
}

export default function StorySection({
  type,
  description,
  highlights = [],
  tags = [],
  deliverables = [],
  faq = [],
}: StorySectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const PREVIEW_LENGTH = 320;
  const needsExpand = description.length > PREVIEW_LENGTH;

  return (
    <section className="story-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

        .story-section {
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          font-family: 'DM Sans', sans-serif;
          color: #ccc;
        }

        .ss-block {
          padding: 24px;
          border-bottom: 1px solid #161616;
        }
        .ss-block:last-child { border-bottom: none; }

        .ss-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #ffb000;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ss-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, #1e1e1e, transparent);
        }

        /* Description */
        .ss-description {
          font-size: 14.5px;
          line-height: 1.8;
          color: #a0a0a0;
          font-weight: 300;
        }
        .ss-description.clamped {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ss-expand-btn {
          background: none;
          border: none;
          color: #ffb000;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          cursor: pointer;
          padding: 8px 0 0;
          display: flex;
          align-items: center;
          gap: 6px;
          letter-spacing: 1px;
        }
        .ss-expand-btn:hover { color: #ffd040; }

        /* Highlights */
        .ss-highlights {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ss-highlight-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 13.5px;
          color: #999;
        }
        .ss-highlight-dot {
          width: 6px;
          height: 6px;
          background: #ffb000;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        /* Tags */
        .ss-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ss-tag {
          background: #111;
          border: 1px solid #1e1e1e;
          color: #666;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 4px 10px;
          transition: all 0.15s;
          cursor: default;
        }
        .ss-tag:hover {
          border-color: #ffb000;
          color: #ffb000;
        }

        /* Deliverables */
        .ss-deliverables {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }
        .ss-deliverable {
          background: #111;
          border: 1px solid #1a1a1a;
          padding: 14px 16px;
          transition: border-color 0.2s;
        }
        .ss-deliverable:hover { border-color: #2a2a2a; }
        .ss-deliverable-label {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 5px;
        }
        .ss-deliverable-detail {
          font-size: 14px;
          font-weight: 500;
          color: #ddd;
        }

        /* FAQ */
        .ss-faq { display: flex; flex-direction: column; gap: 1px; }
        .ss-faq-item {
          background: #111;
          border: 1px solid #1a1a1a;
          overflow: hidden;
        }
        .ss-faq-q {
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          padding: 14px 16px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #ccc;
          transition: color 0.2s;
        }
        .ss-faq-q:hover { color: #fff; }
        .ss-faq-icon {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          color: #ffb000;
          transition: transform 0.3s;
          line-height: 1;
        }
        .ss-faq-icon.open { transform: rotate(45deg); }
        .ss-faq-a {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s;
          padding: 0 16px;
          font-size: 13.5px;
          color: #777;
          line-height: 1.7;
        }
        .ss-faq-a.open {
          max-height: 300px;
          padding: 0 16px 14px;
        }
      `}</style>

      {/* Description */}
      <div className="ss-block">
        <div className="ss-label">About This Experience</div>
        <p className={`ss-description ${needsExpand && !expanded ? "clamped" : ""}`}>
          {description}
        </p>
        {needsExpand && (
          <button className="ss-expand-btn" onClick={() => setExpanded((e) => !e)}>
            {expanded ? "Show less ↑" : "Read more ↓"}
          </button>
        )}
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="ss-block">
          <div className="ss-label">Highlights</div>
          <div className="ss-highlights">
            {highlights.map((h, i) => (
              <div key={i} className="ss-highlight-item">
                <div className="ss-highlight-dot" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deliverables / Details */}
      {type === "experience" && deliverables.length > 0 && (
        <div className="ss-block">
          <div className="ss-label">What You Get</div>
          <div className="ss-deliverables">
            {deliverables.map((d, i) => (
              <div key={i} className="ss-deliverable">
                <div className="ss-deliverable-label">{d.label}</div>
                <div className="ss-deliverable-detail">{d.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === "drop" && (
        <div className="ss-block">
          <div className="ss-label">Item Details</div>
          <div style={{ fontSize: 13.5, color: "#999", lineHeight: 1.8 }}>
            <p>Shipping: Included</p>
            <p>Authenticity: Verified</p>
            <p>Condition: New</p>
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="ss-block">
          <div className="ss-label">Tags</div>
          <div className="ss-tags">
            {tags.map((t, i) => (
              <span key={i} className="ss-tag">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <div className="ss-block">
          <div className="ss-label">FAQ</div>
          <div className="ss-faq">
            {faq.map((item, i) => (
              <div key={i} className="ss-faq-item">
                <button className="ss-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{item.q}</span>
                  <span className={`ss-faq-icon ${openFaq === i ? "open" : ""}`}>+</span>
                </button>
                <div className={`ss-faq-a ${openFaq === i ? "open" : ""}`}>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}