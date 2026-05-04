// src/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getListings, getUserBids, getUserWins } from "@/lib/db/listings";
import ProfileHeader from "@/components/profile/ProfileHeader";
import RoleToggle from "@/components/profile/RoleToggle";
import FanSection from "@/components/profile/FanSection";
import CreatorSection from "@/components/profile/CreatorSection";

// ---------- MOCK DATA ----------
const mockFanVideos = [
  {
    id: "v1",
    title: "Happy Birthday Shoutout",
    creatorName: "DJ Ravi",
    status: "Delivered",
  },
  {
    id: "v2",
    title: "Roast for my brother",
    creatorName: "ComedyKing",
    status: "Delivered",
  },
];

const mockBids = [
  {
    id: "b1",
    type: "drop",
    title: "Limited Edition Sneakers",
    image: "/images/sneakers.jpg",
    creator: "StreetStyle",
    currentBid: 5000,
    yourBid: 5000,
    endTime: "2h left",
  },
  {
    id: "b2",
    type: "experience",
    title: "1-on-1 Gaming Session",
    image: "/images/gaming.jpg",
    creator: "ProGamerX",
    currentBid: 12000,
    yourBid: 11000,
    endTime: "1d left",
  },
];

const mockWins = [
  {
    id: "w1",
    type: "drop",
    title: "Artist Print (Signed)",
    image: "/images/print.jpg",
    creator: "ArtByMaya",
    finalPrice: 7500,
    status: "Won",
  },
  {
    id: "w2",
    type: "experience",
    title: "Cooking Masterclass",
    image: "/images/cooking.jpg",
    creator: "ChefAnanya",
    finalPrice: 15000,
    status: "Won",
  },
];

const mockRequests = [
  {
    id: "r1",
    fanName: "Rohit",
    instructions: "Say happy anniversary to Priya",
    deadline: "28th Oct",
  },
  {
    id: "r2",
    fanName: "Sneha",
    instructions: "Motivational message for my team",
    deadline: "30th Oct",
  },
];

export default function ProfilePage() {
  const [role, setRole] = useState<"fan" | "creator">("fan");
  const [listings, setListings] = useState<any[]>([]);
  const [fanBids, setFanBids] = useState<any[]>([]);
  const [fanWins, setFanWins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  useEffect(() => {
    async function loadListings() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const data = await getListings(user.id);

      // normalize fields for CreatorListings
      const formatted = (data || []).map((item: any) => ({
        id: item.id,
        type: item.type,

        // core fields
        item_name: item.item_name,
        start_datetime: item.start_datetime,
        end_datetime: item.end_datetime,

        // pricing
        fixed_price: item.fixed_price,
        current_bid: item.current_bid,
        pricing_mode: item.pricing_mode,

        // display
        display_name: item.display_name,
        display_image: item.display_image,
        category: item.category,

        // experience-specific
        story: item.story,
        location: item.location,
        duration: item.duration,

        // creator
        avatar_url: item.users?.avatar_url,

        // auction result
        winner_id: item.winner_id,
        winning_bid: item.winning_bid,
        status: item.status,
      }));

      const formattedBids = await getUserBids(user.id);
      const wins = await getUserWins(user.id);

      setListings(formatted);
      setFanBids(formattedBids);
      setFanWins(wins);
      setLoading(false);
    }

    loadListings();
  }, []);

  return (
    <div className="flow-page">
      <style>{`
        .sk {
          background: linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div className="container--wide" style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        {loading ? (
          <div className="sk" style={{ height: 80, borderRadius: 12 }} />
        ) : (
          <ProfileHeader onLogout={handleLogout} />
        )}
        {loading ? (
          <div className="sk" style={{ height: 40, borderRadius: 8, marginTop: 12 }} />
        ) : (
          <RoleToggle active={role} onChange={setRole} />
        )}
        {role === "fan" ? (
          loading ? (
            <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
              {[1,2,3].map(i => (
                <div key={i} className="sk" style={{ height: 120, borderRadius: 12 }} />
              ))}
            </div>
          ) : (
            <FanSection
              videos={mockFanVideos}
              bids={fanBids.length ? fanBids : mockBids}
              wins={fanWins.length ? fanWins : mockWins}
            />
          )
        ) : (
          loading ? (
            <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
              {[1,2,3].map(i => (
                <div key={i} className="sk" style={{ height: 140, borderRadius: 12 }} />
              ))}
            </div>
          ) : (
            <CreatorSection
              listings={listings.length ? listings : []}
            />
          )
        )}
      </div>
    </div>
  );
}