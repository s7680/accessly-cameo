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
  const data = bids && bids.length ? bids : dummyBids;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.map((bid) => (
        <div key={bid.id} className="profile-card-wrap">
          {bid.type === "drop" ? (
            <DropCard
              drop={{
                id: bid.id,
                title: bid.title,
                description: "",
                category: "collectible",
                image: bid.image,
                edition: "1/1",
                creatorName: bid.creator,
                creatorAvatar: bid.image,
                currentBid: bid.currentBid,
                totalBids: 5,
                endsIn: new Date(Date.now() + 86400000).toISOString(),
                buyNowPrice: bid.currentBid,
              }}
            />
          ) : (
            <ExperienceCard
              experience={{
                id: bid.id,
                title: bid.title,
                description: "",
                creatorId: bid.id,
                creatorName: bid.creator,
                creatorAvatar: bid.image,
                image: bid.image,
                category: "general",
                location: "Mumbai",
                date: new Date().toISOString(),
                duration: "2 hours",
                pricingMode: "buyNow",
                tags: ["exclusive"],
                capacity: 10,
                spotsLeft: 5,
                buyNowPrice: bid.currentBid,
                currentBid: bid.currentBid,
                endsIn: new Date(Date.now() + 86400000).toISOString(),
              }}
            />
          )}
          <div style={{ marginTop: 8, fontWeight: 600 }}>
            Your Bid: ₹{bid.yourBid}
          </div>
        </div>
      ))}
    </div>
  );
}