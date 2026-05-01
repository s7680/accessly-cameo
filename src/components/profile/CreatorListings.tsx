// src/components/profile/CreatorListings.tsx
import DropCard from "@/components/DropCard";
import ExperienceCard from "@/components/ExperienceCard";

type Props = { listings: any[] };

const dummyListings = [
  {
    id: "1",
    type: "drop",
    title: "Signed Cricket Bat",
    image: "/bat.jpg",
    creator: "MS Dhoni",
    currentBid: 15000,
    status: "Active",
  },
  {
    id: "2",
    type: "experience",
    title: "Dinner with Virat Kohli",
    image: "/experience.jpg",
    creator: "Virat Kohli",
    currentBid: 25000,
    status: "Ended",
    winner: "Suman",
    finalPrice: 32000,
  },
];

export default function CreatorListings({ listings }: Props) {
  const data = listings && listings.length ? listings : dummyListings;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.map((item) => (
        <div key={item.id} className="profile-card-wrap">
          {item.type === "drop" ? (
            <DropCard
              drop={{
                id: item.id,
                title: item.title,
                description: "",
                category: "collectible",
                image: item.image,
                edition: "1/1",
                creatorName: item.creator,
                creatorAvatar: item.image,
                currentBid: item.currentBid,
                totalBids: 5,
                endsIn: new Date(Date.now() + 86400000).toISOString(),
                buyNowPrice: item.currentBid,
              }}
            />
          ) : (
            <ExperienceCard
              experience={{
                id: item.id,
                title: item.title,
                description: "",
                creatorId: item.id,
                creatorName: item.creator,
                creatorAvatar: item.image,
                image: item.image,
                category: "general",
                location: "Mumbai",
                date: new Date().toISOString(),
                duration: "2 hours",
                pricingMode: "buyNow",
                tags: ["exclusive"],
                capacity: 10,
                spotsLeft: 5,
                buyNowPrice: item.currentBid,
                currentBid: item.currentBid,
                endsIn: new Date(Date.now() + 86400000).toISOString(),
              }}
            />
          )}
          <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                color: item.status === "Active" ? "#4caf50" : "#aaa",
                fontWeight: 600,
              }}
            >
              ● {item.status}
            </span>
            {item.winner && (
              <span style={{ fontSize: 14 }}>
                Winner: {item.winner} (₹{item.finalPrice})
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}