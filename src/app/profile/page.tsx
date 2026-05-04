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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  useEffect(() => {
    async function loadListings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
    }

    loadListings();
  }, []);

  return (
    <div className="flow-page">
      <div className="container--wide" style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        <ProfileHeader onLogout={handleLogout} />
        <RoleToggle active={role} onChange={setRole} />
        {role === "fan" ? (
          <FanSection
            videos={mockFanVideos}
            bids={fanBids.length ? fanBids : mockBids}
            wins={fanWins.length ? fanWins : mockWins}
          />
        ) : (
          <CreatorSection
   
            listings={listings.length ? listings : []}
          />
        )}
      </div>
    </div>
  );
}