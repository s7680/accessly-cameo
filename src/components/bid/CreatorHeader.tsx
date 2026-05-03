"use client";

import { useState, useEffect } from "react";

interface CreatorHeaderProps {
  type: "experience" | "drop";
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  category: string;
  followers: number;
  rating: number;
  reviewCount: number;
  listingTitle: string;
  listingId: string;
  endTime: Date | null;
  isFollowing?: boolean;
}

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function CreatorHeader({
  type,
  name,
  handle,
  avatar,
  verified = false,
  category,
  followers,
  rating,
  reviewCount,
  listingTitle,
  listingId,
  endTime,
  isFollowing: initialFollow = false,
}: CreatorHeaderProps) {
  const [following, setFollowing] = useState(initialFollow);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));

  return (
    <header className="creator-header">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

        .creator-header {
          background: #0d0d0d;
          border-bottom: 1px solid #1e1e1e;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
        }

        .ch-top-bar {
          background: #111;
          border-bottom: 1px solid #1a1a1a;
          padding: 8px 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #555;
        }
        .ch-top-bar .sep { color: #2a2a2a; }
        .ch-top-bar .cat {
          color: #ffb000;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 3px;
          font-size: 12px;
        }

        .ch-main {
          padding: 20px 24px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
        }

        .ch-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .ch-avatar {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          border: 2px solid #1e1e1e;
        }
        .ch-live-dot {
          position: absolute;
          bottom: 3px;
          right: 3px;
          width: 14px;
          height: 14px;
          background: #00e676;
          border-radius: 50%;
          border: 2px solid #0d0d0d;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,230,118,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(0,230,118,0); }
        }

        .ch-info { flex: 1; min-width: 0; }

        .ch-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 3px;
        }
        .ch-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 2px;
          color: #f0f0f0;
          line-height: 1;
        }
        .ch-verified {
          background: #ffb000;
          color: #0a0a0a;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 2px;
        }

        .ch-handle {
          font-size: 13px;
          color: #555;
          margin-bottom: 8px;
        }
        .ch-handle span { color: #ffb000; }

        .ch-stats {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .ch-stat {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #666;
        }
        .ch-stat strong {
          color: #ccc;
          font-weight: 500;
        }
        .ch-stars {
          display: flex;
          gap: 2px;
        }
        .ch-star { font-size: 11px; }
        .ch-star.on { color: #ffb000; }
        .ch-star.off { color: #333; }

        .ch-follow-btn {
          background: transparent;
          border: 1px solid #ffb000;
          color: #ffb000;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          letter-spacing: 2px;
          padding: 7px 18px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .ch-follow-btn:hover,
        .ch-follow-btn.active {
          background: #ffb000;
          color: #0a0a0a;
        }

        .ch-listing {
          padding: 14px 24px;
          border-top: 1px solid #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .ch-listing-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 1.5px;
          color: #e8e8e8;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ch-timer {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #111;
          border: 1px solid #1e1e1e;
          padding: 8px 14px;
          flex-shrink: 0;
        }
        .ch-timer.urgent { border-color: rgba(255,59,48,0.4); }
        .ch-timer-label {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #555;
          margin-right: 8px;
        }
        .ch-timer-seg {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .ch-timer-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          line-height: 1;
          color: #ffb000;
        }
        .ch-timer.urgent .ch-timer-num { color: #ff3b30; }
        .ch-timer-unit {
          font-size: 9px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #444;
        }
        .ch-timer-colon {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          color: #333;
          margin: 0 2px;
          padding-bottom: 4px;
        }

        .ch-id {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #333;
        }
      `}</style>

      {/* Breadcrumb */}
      <div className="ch-top-bar">
        <span>Auctions</span>
        <span className="sep">›</span>
        <span className="cat">{category}</span>
        <span className="sep">›</span>
        <span>{listingId}</span>
      </div>

      {/* Creator info */}
      <div className="ch-main">
        <div className="ch-avatar-wrap">
          <img className="ch-avatar" src={avatar} alt={name} />
          <div className="ch-live-dot" title="Online" />
        </div>

        <div className="ch-info">
          <div className="ch-name-row">
            <span className="ch-name">{name}</span>
            <span style={{ fontSize: 12, color: "#aaa" }}>
              {type === "experience" ? "Experience" : "Drop"}
            </span>
            {verified && <span className="ch-verified">✓ Verified</span>}
          </div>
          <div className="ch-handle"><span>{handle}</span></div>
          <div className="ch-stats">
            <div className="ch-stat">
              <strong>{formatFollowers(followers)}</strong> followers
            </div>
            <div className="ch-stat">
              <div className="ch-stars">
                {stars.map((on, i) => (
                  <span key={i} className={`ch-star ${on ? "on" : "off"}`}>★</span>
                ))}
              </div>
              <strong>{rating.toFixed(1)}</strong>
              <span>({reviewCount})</span>
            </div>
          </div>
        </div>

        <button
          className={`ch-follow-btn ${following ? "active" : ""}`}
          onClick={() => setFollowing((f) => !f)}
        >
          {following ? "Following" : "Follow"}
        </button>
      </div>

      {/* Listing title */}
      <div className="ch-listing">
        <div className="ch-listing-title">{listingTitle}</div>
      </div>
    </header>
  );
}