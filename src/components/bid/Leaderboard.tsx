"use client";

import { useState } from "react";

export interface BidEntry {
  rank: number;
  bidderName: string;
  bidderAvatar?: string;
  amount: number;
  timestamp: Date;
  isAnonymous?: boolean;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: BidEntry[];
  currency?: string;
  maxVisible?: number;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

function formatMoney(n: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

const RANK_MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function Leaderboard({
  entries,
  currency = "USD",
  maxVisible = 5,
}: LeaderboardProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? entries : entries.slice(0, maxVisible);

  return (
    <div className="leaderboard">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        .leaderboard {
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .lb-header {
          background: #111;
          border-bottom: 1px solid #1e1e1e;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .lb-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 4px;
          color: #e0e0e0;
        }
        .lb-count {
          font-size: 11px;
          color: #555;
          letter-spacing: 1px;
        }
        .lb-count span { color: #ffb000; font-weight: 600; }

        .lb-entry {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 20px;
          border-bottom: 1px solid #131313;
          transition: background 0.15s;
          position: relative;
          overflow: hidden;
        }
        .lb-entry:last-child { border-bottom: none; }
        .lb-entry.top-1 { background: rgba(255,176,0,0.04); }
        .lb-entry.current-user { background: rgba(255,255,255,0.03); }
        .lb-entry.current-user::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #ffb000;
        }

        .lb-rank {
          width: 28px;
          flex-shrink: 0;
          text-align: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          color: #333;
          line-height: 1;
        }
        .lb-rank.top { color: #ffb000; font-size: 20px; }
        .lb-rank-medal { font-size: 18px; }

        .lb-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #1a1a1a;
          object-fit: cover;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #555;
          border: 1px solid #222;
        }
        .lb-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .lb-info { flex: 1; min-width: 0; }
        .lb-name {
          font-size: 13.5px;
          font-weight: 500;
          color: #ccc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lb-you-badge {
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          background: rgba(255,176,0,0.15);
          color: #ffb000;
          border: 1px solid rgba(255,176,0,0.3);
          padding: 1px 5px;
          border-radius: 2px;
        }
        .lb-time {
          font-size: 11px;
          color: #444;
          margin-top: 2px;
        }

        .lb-amount {
          text-align: right;
          flex-shrink: 0;
        }
        .lb-amount-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 1px;
          color: #e0e0e0;
          line-height: 1;
        }
        .lb-entry.top-1 .lb-amount-num { color: #ffb000; }
        .lb-amount-label {
          font-size: 10px;
          color: #444;
          letter-spacing: 1px;
        }

        /* Winning banner for rank 1 */
        .lb-winning-bar {
          background: linear-gradient(to right, rgba(255,176,0,0.08), transparent);
          border-bottom: 1px solid rgba(255,176,0,0.1);
          padding: 8px 20px;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #ffb000;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lb-winning-dot {
          width: 6px;
          height: 6px;
          background: #ffb000;
          border-radius: 50%;
          animation: blink 1.5s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* Show more */
        .lb-show-more {
          width: 100%;
          padding: 12px;
          background: #111;
          border: none;
          border-top: 1px solid #1a1a1a;
          color: #555;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lb-show-more:hover {
          color: #ffb000;
          background: #0f0f0f;
        }

        /* Empty state */
        .lb-empty {
          padding: 40px 20px;
          text-align: center;
          color: #444;
          font-size: 13px;
          letter-spacing: 1px;
        }
        .lb-empty-icon {
          font-size: 32px;
          margin-bottom: 10px;
          opacity: 0.3;
        }
      `}</style>

      {/* Header */}
      <div className="lb-header">
        <div className="lb-title">Leaderboard</div>
        <div className="lb-count">
          <span>{entries.length}</span> bidders
        </div>
      </div>

      {/* Winning indicator */}
      {entries.length > 0 && (
        <div className="lb-winning-bar">
          <div className="lb-winning-dot" />
          <span>{entries[0].isAnonymous ? "Anonymous" : entries[0].bidderName} is currently winning</span>
        </div>
      )}

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="lb-empty">
          <div className="lb-empty-icon">⚡</div>
          <div>No bids yet — be the first!</div>
        </div>
      ) : (
        <>
          {visible.map((entry) => (
            <div
              key={entry.rank}
              className={`lb-entry ${entry.rank === 1 ? "top-1" : ""} ${entry.isCurrentUser ? "current-user" : ""}`}
            >
              {/* Rank */}
              <div className={`lb-rank ${entry.rank <= 3 ? "top" : ""}`}>
                {RANK_MEDALS[entry.rank] ? (
                  <span className="lb-rank-medal">{RANK_MEDALS[entry.rank]}</span>
                ) : (
                  <span>{entry.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div className="lb-avatar">
                {entry.bidderAvatar ? (
                  <img src={entry.bidderAvatar} alt={entry.bidderName} />
                ) : (
                  <span>{entry.isAnonymous ? "?" : entry.bidderName[0].toUpperCase()}</span>
                )}
              </div>

              {/* Info */}
              <div className="lb-info">
                <div className="lb-name">
                  {entry.isAnonymous ? "Anonymous Bidder" : entry.bidderName}
                  {entry.isCurrentUser && <span className="lb-you-badge">You</span>}
                </div>
                <div className="lb-time">{timeAgo(entry.timestamp)}</div>
              </div>

              {/* Amount */}
              <div className="lb-amount">
                <div className="lb-amount-num">{formatMoney(entry.amount, currency)}</div>
                <div className="lb-amount-label">bid</div>
              </div>
            </div>
          ))}

          {entries.length > maxVisible && (
            <button className="lb-show-more" onClick={() => setShowAll((s) => !s)}>
              {showAll ? `Show Top ${maxVisible}` : `Show All ${entries.length} Bidders`}
            </button>
          )}
        </>
      )}
    </div>
  );
}