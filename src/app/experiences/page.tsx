"use client";

import { useState, useEffect } from "react";
import ExperienceCard from "@/components/ExperienceCard";
import { getExperiences } from "@/lib/db/listings";

const ALL_LABEL = "All";
const categories = [ALL_LABEL, "Meet & Greet", "Dinner", "Sports Experience", "Bollywood Experience", "Politics Interaction"];


// ── Page ───────────────────────────────────────────────────────────────────────
export default function ExperiencesPage() {
  const [active, setActive]                 = useState(ALL_LABEL);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [sidebarSearch, setSidebarSearch]   = useState("");
  const [sort, setSort]                     = useState("upcoming");
  const [lotType, setLotType] = useState<"all" | "auction" | "buyNow">("all");
  const [allExperiences, setAllExperiences] = useState<any[]>([]);

  useEffect(() => {
    async function loadExperiences() {
      const data = await getExperiences();
      setAllExperiences(data);
    }
    loadExperiences();
  }, []);

  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] =
      cat === ALL_LABEL
        ? allExperiences.length
        : allExperiences.filter((e) => e.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = allExperiences.filter((e) => {
    const matchCat = active === ALL_LABEL || e.category === active;

    const matchLot =
      lotType === "all" ||
      (lotType === "auction" && !e.fixed_price) ||
      (lotType === "buyNow" && !!e.fixed_price);

    return matchCat && matchLot;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "upcoming")       return new Date(a.experience_date || a.start_date).getTime() - new Date(b.experience_date || b.start_date).getTime();
    if (sort === "popular")        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sort === "price_low")      return (a.fixed_price || 0) - (b.fixed_price || 0);
    if (sort === "price_high")     return (b.fixed_price || 0) - (a.fixed_price || 0);
    return 0;
  });

  const clearAll = () => setActive(ALL_LABEL);

  return (
    <div className="vp-root">
      <div className="vp-container mx-auto max-w-7xl">

        {/* Page title */}
        <h1 className="vp-title">
          {active === ALL_LABEL ? "Experiences" : active}
        </h1>

        {/* Explore row */}
        <div className="vp-explore-header">
          <span className="vp-explore-label">Explore</span>
          <div className="vp-explore-arrows">
            <button className="vp-arrow-btn" aria-label="Previous">&#8249;</button>
            <button className="vp-arrow-btn" aria-label="Next">&#8250;</button>
          </div>
        </div>

        {/* Category scroll */}
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
              <div className="vp-category-avatar" style={{ width: "90px", height: "90px" }}>
                <img
                  src={`https://picsum.photos/seed/${cat}/100`}
                  alt={cat}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                />
              </div>
              <span className="vp-category-label">{cat}</span>
            </button>
          ))}
        </div>

        <div style={{ marginBottom: "16px" }}>
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
            <span className="vp-result-count" style={{ marginRight: "16px" }}>
              {sorted.length.toLocaleString()} results
            </span>
            <select
              className="vp-dropdown"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="upcoming">Upcoming</option>
              <option value="popular">Popular</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
            <button
              className="vp-filter-btn"
              onClick={() => setFiltersVisible((v) => !v)}
            >
              <span className="vp-filter-icon">⚙</span>
              {filtersVisible ? "Hide Filters" : "Show Filters"}
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
            <div className="experiences-grid">
              {sorted.map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  experience={{
                    id: exp.id,
                    title: exp.display_name,
                    description: exp.about_experience || "",
                    date: exp.experience_date || exp.start_date || null,
                    duration: exp.duration ? `${exp.duration} mins` : "",
                    category: exp.category,
                    image: exp.display_image,


                    creatorName: exp.display_name,
                    creatorAvatar: exp.display_image || "",
                    creatorId: exp.creator_id,
                    location: exp.location,
                    pricingMode:
                      exp.pricing_mode === "bid"
                        ? "auction"
                        : exp.pricing_mode === "fixed"
                        ? "buyNow"
                        : exp.pricing_mode === "hybrid"
                        ? "both"
                        : "buyNow",
                    capacity: exp.guests,
                    spotsLeft: exp.guests,
                    buyNowPrice: exp.fixed_price || 0,
                    currentBid: null,
                    endsIn: null,
                    tags: [exp.category],
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
                  {active !== ALL_LABEL && (
                    <span className="vp-filter-badge">1</span>
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
}