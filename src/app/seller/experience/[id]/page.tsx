"use client";

import { useState, useRef, useEffect } from "react";

const BORDER = "#1e1e1e";
const GOLD = "#D4AF37";
const BG = "#0d0d0d";
const CARD_BG = "#111";

type OrderStatus = "pending" | "confirmed" | "packing" | "packed" | "shipped" | "out_for_delivery" | "delivered" | "completed" | "cancelled";
type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

interface Order {
  id: string;
  auction_id: string;
  experience_id: string;
  user_id: string;
  amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pincode?: string;
  shipping_country?: string;
  tracking_number?: string;
  tracking_carrier?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  packed_date?: string;
  shipped_date?: string;
  delivered_date?: string;
  courier_name?: string;
  courier_website?: string;
  order_number: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}

interface Experience {
  id: string;
  title: string;
  images: string[];
  video?: string;
  name: string;
  description: string;
  kind_of_experience?: string;
  sub_type?: string;
  city?: string;
  venue_name?: string;
  venue_link?: string;
  experience_date?: string;
  experience_time?: string;
  duration?: string;
  group_size?: number;
  inclusions?: string[];
  special_notes?: string;
  cancellation_policy?: string;
}

interface User {
  full_name: string;
  email: string;
  phone?: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_ORDER: Order = {
  id: "ord_7f3a2c1d",
  auction_id: "auc_heritage_watch",
  experience_id: "exp_culinary_journey",
  user_id: "usr_rahul_mehta",
  amount: 24000,
  status: "confirmed",
  payment_status: "paid",
  shipping_address: "42, Lotus Heights, Powai",
  shipping_city: "Mumbai",
  shipping_state: "Maharashtra",
  shipping_pincode: "400076",
  shipping_country: "India",
  tracking_number: "BLR2025041200123",
  tracking_carrier: "BlueDart",
  estimated_delivery: "2025-04-18T18:00:00.000Z",
  courier_name: "BlueDart Express",
  courier_website: "https://www.bluedart.com",
  order_number: "7F3A2C1D-ORD",
  created_at: "2025-04-12T14:22:00.000Z",
  updated_at: "2025-04-12T15:40:00.000Z",
  notes: "Handle with care. Fragile items inside.",
};

const DUMMY_EXPERIENCE: Experience = {
  id: "exp_culinary_journey",
  title: "Curated Culinary Journey — A Farm-to-Table Saga",
  images: [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  ],
  name: "Chef Meera Pillai",
  description:
    "A full-day immersive farm-to-table experience hosted at an organic estate in Alibag. Guests start the morning harvesting seasonal produce, followed by a hands-on cooking masterclass, and conclude with a sunset long-table dinner prepared entirely from the day's harvest.",
  kind_of_experience: "Culinary",
  sub_type: "Farm-to-Table",
  city: "Alibag",
  venue_name: "Green Horizon Organic Estate",
  venue_link: "https://maps.google.com",
  experience_date: "2025-05-10",
  experience_time: "09:00 AM",
  duration: "10 hours",
  group_size: 12,
  inclusions: [
    "Guided farm walk & harvest session",
    "Cooking masterclass with Chef Meera",
    "All ingredients and equipment",
    "Sunset long-table dinner",
    "Return ferry transfer from Gateway of India",
  ],
  special_notes: "Please wear comfortable, closed-toe footwear. Vegetarian menu only.",
  cancellation_policy: "Full refund if cancelled 7+ days before. 50% refund within 3–7 days. No refund within 72 hours.",
};

const DUMMY_BUYER: User = {
  full_name: "Rahul Mehta",
  email: "rahul.mehta@outlook.com",
  phone: "+91 91234 56789",
};

const DUMMY_QUERIES = [
  {
    id: "q1",
    sender: "buyer",
    message: "Hi! Will there be transport from Mumbai to the farm?",
    created_at: "2025-04-12T14:35:00.000Z",
  },
  {
    id: "q2",
    sender: "seller",
    message: "Yes, a ferry departs from Gateway of India at 8:00 AM. We'll send the boarding pass to your email.",
    created_at: "2025-04-12T15:10:00.000Z",
  },
  {
    id: "q3",
    sender: "buyer",
    message: "Perfect! Can I bring my partner along?",
    created_at: "2025-04-12T15:20:00.000Z",
  },
  {
    id: "q4",
    sender: "seller",
    message: "Absolutely, extra guests can be added for ₹6,000 per person. Let me know!",
    created_at: "2025-04-12T15:35:00.000Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function SellerExperienceOrderPage() {
  const [order, setOrder] = useState<Order>(DUMMY_ORDER);
  const experience = DUMMY_EXPERIENCE;
  const buyer = DUMMY_BUYER;

  const [updating, setUpdating] = useState(false);
  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [showPackingForm, setShowPackingForm] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    trackingNumber: order.tracking_number || "",
    carrier: order.tracking_carrier || "",
    courierName: order.courier_name || "",
    courierWebsite: order.courier_website || "",
    estimatedDays: 5,
  });
  const [packingForm, setPackingForm] = useState({
    weight: "",
    dimensions: "",
    packingNotes: "",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [queries, setQueries] = useState(DUMMY_QUERIES);
  const [selectedMedia, setSelectedMedia] = useState<{ type: "image" | "video"; src: string }>({
    type: "image",
    src: experience.images[0],
  });
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setQueries((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: "seller",
        message: newMessage,
        created_at: new Date().toISOString(),
      },
    ]);
    setNewMessage("");
  };

  const updateOrderStatus = (newStatus: OrderStatus, additionalData?: Partial<Order>) => {
    setUpdating(true);
    setMessage(null);
    setTimeout(() => {
      const updateData: Partial<Order> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...additionalData,
      };
      if (newStatus === "packed") updateData.packed_date = new Date().toISOString();
      if (newStatus === "shipped") updateData.shipped_date = new Date().toISOString();
      if (newStatus === "delivered") updateData.delivered_date = new Date().toISOString();

      setOrder((prev) => ({ ...prev, ...updateData }));

      const statusMessages: Record<OrderStatus, string> = {
        pending: "Order is pending",
        confirmed: "Order confirmed successfully",
        packing: "Order preparation started",
        packed: "Item packed and ready for shipping",
        shipped: "Item shipped successfully",
        out_for_delivery: "Item is out for delivery",
        delivered: "Order delivered successfully",
        completed: "Order completed successfully",
        cancelled: "Order cancelled",
      };
      setMessage({ type: "success", text: statusMessages[newStatus] || `Status updated to ${newStatus}` });
      setShowTrackingForm(false);
      setShowPackingForm(false);
      setUpdating(false);
    }, 400);
  };

  const addTrackingInfo = () => {
    if (!trackingForm.trackingNumber || !trackingForm.carrier) {
      setMessage({ type: "error", text: "Please enter tracking number and carrier" });
      return;
    }
    setUpdating(true);
    setTimeout(() => {
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + trackingForm.estimatedDays);
      setOrder((prev) => ({
        ...prev,
        tracking_number: trackingForm.trackingNumber,
        tracking_carrier: trackingForm.carrier,
        courier_name: trackingForm.courierName,
        courier_website: trackingForm.courierWebsite,
        estimated_delivery: estimatedDate.toISOString(),
      }));
      setMessage({ type: "success", text: "Tracking information added successfully" });
      setShowTrackingForm(false);
      setUpdating(false);
    }, 400);
  };

  const addPackingInfo = () => {
    setUpdating(true);
    setTimeout(() => {
      setOrder((prev) => ({ ...prev, notes: packingForm.packingNotes }));
      setMessage({ type: "success", text: "Packing information saved" });
      setShowPackingForm(false);
      if (order.status === "confirmed") updateOrderStatus("packing");
      setUpdating(false);
    }, 400);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "#f59e0b",
      confirmed: "#3b82f6",
      completed: "#22c55e",
      cancelled: "#ef4444",
    };
    return colors[status] || "#888";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = { confirmed: "✓", completed: "🏁" };
    return icons[status] || "○";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#fff", padding: "40px 60px" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Order Fulfillment</h1>
          <p style={{ color: "#aaa" }}>
            Order #{order.order_number?.slice(0, 8) || order.id?.slice(0, 8)}
          </p>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
            background: message.type === "success" ? "#22c55e20" : "#ef444420",
            border: `1px solid ${message.type === "success" ? "#22c55e" : "#ef4444"}`,
            color: message.type === "success" ? "#22c55e" : "#ef4444",
          }}
        >
          {message.text}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24 }}>

        {/* ── Left Column ── */}
        <div>
          {/* Experience Card */}
          <div
            style={{
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              background: CARD_BG,
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            {/* Main Media */}
            {selectedMedia.type === "video" ? (
              <video
                src={selectedMedia.src}
                controls
                style={{ width: "100%", height: 350, objectFit: "contain", background: "#000" }}
              />
            ) : (
              <img
                src={selectedMedia.src}
                style={{ width: "100%", height: 350, objectFit: "cover", background: "#000" }}
                alt={experience.title}
              />
            )}

            {/* Thumbnails */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px" }}>
              {experience.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  onClick={() => setSelectedMedia({ type: "image", src: img })}
                  style={{
                    width: 80,
                    height: 60,
                    objectFit: "cover",
                    background: "#000",
                    borderRadius: 6,
                    border: selectedMedia.src === img ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
                    cursor: "pointer",
                  }}
                />
              ))}
              {experience.video && (
                <div
                  onClick={() => setSelectedMedia({ type: "video", src: experience.video! })}
                  style={{
                    width: 80, height: 60, borderRadius: 6,
                    border: selectedMedia.type === "video" ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "#000", color: "#fff", fontSize: 10, cursor: "pointer",
                  }}
                >
                  ▶ Video
                </div>
              )}
            </div>

            <div style={{ padding: 20 }}>
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>{experience.title}</h2>
              <p style={{ fontSize: 13, color: "#aaa", marginBottom: 8 }}>
                Category: {experience.kind_of_experience}
              </p>
              <p style={{ fontSize: 14, color: "#888", lineHeight: 1.5 }}>{experience.description}</p>

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  <strong>Type:</strong> {experience.kind_of_experience} / {experience.sub_type}
                </p>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  <strong>Venue:</strong> {experience.venue_name} ({experience.city})
                </p>
                {experience.venue_link && (
                  <a
                    href={experience.venue_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: GOLD, textDecoration: "underline" }}
                  >
                    View Location
                  </a>
                )}
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  <strong>Date:</strong> {experience.experience_date}
                </p>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  <strong>Time:</strong> {experience.experience_time}
                </p>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  <strong>Duration:</strong> {experience.duration}
                </p>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  <strong>Guests Allowed:</strong> {experience.group_size}
                </p>

                {experience.inclusions && experience.inclusions.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    <p style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>
                      <strong>Inclusions:</strong>
                    </p>
                    {experience.inclusions.map((inc, i) => (
                      <p key={i} style={{ fontSize: 12, color: "#888" }}>• {inc}</p>
                    ))}
                  </div>
                )}

                {experience.special_notes && (
                  <p style={{ fontSize: 12, color: "#888" }}>
                    <strong>Notes:</strong> {experience.special_notes}
                  </p>
                )}
                {experience.cancellation_policy && (
                  <p style={{ fontSize: 12, color: "#888" }}>
                    <strong>Cancellation:</strong> {experience.cancellation_policy}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div
            style={{
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              background: CARD_BG,
              padding: 20,
            }}
          >
            <h3 style={{ fontSize: 16, marginBottom: 16, color: GOLD }}>Customer Details</h3>
            <p style={{ marginBottom: 8 }}><strong>Name:</strong> {buyer.full_name}</p>
            <p style={{ marginBottom: 8 }}><strong>Email:</strong> {buyer.email}</p>
            <p style={{ marginBottom: 8 }}><strong>Phone:</strong> {buyer.phone}</p>

            {order.shipping_address && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
                <p style={{ marginBottom: 8 }}><strong>Shipping Address:</strong></p>
                <p style={{ color: "#aaa", lineHeight: 1.5 }}>
                  {order.shipping_address}<br />
                  {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}<br />
                  {order.shipping_country || "India"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column ── */}
        <div>
          {/* Order Status */}
          <div
            style={{
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              background: CARD_BG,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, color: GOLD }}>Order Status</h3>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  background: `${getStatusColor(order.status)}20`,
                  color: getStatusColor(order.status),
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {order.status.toUpperCase().replace(/_/g, " ")}
              </span>
            </div>

            {/* Status Timeline */}
            <div style={{ marginBottom: 24 }}>
              {(["confirmed", "completed"] as OrderStatus[]).map((status, idx) => {
                const isCompleted =
                  order.status === status ||
                  (status === "confirmed" && ["confirmed", "completed"].includes(order.status));
                const isActive = order.status === status;

                return (
                  <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                    <div
                      style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: isCompleted ? GOLD : BORDER,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginRight: 12, fontSize: 14,
                      }}
                    >
                      {isCompleted ? getStatusIcon(status) : idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: isCompleted ? 600 : 400, color: isActive ? GOLD : "#fff" }}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {order.status === "pending" && (
                <button
                  onClick={() => updateOrderStatus("confirmed")}
                  disabled={updating}
                  style={{
                    padding: "10px 20px", background: GOLD, border: "none",
                    borderRadius: 6, cursor: updating ? "not-allowed" : "pointer",
                    fontWeight: 600, color: "#000",
                  }}
                >
                  Confirm Booking
                </button>
              )}
              {order.status === "confirmed" && (
                <button
                  onClick={() => updateOrderStatus("completed")}
                  disabled={updating}
                  style={{
                    padding: "10px 20px", background: GOLD, border: "none",
                    borderRadius: 6, cursor: updating ? "not-allowed" : "pointer",
                    fontWeight: 600, color: "#000",
                  }}
                >
                  Mark as Completed
                </button>
              )}
              {order.status !== "cancelled" && order.status !== "completed" && (
                <button
                  onClick={() => updateOrderStatus("cancelled")}
                  disabled={updating}
                  style={{
                    padding: "10px 20px", background: "transparent",
                    border: `1px solid #ef4444`, borderRadius: 6,
                    cursor: updating ? "not-allowed" : "pointer", color: "#ef4444",
                  }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div
            style={{
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              background: CARD_BG,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <h3 style={{ fontSize: 16, marginBottom: 12, color: GOLD }}>Order Summary</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>Experience Price:</span>
              <span>₹{order.amount.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>Payment Status:</span>
              <span style={{ color: order.payment_status === "paid" ? "#22c55e" : "#f59e0b" }}>
                {order.payment_status.toUpperCase()}
              </span>
            </div>
            <div
              style={{
                display: "flex", justifyContent: "space-between",
                marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}`,
              }}
            >
              <span><strong>Total</strong></span>
              <span><strong style={{ color: GOLD }}>₹{order.amount.toLocaleString()}</strong></span>
            </div>
            <p style={{ fontSize: 11, color: "#666", marginTop: 12 }}>
              Order placed: {formatDate(order.created_at)}
            </p>
          </div>

          {/* Bidder Queries */}
          <div
            style={{
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              background: CARD_BG,
              padding: 20,
            }}
          >
            <h3 style={{ fontSize: 16, marginBottom: 12, color: GOLD }}>Bidder Queries</h3>
            <div
              style={{
                display: "flex", flexDirection: "column", gap: 10,
                maxHeight: 300, overflowY: "auto",
                padding: 10, background: "#0d0d0d", borderRadius: 8,
              }}
            >
              {queries.length === 0 ? (
                <div style={{ color: "#888", fontSize: 13 }}>No queries yet.</div>
              ) : (
                queries.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      alignSelf: q.sender === "buyer" ? "flex-start" : "flex-end",
                      background: q.sender === "buyer" ? "#1e1e1e" : GOLD,
                      color: q.sender === "buyer" ? "#fff" : "#000",
                      padding: "8px 12px",
                      borderRadius: 12,
                      maxWidth: "70%",
                      fontSize: 13,
                    }}
                  >
                    <div>{q.message}</div>
                    <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>
                      {new Date(q.created_at).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                style={{
                  flex: 1, padding: "8px 10px", borderRadius: 6,
                  border: `1px solid ${BORDER}`, background: "#0d0d0d",
                  color: "#fff", fontSize: 13,
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: "8px 14px", background: GOLD, border: "none",
                  borderRadius: 6, cursor: "pointer", fontWeight: 600, color: "#000",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}