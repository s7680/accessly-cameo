// src/components/profile/CreatorListings.tsx
import DropCard from "@/components/DropCard";
import ExperienceCard from "@/components/ExperienceCard";
import { useRouter } from "next/navigation";

type Props = { listings: any[] };

export default function CreatorListings({ listings }: Props) {
  const router = useRouter();
  const data = listings || [];
  const drops = data.filter((item) => item.type === "drop" || item.type === "drops");
  const experiences = data.filter((item) => item.type === "experience" || item.type === "experiences");

  return (
    <div>

      {/* DROPS SECTION */}
      {drops.length > 0 && (
        <>
          <h2 style={{ margin: "16px 0" }}>Drops</h2>
          <div className="creator-grid" data-count={drops.length}>
            {drops.map((item) => (
              <div key={item.id} className="profile-card-wrap" style={{ width: "100%" }}>
                <DropCard
                  drop={{
                    id: item.id,
                    title: item.item_name,
                    description: item.story || "",
                    category: item.category,
                    image: item.display_image,
                    edition: "1/1",
                    creatorName: item.display_name,
                    creatorAvatar: item.display_image,
                    currentBid: item.current_bid || 0,
                    totalBids: item.total_bids || 0,
                    endsIn: item.end_datetime,
                    buyNowPrice: item.fixed_price,
                  }}
                />
                <button
                  style={{
                    marginTop: 8,
                    padding: "8px 12px",
                    width: "100%",
                    background: "#111",
                    color: "#fff",
                    border: "1px solid #333",
                    cursor: "pointer",
                  }}
                  onClick={() => router.push(`/seller/drop/${encodeURIComponent(String(item.id))}`)}
                >
                  Manage Order
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* EXPERIENCES SECTION */}
      {experiences.length > 0 && (
        <>
          <h2 style={{ margin: "24px 0 16px" }}>Experiences</h2>
          <div className="creator-grid" data-count={experiences.length}>
            {experiences.map((item) => (
              <div key={item.id} className="profile-card-wrap" style={{ width: "100%" }}>
                <ExperienceCard
                  experience={{
                    id: item.id,
                    title: item.display_name,
                    description: item.story || "",
                    creatorId: item.creator_id,
                    creatorName: item.display_name,
                    creatorAvatar: item.avatar_url || item.display_image,
                    image: item.display_image,
                    category: item.category,
                    location: item.location || "",
                    date: item.start_datetime,
                    duration: item.duration || "",
                    pricingMode:
                      item.pricing_mode === "bid" ? "auction" :
                      item.pricing_mode === "fixed" ? "buyNow" :
                      "both",
                    tags: [],
                    capacity: item.guests || 0,
                    spotsLeft: item.guests || 0,
                    buyNowPrice: item.fixed_price,
                    currentBid: item.current_bid || 0,
                    endsIn: item.end_datetime,
                  }}
                />
                <button
                  style={{
                    marginTop: 8,
                    padding: "8px 12px",
                    width: "100%",
                    background: "#111",
                    color: "#fff",
                    border: "1px solid #333",
                    cursor: "pointer",
                  }}
                  onClick={() => router.push(`/seller/experience/${encodeURIComponent(String(item.id))}`)}
                >
                  Manage Order
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        .creator-grid {
          display: grid;
          gap: 24px;
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          grid-template-columns: 1fr;
          align-items: stretch;
          justify-items: stretch;
        }

        .profile-card-wrap {
          width: 100%;
        }

        .profile-card-wrap > * {
          width: 100% !important;
        }

        @media (min-width: 1024px) {
          .creator-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}