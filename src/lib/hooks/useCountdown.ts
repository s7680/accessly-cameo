"use client";

import { useEffect, useState } from "react";

export type CountdownResult = {
  d: number;
  h: number;
  m: number;
  s: number;
  status: "upcoming" | "live" | "ended";
};

/**
 * useCountdown
 * Handles countdown safely with null + invalid date protection
 * Accepts start and end time, returns status and time left
 */
export function useCountdown(
  startTime: string | Date | null,
  endTime: string | Date | null
): CountdownResult {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const start = startTime ? new Date(startTime).getTime() : null;
  const end = endTime ? new Date(endTime).getTime() : null;

  if (!end || isNaN(end)) {
    return { d: 0, h: 0, m: 0, s: 0, status: "ended" };
  }

  // BEFORE START
  if (start && now < start) {
    const diff = start - now;
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);

    return { d, h, m, s, status: "upcoming" };
  }

  // AFTER END
  if (now >= end) {
    return { d: 0, h: 0, m: 0, s: 0, status: "ended" };
  }

  // LIVE
  const diff = end - now;
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);

  return { d, h, m, s, status: "live" };
}
