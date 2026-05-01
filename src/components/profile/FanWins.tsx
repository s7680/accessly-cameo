// src/components/profile/FanWins.tsx
import DropCard from "@/components/DropCard";
import ExperienceCard from "@/components/ExperienceCard";
import Button from "@/components/ui/Button";

type Props = { wins: any[] };

const dummyWins = [
  {
    id: "1",
    type: "drop",
    title: "Signed Cricket Bat",
    image: "/bat.jpg",
    creator: "MS Dhoni",
    finalPrice: 18000,
  },
  {
    id: "2",
    type: "experience",
    title: "Dinner with Virat Kohli",
    image: "/experience.jpg",
    creator: "Virat Kohli",
    finalPrice: 32000,
  },
];

export default function FanWins({ wins }: Props) {
  const data = wins && wins.length ? wins : dummyWins;
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
                currentBid: item.finalPrice,
                totalBids: 5,
                endsIn: new Date(Date.now() - 86400000).toISOString(),
                buyNowPrice: item.finalPrice,
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
                spotsLeft: 0,
                buyNowPrice: item.finalPrice,
                currentBid: item.finalPrice,
                endsIn: new Date(Date.now() - 86400000).toISOString(),
              }}
            />
          )}
          <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#4caf50", fontWeight: 600 }}>● Won</span>
            <Button variant="outline">Manage Order</Button>
          </div>
        </div>
      ))}
    </div>
  );
}