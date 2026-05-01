// src/app/how-it-works/page.tsx
// src/app/how-it-works/page.tsx
"use client";

import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function HowItWorksPage() {
  const router = useRouter();
  return (
    <div className="flow-page">
      <div
        className="container--wide"
        style={{ maxWidth: 880, margin: "0 auto", padding: "0 20px" }}
      >
        {/* Hero Section */}
        <section style={{ padding: "48px 0 32px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            How Accessly Works
          </h1>
          <p style={{ color: "#ccc", marginBottom: 24, lineHeight: 1.5 }}>
            Book personalized videos, win exclusive drops, or experience moments
            with your favorite creators.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button variant="primary" onClick={() => router.push("/")}>Explore</Button>
            <Button variant="secondary">Join as Creator</Button>
          </div>
        </section>

        {/* Fan Flow */}
        <section style={{ margin: "48px 0" }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 600,
              marginBottom: 24,
              textAlign: "left",
            }}
          >
            For Fans
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {fanSteps.map((step) => (
              <div
                key={step.step}
                style={{
                  border: "1px solid #333",
                  borderRadius: 12,
                  padding: 20,
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  background: "#111",
                }}
              >
                <span style={{ fontSize: 32 }}>{step.icon}</span>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 18 }}>
                    {step.step}. {step.title}
                  </h3>
                  <p style={{ margin: 0, color: "#aaa" }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Creator Flow */}
        <section style={{ margin: "48px 0" }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 600,
              marginBottom: 24,
              textAlign: "left",
            }}
          >
            For Creators
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {creatorSteps.map((step) => (
              <div
                key={step.step}
                style={{
                  border: "1px solid #333",
                  borderRadius: 12,
                  padding: 20,
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  background: "#111",
                }}
              >
                <span style={{ fontSize: 32 }}>{step.icon}</span>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 18 }}>
                    {step.step}. {step.title}
                  </h3>
                  <p style={{ margin: 0, color: "#aaa" }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section style={{ margin: "48px 0" }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 600,
              marginBottom: 24,
              textAlign: "left",
            }}
          >
            Why Trust Accessly?
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <li style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>🔒</span>
              <span>Secure payments & money-back guarantee</span>
            </li>
            <li style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <span>Verified creators & authentic profiles</span>
            </li>
            <li style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>📊</span>
              <span>Transparent bidding & fair pricing</span>
            </li>
          </ul>
        </section>

        {/* Final CTA */}
        <section
          style={{
            textAlign: "center",
            padding: "56px 0 64px",
            borderTop: "1px solid #333",
            marginTop: 32,
          }}
        >
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 16,
              textAlign: "left",
            }}
          >
            Ready to get started?
          </h2>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button variant="primary" onClick={() => router.push("/")}>
              Start Exploring
            </Button>
            <Button variant="secondary">Become a Creator</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

const fanSteps = [
  {
    step: 1,
    title: "Browse",
    description: "Explore videos, limited drops, and exclusive experiences from your favorite creators.",
    icon: "👀",
  },
  {
    step: 2,
    title: "Act",
    description: "Book a video, place a bid, or secure a drop with instant buy.",
    icon: "⚡",
  },
  {
    step: 3,
    title: "Receive",
    description: "Get your personalized video, win the item, or attend an experience.",
    icon: "🎁",
  },
];

const creatorSteps = [
  {
    step: 1,
    title: "Create listing",
    description: "Set up a video shoutout, launch a limited drop, or offer a 1‑on‑1 experience.",
    icon: "📸",
  },
  {
    step: 2,
    title: "Set pricing",
    description: "Charge a fixed price, run an auction, or let fans place bids.",
    icon: "💰",
  },
  {
    step: 3,
    title: "Earn",
    description: "Deliver the video, ship the item, or host the experience – and keep a majority cut.",
    icon: "🚀",
  },
];