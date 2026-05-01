"use client";

type LotType = "all" | "auction" | "buyNow";

export default function LotTypeFilter({
  value,
  onChange,
}: {
  value: LotType;
  onChange: (val: LotType) => void;
}) {
  return (
    <div className="lot-filter">
      <button
        className={value === "auction" ? "active" : ""}
        onClick={() => onChange("auction")}
      >
        Auction
      </button>

      <button
        className={value === "buyNow" ? "active" : ""}
        onClick={() => onChange("buyNow")}
      >
        Buy Now
      </button>

      <button
        className={value === "all" ? "active" : ""}
        onClick={() => onChange("all")}
      >
        All
      </button>
    </div>
  );
}