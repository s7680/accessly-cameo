// src/app/profile/page.tsx
"use client";

import { useState } from "react";
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

const mockListings = [
  {
    id: "l1",
    type: "drop",
    title: "Autographed Cricket Bat",
    image: "/images/bat.jpg",
    creator: "CricStar",
    currentBid: 20000,
    status: "Active",
    winner: undefined,
  },
  {
    id: "l2",
    type: "experience",
    title: "Virtual Studio Tour",
    image: "/images/studio.jpg",
    creator: "MusicMogul",
    currentBid: 8000,
    status: "Ended",
    winner: "Aarav",
    finalPrice: 8000,
  },
];

export default function ProfilePage() {
  const [role, setRole] = useState<"fan" | "creator">("fan");

  return (
    <div className="flow-page">
      <div className="container--wide" style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        <ProfileHeader />
        <RoleToggle active={role} onChange={setRole} />
        {role === "fan" ? (
          <FanSection
            videos={mockFanVideos}
            bids={mockBids}
            wins={mockWins}
          />
        ) : (
          <CreatorSection
            requests={mockRequests}
            listings={mockListings}
          />
        )}
      </div>
    </div>
  );
}