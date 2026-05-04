"use client";

import { useState, useRef, useEffect } from "react";
import { getExperienceById as getSellerExperienceById } from "@/lib/db/profile/seller/listings";
import { useParams } from "next/navigation";
import { updateOrderByListingId } from "@/lib/db/profile/seller/listings";
import { sendMessage as sendMessageToDB } from "@/lib/db/profile/seller/listings";
import { supabase } from "@/lib/supabaseClient";




const BORDER = "#1e1e1e";
const GOLD = "#D4AF37";
const BG = "#0d0d0d";
const CARD_BG = "#111";

type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled";
type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

interface Order {
  id: string;
  auction_id: string;
  experience_id: string;
  user_id: string;
  amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  order_number: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  special_request?: string;
  availability?: string;
  reschedule_requested?: boolean;
  reschedule_datetime?: string;
  cancel_requested?: boolean;
  cancel_accepted?: boolean | string;
}

interface Experience {
  id: string;
  title: string;
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


export default function SellerExperienceOrderPage() {
  // Initial state: null, will be loaded from backend
  const [order, setOrder] = useState<any>(null);
  const [experience, setExperience] = useState<any>(null);
  const [buyer, setBuyer] = useState<any>(null);

  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [queries, setQueries] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const params = useParams();
  const experienceId = params?.id as string;
  console.log("[SELLER PAGE] Received experience_id:", experienceId);
  console.log("[SELLER PAGE] Params object:", params);

  useEffect(() => {
    inputRef.current?.focus();

    const loadExperience = async () => {
      const data = await getSellerExperienceById(experienceId);
      if (!data) {
        console.error("No experience found for id:", experienceId);
        return;
      }
      setExperience(data);
      setBuyer(data?.winner || null);
      setOrder((prev: any) => prev && Object.keys(prev).length ? prev : (data?.order || {}));
      setQueries(data?.messages || []);
      console.log("[SELLER UI ORDER]:", data?.order);
      console.log("[SELLER MESSAGES]:", data?.messages);
    };
    loadExperience();
  }, [experienceId]);


  const sendMessage = async () => {
    if (!newMessage.trim() || !experienceId) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      console.error("No logged in user");
      return;
    }

    const msg = await sendMessageToDB(
      experienceId,
      user.id,
      "seller",
      newMessage
    );

    if (!msg) return;

    setQueries((prev) => [...prev, msg]);
    setNewMessage("");
  };

  const updateOrderStatus = async (newStatus: OrderStatus) => {
    setUpdating(true);
    setMessage(null);

    const updated = await updateOrderByListingId(experience.id, {
      status: newStatus,
    });

    if (updated) {
      setOrder((prev: any) => ({ ...prev, ...updated }));

      const statusMessages: Record<OrderStatus, string> = {
        pending: "Order is pending",
        confirmed: "Order confirmed successfully",
        completed: "Order completed successfully",
        cancelled: "Order cancelled",
      };

      setMessage({ type: "success", text: statusMessages[newStatus] });
    }

    setUpdating(false);
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

  // Null safety: loading state
  if (!experience) {
    return <div style={{ color: "#fff", padding: 40 }}>Loading...</div>;
  }

  // Debug log for order status
  console.log("[ORDER STATUS]:", order?.status);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#fff", padding: "40px 60px" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Order Fulfillment</h1>
          <p style={{ color: "#aaa" }}>
            Order #{order?.order_number?.slice(0, 8) || order?.id?.slice(0, 8)}
          </p>
        </div>
      </div>
      <div style={{ marginBottom: 12, fontSize: 12, color: "#888" }}>
        Debug experience_id: {experienceId || "No ID received"}
      </div>

      {/* Broadcast Banner for Cancellation Info */}
      {(order?.cancel_requested === true ||
        order?.cancel_accepted === "Yes" ||
        order?.cancel_accepted === true ||
        order?.status === "cancelled") && (
        <div
          style={{
            padding: 16,
            borderRadius: 10,
            marginBottom: 20,
            background: "#ef444420",
            border: "1px solid #ef4444",
            color: "#ef4444",
            fontWeight: 700,
            fontSize: 18,
            textAlign: "center",
          }}
        >
          {order?.cancel_requested === true
            ? "Cancellation: Booking Cancelled by You"
            : (order?.cancel_accepted === "Yes" || order?.cancel_accepted === true)
            ? "Cancellation: Booking Cancelled by You"
            : order?.status === "cancelled"
            ? "Cancellation: Booking Cancelled"
            : ""}
        </div>
      )}

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
            <div style={{ padding: 20 }}>
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>{experience.display_name}</h2>
              <p style={{ fontSize: 13, color: "#aaa", marginBottom: 8 }}>
                Category: {experience.category}
              </p>
              <p style={{ fontSize: 14, color: "#888", lineHeight: 1.5 }}>{experience.about_experience}</p>

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  <strong>Location:</strong> {experience.location}
                </p>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  <strong>Date:</strong> {formatDate(experience.experience_date)}
                </p>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  <strong>Time:</strong> {experience.start_time}
                </p>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  <strong>Duration:</strong> {experience.duration} mins
                </p>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  <strong>Guests Allowed:</strong> {experience.guests}
                </p>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  <strong>Fan Benefits:</strong> {experience.fan_benefits}
                </p>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  <strong>Status:</strong> {experience.status}
                </p>
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
            <p style={{ marginBottom: 8 }}>
              <strong>Name:</strong> {buyer?.full_name || "Not available"}
            </p>
            <p style={{ marginBottom: 8 }}>
              <strong>Email:</strong> {buyer?.email || "Not available"}
            </p>
            <p style={{ marginBottom: 8 }}>
              <strong>Phone:</strong> {buyer?.phone || "Not available"}
            </p>
            <p style={{ marginTop: 10, color: "#facc15" }}>
              <strong>Special Request:</strong> {order?.special_request || "N.A"}
            </p>
            <p style={{ marginTop: 6 }}>
              <strong>Availability:</strong> {order?.availability || "N.A"}
            </p>
            <div style={{ marginTop: 10 }}>
              <p style={{ marginBottom: 6 }}>
                <strong>Reschedule:</strong> 
                {order?.reschedule_requested
                  ? order?.reschedule_accepted === "Yes"
                    ? "You accepted reschedule"
                    : order?.reschedule_accepted === "No"
                    ? "You rejected reschedule"
                    : order?.reschedule_datetime
                    ? new Date(order.reschedule_datetime).toLocaleString()
                    : "Requested"
                  : "N.A"}
              </p>

              {order?.reschedule_requested === true && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    disabled={order?.reschedule_accepted !== undefined && order?.reschedule_accepted !== null}
                    onClick={async () => {
                      const updated = await updateOrderByListingId(experience.id, {
                        reschedule_accepted: "Yes",
                        status: "confirmed",
                      });

                      if (updated) {
                        setOrder((prev: any) => ({ ...prev, ...updated }));
                        setMessage({ type: "success", text: "Reschedule accepted" });
                      }
                    }}
                    style={{
                      padding: "6px 12px",
                      background: GOLD,
                      border: "none",
                      borderRadius: 6,
                      cursor: (order?.reschedule_accepted !== undefined && order?.reschedule_accepted !== null) ? "not-allowed" : "pointer",
                      color: "#000",
                      fontSize: 12,
                      fontWeight: 600,
                      opacity: (order?.reschedule_accepted !== undefined && order?.reschedule_accepted !== null) ? 0.5 : 1,
                    }}
                  >
                    Accept
                  </button>

                  <button
                    disabled={order?.reschedule_accepted !== undefined && order?.reschedule_accepted !== null}
                    onClick={async () => {
                      const updated = await updateOrderByListingId(experience.id, {
                        reschedule_accepted: "No",
                      });

                      if (updated) {
                        setOrder((prev: any) => ({ ...prev, ...updated }));
                        setMessage({ type: "error", text: "Reschedule rejected" });
                      }
                    }}
                    style={{
                      padding: "6px 12px",
                      background: "transparent",
                      border: "1px solid #ef4444",
                      borderRadius: 6,
                      cursor: (order?.reschedule_accepted !== undefined && order?.reschedule_accepted !== null) ? "not-allowed" : "pointer",
                      color: "#ef4444",
                      fontSize: 12,
                      fontWeight: 600,
                      opacity: (order?.reschedule_accepted !== undefined && order?.reschedule_accepted !== null) ? 0.5 : 1,
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
            <p style={{ marginTop: 6, color: "#ef4444" }}>
              <strong>Cancellation:</strong>{" "}
              {order?.cancel_requested
                ? (order?.cancel_accepted === "Yes" || order?.cancel_accepted === true)
                  ? "Booking Cancelled by You"
                  : order?.cancel_accepted === "No"
                  ? "Cancellation rejected"
                  : "Booking Cancelled by Fan"
                : "N.A"}
            </p>
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
                  background: `${getStatusColor(order?.status)}20`,
                  color: getStatusColor(order?.status),
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {order?.status?.toUpperCase().replace(/_/g, " ")}
              </span>
            </div>


            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {order?.status === "pending" && (
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
              {/* --- Robust and fallback logic for Mark as Completed button --- */}
              {(order && order?.status !== "completed" && order?.status !== "cancelled") && (
                <button
                  onClick={async () => {
                    const updated = await updateOrderByListingId(experience.id, {
                      status: "completed",
                      order_completed: "Yes",
                    });

                    if (updated) {
                      setOrder((prev: any) => ({ ...prev, ...updated }));
                      setMessage({ type: "success", text: "Order marked as completed" });
                    }
                  }}
                  disabled={
                    updating ||
                    order?.order_completed === "Yes" ||
                    order?.cancel_accepted === "Yes" ||
                    order?.cancel_accepted === true ||
                    order?.cancel_requested === true
                  }
                  style={{
                    padding: "10px 20px",
                    background: GOLD,
                    border: "none",
                    borderRadius: 6,
                    cursor: (
                      updating ||
                      order?.order_completed === "Yes" ||
                      order?.cancel_accepted === "Yes" ||
                      order?.cancel_accepted === true ||
                      order?.cancel_requested === true
                    ) ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    color: "#000",
                    opacity: (
                      updating ||
                      order?.order_completed === "Yes" ||
                      order?.cancel_accepted === "Yes" ||
                      order?.cancel_accepted === true ||
                      order?.cancel_requested === true
                    ) ? 0.5 : 1,
                  }}
                >
                  Mark as Completed
                </button>
              )}
              {order?.status !== "cancelled" && order?.status !== "completed" && (
                <button
                  onClick={async () => {
                    const updated = await updateOrderByListingId(experience.id, {
                      cancel_accepted: true,
                      status: "cancelled",
                    });

                    if (updated) {
                      setOrder((prev: any) => ({ ...prev, ...updated }));
                      setMessage({ type: "success", text: "You have cancelled the order" });
                    }
                  }}
                  disabled={updating || order?.cancel_accepted === "Yes" || order?.cancel_accepted === true || order?.cancel_requested === true}
                  style={{
                    padding: "10px 20px",
                    background: "transparent",
                    border: `1px solid #ef4444`,
                    borderRadius: 6,
                    cursor: (updating || order?.cancel_accepted === "Yes" || order?.cancel_accepted === true || order?.cancel_requested === true) ? "not-allowed" : "pointer",
                    color: "#ef4444",
                    opacity: (updating || order?.cancel_accepted === "Yes" || order?.cancel_accepted === true || order?.cancel_requested === true) ? 0.5 : 1,
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
              <span>Winning Bid:</span>
              <span>₹{order?.amount?.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>Payment Status:</span>
              <span style={{ color: "#22c55e" }}>
                PAID
              </span>
            </div>
            <div
              style={{
                display: "flex", justifyContent: "space-between",
                marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}`,
              }}
            >
              <span><strong>Total</strong></span>
              <span><strong style={{ color: GOLD }}>₹{order?.amount?.toLocaleString()}</strong></span>
            </div>
            <p style={{ fontSize: 12, marginTop: 8 }}>
              <strong>Order Completed:</strong> {order?.order_completed || "No"}
            </p>
            <p style={{ fontSize: 11, color: "#666", marginTop: 12 }}>
              Order placed: {formatDate(order?.created_at)}
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
                      alignSelf: q.sender_role === "buyer" ? "flex-start" : "flex-end",
                      background: q.sender_role === "buyer" ? "#1e1e1e" : GOLD,
                      color: q.sender_role === "buyer" ? "#fff" : "#000",
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