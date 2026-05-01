"use client";

import { useState, useEffect, useRef } from "react";

interface MediaItem {
  type: "image" | "video";
  src: string;
  alt?: string;
  thumbnail?: string;
}

interface MediaCarouselProps {
  media: MediaItem[];
  title?: string;
}

export default function MediaCarousel({ media, title }: MediaCarouselProps) {
  const [active, setActive] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active]);

  const next = () => setActive((a) => (a + 1) % media.length);
  const prev = () => setActive((a) => (a - 1 + media.length) % media.length);

  const handleDragStart = (x: number) => {
    setDragging(true);
    dragStart.current = x;
  };
  const handleDragEnd = (x: number) => {
    if (!dragging) return;
    const diff = dragStart.current - x;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    setDragging(false);
  };

  const current = media[active];

  return (
    <div className="media-carousel">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .media-carousel {
          position: relative;
          background: #0a0a0a;
          border: 1px solid #1e1e1e;
          overflow: hidden;
          border-radius: 2px;
          user-select: none;
        }

        .carousel-main {
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
          overflow: hidden;
          cursor: pointer;
        }

        .carousel-main img,
        .carousel-main video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .carousel-main:hover img {
          transform: scale(1.02);
        }

        .carousel-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.75) 0%,
            transparent 40%
          );
          pointer-events: none;
        }

        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.6);
          border: 1px solid rgba(255,176,0,0.3);
          color: #ffb000;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.2s;
          z-index: 10;
          font-size: 18px;
        }
        .carousel-nav:hover {
          background: rgba(255,176,0,0.2);
          border-color: #ffb000;
        }
        .carousel-nav.prev { left: 12px; }
        .carousel-nav.next { right: 12px; }

        .carousel-counter {
          position: absolute;
          bottom: 14px;
          right: 14px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          letter-spacing: 2px;
          color: #ffb000;
          background: rgba(0,0,0,0.5);
          padding: 3px 8px;
          backdrop-filter: blur(4px);
        }

        .carousel-label {
          position: absolute;
          top: 14px;
          left: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #888;
          background: rgba(0,0,0,0.6);
          padding: 3px 8px;
          backdrop-filter: blur(4px);
        }

        .carousel-thumbs {
          display: flex;
          gap: 6px;
          padding: 10px;
          background: #111;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .carousel-thumbs::-webkit-scrollbar { display: none; }

        .carousel-thumb {
          flex-shrink: 0;
          width: 64px;
          height: 48px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          transition: border-color 0.2s;
          opacity: 0.5;
          position: relative;
        }
        .carousel-thumb.active {
          border-color: #ffb000;
          opacity: 1;
        }
        .carousel-thumb:hover { opacity: 0.85; }

        .carousel-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .thumb-video-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.4);
          color: #ffb000;
          font-size: 14px;
        }

        /* Zoom overlay */
        .zoom-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-out;
          animation: fadeIn 0.2s ease;
        }
        .zoom-overlay img {
          max-width: 90vw;
          max-height: 90vh;
          object-fit: contain;
        }
        .zoom-close {
          position: absolute;
          top: 24px;
          right: 24px;
          color: #ffb000;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 3px;
          cursor: pointer;
          padding: 8px 16px;
          border: 1px solid rgba(255,176,0,0.4);
        }

        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>

      {/* Zoom overlay */}
      {isZoomed && current.type === "image" && (
        <div className="zoom-overlay" onClick={() => setIsZoomed(false)}>
          <span className="zoom-close">ESC / CLOSE</span>
          <img src={current.src} alt={current.alt} />
        </div>
      )}

      {/* Main viewport */}
      <div
        className="carousel-main"
        onClick={() => current.type === "image" && setIsZoomed(true)}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
      >
        {current.type === "image" ? (
          <img src={current.src} alt={current.alt || title} draggable={false} />
        ) : (
          <video src={current.src} autoPlay muted loop playsInline />
        )}

        <div className="carousel-overlay" />

        {title && <div className="carousel-label">{title}</div>}

        {media.length > 1 && (
          <>
            <button className="carousel-nav prev" onClick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
            <button className="carousel-nav next" onClick={(e) => { e.stopPropagation(); next(); }}>›</button>
          </>
        )}

        <div className="carousel-counter">{active + 1} / {media.length}</div>
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="carousel-thumbs">
          {media.map((m, i) => (
            <div
              key={i}
              className={`carousel-thumb ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              <img src={m.thumbnail || m.src} alt={m.alt || `Media ${i + 1}`} />
              {m.type === "video" && <div className="thumb-video-icon">▶</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}