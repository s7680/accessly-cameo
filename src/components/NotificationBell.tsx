"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { requireOnboarding } from "@/lib/guards/requireOnboarding";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const notifications = [
    "🔔 You have been outbid on a drop",
    "📊 Your ranking has improved",
    "✅ Payment successful",
    "🎥 Your video order has been received",
  ];

  const unreadCount = notifications.length;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Bell */}
      <button
        onClick={async () => {
          const allowed = await requireOnboarding(router);
          if (!allowed) return;
          setOpen((prev) => !prev);
        }}
        style={{
          fontSize: "18px",
          background: "none",
          border: "none",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        🔔
      </button>
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",
            background: "#ff3b30",
            color: "#fff",
            borderRadius: "999px",
            fontSize: "10px",
            padding: "2px 6px",
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          {unreadCount}
        </span>
      )}

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "28px",
            right: "0",
            background: "#111",
            border: "1px solid #222",
            borderRadius: "8px",
            padding: "12px",
            width: "260px",
            zIndex: 100,
          }}
        >
          <p style={{ fontSize: "12px", color: "#ffffff", marginBottom: "8px" }}>
            Notifications
          </p>

          {notifications.map((n, i) => (
            <div key={i} style={{ fontSize: "13px", marginBottom: "6px", color: "#ffffff" }}>
              {n}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}