"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DropCard from "@/components/DropCard";

// ── Mock Data ──────────────────────────────────────────────────────────────────
export interface Drop {
  id: string;
  title: string;
  creator: string;
  category: string;
  currentBid: number;
  buyNowPrice?: number;
  bidCount: number;
  endsInSeconds: number;
  image: string;
}

const allDrops: Drop[] = [
  { id: "1",  title: "Signed Virat Kohli Jersey",       creator: "SportsVault",       category: "Sports",       currentBid: 42500,  buyNowPrice: 75000,  bidCount: 38, endsInSeconds: 7200,   image: "jersey1"  },
  { id: "2",  title: "Rohit Sharma Bat (Match-Used)",   creator: "CricketLegends",    category: "Sports",       currentBid: 31000,  buyNowPrice: 60000,  bidCount: 22, endsInSeconds: 18000,  image: "bat1"     },
  { id: "3",  title: "Shah Rukh Khan Autograph Card",   creator: "BollywoodDrops",    category: "Bollywood",    currentBid: 12500,                       bidCount: 23, endsInSeconds: 10800,  image: "srk1"     },
  { id: "4",  title: "Deepika Padukone Signed Poster",  creator: "StarMoments",       category: "Bollywood",    currentBid: 9800,   buyNowPrice: 20000,  bidCount: 17, endsInSeconds: 64800,  image: "dp1"      },
  { id: "5",  title: "PM Modi Signed Photograph",       creator: "PoliticaVault",     category: "Politics",     currentBid: 55000,                       bidCount: 61, endsInSeconds: 3600,   image: "modi1"    },
  { id: "6",  title: "Rahul Gandhi Campaign Letter",    creator: "PolDocs",           category: "Politics",     currentBid: 8200,                        bidCount: 9,  endsInSeconds: 172800, image: "rg1"      },
  { id: "7",  title: "1983 World Cup Replica Trophy",   creator: "SportsMemorabilia", category: "Collectibles", currentBid: 22000,  buyNowPrice: 40000,  bidCount: 44, endsInSeconds: 14400,  image: "trophy1"  },
  { id: "8",  title: "Vintage IPL Match Ticket (2008)", creator: "CricketCollect",    category: "Collectibles", currentBid: 4500,                        bidCount: 12, endsInSeconds: 108000, image: "ticket1"  },
  { id: "9",  title: "Sachin Tendulkar Autograph",      creator: "MasterBlaster",     category: "Autographs",   currentBid: 88000,  buyNowPrice: 150000, bidCount: 76, endsInSeconds: 20700,  image: "sachin1"  },
  { id: "10", title: "MS Dhoni Signed Gloves",          creator: "DhoniDrops",        category: "Autographs",   currentBid: 61000,                       bidCount: 53, endsInSeconds: 39600,  image: "dhoni1"   },
  { id: "11", title: "Ranveer Singh Signed Cap",        creator: "BollywoodDrops",    category: "Bollywood",    currentBid: 7200,   buyNowPrice: 15000,  bidCount: 8,  endsInSeconds: 79200,  image: "rv1"      },
  { id: "12", title: "PV Sindhu Racket (Tournament)",   creator: "BadmintonVault",    category: "Sports",       currentBid: 18000,  buyNowPrice: 35000,  bidCount: 29, endsInSeconds: 21600,  image: "sindhu1"  },
  { id: "13", title: "Neeraj Chopra Javelin Print",     creator: "OlympicsVault",     category: "Collectibles", currentBid: 13500,                       bidCount: 19, endsInSeconds: 50400,  image: "neeraj1"  },
  { id: "14", title: "Alia Bhatt Script Page (Signed)", creator: "StarMoments",       category: "Autographs",   currentBid: 6800,   buyNowPrice: 12000,  bidCount: 14, endsInSeconds: 32400,  image: "alia1"    },
  { id: "15", title: "Indian Constitution Replica",     creator: "PoliticaVault",     category: "Politics",     currentBid: 33000,                       bidCount: 27, endsInSeconds: 259200, image: "const1"   },
  { id: "16", title: "Kapil Dev World Cup Photo",       creator: "CricketLegends",    category: "Autographs",   currentBid: 24500,  buyNowPrice: 45000,  bidCount: 35, endsInSeconds: 25200,  image: "kapil1"   },
];

const ALL_LABEL = "All";
const categories = [ALL_LABEL, "Autographs", "Sports", "Bollywood", "Politics", "Collectibles"];

const categoryCounts = categories.reduce((acc, cat) => {
  acc[cat] =
    cat === ALL_LABEL
      ? allDrops.length
      : allDrops.filter((d) => d.category === cat).length;
  return acc;
}, {} as Record<string, number>);

// ── Page ───────────────────────────────────────────────────────────────────────
export default function DropsPage() {
  const [active, setActive]                 = useState(ALL_LABEL);
  const [showUrgent, setShowUrgent]         = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [sidebarSearch, setSidebarSearch]   = useState("");
  const [sort, setSort]                     = useState("ending_soon");
  const router = useRouter();

  const filtered = allDrops.filter((d) => {
    const matchCat    = active === ALL_LABEL || d.category === active;
    const matchUrgent = !showUrgent || d.endsInSeconds <= 21600; // ≤ 6 h
    return matchCat && matchUrgent;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "ending_soon")  return a.endsInSeconds - b.endsInSeconds;
    if (sort === "highest_bids") return b.currentBid - a.currentBid;
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
          style={{ gap: "50px", marginBottom: "50px" }}
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                }}
              >
                {sorted.map((drop) => (
                  <DropCard
                    key={drop.id}
                    drop={{
                      ...drop,
                      buyNowPrice: drop.buyNowPrice ?? null,
                      creatorName: drop.creator,
                      creatorAvatar: "",
                      totalBids: drop.bidCount,
                      endsIn: new Date(Date.now() + drop.endsInSeconds * 1000).toISOString(),
                      description: "",
                      edition: "1 of 1",
                    }}
                  />
                ))}
              </div>
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
}

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