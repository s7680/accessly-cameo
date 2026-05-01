// src/components/profile/RoleToggle.tsx
"use client";

type Props = {
  active: "fan" | "creator";
  onChange: (role: "fan" | "creator") => void;
};

export default function RoleToggle({ active, onChange }: Props) {
  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        width: "100%",
        margin: "16px 0",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #333",
      }}
    >
      <button
        role="tab"
        aria-selected={active === "fan"}
        onClick={() => onChange("fan")}
        style={{
          flex: 1,
          padding: "12px 0",
          border: "none",
          background: active === "fan" ? "#ff4d6d" : "transparent",
          color: active === "fan" ? "#fff" : "#aaa",
          fontWeight: active === "fan" ? 600 : 400,
          cursor: "pointer",
          transition: "all 0.2s",
          fontSize: 16,
        }}
      >
        As Fan
      </button>
      <button
        role="tab"
        aria-selected={active === "creator"}
        onClick={() => onChange("creator")}
        style={{
          flex: 1,
          padding: "12px 0",
          border: "none",
          background: active === "creator" ? "#ff4d6d" : "transparent",
          color: active === "creator" ? "#fff" : "#aaa",
          fontWeight: active === "creator" ? 600 : 400,
          cursor: "pointer",
          transition: "all 0.2s",
          fontSize: 16,
        }}
      >
        As Creator
      </button>
    </div>
  );
}