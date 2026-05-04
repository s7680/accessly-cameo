export default function SkeletonCard() {
  return (
    <div
      style={{
        height: 220,
        borderRadius: 12,
        background: "linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  );
}