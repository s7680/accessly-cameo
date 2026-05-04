"use client";

import { useState } from "react";
import { Creator } from "@/lib/types";
import { toggleWatchlist } from "@/lib/watchlist";

interface CreatorCardProps {
  creator: Creator;
  href?: string;
  variant?: "featured" | "default";
}

export default function CreatorCard({ creator, variant = "default" }: CreatorCardProps) {
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const imgSrc =
    !imgError && ((creator as any).display_image || (creator as any).displayImage || creator.avatar || creator.image)
      ? (creator as any).display_image || (creator as any).displayImage || creator.avatar || creator.image
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=1e1e1e&color=888&size=400`;

  const has24hr = creator.deliveryHours != null && creator.deliveryHours <= 24;

  return (
    <>
      <style>{`
        .cc-card {
          position: relative;
          background: #111;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.22s cubic-bezier(.25,.8,.25,1),
                      box-shadow 0.22s cubic-bezier(.25,.8,.25,1);
          text-decoration: none;
          display: block;
          color: inherit;
          border: 1px solid #1e1e1e;
        }
        .cc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.6);
          border-color: #2e2e2e;
        }
        .cc-card:hover .cc-img {
          transform: scale(1.04);
        }
        .cc-card:hover .cc-overlay-btn {
          opacity: 1;
          transform: translateY(0);
        }

        .cc-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #1a1a1a;
        }
        .cc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .cc-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 40%,
            rgba(0,0,0,0.15) 65%,
            rgba(0,0,0,0.72) 100%
          );
          pointer-events: none;
        }

        .cc-heart {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(6px);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          transition: transform 0.18s, background 0.18s;
          z-index: 2;
          color: #fff;
        }
        .cc-heart:hover { background: rgba(0,0,0,0.75); transform: scale(1.15); }
        .cc-heart--active { color: #ff4d6d; }

        .cc-badge-24 {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px);
          border-radius: 20px;
          padding: 3px 8px;
          font-size: 0.68rem;
          font-weight: 700;
          color: #f5c518;
          display: flex;
          align-items: center;
          gap: 3px;
          z-index: 2;
          letter-spacing: 0.02em;
        }

        .cc-overlay-btn {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 8px;
          padding: 9px 0;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.22s, transform 0.22s;
          z-index: 2;
          text-align: center;
        }

        .cc-info {
          padding: 10px 12px 12px;
        }

        .cc-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: #f0f0f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0 0 2px;
          letter-spacing: 0.01em;
        }

        .cc-title {
          font-size: 0.75rem;
          color: #888;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0 0 7px;
        }

        .cc-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .cc-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: #ccc;
        }
        .cc-star { color: #f5c518; font-size: 0.78rem; }
        .cc-review-count { color: #666; font-size: 0.7rem; }

        .cc-delivery {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.72rem;
          color: #f5c518;
          font-weight: 600;
        }

        .cc-price {
          font-size: 0.85rem;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
        }
        .cc-price-label {
          font-size: 0.68rem;
          color: #666;
          font-weight: 400;
        }
      `}</style>

      <a className="cc-card" href={`/videos/${creator.id}`}>
        {/* Image */}
        <div className="cc-img-wrap">
          <img
            className="cc-img"
            src={imgSrc}
            alt={creator.name}
            onError={() => setImgError(true)}
          />
          <div className="cc-scrim" />

          {has24hr && (
            <span className="cc-badge-24">⚡ 24hr</span>
          )}

          <button
            className={`cc-heart ${wishlisted ? "cc-heart--active" : ""}`}
            onClick={async (e) => {
              e.preventDefault();

              const newState = !wishlisted;
              setWishlisted(newState);

              try {
                await toggleWatchlist(creator.id, "video", newState);
              } catch (err) {
                console.error("Watchlist update failed", err);
                setWishlisted(!newState);
              }
            }}
            aria-label="Toggle wishlist"
          >
            {wishlisted ? "♥" : "♡"}
          </button>

          <button
            className="cc-overlay-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/videos/${creator.id}`;
            }}
          >
            Request Video
          </button>
        </div>

        {/* Info */}
        <div className="cc-info">
          <p className="cc-name">{creator.name}</p>
          {creator.title && <p className="cc-title">{creator.title}</p>}

          <div className="cc-meta">
            {creator.rating != null ? (
              <span className="cc-rating">
                <span className="cc-star">★</span>
                {creator.rating.toFixed(1)}
                {creator.reviewCount != null && (
                  <span className="cc-review-count">({creator.reviewCount.toLocaleString()})</span>
                )}
              </span>
            ) : <span />}

            {has24hr && (
              <span className="cc-delivery">⚡ 24hr</span>
            )}

            <span className="cc-price">
              ₹{(creator.price ?? 0).toLocaleString("en-IN")}
              <span className="cc-price-label"> /video</span>
            </span>
          </div>
        </div>
      </a>
    </>
  );
}