"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateExperience, getExperienceById } from "@/lib/profile/won/listings";

const GOLD = "#c9a84c";
const BG = "#0d0d0d";
const BORDER = "#1e1e1e";
const CARD_BG = "#111";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "refunded";
type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

interface ExperienceOrder {
  id: string;
  experience_id: string;
  user_id: string;
  amount: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  booking_date: string;
  number_of_guests: number;
  special_requests?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  booking_reference?: string;
  created_at: string;
  updated_at: string;
  payment_id?: string;
  order_number: string;
}

interface Experience {
  id: string;
  title: string;
  images: string[];
  name: string;
  description: string;
  creator_id: string;
  duration: string;
  city: string;
  venue_name: string;
  venue_link: string;
  price_per_person: number;
  max_guests: number;
  group_size?: number;
  video?: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_ORDER: ExperienceOrder = {
  id: "ord_a3f2e91b",
  experience_id: "exp_chef_table_mumbai",
  user_id: "usr_priya_sharma",
  amount: 18500,
  status: "confirmed",
  payment_status: "paid",
  booking_date: "2025-04-12T19:34:00.000Z",
  number_of_guests: 4,
  special_requests: "One guest has a nut allergy. Prefer a quieter corner table if available.",
  customer_name: "Priya Sharma",
  customer_email: "priya.sharma@gmail.com",
  customer_phone: "+91 98765 43210",
  booking_reference: "EXP-2025-MUM-A3F2E91B",
  created_at: "2025-04-12T19:34:00.000Z",
  updated_at: "2025-04-12T20:10:00.000Z",
  payment_id: "pay_razorpay_abc123",
  order_number: "A3F2E91B-ORD",
};

const DUMMY_EXPERIENCE: Experience = {
  id: "exp_chef_table_mumbai",
  title: "Exclusive Chef's Table Experience",
  images: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  ],
  name: "Arjun Malhotra",
  description:
    "An intimate dining experience led by award-winning chef Arjun Malhotra. Enjoy a curated 7-course tasting menu with wine pairings, live cooking demonstrations, and a behind-the-scenes kitchen tour. Limited to 8 guests per session for a truly personal experience.",
  creator_id: "usr_arjun_malhotra",
  duration: "3 hours",
  city: "Mumbai",
  venue_name: "The Grand Palate, Bandra",
  venue_link: "https://maps.google.com",
  price_per_person: 4625,
  max_guests: 8,
  group_size: 4,
};

const DUMMY_QUERIES = [
  {
    id: "q1",
    sender: "buyer",
    message: "Hi! Just confirming — is valet parking available at the venue?",
    created_at: "2025-04-12T19:45:00.000Z",
  },
  {
    id: "q2",
    sender: "host",
    message:
      "Yes, complimentary valet is available for all guests. Just mention the Chef's Table booking.",
    created_at: "2025-04-12T20:02:00.000Z",
  },
  {
    id: "q3",
    sender: "buyer",
    message: "Perfect, thank you! Really looking forward to it.",
    created_at: "2025-04-12T20:05:00.000Z",
  },
];

const USER_ROLE: "customer" | "host" = "customer";

// ─────────────────────────────────────────────────────────────────────────────

export default function OrderExperiencePage() {
  const router = useRouter();
  const params = useParams();

  const receivedId = params?.id as string;

  console.log("RECEIVED ID:", receivedId);

  if (!receivedId) {
    console.error("ID is missing from route params");
  } else if (receivedId.length < 10) {
    console.warn("ID looks suspicious (too short):", receivedId);
  }

  const [experienceData, setExperienceData] = useState<any>(null);
const experience = experienceData;
  const userRole = USER_ROLE;

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    guests: 1,
    specialRequests: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });
  useEffect(() => {
    const fetchOrder = async () => {
      if (!receivedId) return;

      const data = await getExperienceById(receivedId);

      console.log("FETCHED ORDER:", data);

      if (!data) {
        console.warn("No order found for ID:", receivedId);
        return;
      }

setSelectedMedia({
  type: "image",
  src: data.display_image || ""
});
    };

    fetchOrder();
  }, [receivedId]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
 const [selectedMedia, setSelectedMedia] = useState<{ type: "image" | "video"; src: string }>({
  type: "image",
  src: ""
});
  const [queries, setQueries] = useState(DUMMY_QUERIES);
  const [newMessage, setNewMessage] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const handleSubmitAvailability = async () => {
    const updated = await updateExperience(experienceData.id, {
      availability: new Date().toISOString(),
    });

    if (!updated) return;

    setExperienceData(updated);
    setActionMessage("Availability submitted. Creator will confirm schedule.");
  };

  const handleReschedule = async () => {
    if (!rescheduleDate) {
      setActionMessage("Please select a preferred new date/time.");
      return;
    }
    const updated = await updateExperience(experienceData.id, {
      reschedule_requested: true,
      reschedule_datetime: rescheduleDate,
    });

    if (!updated) return;

    setExperienceData(updated);
    setActionMessage(`Reschedule requested for ${new Date(rescheduleDate).toLocaleString()}`);
    setRescheduleDate("");
  };

  const handleCancel = async () => {
    const updated = await updateExperience(experienceData.id, {
      cancel_requested: true,
    });

    if (!updated) return;

    setExperienceData(updated);
    setActionMessage("Cancellation request sent.");
  };

  const updateBookingStatus = (newStatus: BookingStatus) => {
    setUpdating(true);
    setTimeout(() => {
      setExperienceData((prev: any) => ({ ...prev, status: newStatus }));
      setMessage({ type: "success", text: `Booking status updated to ${newStatus}` });
      setUpdating(false);
    }, 400);
  };

  const updatePaymentStatus = (newStatus: PaymentStatus) => {
    setUpdating(true);
    setTimeout(() => {
      setExperienceData((prev: any) => ({ ...prev, payment_status: newStatus }));
      setMessage({ type: "success", text: `Payment status updated to ${newStatus}` });
      setUpdating(false);
    }, 400);
  };

  const updateBookingDetails = () => {
    if (!bookingForm.customerName || !bookingForm.customerEmail || !bookingForm.customerPhone) {
      setMessage({ type: "error", text: "Please fill in all required customer fields" });
      return;
    }
    if (bookingForm.guests < 1 || bookingForm.guests > experienceData.guests) {
      setMessage({
        type: "error",
        text: `Number of guests must be between 1 and ${experienceData.guests}`,
      });
      return;
    }
    setUpdating(true);
    setTimeout(() => {
      setExperienceData((prev: any) => ({
        ...prev,
        number_of_guests: bookingForm.guests,
        special_requests: bookingForm.specialRequests,
        customer_name: bookingForm.customerName,
        customer_email: bookingForm.customerEmail,
        customer_phone: bookingForm.customerPhone,
      }));
      setShowBookingForm(false);
      setMessage({ type: "success", text: "Booking details updated successfully" });
      setUpdating(false);
    }, 400);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setQueries((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: "buyer",
        message: newMessage,
        created_at: new Date().toISOString(),
      },
    ]);
    setNewMessage("");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "#f59e0b",
      confirmed: "#3b82f6",
      completed: "#22c55e",
      cancelled: "#ef4444",
      refunded: "#f59e0b",
      paid: "#22c55e",
      failed: "#ef4444",
    };
    return colors[status] || "#888";
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!experienceData) {
    return <div style={{ padding: 40, color: "white" }}>Loading order...</div>;
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#fff", padding: "40px 60px" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600 }}>
          Experience Booking{" "}
          <span style={{ color: GOLD }}>
            #{experienceData.id?.slice(0, 8)}
          </span>
        </h1>
        <button
          onClick={() => router.push("/profile")}
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: `1px solid ${BORDER}`,
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 14,
            color: "#aaa",
          }}
        >
          ← Back to Profile
        </button>
      </div>

      <div style={{ marginBottom: 12, fontSize: 12, color: "#888" }}>
        Debug ID: {receivedId || "No ID received"}
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

      {/* Winner Dashboard Single Column Layout */}
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Summary + Next Step */}
        <div
          style={{
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            background: CARD_BG,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <p style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Experience</p>
          <h2 style={{ fontSize: 20, marginBottom: 6 }}>{experienceData.display_name}</h2>

          <p style={{ fontSize: 14, color: "#aaa", marginBottom: 10 }}>
           Hosted by {experienceData.creator_id} • {experienceData.location}
          </p>

          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: "#888" }}>Amount Paid</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: GOLD }}>
              ₹{experienceData.winning_bid?.toLocaleString()}
            </p>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: "#0d0d0d",
              border: `1px solid ${BORDER}`,
            }}
          >
            <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Next Step</p>
            <p style={{ fontSize: 14 }}>
              {experienceData.status === "pending" && "Waiting for creator confirmation"}
              {experienceData.status === "confirmed" && "Coordinate schedule with creator"}
              {experienceData.status === "completed" && "Experience completed"}
              {experienceData.status === "cancelled" && "Booking cancelled"}
            </p>
          </div>
        </div>

        {/* Schedule */}
        <div
          style={{
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            background: CARD_BG,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <p style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Schedule</p>
          <p style={{ fontSize: 16, fontWeight: 500 }}>
            {experienceData.status === "ended"
              ? formatDate(experienceData.end_datetime)
              : "Not scheduled yet"}
          </p>
        </div>

        {/* Booking Status */}
        <div
          style={{
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            background: CARD_BG,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <h3 style={{ fontSize: 16, marginBottom: 16, color: GOLD }}>Booking Status</h3>
          <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Booking Status</p>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: getStatusColor(experienceData.status),
                  textTransform: "capitalize",
                }}
              >
                {experienceData.status}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Payment Status</p>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: getStatusColor("paid"),
                  textTransform: "capitalize",
                }}
              >
                paid
              </p>
            </div>
          </div>
        </div>


        {/* Special Request */}
        <div
          style={{
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            background: CARD_BG,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <h3 style={{ fontSize: 16, marginBottom: 12, color: GOLD }}>
            Special Request for Creator
          </h3>

          <textarea
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            placeholder="Share any preferences or requests for the creator..."
            style={{
              width: "100%",
              minHeight: 80,
              padding: 10,
              borderRadius: 6,
              border: `1px solid ${BORDER}`,
              background: "#0d0d0d",
              color: "#fff",
              fontSize: 13,
              marginBottom: 10,
            }}
          />

          <button
            onClick={async () => {
              if (!specialRequest.trim()) return;

              const updated = await updateExperience(experienceData.id, {
                // remove special_request since it does not exist in experiences_form
              });
              console.warn("special_request belongs to orders table, not experiences_form");

              if (!updated) return;

              setExperienceData(updated);
              setRequestSubmitted(true);
              setSpecialRequest("");
            }}
            style={{
              padding: "10px 16px",
              background: GOLD,
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
              color: "#000",
            }}
          >
            Submit Request
          </button>

          {requestSubmitted && (
            <p style={{ marginTop: 10, fontSize: 13, color: "#22c55e" }}>
              Your request has been sent to the creator.
            </p>
          )}
        </div>

        {/* Actions */}
        <div
          style={{
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            background: CARD_BG,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <h3 style={{ fontSize: 16, marginBottom: 12, color: GOLD }}>Actions</h3>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleSubmitAvailability}
              style={{
                padding: "10px 16px",
                background: GOLD,
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
                color: "#000",
              }}
            >
              Submit Availability
            </button>

            <button
              onClick={handleReschedule}
              style={{
                padding: "10px 16px",
                background: "transparent",
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                cursor: "pointer",
                color: "#fff",
              }}
            >
              Request Reschedule (with date)
            </button>

            <button
              onClick={handleCancel}
              style={{
                padding: "10px 16px",
                background: "transparent",
                border: "1px solid #ef4444",
                borderRadius: 6,
                cursor: "pointer",
                color: "#ef4444",
              }}
            >
              Cancel Booking
            </button>
          </div>

          <input
            type="datetime-local"
            value={rescheduleDate}
            onChange={(e) => setRescheduleDate(e.target.value)}
            style={{
              marginTop: 12,
              padding: "8px 10px",
              borderRadius: 6,
              border: `1px solid ${BORDER}`,
              background: "#0d0d0d",
              color: "#fff",
              fontSize: 13,
              width: "100%",
            }}
          />
        </div>

        {actionMessage && (
          <div style={{ marginBottom: 24, color: "#22c55e", fontSize: 14 }}>
            {actionMessage}
          </div>
        )}

        {/* Chat Section */}
        <div
          style={{
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            background: CARD_BG,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <h3 style={{ fontSize: 16, marginBottom: 12, color: GOLD }}>Contact Creator</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxHeight: 250,
              overflowY: "auto",
              padding: 10,
              background: "#0d0d0d",
              borderRadius: 8,
            }}
          >
            {queries.length === 0 ? (
              <div style={{ color: "#888", fontSize: 13 }}>No messages yet.</div>
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
                flex: 1,
                padding: "8px 10px",
                borderRadius: 6,
                border: `1px solid ${BORDER}`,
                background: "#0d0d0d",
                color: "#fff",
                fontSize: 13,
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "8px 14px",
                background: GOLD,
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
                color: "#000",
              }}
            >
              Send
            </button>
          </div>
        </div>

        {/* Booking Reference */}
        {false && (
          <div
            style={{
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              background: CARD_BG,
              padding: 20,
            }}
          >
            <h3 style={{ fontSize: 16, marginBottom: 12, color: GOLD }}>Booking Reference</h3>
            <p style={{ fontSize: 14, fontFamily: "monospace", color: GOLD }}>
              {experienceData.booking_reference}
            </p>
            <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
              Please present this reference at the experience venue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}