"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Drop } from "@/lib/types";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";

interface DropCardProps {
  drop: Drop;
}

function useCountdown(endsIn: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function calc() {
      const diff = new Date(endsIn).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft("Ended");
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endsIn]);

  return timeLeft;
}

function fmt(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function DropCard({ drop }: DropCardProps) {
  const router = useRouter();

  if (!drop) return null;

  // Use a safe fallback for endsIn if missing or invalid
  const safeEndsIn =
    drop?.endsIn && !isNaN(new Date(drop.endsIn).getTime())
      ? drop.endsIn
      : new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(); // fallback: +6 hours

  const endTime = new Date(safeEndsIn).getTime();

  const endsInSeconds = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  const isUrgent = endsInSeconds <= 21600; // < 6h

  return (
    <article className="drop-card">
      <div className="drop-card__image-wrap">
        <Image
          src={
            drop.image && drop.image.trim() !== ""
              ? (drop.image.startsWith("http")
                  ? drop.image
                  : `https://picsum.photos/seed/${drop.image}/600/400`)
              : "https://picsum.photos/seed/fallback/600/400"
          }
          alt={drop.title}
          fill
          className="drop-card__image"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
        <div className="drop-card__overlay">
          <span className="drop-card__edition">{drop.edition}</span>
          <span
            className={`drop-card__timer ${isUrgent ? "drop-card__timer--urgent" : ""}`}
            style={{ color: isUrgent ? "var(--color-danger, #e53e3e)" : "inherit" }}
          >
            Ends in {fmt(endsInSeconds)}
          </span>
        </div>
      </div>

      <div className="drop-card__body">
        <div className="drop-card__creator">
          <Image
            src={
              drop.creatorAvatar && drop.creatorAvatar.trim() !== ""
                ? drop.creatorAvatar
                : "https://picsum.photos/seed/avatar/50/50"
            }
            alt={drop.creatorName}
            width={28}
            height={28}
            className="drop-card__creator-avatar"
            unoptimized
          />
          <span className="drop-card__creator-name">{drop.creatorName}</span>
          <span className="drop-card__category">{drop.category}</span>
        </div>

        <h3 className="drop-card__title">{drop.title}</h3>
        <p className="drop-card__description">{drop.description}</p>

        <div className="drop-card__pricing">
          <div className="drop-card__bid-block">
            <span className="drop-card__price-label">Highest Bid</span>
            <span className="drop-card__price-value drop-card__price-value--bid">
              ₹{drop.currentBid.toLocaleString("en-IN")}
            </span>
            <span className="drop-card__bid-count">{drop.totalBids} bids</span>
          </div>

          {drop.buyNowPrice !== null && (
            <div className="drop-card__buynow-block">
              <span className="drop-card__price-label">Buy Now</span>
              <span className="drop-card__price-value drop-card__price-value--buynow">
                ₹{(drop.buyNowPrice ?? 0).toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>

        <div className="drop-card__actions">
          <Button
            aria-label={`Place bid on ${drop.title}`}
            onClick={() => router.push(`${routes.bid(drop.id)}?type=drop`)}
          >
            Place Bid
          </Button>
          {drop.buyNowPrice !== null && (
            <Button
              variant="primary"
              aria-label={`Buy now — ${drop.title}`}
              onClick={(e) => {
                e.stopPropagation();
                router.push(routes.checkout);
              }}
            >
              Buy Now — ₹{(drop.buyNowPrice ?? 0).toLocaleString("en-IN")}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}