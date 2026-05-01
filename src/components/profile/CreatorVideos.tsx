// src/components/profile/CreatorVideos.tsx
import { useRef, useState } from "react";
import Button from "@/components/ui/Button";

type Props = { requests: any[] };

export default function CreatorVideos({ requests }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {requests.map((req) => (
        <RequestCard key={req.id} req={req} />
      ))}
    </div>
  );
}

function RequestCard({ req }: { req: any }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div
      style={{
        border: "1px solid #333",
        borderRadius: 8,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <h3 style={{ margin: 0 }}>Fan: {req.fanName}</h3>

      <div style={{ marginTop: 6 }}>
        {/* 1. Who is this video for */}
        <div style={{ marginBottom: 6 }}>
          <p style={{ margin: "0 0 2px", fontSize: 12, color: "#888" }}>Who is this video for?</p>
          <p style={{ margin: 0, color: "#ccc" }}>
            {req.recipient || "—"}
            {req.recipientPronoun ? ` (${req.recipientPronoun})` : ""}
          </p>
        </div>

        {/* 3. Who is this video from */}
        <div style={{ marginBottom: 6 }}>
          <p style={{ margin: "0 0 2px", fontSize: 12, color: "#888" }}>Who is this video from?</p>
          <p style={{ margin: 0, color: "#ccc" }}>
            {req.fromName || "—"}
            {req.fromPronoun ? ` (${req.fromPronoun})` : ""}
          </p>
        </div>

        {/* Occasion */}
        <div style={{ marginBottom: 6 }}>
          <p style={{ margin: "0 0 2px", fontSize: 12, color: "#888" }}>Occasion</p>
          <p style={{ margin: 0, color: "#ccc" }}>
            {req.occasion || "—"}
          </p>
        </div>

        {/* Privacy */}
        {typeof req.hideVideo === "boolean" && (
          <div style={{ fontSize: 13, color: "#aaa" }}>
            Privacy: {req.hideVideo ? "Hidden from profile" : "Public"}
          </div>
        )}
      </div>

      <div>
        <p style={{ margin: "6px 0 2px", fontSize: 12, color: "#888" }}>Request details</p>
        <p style={{ margin: 0, color: "#ccc" }}>{req.instructions || "—"}</p>
      </div>
      <p style={{ margin: 0, color: "#aaa", fontSize: 13 }}>
        Delivery by: {req.deadline || "—"}
      </p>

      <div style={{ marginTop: 6 }}>
        <p style={{ margin: "0 0 2px", fontSize: 12, color: "#888" }}>Payment</p>
        <p style={{ margin: 0, color: "#4caf50", fontWeight: 500 }}>
          Paid: ₹{req.amountPaid ? Number(req.amountPaid).toLocaleString() : "—"}
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
        <Button
          variant="primary"
          onClick={() => fileRef.current?.click()}
        >
          Upload Video
        </Button>
        <input
          type="file"
          accept="video/*"
          ref={fileRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {fileName && <span style={{ fontSize: 14, color: "#4caf50" }}>{fileName}</span>}
      </div>
    </div>
  );
}