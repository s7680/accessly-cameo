// src/components/profile/FanBids.tsx
import DropCard from "@/components/DropCard";
import ExperienceCard from "@/components/ExperienceCard";


type Props = { bids: any[] };

const dummyBids = [
  {
    id: "1",
    type: "drop",
    title: "Signed Cricket Bat",
    image: "/bat.jpg",
    creator: "MS Dhoni",
    currentBid: 15000,
    yourBid: 16000,
  },
  {
    id: "2",
    type: "experience",
    title: "Dinner with Virat Kohli",
    image: "/experience.jpg",
    creator: "Virat Kohli",
    currentBid: 25000,
    yourBid: 26000,
  },
];

export default function FanBids({ bids }: Props) {
  const data = bids || [];
  if (!bids) {
    return <div style={{ padding: 16 }}>Loading bids...</div>;
  }

  if (!data.length) {
    return <div style={{ padding: 16 }}>No bids yet</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.map((bid) => (
        <div key={bid.id} className="profile-card-wrap">
          {bid.listing_type === "drop" ? (
              <DropCard
                drop={{
                  id: bid.listing_id || bid.id,
                  title: bid.title || "Untitled",
                  description: "",
                  category: bid.category || "collectible",
                  image: bid.image || "",
                  edition: "1/1",
                  creatorName: bid.creator || "",
                  creatorAvatar: bid.image || "",
                  currentBid: bid.highest_bid || 0,
                  totalBids: 0,
                  endsIn: bid.end_datetime || null,
                  buyNowPrice: bid.highest_bid,
                }}
              />
          ) : (
              <ExperienceCard
                experience={{
                  id: bid.listing_id || bid.id,
                  title: bid.title || "Untitled",
                  description: "",
                  creatorId: bid.listing_id,
                  creatorName: bid.creator || "",
                  creatorAvatar: bid.image || "",
                  image: bid.image || "",
                  category: bid.category || "general",
                  location: "",
                  date: bid.start_datetime || null,
                  duration: "",
                  pricingMode: "auction",
                  tags: [],
                  capacity: 0,
                  spotsLeft: 0,
                  buyNowPrice: bid.highest_bid,
                  currentBid: bid.highest_bid || 0,
                  endsIn: bid.end_datetime || null,
                }}
              />
          )}
          <div style={{ marginTop: 8, fontWeight: 600 }}>
            Your Bid: ₹{bid.amount || 0}
          </div>

          <div style={{ fontSize: 12, color: bid.isWinning ? "green" : "red" }}>
            {bid.isWinning ? "Winning" : "Outbid"} • Highest: ₹{bid.highest_bid || 0}
          </div>
        </div>
      ))}
    </div>
  );
}