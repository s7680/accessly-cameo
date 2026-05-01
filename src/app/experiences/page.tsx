"use client";

import { useState } from "react";
import ExperienceCard from "@/components/ExperienceCard";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface Experience {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  creatorName: string;
  creatorAvatar: string;
  price: number;
  availableOn: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────
const allExperiences: Experience[] = [
  { id: "1",  title: "1-on-1 Meet with Virat Kohli",         description: "Spend 30 minutes with the legend himself at a private lounge in Mumbai.", category: "Meet & Greet",          image: "virat-meet",    creatorName: "Virat Kohli",      creatorAvatar: "virat",    price: 250000, availableOn: "2025-08-10" },
  { id: "2",  title: "Dinner with Shah Rukh Khan",           description: "An intimate dinner experience with SRK at his favourite Delhi restaurant.", category: "Dinner",                image: "srk-dinner",    creatorName: "Shah Rukh Khan",   creatorAvatar: "srk",      price: 500000, availableOn: "2025-09-01" },
  { id: "3",  title: "Cricket Nets Session with MS Dhoni",   description: "Train with Mahi for an hour at a private ground in Ranchi.",              category: "Sports Experience",     image: "dhoni-nets",    creatorName: "MS Dhoni",         creatorAvatar: "dhoni",    price: 350000, availableOn: "2025-08-22" },
  { id: "4",  title: "Behind-the-Scenes with Deepika",       description: "Visit a live Bollywood shoot set and spend time with Deepika Padukone.",   category: "Bollywood Experience",  image: "deepika-bts",   creatorName: "Deepika Padukone", creatorAvatar: "deepika",  price: 400000, availableOn: "2025-10-05" },
  { id: "5",  title: "Tea with a Senior Minister",           description: "A curated discussion on policy and leadership over chai in New Delhi.",     category: "Politics Interaction",  image: "minister-tea",  creatorName: "PoliticaVault",    creatorAvatar: "pol1",     price: 150000, availableOn: "2025-08-30" },
  { id: "6",  title: "Badminton Rally with PV Sindhu",       description: "Play a friendly match and get coaching tips from the Olympic champion.",    category: "Sports Experience",     image: "sindhu-rally",  creatorName: "PV Sindhu",        creatorAvatar: "sindhu",   price: 200000, availableOn: "2025-09-15" },
  { id: "7",  title: "Lunch with Ranveer Singh",             description: "A high-energy lunch with Bollywood's most vibrant star in Mumbai.",         category: "Dinner",                image: "ranveer-lunch", creatorName: "Ranveer Singh",    creatorAvatar: "ranveer",  price: 375000, availableOn: "2025-11-01" },
  { id: "8",  title: "Fan Meet with Alia Bhatt",             description: "An exclusive meet-and-greet with Alia at her production office.",           category: "Meet & Greet",          image: "alia-meet",     creatorName: "Alia Bhatt",       creatorAvatar: "alia",     price: 175000, availableOn: "2025-09-20" },
  { id: "9",  title: "Javelin Throw Masterclass — Neeraj",   description: "Learn technique and train side-by-side with the Olympic gold medallist.",   category: "Sports Experience",     image: "neeraj-throw",  creatorName: "Neeraj Chopra",    creatorAvatar: "neeraj",   price: 300000, availableOn: "2025-10-12" },
  { id: "10", title: "Script Reading with Karan Johar",      description: "Sit in on a real script reading session and get insider Bollywood access.", category: "Bollywood Experience",  image: "karan-script",  creatorName: "Karan Johar",      creatorAvatar: "karan",    price: 225000, availableOn: "2025-12-01" },
  { id: "11", title: "Roundtable with Young MP",             description: "Engage in a candid roundtable on governance and India's future.",            category: "Politics Interaction",  image: "mp-roundtable", creatorName: "YouthPol India",   creatorAvatar: "pol2",     price: 80000,  availableOn: "2025-08-18" },
  { id: "12", title: "Private Dinner with Sachin Tendulkar", description: "The ultimate sporting dinner — an evening with the Master Blaster.",        category: "Dinner",                image: "sachin-dinner", creatorName: "Sachin Tendulkar", creatorAvatar: "sachin",   price: 750000, availableOn: "2025-09-28" },
  { id: "13", title: "Bollywood Dance Class with Madhuri",   description: "Learn Madhuri Dixit's iconic moves in a private studio session.",           category: "Bollywood Experience",  image: "madhuri-dance", creatorName: "Madhuri Dixit",    creatorAvatar: "madhuri",  price: 280000, availableOn: "2025-10-20" },
  { id: "14", title: "Coffee Chat with Rohit Sharma",        description: "A relaxed coffee session with the Indian cricket captain.",                  category: "Meet & Greet",          image: "rohit-coffee",  creatorName: "Rohit Sharma",     creatorAvatar: "rohit",    price: 195000, availableOn: "2025-08-25" },
  { id: "15", title: "Constituency Walk with MP",            description: "Join a sitting MP on a constituency tour and witness democracy up close.",   category: "Politics Interaction",  image: "mp-walk",       creatorName: "PoliticaVault",    creatorAvatar: "pol3",     price: 60000,  availableOn: "2025-09-05" },
  { id: "16", title: "Film Premiere Access with Hrithik",    description: "Walk the red carpet and attend a premiere alongside Hrithik Roshan.",        category: "Bollywood Experience",  image: "hrithik-prem",  creatorName: "Hrithik Roshan",   creatorAvatar: "hrithik",  price: 450000, availableOn: "2025-11-15" },
];

const ALL_LABEL = "All";
const categories = [ALL_LABEL, "Meet & Greet", "Dinner", "Sports Experience", "Bollywood Experience", "Politics Interaction"];

const categoryCounts = categories.reduce((acc, cat) => {
  acc[cat] =
    cat === ALL_LABEL
      ? allExperiences.length
      : allExperiences.filter((e) => e.category === cat).length;
  return acc;
}, {} as Record<string, number>);

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ExperiencesPage() {
  const [active, setActive]                 = useState(ALL_LABEL);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [sidebarSearch, setSidebarSearch]   = useState("");
  const [sort, setSort]                     = useState("upcoming");
  const [lotType, setLotType] = useState<"all" | "auction" | "buyNow">("all");

  const filtered = allExperiences.filter((e) => {
    const matchCat = active === ALL_LABEL || e.category === active;

    const matchLot =
      lotType === "all" ||
      (lotType === "auction" && !e.price) ||
      (lotType === "buyNow" && !!e.price);

    return matchCat && matchLot;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "upcoming")       return new Date(a.availableOn).getTime() - new Date(b.availableOn).getTime();
    if (sort === "popular")        return parseInt(b.id) - parseInt(a.id);
    if (sort === "price_low")      return a.price - b.price;
    if (sort === "price_high")     return b.price - a.price;
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
                    title: exp.title,
                    description: exp.description,
                    category: exp.category,
                    image: exp.image,
                    creatorName: exp.creatorName,
                    creatorAvatar: exp.creatorAvatar,
                    creatorId: exp.creatorName,
                    location: "Mumbai",
                    date: exp.availableOn,
                    duration: "2 hours",
                    pricingMode: "buyNow",
                    capacity: 10,
                    spotsLeft: 3,
                    buyNowPrice: exp.price,
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