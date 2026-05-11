"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DropCard from "@/components/DropCard";
import SkeletonCard from "@/components/SkeletonCard";
import { getDrops } from "@/lib/db/listings";

const ALL_LABEL = "All";
const categories = [ALL_LABEL, "Autographs", "Sports", "Bollywood", "Politics", "Collectibles"];

const DropsPage = () => {
  const [active, setActive]                 = useState(ALL_LABEL);
  const [sort, setSort]                     = useState("ending_soon");
  const [lotType, setLotType] = useState<"all" | "auction" | "buyNow">("all");
  const router = useRouter();
  const [allDrops, setAllDrops] = useState<any[]>([]);

  useEffect(() => {
    async function loadDrops() {
      const data = await getDrops();
      setAllDrops(data);
    }
    loadDrops();
  }, []);

  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] =
      cat === ALL_LABEL
        ? allDrops.length
        : allDrops.filter((d) => d.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = allDrops.filter((d) => {
    const matchCat    = active === ALL_LABEL || d.category === active;

    const matchLot =
      lotType === "all" ||
      (lotType === "auction" && d.pricing_mode === "bid") ||
      (lotType === "buyNow" &&
        (d.pricing_mode === "fixed" || d.pricing_mode === "hybrid"));

    return matchCat && matchLot;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "ending_soon")  return new Date(a.end_datetime).getTime() - new Date(b.end_datetime).getTime();
    if (sort === "highest_bids") return (b.starting_bid || 0) - (a.starting_bid || 0);
    if (sort === "newest")       return parseInt(b.id) - parseInt(a.id);
    return 0;
  });

  const clearAll = () => { setActive(ALL_LABEL); };

  return (
    <div className="vp-root">
      <div className="vp-container mx-auto max-w-7xl">

        {/* Page title */}
        <h1 className="vp-title">
          {active === ALL_LABEL ? "Drops" : active}
        </h1>

        {/* Explore row */}
        <div className="vp-explore-header">
          <span className="vp-explore-label">Explore</span>
          <div className="vp-explore-arrows">
            <button className="vp-arrow-btn" aria-label="Previous">&#8249;</button>
            <button className="vp-arrow-btn" aria-label="Next">&#8250;</button>
          </div>
        </div>

        {/* Category scroll — identical markup, drop-specific seeds */}
        <div
          className="vp-category-scroll"
          role="group"
          aria-label="Filter by category"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              className={`vp-category-item ${active === cat ? "vp-category-item--active" : ""}`}
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
            >
              <div className="vp-category-avatar">
                <img
                  src={`https://picsum.photos/seed/${cat}/300`}
                  alt={cat}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                />
              </div>
              <span className="vp-category-label">{cat}</span>
            </button>
          ))}
        </div>

        <div>
          {/* Lot Type Filter */}
          <div className="lot-filter">
            <button
              className={lotType === "auction" ? "active" : ""}
              onClick={() => setLotType("auction")}
            >
              Auction
            </button>
            <button
              className={lotType === "buyNow" ? "active" : ""}
              onClick={() => setLotType("buyNow")}
            >
              Buy Now
            </button>
            <button
              className={lotType === "all" ? "active" : ""}
              onClick={() => setLotType("all")}
            >
              All
            </button>
          </div>
        </div>

        {/* Control bar */}
        <div className="vp-control-bar">
          <div className="vp-control-bar__left">
            <span className="vp-result-count">
              {sorted.length.toLocaleString()} results
            </span>
          </div>
          <div className="vp-control-bar__right"></div>
        </div>

        {/* Main layout */}
        <div className="vp-layout">

          {/* Grid */}
          <div className="vp-main w-full">
            <div className="drops-grid">
              {allDrops.length === 0
                ? [1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)
                : sorted.map((drop) => (
                  <DropCard
                    key={drop.id}
                    drop={{
                      id: drop.id,
                      title: drop.item_name,
                      creatorName: drop.display_name,
                      creatorAvatar: drop.display_image || "",
                      category: drop.category,
                      currentBid: drop.starting_bid || 0,
                      buyNowPrice: drop.fixed_price || null,
                      pricing_mode: drop.pricing_mode,
                      totalBids: 0,
                      endsIn: drop.end_datetime,
                      image: drop.display_image,
                      description: drop.product_details || "",
                      edition: "1 of 1",
                    } as any}
                  />
                ))
              }
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DropsPage;

// NOTE: To make the grid responsive, add CSS for `.drops-grid` in your CSS file, e.g.:
// @media (max-width: 900px) {
//   .drops-grid > div {
//     grid-template-columns: 1fr 1fr !important;
//   }
// }
// @media (max-width: 600px) {
//   .drops-grid > div {
//     grid-template-columns: 1fr !important;
//   }
// }