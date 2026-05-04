"use client";
import CreatorCard from "@/components/CreatorCard";
import DropCard from "@/components/DropCard";
import ExperienceCard from "@/components/ExperienceCard";
import SectionWrapper from "@/components/SectionWrapper";
import Button from "@/components/ui/Button";
import { howItWorksSteps } from "@/lib/mockData";
import { getExperiences } from "@/lib/db/listings";
import { getDrops } from "@/lib/db/listings";
import { useEffect, useState } from "react";
import { getCreatorCards } from "@/lib/db/videos";

export default function HomePage() {
  const [drops, setDrops] = useState<any[] | null>(null);
  const [allCreators, setAllCreators] = useState<any[] | null>(null);
  const [featuredCreators, setFeaturedCreators] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[] | null>(null);

  useEffect(() => {
    async function loadDrops() {
      const data = await getDrops();
      setDrops(data || []);
    }
    loadDrops();
  }, []);
  useEffect(() => {
    async function loadCreators() {
      const data = await getCreatorCards();
      setAllCreators(data || []);
      setFeaturedCreators((data || []).slice(0, 5));
    }
    loadCreators();
  }, []);
  useEffect(() => {
    async function loadExperiences() {
      const data = await getExperiences();
      setExperiences(data || []);
    }
    loadExperiences();
  }, []);

  return (
    <>
      {/* ── Section 1: Hero ───────────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero__inner">
          <p className="hero__eyebrow animate-fade-up">✦ The creator economy, elevated</p>

          <h1 className="hero__title animate-fade-up animate-delay-1">
            Moments made <em>only</em>
            <br />for you
          </h1>

          <p className="hero__subtitle animate-fade-up animate-delay-2">
            Personalised video messages, exclusive collectible Drops, and once-in-a-lifetime
            Experiences — direct from the creators you love.
          </p>

          <div className="hero__cta animate-fade-up animate-delay-3">
            <Button href="#videos">Request a Video</Button>
            <Button href="#drops">Explore Drops</Button>
            <Button href="#experiences">Explore Experiences</Button>
          </div>

          <div className="hero__trust animate-fade-up animate-delay-4">
            <span className="hero__trust-item"><span>★★★★★</span> 4.9 avg rating</span>
            <span className="hero__trust-item"><span>✦</span> 50k+ videos delivered</span>
            <span className="hero__trust-item"><span>✦</span> 1,200+ verified creators</span>
          </div>
        </div>
      </section>

      {/* ── Section 2: Personalised Videos ───────────────────────────── */}
      <SectionWrapper
        id="videos"
        eyebrow="① Personalised Video Messages"
        title="A message that lasts forever."
        subtitle="Request a personalised video directly from your favourite creators. Perfect for birthdays, surprises, or meaningful moments — delivered just for you."
        titleAlign="left"
        action={<Button href="/creators" variant="secondary">See All Creators</Button>}
      >
        <div className="card-grid card-grid--4">
          {allCreators === null ? (
            <p>Loading...</p>
          ) : allCreators.length === 0 ? (
            <p>No creators found</p>
          ) : (
            allCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))
          )}
        </div>
      </SectionWrapper>

      {/* ── Section 3: Drops ─────────────────────────────────────────── */}
      <SectionWrapper
        id="drops"
        eyebrow="② Drops — Limited Edition Collectibles"
        title={<>Own something <em>truly</em> rare.</>}
        subtitle="Own exclusive items directly from creators — signed memorabilia, rare collectibles, and one-time drops. Bid or buy before they’re gone forever."
        titleAlign="left"
        action={<Button href="/drops" variant="secondary">Browse All Drops</Button>}
      >
        <div className="card-grid card-grid--3">
          {drops === null ? (
            <p>Loading...</p>
          ) : drops.length === 0 ? (
            <p>No drops found</p>
          ) : (
            drops.map((drop) => (
              <DropCard
                key={drop.id}
                drop={{
                  id: drop?.id || "",
                  title: drop?.item_name || "Untitled",
                  creatorName: drop?.display_name || "Unknown",
                  creatorAvatar: drop?.display_image || "",
                  category: drop?.category || "General",
                  currentBid: Number(drop?.starting_bid) || 0,
                  buyNowPrice: drop?.fixed_price ? Number(drop.fixed_price) : null,
                  totalBids: 0,
                  endsIn: drop?.end_datetime || null,
                  image: drop?.display_image || "",
                  description: drop?.product_details || "",
                  edition: "1 of 1",
                }}
              />
            ))
          )}
        </div>
      </SectionWrapper>

      {/* ── Section 4: Experiences ────────────────────────────────────── */}
      <SectionWrapper
        id="experiences"
        eyebrow="③ Experiences — Live & In-Person"
        title="Be in the room where it happens."
        subtitle="Access real-world experiences with creators — meet them, train with them, or join exclusive events. Limited spots, real access."
        titleAlign="left"
        action={<Button href="/experiences" variant="secondary">All Experiences</Button>}
      >
        <div className="card-grid card-grid--3">
          {experiences === null ? (
            <p>Loading...</p>
          ) : experiences.length === 0 ? (
            <p>No experiences found</p>
          ) : (
            experiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={{
                  id: exp.id,
                  title: exp.about_experience || "Experience",
                  description: exp.fan_benefits || "",
                  category: exp.category || "General",
                  image: exp.display_image || "",
                  creatorName: exp.display_name || "Unknown",
                  creatorAvatar: exp.display_image || "",
                  creatorId: exp.creator_id,
                  location: exp.location || "",
                  date: exp.experience_date || exp.start_date || null,
                  duration: exp.duration_minutes ? `${exp.duration_minutes} mins` : "",
                  pricingMode: "buyNow",
                  capacity: exp.guests || 0,
                  spotsLeft: exp.guests || 0,
                  buyNowPrice: 0,
                  currentBid: null,
                  endsIn: null,
                  tags: [exp.category || "General"],
                }}
              />
            ))
          )}
        </div>
      </SectionWrapper>

      {/* ── Section 5: How It Works ───────────────────────────────────── */}
      <SectionWrapper
        id="how-it-works"
        eyebrow="How It Works"
        title="Simple. Transparent. Unforgettable."
        subtitle="Discover how you can connect, collect, and experience creators in three simple steps."
      >
        <div className="how-it-works__grid">
          {howItWorksSteps.map((step) => (
            <div key={step.id} className="step-card">
              <span className="step-card__number">{step.step}</span>
              <span className="step-card__icon">{step.icon}</span>
              <h3 className="step-card__title">{step.title}</h3>
              <p className="step-card__description">{step.description}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── Section 6: Urgency ────────────────────────────────────────── */}
      <SectionWrapper id="urgency" className="urgency-section">
        <div className="urgency-inner">
          <h2 className="urgency__title">
            The next drop ends in <em>hours.</em>
            <br />Don&apos;t miss your moment.
          </h2>
          <p className="urgency__subtitle">
            Every bid, every booking, every message request is a connection you can&apos;t manufacture.
            These windows close — and they don&apos;t reopen.
          </p>
          <div className="urgency__stats">
            <div className="urgency__stat">
              <span className="urgency__stat-value">3</span>
              <span className="urgency__stat-label">Live Drops</span>
            </div>
            <div className="urgency__stat">
              <span className="urgency__stat-value">12</span>
              <span className="urgency__stat-label">Active Bids</span>
            </div>
            <div className="urgency__stat">
              <span className="urgency__stat-value">5</span>
              <span className="urgency__stat-label">Spots Remaining</span>
            </div>
          </div>
          <div className="hero__cta">
            <Button href="#drops">Bid on a Drop</Button>
            <Button href="#videos" variant="secondary">Request a Video</Button>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}