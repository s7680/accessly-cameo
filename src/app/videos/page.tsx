"use client";

import { useState } from "react";
import { useEffect } from "react";
import CreatorCard from "@/components/CreatorCard";
import { getCreatorCards } from "@/lib/db/videos";

const ALL_LABEL = "All";


export default function VideosPage() {
  const [active, setActive] = useState(ALL_LABEL);

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
    return matchCat;
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
          </div>
          <div className="vp-control-bar__right">
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
        </div>

      </div>
    </div>
  );
}