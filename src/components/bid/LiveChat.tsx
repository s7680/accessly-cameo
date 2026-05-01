"use client";

import { useState, useRef, useEffect } from "react";

export interface ChatMessage {
  id: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  timestamp: Date;
  type?: "message" | "bid_event" | "system";
  bidAmount?: number;
}

interface LiveChatProps {
  messages: ChatMessage[];
  currentUserName?: string;
  currency?: string;
  onSend?: (text: string) => void;
  viewerCount?: number;
}

function formatMoney(n: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

function timeLabel(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const hour12 = h % 12 || 12;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hour12.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")} ${ampm}`;
}

const QUICK_REPLIES = ["🔥", "👏", "👀", "🙌", "Wow!", "Congrats!"];

export default function LiveChat({
  messages: initialMessages,
  currentUserName = "You",
  currency = "USD",
  onSend,
  viewerCount = 0,
}: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [atBottom, setAtBottom] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (atBottom && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, atBottom]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    setAtBottom(isAtBottom);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: `local-${Date.now()}`,
      authorName: currentUserName,
      text,
      timestamp: new Date(),
      type: "message",
    };
    setMessages((prev) => [...prev, msg]);
    onSend?.(text);
    setInput("");
    setAtBottom(true);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    setAtBottom(true);
  };

  return (
    <div className="live-chat">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .live-chat {
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          height: 480px;
          min-height: 0;
        }

        /* Header */
        .lc-header {
          background: #111;
          border-bottom: 1px solid #1e1e1e;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .lc-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 4px;
          color: #e0e0e0;
        }
        .lc-live-badge {
          background: #ff3b30;
          color: #fff;
          font-size: 9px;
          letter-spacing: 2px;
          padding: 2px 6px;
          border-radius: 2px;
          animation: livePulse 2s infinite;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .lc-viewers {
          font-size: 11px;
          color: #555;
          display: flex;
          align-items: center;
          gap: 5px;
          letter-spacing: 1px;
        }
        .lc-viewers span { color: #888; }
        .lc-eye { font-size: 12px; }

        /* Message list */
        .lc-messages {
          flex: 1;
          overflow-y: auto;
          padding: 10px 0;
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: #222 transparent;
        }
        .lc-messages::-webkit-scrollbar { width: 4px; }
        .lc-messages::-webkit-scrollbar-track { background: transparent; }
        .lc-messages::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }

        /* Message types */
        .lc-msg {
          padding: 5px 16px;
          display: flex;
          gap: 9px;
          align-items: flex-start;
          transition: background 0.1s;
        }
        .lc-msg:hover { background: rgba(255,255,255,0.02); }

        /* Bid event */
        .lc-msg.bid-event {
          background: rgba(255,176,0,0.05);
          border-left: 2px solid rgba(255,176,0,0.4);
          margin: 4px 0;
          padding: 8px 16px;
        }

        /* System message */
        .lc-msg.system {
          justify-content: center;
          padding: 6px 16px;
        }
        .lc-system-text {
          font-size: 11px;
          color: #444;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-align: center;
          border-top: 1px solid #1a1a1a;
          border-bottom: 1px solid #1a1a1a;
          padding: 4px 12px;
          width: 100%;
        }

        .lc-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          color: #555;
          flex-shrink: 0;
          border: 1px solid #222;
          object-fit: cover;
          margin-top: 1px;
        }
        .lc-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .lc-msg-body { flex: 1; min-width: 0; }
        .lc-msg-top {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 2px;
        }
        .lc-author {
          font-size: 12px;
          font-weight: 600;
          color: #888;
          white-space: nowrap;
        }
        .lc-msg.bid-event .lc-author { color: #ffb000; }
        .lc-time {
          font-size: 10px;
          color: #333;
          flex-shrink: 0;
        }
        .lc-text {
          font-size: 13px;
          color: #777;
          line-height: 1.5;
          word-break: break-word;
        }
        .lc-msg.bid-event .lc-text {
          color: #aaa;
        }
        .lc-bid-amount {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          color: #ffb000;
          letter-spacing: 1px;
        }

        /* Scroll to bottom */
        .lc-scroll-btn {
          position: absolute;
          bottom: 70px;
          right: 16px;
          background: #111;
          border: 1px solid #2a2a2a;
          color: #ffb000;
          font-size: 11px;
          letter-spacing: 1px;
          padding: 5px 10px;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 5;
        }
        .lc-scroll-btn:hover { background: #1a1a1a; }

        /* Input area */
        .lc-input-area {
          border-top: 1px solid #1a1a1a;
          background: #111;
          padding: 8px;
          flex-shrink: 0;
        }
        .lc-quick-replies {
          display: flex;
          gap: 5px;
          margin-bottom: 7px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .lc-quick-replies::-webkit-scrollbar { display: none; }
        .lc-qr-btn {
          background: #161616;
          border: 1px solid #1e1e1e;
          color: #666;
          font-size: 12px;
          padding: 4px 9px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .lc-qr-btn:hover {
          border-color: #333;
          color: #999;
          background: #1a1a1a;
        }

        .lc-input-row {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .lc-input {
          flex: 1;
          background: #161616;
          border: 1px solid #222;
          outline: none;
          color: #ccc;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          padding: 9px 12px;
          transition: border-color 0.2s;
        }
        .lc-input:focus { border-color: #333; }
        .lc-input::placeholder { color: #444; }

        .lc-send-btn {
          background: #ffb000;
          border: none;
          color: #0a0a0a;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          letter-spacing: 2px;
          padding: 9px 16px;
          cursor: pointer;
          transition: opacity 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .lc-send-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .lc-send-btn:not(:disabled):hover { opacity: 0.85; }
      `}</style>

      {/* Header */}
      <div className="lc-header">
        <div className="lc-title">
          Live Chat <span className="lc-live-badge">LIVE</span>
        </div>
        <div className="lc-viewers">
          <span className="lc-eye">👁</span>
          <span>{viewerCount.toLocaleString()}</span> watching
        </div>
      </div>

      {/* Messages */}
      <div style={{ position: "relative", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div className="lc-messages" ref={listRef} onScroll={handleScroll}>
          {messages.map((msg) => {
            if (msg.type === "system") {
              return (
                <div key={msg.id} className="lc-msg system">
                  <div className="lc-system-text">{msg.text}</div>
                </div>
              );
            }
            if (msg.type === "bid_event") {
              return (
                <div key={msg.id} className="lc-msg bid-event">
                  <div className="lc-avatar">⚡</div>
                  <div className="lc-msg-body">
                    <div className="lc-msg-top">
                      <span className="lc-author">{msg.authorName}</span>
                      <span className="lc-time">{timeLabel(msg.timestamp)}</span>
                    </div>
                    <div className="lc-text">
                      placed a bid of{" "}
                      <span className="lc-bid-amount">
                        {msg.bidAmount ? formatMoney(msg.bidAmount, currency) : ""}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={msg.id} className="lc-msg">
                <div className="lc-avatar">
                  {msg.authorAvatar ? (
                    <img src={msg.authorAvatar} alt={msg.authorName} />
                  ) : (
                    msg.authorName[0].toUpperCase()
                  )}
                </div>
                <div className="lc-msg-body">
                  <div className="lc-msg-top">
                    <span className="lc-author">{msg.authorName}</span>
                    <span className="lc-time">{timeLabel(msg.timestamp)}</span>
                  </div>
                  <div className="lc-text">{msg.text}</div>
                </div>
              </div>
            );
          })}
        </div>

        {!atBottom && (
          <button className="lc-scroll-btn" onClick={scrollToBottom}>
            ↓ New messages
          </button>
        )}
      </div>

      {/* Input */}
      <div className="lc-input-area">
        <div className="lc-quick-replies">
          {QUICK_REPLIES.map((qr) => (
            <button
              key={qr}
              className="lc-qr-btn"
              onClick={() => {
                const msg: ChatMessage = {
                  id: `qr-${Date.now()}`,
                  authorName: currentUserName,
                  text: qr,
                  timestamp: new Date(),
                  type: "message",
                };
                setMessages((prev) => [...prev, msg]);
                onSend?.(qr);
                setAtBottom(true);
              }}
            >
              {qr}
            </button>
          ))}
        </div>
        <div className="lc-input-row">
          <input
            ref={inputRef}
            className="lc-input"
            placeholder="Say something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            maxLength={200}
          />
          <button className="lc-send-btn" onClick={handleSend} disabled={!input.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}