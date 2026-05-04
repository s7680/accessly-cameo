

export default function Loading() {
  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        background: "#0a0a0a",
        minHeight: "100vh",
      }}
    >
      {/* Hero skeleton */}
      <div
        style={{
          height: 220,
          borderRadius: 12,
          background: "linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />

      {/* Section title */}
      <div
        style={{
          width: "40%",
          height: 20,
          borderRadius: 6,
          background: "#1a1a1a",
        }}
      />

      {/* Cards grid */}
      <div style={{ display: "flex", gap: 16 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 180,
              borderRadius: 12,
              background: "linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          />
        ))}
      </div>

      {/* Animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}