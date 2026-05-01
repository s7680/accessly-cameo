"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

// ── Testimonial data ───────────────────────────────────────────────────────────
const testimonials = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Fitness Creator",
    earned: "₹4,20,000",
    quote: "I set my own schedule. I earn on my terms. Best decision I ever made.",
    avatar: "priya",
  },
  {
    id: "2",
    name: "Rahul Mehta",
    role: "Stand-up Comedian",
    earned: "₹2,85,000",
    quote: "My fans pay me directly. No middlemen. No nonsense.",
    avatar: "rahul",
  },
  {
    id: "3",
    name: "Anika Verma",
    role: "Bollywood Choreographer",
    earned: "₹6,10,000",
    quote: "I do what I love. The money just follows.",
    avatar: "anika",
  },
  {
    id: "4",
    name: "Kabir Sinha",
    role: "Cricket Coach",
    earned: "₹3,40,000",
    quote: "Dropped my 9-to-5 after 3 months. Never looked back.",
    avatar: "kabir",
  },
];

const steps = [
  {
    num: "01",
    title: "Create your profile",
    desc: "Set up in minutes. Add your photo, bio, and what you offer.",
  },
  {
    num: "02",
    title: "Set your price",
    desc: "You decide what your time is worth. Change it anytime.",
  },
  {
    num: "03",
    title: "Start earning",
    desc: "Fans book you. You deliver. Money hits your account.",
  },
];

const benefits = [
  {
    icon: "₹",
    title: "Earn directly from fans",
    desc: "No brand deals. No algorithms. Pure income from people who love your work.",
  },
  {
    icon: "⚡",
    title: "Full control over pricing",
    desc: "Set your rate. Raise it when demand grows. You're in charge.",
  },
  {
    icon: "📅",
    title: "Flexible schedule",
    desc: "Work when you want. Accept or decline any booking.",
  },
  {
    icon: "🚀",
    title: "Build your personal brand",
    desc: "Your profile becomes your portfolio. Grow your audience while you earn.",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────────
export default function JoinTalentPage() {
  return (
    <div className="jt-root">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="jt-hero">
        <div className="jt-hero-glow jt-hero-glow--1" />
        <div className="jt-hero-glow jt-hero-glow--2" />

        <div className="jt-hero-inner">
          <div className="jt-hero-badge">
            <span className="jt-badge-dot" />
            Thousands of creators already earning
          </div>

          <h1 className="jt-hero-headline">
            Earn money<br />
            <span className="jt-hero-accent">from your fans</span>
          </h1>

          <p className="jt-hero-sub">
            Create personalized videos, experiences, and drops.
            <br className="jt-hero-br" />
            Your talent. Your price. Your time.
          </p>

          <div className="jt-hero-cta-row">
            <Link href="/onboarding">
              <button className="jt-btn-primary">
                Join as Talent
                <span className="jt-btn-arrow">→</span>
              </button>
            </Link>
            <span className="jt-hero-trust">Free to join · No fees until you earn</span>
          </div>

          {/* Floating earnings pill */}
          <div className="jt-floating-pills">
            <div className="jt-pill jt-pill--1">
              <img src="https://picsum.photos/seed/pill1/32/32" alt="" className="jt-pill-img" />
              <span>Priya just earned <strong>₹12,000</strong></span>
            </div>
            <div className="jt-pill jt-pill--2">
              <img src="https://picsum.photos/seed/pill2/32/32" alt="" className="jt-pill-img" />
              <span>Kabir got a new booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="jt-section">
        <div className="jt-section-inner">
          <p className="jt-section-eyebrow">How it works</p>
          <h2 className="jt-section-title">Up and earning in minutes</h2>

          <div className="jt-steps-grid">
            {steps.map((s, i) => (
              <div key={s.num} className="jt-step-card">
                <span className="jt-step-num">{s.num}</span>
                {i < steps.length - 1 && <span className="jt-step-connector" />}
                <h3 className="jt-step-title">{s.title}</h3>
                <p className="jt-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY JOIN ──────────────────────────────────────────────────────── */}
      <section className="jt-section jt-section--alt">
        <div className="jt-section-inner">
          <p className="jt-section-eyebrow">Why join</p>
          <h2 className="jt-section-title">Everything on your terms</h2>

          <div className="jt-benefits-grid">
            {benefits.map((b) => (
              <div key={b.title} className="jt-benefit-card">
                <span className="jt-benefit-icon">{b.icon}</span>
                <h3 className="jt-benefit-title">{b.title}</h3>
                <p className="jt-benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ──────────────────────────────────────────────────── */}
      <section className="jt-section">
        <div className="jt-section-inner">
          <p className="jt-section-eyebrow">Creator stories</p>
          <h2 className="jt-section-title">Real people. Real earnings.</h2>

          <div className="jt-testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="jt-testimonial-card">
                <div className="jt-testimonial-top">
                  <img
                    src={`https://picsum.photos/seed/${t.avatar}/56/56`}
                    alt={t.name}
                    className="jt-testimonial-avatar"
                  />
                  <div>
                    <p className="jt-testimonial-name">{t.name}</p>
                    <p className="jt-testimonial-role">{t.role}</p>
                  </div>
                  <span className="jt-testimonial-earned">{t.earned}</span>
                </div>
                <blockquote className="jt-testimonial-quote">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="jt-final-cta">
        <div className="jt-final-glow" />
        <div className="jt-final-inner">
          <h2 className="jt-final-headline">Start earning today.</h2>
          <p className="jt-final-sub">
            Join thousands of creators monetising their talent — on their own terms.
          </p>
          <Link href="/onboarding">
            <button className="jt-btn-primary jt-btn-primary--large">
              Join Now
              <span className="jt-btn-arrow">→</span>
            </button>
          </Link>
          <p className="jt-final-footnote">Free to join · Payouts every week</p>
        </div>
      </section>

      {/* ── STYLES ────────────────────────────────────────────────────────── */}
      <style>{`
        /* ── Root & tokens ───────────────────────────────────────────── */
        .jt-root {
          background: var(--bg-base);
          color: var(--text-primary);
          font-family: inherit;
          overflow-x: hidden;
        }

        /* ── HERO ────────────────────────────────────────────────────── */
        .jt-hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 24px 60px;
          text-align: center;
          overflow: hidden;
        }

        .jt-hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.18;
          pointer-events: none;
        }
        .jt-hero-glow--1 {
          width: 600px; height: 600px;
          background: var(--gold);
          top: -100px; left: 50%;
          transform: translateX(-60%);
        }
        .jt-hero-glow--2 {
          width: 400px; height: 400px;
          background: var(--accent);
          bottom: 0; right: -80px;
        }

        .jt-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 720px;
          margin: 0 auto;
        }

        .jt-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--gold-dim);
          border: 1px solid var(--border-accent);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 13px;
          color: var(--text-gold);
          font-weight: 500;
          margin-bottom: 32px;
          letter-spacing: 0.02em;
        }
        .jt-badge-dot {
          width: 7px; height: 7px;
          background: var(--text-gold);
          border-radius: 50%;
          animation: jt-pulse 2s ease-in-out infinite;
        }
        @keyframes jt-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        .jt-hero-headline {
          font-size: clamp(44px, 8vw, 86px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin: 0 0 24px;
          color: var(--text-primary);
        }
        .jt-hero-accent {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 50%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .jt-hero-sub {
          font-size: clamp(16px, 2.5vw, 20px);
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0 0 40px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }
        .jt-hero-br { display: none; }
        @media (min-width: 600px) { .jt-hero-br { display: block; } }

        .jt-hero-cta-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-bottom: 56px;
        }

        .jt-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--gold);
          color: var(--bg-base);
          font-size: 16px;
          font-weight: 700;
          padding: 16px 32px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
          box-shadow: 0 0 0 0 var(--gold-dim);
          letter-spacing: 0.01em;
        }
        .jt-btn-primary:hover {
          transform: translateY(-2px);
          background: var(--gold-light);
          box-shadow: var(--shadow-gold);
        }
        .jt-btn-primary:active { transform: translateY(0); }
        .jt-btn-primary--large {
          font-size: 18px;
          padding: 20px 44px;
        }
        .jt-btn-arrow {
          font-size: 18px;
          transition: transform 0.15s ease;
        }
        .jt-btn-primary:hover .jt-btn-arrow { transform: translateX(4px); }

        .jt-hero-trust {
          font-size: 13px;
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }

        /* Floating pills */
        .jt-floating-pills {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        @media (min-width: 600px) {
          .jt-floating-pills {
            flex-direction: row;
            justify-content: center;
          }
        }

        .jt-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-muted);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 8px 16px 8px 8px;
          font-size: 13px;
          color: var(--text-secondary);
          backdrop-filter: blur(8px);
          animation: jt-floatUp 0.6s ease both;
        }
        .jt-pill--1 { animation-delay: 0.1s; }
        .jt-pill--2 { animation-delay: 0.25s; }
        @keyframes jt-floatUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .jt-pill strong { color: var(--text-gold); }
        .jt-pill-img {
          width: 28px; height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }

        /* ── Shared section layout ───────────────────────────────────── */
        .jt-section {
          padding: 80px 24px;
        }
        .jt-section--alt {
          background: var(--bg-subtle);
        }
        .jt-section-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .jt-section-eyebrow {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-gold);
          margin: 0 0 12px;
        }
        .jt-section-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.1;
          margin: 0 0 48px;
          color: var(--text-primary);
        }

        /* ── Steps ───────────────────────────────────────────────────── */
        .jt-steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .jt-steps-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
        }

        .jt-step-card {
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px 28px;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .jt-step-card:hover {
          border-color: var(--border-accent);
          transform: translateY(-3px);
        }

        .jt-step-num {
          display: block;
          font-size: 48px;
          font-weight: 900;
          line-height: 1;
          color: var(--gold-dim);
          letter-spacing: -0.04em;
          margin-bottom: 20px;
        }

        .jt-step-connector {
          display: none;
        }

        .jt-step-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 10px;
          letter-spacing: -0.01em;
        }
        .jt-step-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Benefits ────────────────────────────────────────────────── */
        .jt-benefits-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 600px) {
          .jt-benefits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .jt-benefit-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px 24px;
          transition: border-color 0.2s ease;
        }
        .jt-benefit-card:hover {
          border-color: var(--border-accent);
        }

        .jt-benefit-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px; height: 44px;
          background: var(--gold-dim);
          border-radius: 12px;
          font-size: 20px;
          margin-bottom: 16px;
        }

        .jt-benefit-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 8px;
          letter-spacing: -0.01em;
        }
        .jt-benefit-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Testimonials ────────────────────────────────────────────── */
        .jt-testimonials-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 600px) {
          .jt-testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .jt-testimonial-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          transition: border-color 0.2s ease;
        }
        .jt-testimonial-card:hover {
          border-color: var(--border-accent);
        }

        .jt-testimonial-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .jt-testimonial-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 2px solid var(--border);
        }

        .jt-testimonial-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 2px;
        }
        .jt-testimonial-role {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
        }

        .jt-testimonial-earned {
          margin-left: auto;
          font-size: 15px;
          font-weight: 800;
          color: var(--text-gold);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .jt-testimonial-quote {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.65;
          margin: 0;
          font-style: italic;
          border-left: 2px solid var(--border-accent);
          padding-left: 14px;
        }

        /* ── Final CTA ───────────────────────────────────────────────── */
        .jt-final-cta {
          position: relative;
          padding: 100px 24px;
          text-align: center;
          overflow: hidden;
          background: var(--bg-subtle);
          border-top: 1px solid var(--border);
        }

        .jt-final-glow {
          position: absolute;
          width: 500px; height: 500px;
          background: var(--gold);
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.08;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .jt-final-inner {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin: 0 auto;
        }

        .jt-final-headline {
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: var(--text-primary);
          margin: 0 0 20px;
        }

        .jt-final-sub {
          font-size: 16px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0 0 40px;
          max-width: 440px;
          margin-left: auto;
          margin-right: auto;
        }

        .jt-final-footnote {
          margin-top: 18px;
          font-size: 12px;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }
      `}</style>
    </div>
  );
}