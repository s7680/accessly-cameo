"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DropCard from "@/components/DropCard";
import { getDrops } from "@/lib/db/listings";

const ALL_LABEL = "All";
const categories = [ALL_LABEL, "Autographs", "Sports", "Bollywood", "Politics", "Collectibles"];

const DropsPage = () => {
  const [active, setActive]                 = useState(ALL_LABEL);
  const [showUrgent, setShowUrgent]         = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [sidebarSearch, setSidebarSearch]   = useState("");
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
    const matchUrgent = !showUrgent || new Date(d.end_datetime).getTime() - Date.now() <= 21600000;

    const matchLot =
      lotType === "all" ||
      (lotType === "auction" && d.pricing_mode === "bid") ||
      (lotType === "buyNow" &&
        (d.pricing_mode === "fixed" || d.pricing_mode === "hybrid"));

    return matchCat && matchUrgent && matchLot;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "ending_soon")  return new Date(a.end_datetime).getTime() - new Date(b.end_datetime).getTime();
    if (sort === "highest_bids") return (b.starting_bid || 0) - (a.starting_bid || 0);
    if (sort === "newest")       return parseInt(b.id) - parseInt(a.id);
    return 0;
  });

  const clearAll = () => { setActive(ALL_LABEL); setShowUrgent(false); };

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
            <select
              className="vp-dropdown"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="ending_soon">Ending Soon</option>
              <option value="highest_bids">Highest Bids</option>
              <option value="newest">Newest</option>
            </select>
            <button
              className="vp-filter-btn"
              onClick={() => setFiltersVisible((v) => !v)}
            >
              <span className="vp-filter-icon">⚙</span>
              {filtersVisible ? "Hide Filters" : "Show Filters"}
            </button>
            <button
              className={`vp-delivery-btn ${showUrgent ? "vp-delivery-btn--active" : ""}`}
              onClick={() => setShowUrgent((v) => !v)}
            >
              Ending &lt; 6h
            </button>
          </div>
          <div className="vp-control-bar__right">
            <button className="vp-clear-btn" onClick={clearAll}>Clear all</button>
          </div>
        </div>

        {/* Main layout */}
        <div className="vp-layout">

          {/* Grid */}
          <div className="vp-main w-full">
            <div className="drops-grid">
              {sorted.map((drop) => (
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
                    pricingMode: (
                      drop.pricing_mode === "Bid"
                        ? "bid"
                        : drop.pricing_mode === "buyNow"
                        ? "fixed"
                        : drop.pricing_mode === "Both"
                        ? "hybrid"
                        : "bid"
                    ) as "bid" | "fixed" | "hybrid",
                    totalBids: 0,
                    endsIn: drop.end_datetime,
                    image: drop.display_image,
                    description: drop.product_details || "",
                    edition: "1 of 1",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          {filtersVisible && (
            <aside className="vp-sidebar">
              <div className="vp-sidebar-header">
                <h3 className="vp-sidebar-title">
                  Filters
                  {(active !== ALL_LABEL || showUrgent) && (
                    <span className="vp-filter-badge">
                      {(active !== ALL_LABEL ? 1 : 0) + (showUrgent ? 1 : 0)}
                    </span>
                  )}
                </h3>
                <button className="vp-clear-btn" onClick={clearAll}>Clear all</button>
              </div>

              <div className="vp-sidebar-section">
                <div className="vp-sidebar-section-header">
                  <span className="vp-sidebar-section-title">Category</span>
                  <span className="vp-sidebar-section-value">
                    {active !== ALL_LABEL ? active : ""}
                  </span>
                  <span className="vp-sidebar-chevron">∧</span>
                </div>
                {active !== ALL_LABEL && (
                  <p className="vp-sidebar-active-cat">{active}</p>
                )}
                <button className="vp-see-all-btn" onClick={() => setActive(ALL_LABEL)}>
                  See all categories
                </button>
              </div>

              <div className="vp-sidebar-search-wrap">
                <span className="vp-search-icon">🔍</span>
                <input
                  type="text"
                  className="vp-sidebar-search"
                  placeholder="Search"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                />
              </div>

              <ul className="vp-sidebar-list">
                {categories
                  .filter((cat) => cat !== ALL_LABEL)
                  .filter((cat) => cat.toLowerCase().includes(sidebarSearch.toLowerCase()))
                  .map((cat) => (
                    <li key={cat} className="vp-sidebar-list-item">
                      <label className="vp-sidebar-check-label">
                        <span className="vp-sidebar-cat-name">{cat}</span>
                        <span className="vp-sidebar-cat-count">
                          ({categoryCounts[cat]?.toLocaleString()})
                        </span>
                      </label>
                      <input
                        type="checkbox"
                        className="vp-sidebar-checkbox"
                        checked={active === cat}
                        onChange={() => setActive(active === cat ? ALL_LABEL : cat)}
                      />
                    </li>
                  ))}
              </ul>
            </aside>
          )}
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