// src/components/profile/CreatorVideos.tsx
import { useRef, useState } from "react";
import { uploadVideoForRequest } from "@/lib/db/videoRequests";
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
  const [videoUrl, setVideoUrl] = useState<string | null>(req.videoUrl || null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSelectedFile(file);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);

    try {
      const url = await uploadVideoForRequest(req.id, selectedFile);
      setVideoUrl(url);
      setUploadSuccess(true);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #333", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 10, background: "#111" }}>
      <h3 style={{ margin: 0 }}>Fan: {req.fanName}</h3>
      <p style={{ margin: 0, color: "#aaa", fontSize: 13 }}>
        <strong>Requested on:</strong> {req.created_at ? new Date(req.created_at).toLocaleString() : "—"}
      </p>

      <p style={{ margin: 0, color: "#ccc" }}>
        <strong>Recipient:</strong> {req.recipientName || "—"} {req.recipientType ? `(${req.recipientType})` : ""}
      </p>

      <p style={{ margin: 0, color: "#ccc" }}>
        <strong>Occasion:</strong> {req.occasion || "—"}
      </p>

      <p style={{ margin: 0, color: "#ccc" }}>
        <strong>From:</strong> {req.fromName || "—"}
      </p>

      <p style={{ margin: 0, color: "#ccc" }}>
        <strong>Language:</strong> {req.language || "—"}
      </p>

      <p style={{ marginTop: 6, color: "#ccc" }}>
        <strong>Request details:</strong> {req.instructions || "—"}
      </p>

      <p
        style={{
          marginTop: 8,
          fontWeight: 800,
          fontSize: 18,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          padding: "6px 10px",
          borderRadius: 6,
          display: "inline-block",
          width: "fit-content",
          color:
            req.status?.toLowerCase() === "pending"
              ? "#8b0000"
              : req.status?.toLowerCase() === "completed"
              ? "#006400"
              : "#ccc",
          backgroundColor:
            req.status?.toLowerCase() === "pending"
              ? "rgba(139, 0, 0, 0.15)"
              : req.status?.toLowerCase() === "completed"
              ? "rgba(0, 100, 0, 0.15)"
              : "transparent",
        }}
      >
        Status: {req.status || "—"}
      </p>

      <p style={{ margin: 0, color: "#4caf50", fontWeight: 500 }}>
        <strong>Price:</strong> ₹{req.price ? Number(req.price).toLocaleString() : "—"}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
        <p style={{ color: "#4caf50", cursor: "pointer", margin: 0 }} onClick={() => fileRef.current?.click()}>
          Choose Video
        </p>

        {selectedFile && (
          <Button variant="primary" onClick={handleUpload} disabled={isUploading} style={{ width: "fit-content" }}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        )}

        {uploadSuccess && (
          <span style={{ fontSize: 13, color: "#4caf50" }}>
            Video successfully uploaded
          </span>
        )}

        <input
          type="file"
          accept="video/*"
          ref={fileRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {fileName && <span style={{ fontSize: 14, color: "#4caf50" }}>{fileName}</span>}

        {videoUrl && (
          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              Uploaded Video
            </p>
            <video src={videoUrl} controls style={{ width: "100%", borderRadius: 8 }} />
          </div>
        )}
      </div>
    </div>
  );
}