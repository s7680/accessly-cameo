import CreatorCard from "@/components/CreatorCard";
import DropCard from "@/components/DropCard";
import ExperienceCard from "@/components/ExperienceCard";
import SectionWrapper from "@/components/SectionWrapper";
import Button from "@/components/ui/Button";
import {
  featuredCreators,
  allCreators,
  drops,
  experiences,
  howItWorksSteps,
} from "@/lib/mockData";

export default function HomePage() {
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

          <div className="hero__creators animate-fade-up animate-delay-4">
            {featuredCreators.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                variant="featured"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Personalised Videos ───────────────────────────── */}
      <SectionWrapper
        id="videos"
        eyebrow="Personalised Video Messages"
        title="A message that lasts forever."
        subtitle="Choose your creator, share your story, and receive a custom video crafted just for you — birthdays, milestones, surprises, or just because."
        titleAlign="left"
        action={<Button href="/creators" variant="secondary">See All Creators</Button>}
      >
        <div className="card-grid card-grid--4">
          {allCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </SectionWrapper>

      {/* ── Section 3: Drops ─────────────────────────────────────────── */}
      <SectionWrapper
        id="drops"
        eyebrow="Drops — Limited Edition Collectibles"
        title={<>Own something <em>truly</em> rare.</>}
        subtitle="Auction-first collectibles and digital artefacts released in limited editions. Bid now — these won't return."
        titleAlign="left"
        action={<Button href="/drops" variant="secondary">Browse All Drops</Button>}
      >
        <div className="card-grid card-grid--3">
          {drops.map((drop) => (
            <DropCard key={drop.id} drop={drop} />
          ))}
        </div>
      </SectionWrapper>

      {/* ── Section 4: Experiences ────────────────────────────────────── */}
      <SectionWrapper
        id="experiences"
        eyebrow="Experiences — Live & In-Person"
        title="Be in the room where it happens."
        subtitle="Studio sessions, set visits, workshops, dinners — book your spot or place a bid before it's gone."
        titleAlign="left"
        action={<Button href="/experiences" variant="secondary">All Experiences</Button>}
      >
        <div className="card-grid card-grid--3">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </SectionWrapper>

      {/* ── Section 5: How It Works ───────────────────────────────────── */}
      <SectionWrapper
        id="how-it-works"
        eyebrow="How It Works"
        title="Simple. Transparent. Unforgettable."
        subtitle="From first click to lasting memory — here's how Luminary works."
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