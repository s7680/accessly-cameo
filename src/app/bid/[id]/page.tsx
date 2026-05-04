"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { getDropById, getExperiences } from "@/lib/db/listings";

import MediaCarousel from "@/components/bid/MediaCarousel";
import CreatorHeader from "@/components/bid/CreatorHeader";
import ExperienceDetails from "@/components/bid/ExperienceDetails";
import DropStorySection from "@/components/bid/DropStorySection";
import DropDetails from "@/components/bid/DropDetails";
import BidPanel from "@/components/bid/BidPanel";
import Leaderboard from "@/components/bid/Leaderboard";
import LiveChat from "@/components/bid/LiveChat";
import type { BidEntry } from "@/components/bid/Leaderboard";
import type { ChatMessage } from "@/components/bid/LiveChat";
import { fetchMessages, sendMessage, subscribeToChat } from "@/lib/db/chat";
import { placeBid, getHighestBid, subscribeToBids, getLeaderboard } from "@/lib/db/bids";




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

  const initialMessages: ChatMessage[] = [];
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    if (!data?.id) return;

    async function loadMessages() {
      const msgs = await fetchMessages(data.id, type);
      setMessages(msgs);
    }

    loadMessages();

    const unsubscribe = subscribeToChat(data.id, type, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => unsubscribe();
  }, [data?.id, type]);

  const [currentBid, setCurrentBid] = useState<number>(data?.starting_bid || 0);
  const [leaderboard, setLeaderboard] = useState<BidEntry[]>([]);

  useEffect(() => {
    if (!data?.id) return;
    (async () => {
      const highest = await getHighestBid(data.id, type);
      setCurrentBid(highest || data.starting_bid || 0);
    })();
  }, [data?.id, type]);

useEffect(() => {
  if (!data?.id) return;

  const unsubscribe = subscribeToBids(data.id, type, (b) => {
    setCurrentBid((prev) => Math.max(prev, b.amount));

    // handle async separately
    (async () => {
      const lb = await getLeaderboard(data.id, type);
      setLeaderboard(lb);
    })();
  });

  return () => {
    unsubscribe();
  };
}, [data?.id, type]);

  useEffect(() => {
    if (!data?.id) return;

    async function loadLeaderboard() {
      const lb = await getLeaderboard(data.id, type);
      setLeaderboard(lb);
    }

    loadLeaderboard();
  }, [data?.id, type]);

  if (!data) return <div style={{ padding: 40 }}>Loading...</div>;

  const isExperience = type === "experience";
  const safeId = (resolvedParams?.id ?? "NA").toUpperCase();

  const faqEntries: { question: string; answer: string }[] =
    Object.entries(data.faq || {}).map(([q, a]) => ({
      question: String(q),
      answer: String(a ?? ""),
    }));

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

    startTime: data.start_datetime ? new Date(data.start_datetime) : null,
    endTime: data.end_datetime ? new Date(data.end_datetime) : null,
    currentBid: currentBid,
    startingBid: data.starting_bid || 0,
    minIncrement: 1000,
    buyNowPrice: data.fixed_price || 0,
    totalBids: 0,
    reserveMet: false,

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
    faq: faqEntries,
  };

  const bidPanelProps = {
    currentBid: currentBid,
    startingBid: item.startingBid,
    minIncrement: item.minIncrement,
    totalBids: item.totalBids,
    // startTime={item.startTime},  <-- REMOVED
    // endTime={item.endTime},      <-- REMOVED
    currency: "INR" as const,
    reserveMet: item.reserveMet,
    onBid: async (amount: number) => {
      await placeBid(data.id, type, amount);
      const latest = await getHighestBid(data.id, type);
      setCurrentBid(latest);
    },
    isWatchlisted: false,
    type: item.type,
  };


  const liveChatProps = {
    messages,
    currentUserName: "You",
    currency: "INR" as const,
    viewerCount: 3847,
    onSend: async (text: string) => {
      await sendMessage(data.id, type, text);
    },
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
                  name={data.display_name}
                  handle=""
                  avatar={data.display_image}
                  verified={item.verified}
                  category="Experience"
                  followers={item.followers}
                  rating={item.rating}
                  reviewCount={item.reviewCount}
                  listingTitle={item.title}
                  listingId={`#EXP-${safeId}`}
                  isFollowing={false}
                  type={item.type}
                />
                <ExperienceDetails
                  name={data.display_name}
                  story={data.about_experience}
                  date={data.experience_date || data.start_datetime}
                  duration={data.duration ? `${data.duration} mins` : ""}
                  location={data.location}
                  benefits={data.fan_benefits}
                  capacity={data.guests}
                  cuisine={data.cuisine}
                  photosIncluded={data.photos_included}
                  autographIncluded={data.autograph_included}
                  instagramLink={data.instagram_link}
                  pricingMode={data.pricing_mode}
                  startingBid={data.starting_bid}
                  fixedPrice={data.fixed_price}
                  faq={data.faq}
                />
              </>
            ) : (
              <>
                <CreatorHeader
                  name={data.creator?.name}
                  handle=""
                  avatar={data.creator?.avatar}
                  verified={item.verified}
                  category="Drop"
                  followers={item.followers}
                  rating={item.rating}
                  reviewCount={item.reviewCount}
                  listingTitle={item.title}
                  listingId={`#DROP-${safeId}`}
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
            <BidPanel {...bidPanelProps} />
            <Leaderboard entries={leaderboard} currency="INR" maxVisible={5} />
            {/* Render LiveChat directly — it owns its height: 480px internally */}
            <LiveChat {...liveChatProps} />
          </aside>

        </div>

        {/* ── Mobile-only extras ── */}
        <div className="bp-mobile-extras">
          <BidPanel {...bidPanelProps} />
          <Leaderboard entries={leaderboard} currency="INR" maxVisible={5} />
          {/* Same here — no wrapper, LiveChat manages its own height */}
          <LiveChat {...liveChatProps} />
        </div>
      </div>
    </>
  );
}