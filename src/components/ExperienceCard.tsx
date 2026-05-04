"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Experience } from "@/lib/types";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { toggleWatchlist } from "@/lib/watchlist";
import { supabase } from "@/lib/supabaseClient";

interface ExperienceCardProps {
  experience: Experience;
}

function useCountdown(endsIn: string | null) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!endsIn) return;
    function calc() {
      const diff = new Date(endsIn!).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft("Ended");
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      setTimeLeft(d > 0 ? `${d}d ${h}h` : `${h}h left`);
    }
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [endsIn]);

  return timeLeft;
}

export default function ExperienceCard({ experience: exp }: ExperienceCardProps) {
  const router = useRouter();
  const [isWatching, setIsWatching] = useState(false);
  const [user, setUser] = useState<any>(null);
  if (!exp) return null;
  const countdown = useCountdown(exp?.endsIn || null);
  const spotsPercent =
    exp?.capacity && exp.spotsLeft !== undefined
      ? Math.round(((exp.capacity - exp.spotsLeft) / exp.capacity) * 100)
      : 0;
  // Ensure pricingMode default for safety
  const pricingMode = exp.pricingMode || "both";

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user || !exp?.id) return;

    const check = async () => {
      const { data } = await supabase
        .from("watchlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("item_id", exp.id)
        .eq("item_type", "experience")
         .maybeSingle();

      setIsWatching(!!data);
    };

    check();
  }, [user, exp.id]);

  const handleWatch = async () => {
    if (!user) return;
    const newState = !isWatching;
    await toggleWatchlist(exp.id, "experience", newState);
    setIsWatching(newState);
  };

  const hasBid = pricingMode === "auction" || pricingMode === "both" || exp.currentBid != null;
  const hasBuy = pricingMode === "buyNow" || pricingMode === "both" || exp.buyNowPrice != null;

  return (
    <article className="experience-card">
      <div className="experience-card__image-wrap">
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
            exp.image && exp.image.trim() !== ""
              ? (exp.image.startsWith("http")
                  ? exp.image
                  : `https://picsum.photos/seed/${exp.image}/600/400`)
              : "https://picsum.photos/seed/fallback/600/400"
          }
          alt={exp.title}
          fill
          className="experience-card__image"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
        <div className="experience-card__badges">
          <span className="experience-card__location-badge">📍 {exp.location}</span>
          {exp.spotsLeft <= 3 && (
            <span className="experience-card__urgency-badge">Only {exp.spotsLeft} left!</span>
          )}
        </div>
      </div>

      <div className="experience-card__body">
        <div className="experience-card__creator">
          <Image
            src={
              exp.creatorAvatar && exp.creatorAvatar.trim() !== ""
                ? exp.creatorAvatar
                : "https://picsum.photos/seed/avatar/50/50"
            }
            alt={exp.creatorName}
            width={26}
            height={26}
            className="experience-card__creator-avatar"
            unoptimized
          />
          <span className="experience-card__creator-name">{exp.creatorName}</span>
        </div>

        <h3 className="experience-card__title">{exp.title}</h3>
        <p className="experience-card__description">
          {exp.description || "No description available"}
        </p>

        <style jsx>{`
          .experience-card__description {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            min-height: 3em; /* ensures space for 2 lines even if 1 line */
            line-height: 1.5em;
          }
        `}</style>

        <div className="experience-card__meta">
          <span>📅 {exp.date || "TBA"}</span>
          <span>⏳ {exp.duration || "—"}</span>
        </div>

        {exp.tags && exp.tags.length > 0 && (
          <div className="experience-card__tags">
            {exp.tags?.map((tag) => (
              <span key={tag} className="experience-card__tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="experience-card__capacity">
          <div className="experience-card__capacity-bar">
            <div
              className="experience-card__capacity-fill"
              style={{ width: `${spotsPercent}%` }}
              role="progressbar"
              aria-valuenow={spotsPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="experience-card__capacity-label">
            {exp.spotsLeft} of {exp.capacity} spots left
          </span>
        </div>

        <div className="experience-card__pricing">
          {hasBid && (
            <div className="experience-card__price-block">
              <span className="experience-card__price-label">Current Bid</span>
              <span className="experience-card__price-value experience-card__price-value--bid">
                ₹{exp.currentBid != null ? exp.currentBid.toLocaleString("en-IN") : "No bids yet"}
              </span>
              {countdown && (
                <span className="experience-card__countdown">⏱ {countdown}</span>
              )}
            </div>
          )}

          {hasBuy && (
            <div className="experience-card__price-block">
              <span className="experience-card__price-label">Buy Now</span>
              <span className="experience-card__price-value experience-card__price-value--buynow">
                ₹{exp.buyNowPrice != null ? exp.buyNowPrice.toLocaleString("en-IN") : "Not available"}
              </span>
            </div>
          )}
        </div>

        <div className="experience-card__actions">
          {hasBid && (
            <Button
              onClick={() => router.push(`${routes.bid(exp.id)}?type=experience`)}
            >
              {pricingMode === "both" ? "Place Bid" : "Bid for Spot"}
            </Button>
          )}
          {hasBuy && (
            <Button
              variant="primary"
              onClick={() => router.push(`${routes.checkout}?id=${exp.id}&type=experience`)}
            >
              {pricingMode === "both"
                ? `Buy Now — ₹${exp.buyNowPrice != null ? exp.buyNowPrice.toLocaleString("en-IN") : "Not available"}`
                : `Book Now — ₹${exp.buyNowPrice != null ? exp.buyNowPrice.toLocaleString("en-IN") : "Not available"}`}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}