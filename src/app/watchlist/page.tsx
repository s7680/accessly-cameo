"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import CreatorCard from "@/components/CreatorCard";
import DropCard from "@/components/DropCard";
import ExperienceCard from "@/components/ExperienceCard";
import { supabase } from "@/lib/supabaseClient";

// ── Types ─────────────────────────────────────────────────────────────────────

type WatchlistEntry = {
  id: string;
  item_id: string;
  item_type: string;
};

interface WatchlistItemProps {
  item: WatchlistEntry;
  onRemove: (id: string) => void;
  router: ReturnType<typeof useRouter>;
}

// ── Inline Wrapper (defined inside this file) ─────────────────────────────────

function WatchlistItem({ item, onRemove, router }: WatchlistItemProps) {
  const actionRow = (path: string) => (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <Button onClick={() => router.push(path)}>View</Button>
      <Button variant="secondary" onClick={() => onRemove(item.id)}>
        Remove
      </Button>
    </div>
  );

  if (item.type === "video") {
    return (
      <div className="wl-card">
        <CreatorCard
          creator={{
            id: item.id,
            name: item.creator,
            image: item.image,
            price: item.price,
          }}
        />
        {actionRow(`/videos/${item.id}`)}
      </div>
    );
  }

  if (item.type === "drop") {
    return (
      <div className="wl-card">
        <DropCard
          drop={{
            id: item.id,
            title: item.title,
            description: "",
            category: "collectible",
            image: item.image,
            edition: "1/1",
            creatorName: item.creator,
            creatorAvatar: "",
            currentBid: item.price,
            totalBids: 5,
            endsIn: new Date(Date.now() + 86400000).toISOString(),
            buyNowPrice: item.price,
          }}
        />
        {actionRow(`/drops/${item.id}`)}
      </div>
    );
  }


  return null;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WatchlistPage() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;

      const { data } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user.id);

      if (data) setWatchlist(data);
    };

    fetchWatchlist();
  }, []);

  const handleRemove = async (id: string) => {
    await supabase.from("watchlist").delete().eq("id", id);
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="wl-container">
        {/* ── Header ── */}
        <div className="wl-header">
          <h1
            className="wl-title"
            style={{
              fontSize: "34px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            Your Watchlist
          </h1>
          {watchlist.length > 0 && (
            <span className="wl-badge">{watchlist.length}</span>
          )}
        </div>
        <p className="wl-subtitle">
          Don’t miss out — complete your purchase before it’s gone
        </p>

        {/* ── Content ── */}
        {watchlist.length === 0 ? (
          <div className="wl-empty">
            <span className="wl-empty-icon">🎯</span>
            <p className="wl-empty-heading">Your watchlist is empty</p>
            <p className="wl-empty-sub">
              Browse drops, videos &amp; experiences and save what excites you.
            </p>
            <Button onClick={() => router.push("/")}>Explore Now</Button>
          </div>
        ) : (
          <div className="wl-list">
            {watchlist.map((item) => (
              <div key={item.id} className="wl-card">
                <p>{item.item_type} - {item.item_id}</p>
                <Button onClick={() => handleRemove(item.id)}>Remove</Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Scoped styles (no extra files needed) ── */}
      <style>{`
        /* Container */
        .wl-container {
          max-width: 420px;
          margin: 0 auto;
          padding: 24px 16px 96px;
        }

        /* Header row */
        .wl-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .wl-title {
          font-size: 34px;
          font-weight: 900;
          color: #ffffff;
          margin: 0;
        }
        .wl-subtitle {
          font-size: 14px;
          color: #bbbbbb;
          margin-top: 4px;
          margin-bottom: 4px;
        }
        .wl-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          padding: 0 7px;
          border-radius: 999px;
          background: var(--color-primary, #f97316);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
        }

        /* Card list */
        .wl-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Individual card wrapper */
        .wl-card {
          background: var(--color-card, #fff);
          border: 1px solid var(--color-border, #ebebeb);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,.04);
          transition: box-shadow 0.2s ease;
        }
        .wl-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,.08);
        }

        /* Empty state */
        .wl-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 56px 24px;
          gap: 10px;
        }
        .wl-empty-icon {
          font-size: 52px;
          margin-bottom: 4px;
        }
        .wl-empty-heading {
          font-size: 20px;
          font-weight: 600;
          color: var(--color-text, #0f0f0f);
          margin: 0;
        }
        .wl-empty-sub {
          font-size: 14px;
          color: var(--color-muted, #888);
          line-height: 1.55;
          margin: 0 0 8px;
        }

        /* Make both buttons inside action row equal width */
        .wl-card > div > * {
          flex: 1;
        }
      `}</style>
    </>
  );
}