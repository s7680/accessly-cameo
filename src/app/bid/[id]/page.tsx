"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { getDropById, getExperiences } from "@/lib/db/listings";

import MediaCarousel from "@/components/bid/MediaCarousel";
import CreatorHeader from "@/components/bid/CreatorHeader";
import ExperienceStorySection from "@/components/bid/ExperienceStorySection";
import DropStorySection from "@/components/bid/DropStorySection";
import DropDetails from "@/components/bid/DropDetails";
import BidPanel from "@/components/bid/BidPanel";
import Leaderboard from "@/components/bid/Leaderboard";
import LiveChat from "@/components/bid/LiveChat";
import type { BidEntry } from "@/components/bid/Leaderboard";
import type { ChatMessage } from "@/components/bid/LiveChat";


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

  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      if (type === "drop") {
        const drop = await getDropById(resolvedParams?.id);
        setData(drop);
      } else {
        const exps = await getExperiences();
        const found = exps.find((e: any) => e.id === resolvedParams?.id);
        setData(found);
      }
    }
    load();
  }, [resolvedParams?.id, type]);

  if (!data) return <div style={{ padding: 40 }}>Loading...</div>;

  const isExperience = type === "experience";
  const safeId = (resolvedParams?.id ?? "NA").toUpperCase();

  const item = {
    type,
    id: data.id,
    title: data.item_name,
    creatorName: data.creator?.name,
    creatorHandle: data.creator?.instagram,
    creatorAvatar: data.creator?.avatar,
    verified: true,
    category: data.category,
    followers: 0,
    rating: 0,
    reviewCount: 0,

    currentBid: data.starting_bid || 0,
    startingBid: data.starting_bid || 0,
    minIncrement: 1000,
    buyNowPrice: data.fixed_price || 0,
    totalBids: 0,
    reserveMet: false,

    endTime: data.end_datetime ? new Date(data.end_datetime) : null,
    pricingMode: data.pricing_mode || "both",

    story: data.story || data.product_details || "",
    highlights: [
      data.condition && `Condition: ${data.condition}`,
      data.authenticity && `Authenticity: ${data.authenticity}`,
      data.shipping_details && `Shipping: ${data.shipping_details}`,
    ].filter(Boolean),

    deliverables: [
      { label: "Condition", detail: data.condition || "-" },
      { label: "Authenticity", detail: data.authenticity || "-" },
      { label: "Shipping", detail: data.shipping_details || "-" },
    ],

    tags: ["drop"],
    faq: Object.entries(data.faq || {}).map(
      ([q, a]: [string, any]) => ({
        question: q,
        answer: String(a ?? ""),
      })
    ),
  };

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
            <MediaCarousel
              media={(data.media || [])
                .map((m: any) => ({
                  type: m.type || "image",
                  src: m.src || m.url || null,
                  alt: m.alt || item.title,
                  thumbnail: m.thumbnail || m.src || m.url || null,
                }))
                .filter((m: any) => m.src)}
              title={item.title}
            />

            {isExperience ? (
              <>
                <CreatorHeader
                  name={item.creatorName}
                  handle={data.creator?.instagram || ""}
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
                  name={data.creator?.name}
                  handle={data.creator?.instagram || ""}
                  avatar={data.creator?.avatar}
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
                <DropDetails
                  itemName={data.item_name}
                  category={data.category}
                  createdAt={data.created_at}

                  story={data.story}
                  instagramLink={data.instagram_link}

                  pricingMode={data.pricing_mode}
                  startDateTime={data.start_datetime}
                  endDateTime={data.end_datetime}
                  startingBid={data.starting_bid}
                  fixedPrice={data.fixed_price}

                  condition={data.condition}
                  productDetails={data.product_details}
                  shippingDetails={data.shipping_details}
                  authenticity={data.authenticity}

                  faq={data.faq}
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