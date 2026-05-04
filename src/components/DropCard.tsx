"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Drop } from "@/lib/types";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { toggleWatchlist } from "@/lib/watchlist";
import { supabase } from "@/lib/supabaseClient";

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
  const [isWatching, setIsWatching] = useState(false);
  const [user, setUser] = useState<any>(null);

  if (!drop) return null;
  const mode = ((drop as any).pricing_mode || (drop as any).pricingMode || "bid").toLowerCase();

  // Use a safe fallback for endsIn if missing or invalid
  const safeEndsIn =
    drop?.endsIn && !isNaN(new Date(drop.endsIn).getTime())
      ? drop.endsIn
      : new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(); // fallback: +6 hours

  const endTime = new Date(safeEndsIn).getTime();

  const endsInSeconds = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  const isUrgent = endsInSeconds <= 21600; // < 6h

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user || !drop?.id) return;

    const check = async () => {
      const { data } = await supabase
        .from("watchlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("item_id", drop.id)
        .eq("item_type", "drop")
        .maybeSingle();
      setIsWatching(!!data);
    };

    check();
  }, [user, drop.id]);

  const handleWatch = async () => {
    if (!user) return;
    await toggleWatchlist(user.id, drop.id, !isWatching);
    setIsWatching((prev) => !prev);
  };

  return (
    <article className="drop-card">
      <div className="drop-card__image-wrap">
        <button
          onClick={handleWatch}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "22px",
            color: "red",
            background: "rgba(0,0,0,0.4)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          ♥
        </button>
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
          {mode === "buynow" && drop.buyNowPrice !== null && (
            <Button
              variant="primary"
              aria-label={`Buy now — ${drop.title}`}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`${routes.checkout}?id=${drop.id}&type=drop`);
              }}
            >
              Purchase — ₹{(drop.buyNowPrice ?? 0).toLocaleString("en-IN")}
            </Button>
          )}

          {mode === "bid" && (
            <Button
              aria-label={`Place bid on ${drop.title}`}
              onClick={() => {
                if (!drop?.id) return;
                router.push(`/bid/${String(drop.id)}?type=drop`);
              }}
            >
              Place Bid
            </Button>
          )}

          {(mode === "fixed") && drop.buyNowPrice !== null && (
            <Button
              variant="primary"
              aria-label={`Buy now — ${drop.title}`}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`${routes.checkout}?id=${drop.id}&type=drop`);
              }}
            >
              Buy Now — ₹{(drop.buyNowPrice ?? 0).toLocaleString("en-IN")}
            </Button>
          )}

          {mode === "hybrid" && (
            <>
              <Button
                aria-label={`Place bid on ${drop.title}`}
                onClick={() => {
                  if (!drop?.id) return;
                  router.push(`/bid/${String(drop.id)}?type=drop`);
                }}
              >
                Place Bid
              </Button>

              {drop.buyNowPrice !== null && (
                <Button
                  variant="primary"
                  aria-label={`Buy now — ${drop.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`${routes.checkout}?id=${drop.id}&type=drop`);
                  }}
                >
                  Buy Now — ₹{(drop.buyNowPrice ?? 0).toLocaleString("en-IN")}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}