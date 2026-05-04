// src/components/profile/FanWins.tsx
import DropCard from "@/components/DropCard";
import ExperienceCard from "@/components/ExperienceCard";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

type Props = { wins: any[] };


export default function FanWins({ wins }: Props) {
  const router = useRouter();
  const data = wins || [];

  if (!wins) {
    return <div style={{ padding: 16 }}>Loading wins...</div>;
  }

  if (!data.length) {
    return <div style={{ padding: 16 }}>No wins yet</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.map((item) => (
        <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          <div className="profile-card-wrap" style={{ width: "100%" }}>
            {item.listing_type === "drop" ? (
              <DropCard
                drop={{
                  id: item.listing_id,
                  title: item.title || "Untitled",
                  description: "",
                  category: item.category || "collectible",
                  image: item.image || "",
                  edition: "1/1",
                  creatorName: item.creator || "",
                  creatorAvatar: item.image || "",
                  currentBid: item.winning_bid || 0,
                  totalBids: 0,
                  endsIn: item.end_datetime || null,
                  buyNowPrice: item.winning_bid || 0,
                }}
              />
            ) : (
              <ExperienceCard
                experience={{
                  id: item.listing_id,
                  title: item.title || "Untitled",
                  description: "",
                  creatorId: item.listing_id,
                  creatorName: item.creator || "",
                  creatorAvatar: item.image || "",
                  image: item.image || "",
                  category: item.category || "general",
                  location: "",
                  date: item.start_datetime || null,
                  duration: "",
                  pricingMode: "auction",
                  tags: [],
                  capacity: 0,
                  spotsLeft: 0,
                  buyNowPrice: item.winning_bid || 0,
                  currentBid: item.winning_bid || 0,
                  endsIn: item.end_datetime || null,
                }}
              />
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", padding: "0 4px" }}>
            <Button
              variant="outline"
              style={{ width: "100%", padding: "12px", border: "1px solid #000", background: "#fff", display: "block" }}
              disabled={!item?.id}
              onClick={() => {
                if (!item?.id) {
                  console.error("Missing ORDER ID", item);
                  return;
                }

                console.log("NAVIGATING WITH ORDER ID:", item.id);

                if (item.listing_type === "drop") {
                  router.push(`/winner/drops/${item.listing_id}`);
                } else {
                  router.push(`/winner/experiences/${item.id}`);
                }
              }}
            >
              Manage Order
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}