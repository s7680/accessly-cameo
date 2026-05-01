import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { routes } from "@/lib/routes";

import NotificationBell from "@/components/NotificationBell";

export const metadata: Metadata = {
  title: "Accessly — Creator Connections, Drops & Experiences",
  description:
    "Request personalised video messages from your favourite creators, bid on exclusive Drops, and secure rare Experiences — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav className="nav container">
            <Link href="/" className="nav__logo">
              Access<span>ly</span>
            </Link>
            <ul className="nav__links">
              <li><Link href={routes.videos}>Videos</Link></li>
              <li><Link href={routes.drops}>Drops</Link></li>
              <li><Link href={routes.experiences}>Experiences</Link></li>
              <li><Link href="/join-talent">Join as Talent</Link></li>
              <li><Link href={routes.howItWorks}>How It Works</Link></li>
            </ul>
            <div className="nav__actions" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <NotificationBell />
              <Link
                href="/watchlist"
                style={{
                  fontSize: "20px",
                  color: "#ff4d8d",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                ❤️
              </Link>
              <Link href={routes.signIn} className="btn btn--primary btn--sm">Sign In</Link>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="container footer-inner">
            <span className="footer-logo">
              Access<span>ly</span>
            </span>
            <ul className="footer-links">
              <li><a href="/about">About</a></li>
              <li><a href="/creators">For Creators</a></li>
              <li><a href="/privacy">Privacy</a></li>
              <li><a href="/terms">Terms</a></li>
            </ul>
            <p className="footer-copy">© {new Date().getFullYear()} Accessly. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}