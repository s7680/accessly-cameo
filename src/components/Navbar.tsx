"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";
import { routes } from "@/lib/routes";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="site-header">
      <div className="container nav">
        {/* Logo */}
        <Link href="/" className="nav__logo">
          Access<span>ly</span>
        </Link>

        {/* Desktop Links */}
        <ul className="nav__links">
          <li><Link href="/videos">Videos</Link></li>
          <li><Link href="/drops">Drops</Link></li>
          <li><Link href="/experiences">Experiences</Link></li>
          <li><Link href="/join-talent">Join as Talent</Link></li>
          <li><Link href="/how-it-works">How It Works</Link></li>
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
          {user ? (
            <Link href="/profile" className="btn btn--primary btn--sm">
              Profile
            </Link>
          ) : (
            <Link href="/sign-in" className="btn btn--primary btn--sm">
              Sign In
            </Link>
          )}
        </div>

        {/* Hamburger (mobile only) */}
        <button
          className="nav__menu-btn"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="nav__mobile">
          <Link href="/videos" onClick={() => setOpen(false)}>Videos</Link>
          <Link href="/drops" onClick={() => setOpen(false)}>Drops</Link>
          <Link href="/experiences" onClick={() => setOpen(false)}>Experiences</Link>
          <Link href="/join-talent" onClick={() => setOpen(false)}>Join as Talent</Link>
          <Link href="/how-it-works" onClick={() => setOpen(false)}>How It Works</Link>
        </div>
      )}
    </header>
  );
}