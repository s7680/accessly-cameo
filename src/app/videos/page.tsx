"use client";

import { useState } from "react";
import { useEffect } from "react";
import CreatorCard from "@/components/CreatorCard";
import { getCreatorCards } from "@/lib/db/videos";

const ALL_LABEL = "All";


export default function VideosPage() {
  const [active, setActive] = useState(ALL_LABEL);
  const [show24hr, setShow24hr] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState("");

  const [creators, setCreators] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCreatorCards();

        const withFallback = data.map((c: any) => ({
          ...c,
          display_image: c.display_image || "https://via.placeholder.com/300?text=No+Image",
        }));

        setCreators(withFallback);
      } catch (err) {
        console.log(err);
      }
    }
    load();
  }, []);

  const categories: string[] = [
    ALL_LABEL,
    ...Array.from(new Set(creators.map((c) => c.category).filter(Boolean))) as string[],
  ];

  // Category counts helper
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = cat === ALL_LABEL
      ? creators.length
      : creators.filter((c) => c.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = creators.filter((c) => {
    const matchCat = active === ALL_LABEL || c.category === active;
    const match24hr = !show24hr || (c.deliveryHours ?? Infinity) <= 24;
    return matchCat && match24hr;
  });

  return (
    <div className="vp-root">
      <div className="vp-container mx-auto max-w-7xl">

        {/* Page title */}
        <h1 className="vp-title">
          {active === ALL_LABEL ? "All Creators" : active}
        </h1>

        {/* Explore row */}
        <div className="vp-explore-header">
          <span className="vp-explore-label">
            {categories.length <= 1 ? "Browse" : "Explore"}
          </span>
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
              <div className="vp-category-avatar">
                <img
                  src={
                    cat === ALL_LABEL
                      ? "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop"
                      : creators.find((c) => c.category === cat)?.display_image ||
                        "https://ui-avatars.com/api/?name=" + encodeURIComponent(cat) + "&background=1e1e1e&color=aaa&size=200"
                  }
                  alt={cat}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                />
              </div>
              <span className="vp-category-label">{cat}</span>
            </button>
          ))}
        </div>

        {/* Control bar */}
        <div className="vp-control-bar">
          <div className="vp-control-bar__left">
            <span className="vp-result-count">
              {filtered.length.toLocaleString()} results
            </span>
            <select className="vp-dropdown" defaultValue="featured">
              <option value="featured">Featured</option>
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
            <button
              className={`vp-delivery-btn ${show24hr ? "vp-delivery-btn--active" : ""}`}
              onClick={() => setShow24hr((v) => !v)}
            >
            </button>
          </div>
          <div className="vp-control-bar__right">
            <button
              className="vp-clear-btn"
              onClick={() => { setActive(ALL_LABEL); setShow24hr(false); }}
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="vp-layout">
          {/* Grid */}
          <div className="vp-main w-full">
            <div
              className="vp-grid"
            >
              {filtered.map((creator) => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  href={`/videos/${creator.id}`}
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
                  {(active !== ALL_LABEL || show24hr) && (
                    <span className="vp-filter-badge">
                      {(active !== ALL_LABEL ? 1 : 0) + (show24hr ? 1 : 0)}
                    </span>
                  )}
                </h3>
                <button
                  className="vp-clear-btn"
                  onClick={() => { setActive(ALL_LABEL); setShow24hr(false); }}
                >
                  Clear all
                </button>
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
                <button
                  className="vp-see-all-btn"
                  onClick={() => setActive(ALL_LABEL)}
                >
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
                  .filter((cat) =>
                    cat.toLowerCase().includes(sidebarSearch.toLowerCase())
                  )
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