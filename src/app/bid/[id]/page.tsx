"use client";

import { use } from "react";

import MediaCarousel from "@/components/bid/MediaCarousel";
import CreatorHeader from "@/components/bid/CreatorHeader";
import ExperienceStorySection from "@/components/bid/ExperienceStorySection";
import DropStorySection from "@/components/bid/DropStorySection";
import BidPanel from "@/components/bid/BidPanel";
import Leaderboard from "@/components/bid/Leaderboard";
import LiveChat from "@/components/bid/LiveChat";
import type { BidEntry } from "@/components/bid/Leaderboard";
import type { ChatMessage } from "@/components/bid/LiveChat";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_MEDIA = [
  {
    type: "image" as const,
    src: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80",
    alt: "Cricket stadium",
    thumbnail: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200&q=60",
  },
  {
    type: "image" as const,
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
    alt: "Fine dining table",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=60",
  },
  {
    type: "image" as const,
    src: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80",
    alt: "Cricket equipment",
    thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=200&q=60",
  },
];

const MOCK_LEADERBOARD: BidEntry[] = [
  { rank: 1, bidderName: "Arjun S.", amount: 25000, timestamp: new Date(Date.now() - 4 * 60_000) },
  { rank: 2, bidderName: "Priya M.", amount: 22000, timestamp: new Date(Date.now() - 18 * 60_000), isCurrentUser: true },
  { rank: 3, bidderName: "Anonymous", amount: 19000, timestamp: new Date(Date.now() - 35 * 60_000), isAnonymous: true },
  { rank: 4, bidderName: "Rohit V.", amount: 16000, timestamp: new Date(Date.now() - 52 * 60_000) },
  { rank: 5, bidderName: "Sneha K.", amount: 13000, timestamp: new Date(Date.now() - 74 * 60_000) },
  { rank: 6, bidderName: "Dev R.", amount: 10000, timestamp: new Date(Date.now() - 98 * 60_000) },
  { rank: 7, bidderName: "Ananya P.", amount: 8000, timestamp: new Date(Date.now() - 120 * 60_000) },
];

const MOCK_CHAT: ChatMessage[] = [
  {
    id: "sys-1",
    authorName: "System",
    text: "Auction is now live! Bidding ends in 5 hours.",
    timestamp: new Date(Date.now() - 300 * 60_000),
    type: "system",
  },
  {
    id: "msg-1",
    authorName: "Rohit V.",
    text: "This is incredible. Never thought I'd have a shot at this 🙏",
    timestamp: new Date(Date.now() - 120 * 60_000),
    type: "message",
  },
  {
    id: "msg-2",
    authorName: "Sneha K.",
    text: "Already placed my bid. Fingers crossed 🤞",
    timestamp: new Date(Date.now() - 90 * 60_000),
    type: "message",
  },
  {
    id: "bid-1",
    authorName: "Arjun S.",
    text: "",
    bidAmount: 25000,
    timestamp: new Date(Date.now() - 4 * 60_000),
    type: "bid_event",
  },
  {
    id: "msg-3",
    authorName: "Dev R.",
    text: "₹25,000 already? This is getting serious 🔥",
    timestamp: new Date(Date.now() - 2 * 60_000),
    type: "message",
  },
];

const handleBid = async (amount: number) => {
  await new Promise((r) => setTimeout(r, 800));
  console.log("Bid placed:", amount);
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BidPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const resolvedParams = use(params);
  const resolvedSearch = use(searchParams);
  const type: "experience" | "drop" =
    resolvedSearch?.type === "drop" ? "drop" : "experience";

  const item = {
    type,
    id: "1",
    title:
      type === "experience"
        ? "Dinner with Virat Kohli"
        : "Signed Virat Kohli Jersey",
    creatorName: "Virat Kohli",
    creatorHandle: "virat.kohli",
    creatorAvatar: "https://i.pravatar.cc/150?img=68",
    verified: true,
    category: "Sports",
    followers: 258_000_000,
    rating: 5.0,
    reviewCount: 0,
    currentBid: type === "experience" ? 25000 : 12000,
    startingBid: 5000,
    minIncrement: 1000,
    buyNowPrice: type === "experience" ? 75000 : 25000,
    totalBids: 12,
    reserveMet: true,
    endTime: new Date("2026-12-31T23:59:59"),
    pricingMode: "both" as const,
    story:
      type === "experience"
        ? "A once-in-a-lifetime opportunity to share an intimate dinner with Virat Kohli — one of cricket's greatest batsmen and a global icon. Enjoy a private three-course meal, hear untold stories, and get exclusive access."
        : "Own a rare, authenticated signed jersey from Virat Kohli. A premium collectible shipped securely to your home with full authenticity verification.",
    highlights:
      type === "experience"
        ? [
            "Private dinner with Virat Kohli",
            "1+1 guest access",
            "Live interaction + Q&A",
            "Professional photography",
            "Luxury venue experience",
          ]
        : [
            "Official signed jersey",
            "Verified authenticity certificate",
            "Limited edition collectible",
            "Secure packaging",
            "Home delivery included",
          ],
    deliverables:
      type === "experience"
        ? [
            { label: "Duration", detail: "3 Hours" },
            { label: "Guests", detail: "Winner + 1" },
            { label: "Photos", detail: "Professional Set" },
            { label: "Cuisine", detail: "Fine Dining" },
            { label: "Location", detail: "Mumbai, India" },
          ]
        : [
            { label: "Item", detail: "Signed Jersey" },
            { label: "Authentication", detail: "Verified Certificate" },
            { label: "Shipping", detail: "Included" },
            { label: "Condition", detail: "New" },
          ],
    tags: ["cricket", "sports", "dinner", "exclusive", "india", "celebrity", "once-in-a-lifetime"],
    faq: [
      {
        question: "How will the winner be contacted?",
        answer: "We reach out via email within 24 hours of auction close to coordinate all logistics.",
      },
      {
        question: "Can the experience be gifted?",
        answer: "Yes. The winner may transfer the experience to another person — just notify us at least 7 days in advance.",
      },
      {
        question: "What if dates need to change?",
        answer: "Fully reschedulable within 18 months at no cost if either party needs to adjust.",
      },
    ],
  };

  const isExperience = item.type === "experience";
  const safeId = (resolvedParams?.id ?? "NA").toUpperCase();

  const bidPanelProps = {
    currentBid: item.currentBid,
    startingBid: item.startingBid,
    minIncrement: item.minIncrement,
    totalBids: item.totalBids,
    currency: "INR" as const,
    reserveMet: item.reserveMet,
    onBid: handleBid,
    isWatchlisted: false,
    type: item.type,
  };

  const liveChatProps = {
    messages: MOCK_CHAT,
    currentUserName: "You",
    currency: "INR" as const,
    viewerCount: 3_847,
    onSend: (text: string) => console.log("Chat:", text),
  };

  return (
    <>
      <style>{`
        .bp-root {
          min-height: 100vh;
          background: #080808;
        }

        .bp-inner {
          max-width: 1360px;
          margin: 0 auto;
          padding: 16px;
        }

        .bp-col-left {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Desktop right column hidden on mobile */
        .bp-col-right {
          display: none;
        }

        /*
         * Mobile extras sit outside bp-inner (below the grid on desktop).
         * LiveChat has its own height: 480px — no extra wrapper needed.
         */
        .bp-mobile-extras {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 0 16px 32px;
        }

        @media (min-width: 1024px) {
          .bp-inner {
            padding: 32px 32px 48px;
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 28px;
            align-items: start;
          }

          .bp-col-left {
            gap: 20px;
            grid-column: 1;
            grid-row: 1;
          }

          /*
           * THE FIX: no max-height, no overflow-y, no height constraints here.
           * LiveChat already has height: 480px on its own .live-chat root.
           * Any overflow clipping on this ancestor was hiding it entirely.
           */
          .bp-col-right {
            display: flex;
            flex-direction: column;
            gap: 16px;
            grid-column: 2;
            grid-row: 1;
          }

          .bp-mobile-extras {
            display: none;
          }
        }
      `}</style>

      <div className="bp-root">
        <div className="bp-inner">

          {/* ── LEFT / main column ── */}
          <div className="bp-col-left">
            <MediaCarousel media={MOCK_MEDIA} title={item.title} />

            {isExperience ? (
              <>
                <CreatorHeader
                  name={item.creatorName}
                  handle={item.creatorHandle}
                  avatar={item.creatorAvatar}
                  verified={item.verified}
                  category="Experience"
                  followers={item.followers}
                  rating={item.rating}
                  reviewCount={item.reviewCount}
                  listingTitle={item.title}
                  listingId={`#EXP-${safeId}`}
                  endTime={item.endTime}
                  isFollowing={false}
                  type={item.type}
                />
                <ExperienceStorySection
                  description={item.story}
                  highlights={item.highlights}
                  deliverables={item.deliverables}
                  tags={[...item.tags, "experience"]}
                  faq={item.faq}
                />
              </>
            ) : (
              <>
                <CreatorHeader
                  name={item.creatorName}
                  handle={item.creatorHandle}
                  avatar={item.creatorAvatar}
                  verified={item.verified}
                  category="Drop"
                  followers={item.followers}
                  rating={item.rating}
                  reviewCount={item.reviewCount}
                  listingTitle={item.title}
                  listingId={`#DROP-${safeId}`}
                  endTime={item.endTime}
                  isFollowing={false}
                  type={item.type}
                />
                <DropStorySection
                  type={item.type}
                  description={item.story}
                  highlights={item.highlights}
                  deliverables={item.deliverables}
                  tags={[...item.tags, "drop"]}
                  faq={item.faq.map(f => ({ q: f.question, a: f.answer }))}
                />
              </>
            )}
          </div>

          {/* ── RIGHT / sidebar — desktop only ── */}
          <aside className="bp-col-right">
            <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
              <BidPanel {...bidPanelProps} />
            </div>
            <Leaderboard entries={MOCK_LEADERBOARD} currency="INR" maxVisible={5} />
            {/* Render LiveChat directly — it owns its height: 480px internally */}
            <LiveChat {...liveChatProps} />
          </aside>

        </div>

        {/* ── Mobile-only extras ── */}
        <div className="bp-mobile-extras">
          <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <BidPanel {...bidPanelProps} />
          </div>
          <Leaderboard entries={MOCK_LEADERBOARD} currency="INR" maxVisible={5} />
          {/* Same here — no wrapper, LiveChat manages its own height */}
          <LiveChat {...liveChatProps} />
        </div>
      </div>
    </>
  );
}