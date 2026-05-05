"use client";

import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { routes } from "@/lib/routes";

import NotificationBell from "@/components/NotificationBell";
import Navbar from "@/components/Navbar";

import { useEffect } from "react";
import { initDeepLinkHandler } from "@/lib/deeplinkHandler";

export const metadata: Metadata = {
  title: "Accessly - Creator Connections, Drops & Experiences",
  description: "Request personalised video messages from your favourite creators, bid on exclusive drops, and secure rare experiences in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    initDeepLinkHandler();
  }, []);

  return (
    <html lang="en">
      <body>
        <Navbar />

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