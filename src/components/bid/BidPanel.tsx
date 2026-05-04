"use client";

import { useState, useEffect } from "react";
import { useCountdown } from "@/lib/hooks/useCountdown";
import { useRouter } from "next/navigation";
import { requireOnboarding } from "@/lib/guards/requireOnboarding";

interface BidPanelProps {
  type: "experience" | "drop";
  currentBid: number;
  startingBid: number;
  minIncrement: number;
  totalBids: number;
  currency?: string;
  reserveMet?: boolean;
  onBid: (amount: number) => Promise<void> | void;
  onWatchlist?: () => void;
  isWatchlisted?: boolean;
  startTime?: string | Date | null;
  endTime?: string | Date | null;
}

function formatMoney(n: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

const QUICK_INCREMENTS = [1, 2, 5, 10];

export default function BidPanel({
  type,
  currentBid,
  startingBid,
  minIncrement,
  totalBids,
  startTime,
  endTime,
  currency = "USD",
  onBid,
  onWatchlist,
  isWatchlisted: initWatched = false,
}: BidPanelProps) {
  const effectiveIncrement = 500;
  const minNext = currentBid + effectiveIncrement;
  const [bidAmount, setBidAmount] = useState(currentBid + effectiveIncrement);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [watched, setWatched] = useState(initWatched);

  const router = useRouter();

  useEffect(() => {
    setBidAmount(currentBid + effectiveIncrement);
  }, [currentBid]);

  const handleBidChange = (val: number | "") => {
    if (val === "") {
      setBidAmount(0);
      return;
    }
    setBidAmount(val);
  };

  const handleSubmit = async () => {
    const allowed = await requireOnboarding(router);
    if (!allowed) return;
    // Minimum rule: must be higher than current bid
    if (bidAmount <= currentBid) {
      setStatus("error");
      setStatusMsg(`Bid must be higher than current bid ${formatMoney(currentBid, currency)}`);
      return;
    }

    // Anti-manipulation cap: prevent absurd jumps
    const MAX_MULTIPLIER = 5;
    if (bidAmount > currentBid * MAX_MULTIPLIER) {
      setStatus("error");
      setStatusMsg(`Bid too high. Maximum allowed is ${formatMoney(currentBid * MAX_MULTIPLIER, currency)}`);
      return;
    }
    setLoading(true);
    setStatus("idle");
    try {
      await onBid(bidAmount);
      setStatus("success");
      setStatusMsg(`Bid of ${formatMoney(bidAmount, currency)} placed!`);
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err: any) {
      setStatus("error");
      setStatusMsg(err?.message || "Failed to place bid. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = () => {
    setWatched((w) => !w);
    onWatchlist?.();
  };

  const timer = useCountdown(startTime || null, endTime || null);

  console.log("[BidPanel Timer Debug]", {
    startTime,
    endTime,
    parsedStart: startTime ? new Date(startTime).toISOString() : null,
    parsedEnd: endTime ? new Date(endTime).toISOString() : null,
  });

  const percentAboveStart =
    startingBid > 0
      ? Math.min(100, Math.round(((currentBid - startingBid) / startingBid) * 100))
      : 0;

  return (
    <div className="bid-panel">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        .bid-panel {
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          font-family: 'DM Sans', sans-serif;
          position: relative;

          /* EXPAND: allow full height, no internal scroll */
          height: auto;
          overflow: visible;
        }

        .bp-header {
          background: #111;
          border-bottom: 1px solid #1e1e1e;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .bp-header-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 11px;
          letter-spacing: 4px;
          color: #555;
        }
        .bp-bid-count {
          font-size: 12px;
          color: #555;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .bp-bid-count strong { color: #ffb000; }

        /* Current bid */
        .bp-current {
          padding: 20px 20px 16px;
          border-bottom: 1px solid #1a1a1a;
        }
        .bp-current-label {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 4px;
        }
        .bp-current-amount {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px;
          letter-spacing: 2px;
          color: #f0f0f0;
          line-height: 1;
        }
        .bp-current-sub {
          margin-top: 4px;
          font-size: 12px;
          color: #555;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .bp-reserve {
          padding: 2px 7px;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          border-radius: 2px;
        }
        .bp-reserve.met {
          background: rgba(0,230,118,0.12);
          color: #00e676;
          border: 1px solid rgba(0,230,118,0.3);
        }
        .bp-reserve.unmet {
          background: rgba(255,176,0,0.1);
          color: #ffb000;
          border: 1px solid rgba(255,176,0,0.25);
        }

        /* Progress bar */
        .bp-progress-wrap {
          height: 3px;
          background: #1a1a1a;
          margin: 0 20px 16px;
        }
        .bp-progress-bar {
          height: 100%;
          background: linear-gradient(to right, #ffb000, #ffd040);
          transition: width 0.5s ease;
        }

        /* Input area */
        .bp-input-area {
          padding: 0 20px 16px;
        }
        .bp-input-label {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 8px;
        }
        .bp-input-row {
          display: flex;
          border: 1px solid #2a2a2a;
          background: #111;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .bp-input-row:focus-within { border-color: #ffb000; }
        .bp-currency {
          padding: 0 14px;
          display: flex;
          align-items: center;
          background: #161616;
          border-right: 1px solid #2a2a2a;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          color: #666;
          letter-spacing: 1px;
          flex-shrink: 0;
        }
        .bp-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: #f0f0f0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          letter-spacing: 1px;
          padding: 12px 14px;
          width: 100%;
        }
        .bp-step-btns {
          display: flex;
          flex-direction: column;
          border-left: 1px solid #2a2a2a;
        }
        .bp-step-btn {
          background: none;
          border: none;
          color: #555;
          cursor: pointer;
          padding: 0 12px;
          flex: 1;
          font-size: 14px;
          line-height: 1;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bp-step-btn:hover {
          background: #1a1a1a;
          color: #ffb000;
        }
        .bp-step-divider { height: 1px; background: #2a2a2a; }

        /* Quick increments */
        .bp-quick-row {
          display: flex;
          gap: 6px;
          padding: 0 20px 16px;
          flex-wrap: wrap;
        }
        .bp-quick-btn {
          background: #111;
          border: 1px solid #1e1e1e;
          color: #666;
          font-size: 11px;
          letter-spacing: 1px;
          cursor: pointer;
          padding: 5px 10px;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .bp-quick-btn:hover {
          border-color: #ffb000;
          color: #ffb000;
          background: rgba(255,176,0,0.06);
        }

        /* Submit button */
        .bp-submit {
          margin: 0 20px 12px;
          width: calc(100% - 40px);
          padding: 16px;
          background: #ffb000;
          border: none;
          cursor: pointer;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 4px;
          color: #0a0a0a;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .bp-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.15);
          transform: translateX(-100%);
          transition: transform 0.3s;
        }
        .bp-submit:hover::before { transform: translateX(0); }
        .bp-submit:disabled {
          background: #2a2a2a;
          color: #555;
          cursor: not-allowed;
        }
        .bp-submit.loading {
          background: #cc8c00;
        }

        /* Status message */
        .bp-status {
          margin: 0 20px 12px;
          padding: 10px 14px;
          font-size: 13px;
          border-radius: 2px;
          text-align: center;
          letter-spacing: 0.5px;
        }
        .bp-status.success {
          background: rgba(0,230,118,0.1);
          border: 1px solid rgba(0,230,118,0.2);
          color: #00e676;
        }
        .bp-status.error {
          background: rgba(255,59,48,0.1);
          border: 1px solid rgba(255,59,48,0.2);
          color: #ff3b30;
        }

        /* Secondary actions */
        .bp-secondary {
          padding: 12px 20px;
          border-top: 1px solid #161616;
          display: flex;
          gap: 10px;
        }
        .bp-watch-btn {
          flex: 1;
          background: none;
          border: 1px solid #1e1e1e;
          color: #666;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .bp-watch-btn:hover, .bp-watch-btn.active {
          border-color: #ffb000;
          color: #ffb000;
        }
        .bp-share-btn {
          background: none;
          border: 1px solid #1e1e1e;
          color: #555;
          font-size: 16px;
          padding: 10px 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .bp-share-btn:hover {
          border-color: #333;
          color: #999;
        }

        /* Min bid notice */
        .bp-min-notice {
          padding: 0 20px 14px;
          font-size: 11px;
          color: #444;
          letter-spacing: 0.5px;
        }
        .bp-min-notice span { color: #666; }
      `}</style>

      {/* Header */}
      <div className="bp-header">
        <div className="bp-header-label">Live Auction</div>
        <div className="bp-bid-count">
          <strong>{totalBids}</strong> bids placed
        </div>
      </div>

      {/* Timer */}
      {timer.status !== "idle" && (
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid #1e1e1e",
        }}>
          <div style={{
            fontSize: 10,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#555",
            marginBottom: 10,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {timer.status === "upcoming"
              ? "Auction Starts In"
              : timer.status === "live"
              ? "Auction Ends In"
              : "Auction Ended"}
          </div>

          {timer.status === "ended" ? (
            <span style={{
              fontSize: 10, letterSpacing: "2px", textTransform: "uppercase",
              color: "#555", background: "rgba(255,255,255,0.04)",
              border: "1px solid #222", padding: "3px 8px", borderRadius: 2,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Auction Ended
            </span>
          ) : (() => {
            const totalSecs = timer.d * 86400 + timer.h * 3600 + timer.m * 60 + timer.s;
            const isRed = totalSecs <= 3 * 3600;
            const color = isRed ? "#ff3b30" : "#00e676";
            const mutedColor = isRed ? "rgba(255,59,48,0.45)" : "rgba(0,230,118,0.45)";
            const isLastMin = totalSecs <= 60;

            const unitStyle: React.CSSProperties = {
              display: "flex", flexDirection: "column", alignItems: "center", minWidth: 64,
            };
            const digitStyle: React.CSSProperties = {
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 56, lineHeight: 1, letterSpacing: 3, color,
              transition: "color 0.5s ease",
              animation: isLastMin ? "blink 1s step-start infinite" : undefined,
            };
            const labelStyle: React.CSSProperties = {
              fontSize: 9, letterSpacing: "2.5px", textTransform: "uppercase",
              marginTop: 4, color: mutedColor, fontFamily: "'DM Sans', sans-serif",
            };
            const sepStyle: React.CSSProperties = {
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 48, lineHeight: 1, paddingTop: 4,
              color: mutedColor, userSelect: "none", transition: "color 0.5s ease",
            };
            const pad = (n: number) => String(n).padStart(2, "0");

            return (
              <>
                <style>{`@keyframes blink { 50% { opacity: 0.4; } }`}</style>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  {timer.d > 0 && (
                    <>
                      <div style={unitStyle}>
                        <span style={digitStyle}>{pad(timer.d)}</span>
                        <span style={labelStyle}>Days</span>
                      </div>
                      <span style={sepStyle}>:</span>
                    </>
                  )}
                  <div style={unitStyle}>
                    <span style={digitStyle}>{pad(timer.h)}</span>
                    <span style={labelStyle}>Hours</span>
                  </div>
                  <span style={sepStyle}>:</span>
                  <div style={unitStyle}>
                    <span style={digitStyle}>{pad(timer.m)}</span>
                    <span style={labelStyle}>Minutes</span>
                  </div>
                  <span style={sepStyle}>:</span>
                  <div style={unitStyle}>
                    <span style={digitStyle}>{pad(timer.s)}</span>
                    <span style={labelStyle}>Seconds</span>
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <span style={{
                    fontSize: 10, letterSpacing: "2px", textTransform: "uppercase",
                    color, background: isRed ? "rgba(255,59,48,0.08)" : "rgba(0,230,118,0.08)",
                    border: `1px solid ${isRed ? "rgba(255,59,48,0.2)" : "rgba(0,230,118,0.2)"}`,
                    padding: "3px 8px", borderRadius: 2, fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {isRed ? "Ending Soon" : "Live"}
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Type description */}
      {type === "experience" && (
        <p style={{ fontSize: 12, color: "#aaa", padding: "8px 20px 0" }}>
          Limited slots experience — highest bidder wins access
        </p>
      )}

      {type === "drop" && (
        <p style={{ fontSize: 12, color: "#aaa", padding: "8px 20px 0" }}>
          Physical collectible — winner gets ownership
        </p>
      )}

      {/* Current bid */}
      <div className="bp-current">
        <div className="bp-current-label">Highest Bid</div>
        <div className="bp-current-amount">{formatMoney(currentBid, currency)}</div>
        <div className="bp-current-sub">
          <span>Started at {formatMoney(startingBid, currency)}</span>
          <span className={`bp-reserve ${currentBid >= startingBid ? "met" : "unmet"}`}>
            {currentBid >= startingBid ? "Reserve Met" : "Reserve Not Met"}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="bp-progress-wrap">
        <div className="bp-progress-bar" style={{ width: `${percentAboveStart}%` }} />
      </div>

      {/* Input */}
      <div className="bp-input-area">
        <div className="bp-input-label">Your Bid</div>
        <div className="bp-input-row">
          <div className="bp-currency">{currency}</div>
        <input
          className="bp-input"
          type="number"
          min={minNext}
          step={effectiveIncrement}
          value={bidAmount === 0 ? "" : bidAmount}
          placeholder={String(minNext)}
          style={{ color: bidAmount === minNext ? "#666" : "#ffffff" }}
          onChange={(e) => {
            const value = e.target.value;
            handleBidChange(value === "" ? "" : Number(value));
          }}
        />
        <div className="bp-step-btns">
          <button className="bp-step-btn" onClick={() => handleBidChange(bidAmount + effectiveIncrement)}>▲</button>
          <div className="bp-step-divider" />
          <button className="bp-step-btn" onClick={() => handleBidChange(bidAmount - effectiveIncrement)}>▼</button>
        </div>
        </div>
      </div>

      {/* Quick increments */}
      <div className="bp-quick-row">
      {QUICK_INCREMENTS.map((mult) => {
        const amount = currentBid + mult * effectiveIncrement;
        return (
          <button key={mult} className="bp-quick-btn" onClick={() => setBidAmount(amount)}>
            +{formatMoney(mult * effectiveIncrement, currency)}
          </button>
        );
      })}
      </div>

      {/* Min notice */}
    <div className="bp-min-notice">
      Minimum bid: <span>{formatMoney(minNext, currency)}</span> · Increment: <span>{formatMoney(effectiveIncrement, currency)}</span>
    </div>

      {/* Status */}
      {status !== "idle" && (
        <div className={`bp-status ${status}`}>{statusMsg}</div>
      )}

      {/* Auction timing notice */}
      {timer.status === "upcoming" && (
        <div className="bp-status error">
          Bidding has not started yet
        </div>
      )}

      {timer.status === "ended" && (
        <div className="bp-status error">
          Auction has ended
        </div>
      )}

      {/* Submit */}
      <button
        className={`bp-submit ${loading ? "loading" : ""}`}
        onClick={handleSubmit}
        disabled={
          loading ||
          bidAmount <= currentBid ||
          bidAmount > currentBid * 5 ||
          timer.status !== "live"
        }
      >
        {loading
          ? "Placing Bid..."
          : timer.status === "upcoming"
          ? "Auction Not Started"
          : timer.status === "ended"
          ? "Auction Ended"
          : `${type === "experience" ? "Bid for Spot" : "Place Bid"} ${formatMoney(bidAmount, currency)}`}
      </button>

      {/* Secondary */}
      <div className="bp-secondary">
        <button className={`bp-watch-btn ${watched ? "active" : ""}`} onClick={handleWatch}>
          <span>{watched ? "♥" : "♡"}</span>
          <span>{watched ? "Watching" : "Add to Watchlist"}</span>
        </button>
        <button className="bp-share-btn" title="Share">↗</button>
      </div>
    </div>
  );
}