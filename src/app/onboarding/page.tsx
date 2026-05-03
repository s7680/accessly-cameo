"use client";

import { useState, useRef } from "react";
import { createVideoForm } from "@/lib/db/videos";
import { createListing } from "@/lib/db/listings";

// ── Types ─────────────────────────────────────────────────────────────────────
type OfferType = "video" | "drops" | "experiences";
type PricingMode = "bid" | "buyNow" | "both";

interface MediaItem {
  id: string;
  url: string;
  name: string;
  file: File;
  type: "image" | "video";
}

interface FormState {
  // Step 1
  selectedType: OfferType | null;
  // Step 4 – common
  category: string;
  // Step 4 – video
  price: string;
  deliveryTime: string;
  instructions: string;
  // Step 4 – drops / experiences
  media: MediaItem[];
  displayImage: File | null;
  displayName: string;
  story: string;
  pricingMode: PricingMode;
  itemName: string;
  startingBid: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  fixedPrice: string;

  // Experience specific
  duration: string;
  fanBenefits: string;
  location: string;
  guests: string;

  // Duration-based scheduling for experiences
  experienceDurationType: "short" | "long";
  experienceHours: string;
  experienceMinutes: string;
  experienceDate: string;
  experienceStartDate: string;
  experienceEndDate: string;
  experienceStartTime: string;
  experienceEndTime: string;

  // Video extras
  language: string;
  maxDuration: string;
  occasions: string;
  bio: string;

  // Drops extras
  condition: string;
  authenticity: string;
  shippingDetails: string;

  // Experiences extras
  availabilityNotes: string;

  // Promotion
  promoInstagramLink: string;

  // Drops - new fields
  specifications: string;
  additionalDetails: string;
  dropFaq: string;

  // Experience - new fields
  photosIncluded: string;
  autographIncluded: string;
  cuisine: string;
  tags: string; // comma-separated
  experienceFaq: string; // pipe-separated answers
}

interface Errors {
  [key: string]: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const VIDEO_CATEGORIES = ["Comedy", "Motivation", "Music", "Fitness", "Education", "Acting", "Dance", "Lifestyle"];
const DROP_CATEGORIES  = ["Sports", "Bollywood", "Politics", "Autographs", "Collectibles", "Art"];
const EXP_CATEGORIES   = ["Meet & Greet", "Dinner", "Sports Experience", "Bollywood Experience", "Politics Interaction"];

const OFFER_TYPES = [
  { id: "video",       emoji: "🎬", label: "Video",       sub: "Personalised video messages for fans" },
  { id: "drops",       emoji: "🏆", label: "Drops",       sub: "Auction or sell signed memorabilia"   },
  { id: "experiences", emoji: "✨", label: "Experience",  sub: "Host exclusive in-person experiences"  },
] as const;

const DELIVERY_OPTIONS = ["24 hours", "48 hours", "3 days", "7 days"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const TOTAL_STEPS = 2;

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="ob-progress">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`ob-progress-seg ${i < current ? "ob-progress-seg--done" : ""}`} />
      ))}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="ob-field-error">⚠ {msg}</p>;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    selectedType: null,
    category: "",
    price: "", deliveryTime: "", instructions: "",
    media: [], displayImage: null, displayName: "", story: "", pricingMode: "bid",
    itemName: "", startingBid: "", startDate: "", startTime: "",
    endDate: "", endTime: "", fixedPrice: "",

    duration: "",
    fanBenefits: "",
    location: "",
    guests: "",

    // Experience duration-based scheduling
    experienceDurationType: "short",
    experienceHours: "",
    experienceMinutes: "",
    experienceDate: "",
    experienceStartDate: "",
    experienceEndDate: "",
    experienceStartTime: "",
    experienceEndTime: "",

    language: "",
    maxDuration: "",
    occasions: "",
    bio: "",

    condition: "",
    authenticity: "",
    shippingDetails: "",

    availabilityNotes: "",

    promoInstagramLink: "",

    specifications: "",
    additionalDetails: "",
    dropFaq: "",

    photosIncluded: "",
    autographIncluded: "",
    cuisine: "",
    tags: "",
    experienceFaq: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormState, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const clearError = (key: string) =>
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });

  // ── Validation ──────────────────────────────────────────────────────────────
  function validateStep(s: number): boolean {
    const e: Errors = {};
    if (s === 1) {
      if (!form.selectedType) e.selectedType = "Please choose an offer type";
    }
    if (s === 2) {
      if (!form.category)                      e.category = "Please select a category";
      if (form.selectedType === "video") {
        if (!form.price)                       e.price = "Set your price";
        if (!form.deliveryTime)                e.deliveryTime = "Choose delivery time";
        if (!form.language) e.language = "Select language";
        if (!form.maxDuration) e.maxDuration = "Set max video duration";
      }
      if (form.selectedType !== "video") {
        if (form.story.trim().length < 10)    e.story = "Add a story (min 10 characters)";
        if (form.pricingMode !== "buyNow") {
          if (!form.itemName.trim())           e.itemName    = "Item name required";
          if (!form.startingBid)               e.startingBid = "Starting bid required";
          if (!form.startDate)                 e.startDate   = "Start date required";
          if (!form.startTime)                 e.startTime   = "Start time required";
          if (!form.endDate)                   e.endDate     = "End date required";
          if (!form.endTime)                   e.endTime     = "End time required";
        }
        if (form.pricingMode !== "bid") {
          if (!form.itemName.trim())           e.itemName   = "Item name required";
          if (!form.fixedPrice)                e.fixedPrice = "Fixed price required";
        }
      if (form.selectedType === "experiences") {
        if (form.experienceDurationType === "short") {
          if (!form.experienceHours && !form.experienceMinutes) e.duration = "Enter hours or minutes";
          if (!form.experienceDate) e.experienceDate = "Select date";
          if (!form.experienceStartTime) e.experienceStartTime = "Select time";
        } else {
          if (!form.experienceStartDate) e.experienceStartDate = "Start date required";
          if (!form.experienceEndDate) e.experienceEndDate = "End date required";
          if (!form.experienceStartTime) e.experienceStartTime = "Start time required";
          if (!form.experienceEndTime) e.experienceEndTime = "End time required";
        }
        if (form.fanBenefits.trim().length < 10) e.fanBenefits = "Describe what fans will get";
        if (!form.location.trim()) e.location = "Location required";
        if (!form.guests) e.guests = "Number of guests required";
      }
        if (form.selectedType === "drops") {
          if (!form.condition) e.condition = "Select condition";
          if (!form.authenticity.trim()) e.authenticity = "Add authenticity details";
        }
        if (!form.promoInstagramLink.trim()) {
          e.promoInstagramLink = "Add Instagram promotion link";
        }
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

 async function next() {
  if (!validateStep(step)) return;

  if (step < TOTAL_STEPS) {
    setStep((s) => s + 1);
    return;
  }

  try {
    setLoading(true);
    if (!form.selectedType) {
      setLoading(false);
      alert("Offer type is required");
      return;
    }
    const files =
      form.selectedType === "video"
        ? form.media.map((m) => m.file)
        : [];

    if (form.selectedType === "video") {
      await createVideoForm({
        type: form.selectedType as string,
        category: form.category,
        price: Number(form.price) || 0,
        delivery_time: form.deliveryTime,
        language: form.language,
        max_duration: form.maxDuration,
        occasions: form.occasions ? form.occasions.split(",") : [],
        files,
        instructions: form.instructions,
        displayImage: form.displayImage,
      });
    }

    if (form.selectedType === "drops" || form.selectedType === "experiences") {
      // Normalize FAQ handling
      const dropFaqParts = form.dropFaq ? form.dropFaq.split("||") : [];
      const expFaqParts = form.experienceFaq ? form.experienceFaq.split("||") : [];
      await createListing({
        type: form.selectedType === "drops" ? "drop" : form.selectedType === "experiences" ? "experience" : form.selectedType,
        category: form.category,

        displayName: form.displayName,
        displayImage: form.displayImage,
        media: form.media.map((m) => m.file),

        story: form.story,
        instagramLink: form.promoInstagramLink,

        pricingMode: form.pricingMode,
        startDateTime: form.startDate && form.startTime ? `${form.startDate} ${form.startTime}` : undefined,
        endDateTime: form.endDate && form.endTime ? `${form.endDate} ${form.endTime}` : undefined,

        startingBid: form.startingBid ? Number(form.startingBid) : undefined,
        fixedPrice: form.fixedPrice ? Number(form.fixedPrice) : undefined,

        itemName: form.itemName,
        condition: form.condition,
        authenticity: form.authenticity,
        shippingDetails: form.shippingDetails,
        productDetails: form.specifications,

        faq: form.selectedType === "drops"
          ? {
              authenticity: dropFaqParts[0] || "",
              shipping: dropFaqParts[1] || "",
              returns: dropFaqParts[2] || "",
              extra: dropFaqParts[3] || "",
            }
          : {
              cancel: expFaqParts[0] || "",
              reschedule: expFaqParts[1] || "",
              refund: expFaqParts[2] || "",
            },

        aboutExperience: form.story,
        fanBenefits: form.fanBenefits,
        durationType: form.experienceDurationType,
        experienceDate: form.experienceDate,
        startTime: form.experienceStartTime,
        durationMinutes: form.experienceMinutes ? Number(form.experienceMinutes) : undefined,
        startDate: form.experienceStartDate,
        endDate: form.experienceEndDate,
        guests: form.guests ? Number(form.guests) : undefined,
        location: form.location,
        photosIncluded: form.photosIncluded,
        autographIncluded: form.autographIncluded,
        cuisine: form.cuisine,
      });
    }

    setLoading(false);
    setSubmitted(true);

  } catch (err) {
    console.log(err);
    setLoading(false);
    alert((err as any)?.message || "Failed to submit");
  }
}

  function back() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    const existingVideos = form.media.filter((m) => m.type === "video").length;

    const newItems: MediaItem[] = [];

    files.forEach((f) => {
      const isVideo = f.type.startsWith("video");
      if (!isVideo) return;

      if (isVideo) {
        if (existingVideos + newItems.filter(i => i.type === "video").length >= 5) {
          setUploadError("Max 5 videos allowed");
          return;
        }
      }

     newItems.push({
  id: Math.random().toString(36).slice(2),
  url: URL.createObjectURL(f),
  name: f.name,
  file: f,
  type: isVideo ? "video" : "image",
});
    });

    if (newItems.length > 0) setUploadError(null);
    set("media", [...form.media, ...newItems]);
  }

  function removeMedia(id: string) {
    set("media", form.media.filter((m) => m.id !== id));
  }

  const categories =
    form.selectedType === "video" ? VIDEO_CATEGORIES :
    form.selectedType === "drops" ? DROP_CATEGORIES :
    EXP_CATEGORIES;

  // Helper: Platform fee based on delivery time
  function getPlatformFee(deliveryTime: string) {
    switch (deliveryTime) {
      case "24 hours": return 10;
      case "48 hours": return 15;
      case "3 days": return 17.5;
      case "7 days": return 20;
      default: return null;
    }
  }

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="ob-root ob-success-screen">
        <div className="ob-success-inner">
          <div className="ob-success-icon">🎉</div>
          <h1 className="ob-success-title">You're in!</h1>
          <p className="ob-success-sub">
            Your profile is under review. We'll email you within 24 hours.
          </p>
          <div className="ob-success-detail">
            <span className="ob-success-label">Type</span>
            <span className="ob-success-value" style={{ textTransform: "capitalize" }}>{form.selectedType}</span>
          </div>
          <button className="ob-btn-primary" onClick={() => { setSubmitted(false); setStep(1); setForm({
            selectedType: null,
            category: "",
            price: "",
            deliveryTime: "",
            instructions: "",
            media: [],
            story: "",
            pricingMode: "bid",
            itemName: "",
            startingBid: "",
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
            fixedPrice: "",

            duration: "",
            fanBenefits: "",
            location: "",
            guests: "",

            experienceDurationType: "short",
            experienceHours: "",
            experienceMinutes: "",
            experienceDate: "",
            experienceStartDate: "",
            experienceEndDate: "",
            experienceStartTime: "",
            experienceEndTime: "",

            language: "",
            maxDuration: "",
            occasions: "",

            condition: "",
            authenticity: "",
            shippingDetails: "",

            availabilityNotes: "",

            promoInstagramLink: "",

            specifications: "",
            additionalDetails: "",
            dropFaq: "",

            photosIncluded: "",
            autographIncluded: "",
            cuisine: "",
            tags: "",
            experienceFaq: "",
          }); }}>
            Start over
          </button>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  // ── Render Steps ────────────────────────────────────────────────────────────
  const stepLabels = [
    "Offer type",
    form.selectedType === "video" ? "Video details" : form.selectedType === "drops" ? "Drop details" : "Experience details"
  ];

  return (
    <div className="ob-root">
      {/* ── Header ── */}
      <header className="ob-header">
        {step > 1 ? (
          <button className="ob-back-btn" onClick={back} aria-label="Go back">
            ← Back
          </button>
        ) : <div />}
        <span className="ob-step-label">{step} of {TOTAL_STEPS} — {stepLabels[step - 1]}</span>
        <div className="ob-logo">fanblock</div>
      </header>

      {/* Progress */}
      <ProgressBar current={step} total={TOTAL_STEPS} />

      {/* ── Scrollable body ── */}
      <main className="ob-main">

        {/* ════ STEP 1: OFFER TYPE ════ */}
        {step === 1 && (
          <div className="ob-step ob-step--enter">
            <h1 className="ob-step-title">What do you want to offer?</h1>
            <p className="ob-step-sub">Pick one to start. You can add more later.</p>
            <FieldError msg={errors.selectedType} />
            <div className="ob-offer-grid">
              {OFFER_TYPES.map((o) => (
                <button
                  key={o.id}
                  className={`ob-offer-card ${form.selectedType === o.id ? "ob-offer-card--active" : ""}`}
                  onClick={() => { set("selectedType", o.id as OfferType); set("category", ""); clearError("selectedType"); }}
                >
                  <span className="ob-offer-emoji">{o.emoji}</span>
                  <span className="ob-offer-label">{o.label}</span>
                  <span className="ob-offer-sub">{o.sub}</span>
                  {form.selectedType === o.id && <span className="ob-offer-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════ STEP 2: OFFER DETAILS ════ */}
        {step === 2 && (
          <div className="ob-step ob-step--enter">
            <h1 className="ob-step-title">
              {form.selectedType === "video" ? "Video details" :
               form.selectedType === "drops" ? "Drop details" :
               "Experience details"}
            </h1>
            <p className="ob-step-sub">Almost there. Set up your offering.</p>

            {/* ── VIDEO: Profile image upload + Your bio (above category) ── */}
            {form.selectedType === "video" && (
              <>
                <div className="ob-field">
                  <label className="ob-label">Upload your video card display image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      set("displayImage", file);
                    }}
                  />
                  {form.displayImage && (
                    <div style={{ marginTop: 10 }}>
                      <img
                        src={URL.createObjectURL(form.displayImage)}
                        alt="preview"
                        style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>

                <div className="ob-field">
                  <label className="ob-label">Your bio</label>
                  <textarea
                    className="ob-textarea"
                    placeholder="Tell fans about yourself..."
                    rows={3}
                    value={form.bio}
                    onChange={(e) => set("bio", e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ── Category (all types) ── */}
            <div className="ob-field">
              <label className="ob-label">Category</label>
              <div className="ob-chips">
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`ob-chip ${form.category === c ? "ob-chip--active" : ""}`}
                    onClick={() => { set("category", c); clearError("category"); }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <FieldError msg={errors.category} />
            </div>

            {/* ──────────── VIDEO FORM ──────────── */}
            {form.selectedType === "video" && (
              <>
                <div className="ob-field">
                  <label className="ob-label">Your Price (₹)</label>
                  <div className="ob-prefix-wrap">
                    <span className="ob-prefix">₹</span>
                    <input
                      className={`ob-input ob-input--prefixed ${errors.price ? "ob-input--error" : ""}`}
                      type="number"
                      inputMode="numeric"
                      placeholder="500"
                      min="0"
                      value={form.price}
                      onChange={(e) => { set("price", e.target.value); clearError("price"); }}
                    />
                  </div>
                  <FieldError msg={errors.price} />
                </div>

                <div className="ob-field">
                  <label className="ob-label">Delivery Time</label>
                  <div className="ob-chips">
                    {DELIVERY_OPTIONS.map((d) => (
                      <button
                        key={d}
                        className={`ob-chip ${form.deliveryTime === d ? "ob-chip--active" : ""}`}
                        onClick={() => { set("deliveryTime", d); clearError("deliveryTime"); }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <FieldError msg={errors.deliveryTime} />
                  {form.deliveryTime && (
                    <p style={{
                      marginTop: "6px",
                      fontSize: "12px",
                      color: "#9a9085"
                    }}>
                      Platform fee: {getPlatformFee(form.deliveryTime)}%
                    </p>
                  )}
                  {form.price && form.deliveryTime && (
                    <p style={{
                      marginTop: "4px",
                      fontSize: "12px",
                      color: "#4CAF50"
                    }}>
                      You earn: ₹
                      {Math.floor(
                        Number(form.price) *
                        (1 - (getPlatformFee(form.deliveryTime)! / 100))
                      )}
                    </p>
                  )}
                </div>

                <div className="ob-field">
                  <label className="ob-label">Language</label>
                  <div className="ob-chips">
                    {["Hindi", "English", "Both"].map((l) => (
                      <button
                        key={l}
                        className={`ob-chip ${form.language === l ? "ob-chip--active" : ""}`}
                        onClick={() => { set("language", l); clearError("language"); }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <FieldError msg={errors.language} />
                </div>

                <div className="ob-field">
                  <label className="ob-label">Max video duration</label>
                  <input
                    className={`ob-input ${errors.maxDuration ? "ob-input--error" : ""}`}
                    placeholder="e.g. 60 seconds"
                    value={form.maxDuration}
                    onChange={(e) => { set("maxDuration", e.target.value); clearError("maxDuration"); }}
                  />
                  <FieldError msg={errors.maxDuration} />
                </div>

                <div className="ob-field">
                  <label className="ob-label">Occasions you accept</label>
                  <div className="ob-chips">
                    {["Birthday", "Anniversary", "Motivation", "Roast", "Congratulations", "Get Well Soon", "Other"].map((o) => (
                      <button
                        key={o}
                        className={`ob-chip ${form.occasions.includes(o) ? "ob-chip--active" : ""}`}
                        onClick={() => {
                          const current = form.occasions ? form.occasions.split(",") : [];
                          const updated = current.includes(o)
                            ? current.filter((c) => c !== o)
                            : [...current, o];
                          set("occasions", updated.join(","));
                        }}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                  {form.occasions.includes("Other") && (
                    <input
                      className="ob-input"
                      placeholder="Enter custom occasion"
                      style={{ marginTop: "10px" }}
                      onChange={(e) => {
                        const base = form.occasions
                          .split(",")
                          .filter((c) => c !== "Other");
                        set("occasions", [...base, e.target.value].join(","));
                      }}
                    />
                  )}
                </div>

                {/* Media upload for VIDEO */}
                <div className="ob-field">
                  <label className="ob-label">Upload sample videos (portrait mode preferred)</label>
                  <button
                    className="ob-upload-zone"
                    onClick={() => fileRef.current?.click()}
                  >
                    <span className="ob-upload-icon">📎</span>
                    <span className="ob-upload-text">Tap to add media</span>
                    <span className="ob-upload-hint">MP4, MOV · Max 20 MB each · Max 5 videos</span>
                    <span className="ob-upload-hint" style={{ marginTop: 4 }}>
                      These videos will appear on your profile to help fans understand your style
                    </span>
                  </button>

                  {uploadError && (
                    <p style={{ color: "#e74c3c", fontSize: "12px", marginTop: "6px" }}>
                      {uploadError}
                    </p>
                  )}

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  {form.media.length > 0 && (
                    <div className="ob-media-scroll">
                      {form.media.map((m) => (
                        <div key={m.id} className="ob-media-thumb">
                          {m.type === "image"
                            ? <img src={m.url} alt={m.name} className="ob-media-img" />
                            : <video src={m.url} className="ob-media-img" />
                          }
                          <button className="ob-media-remove" onClick={() => removeMedia(m.id)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="ob-field">
                  <label className="ob-label">Instructions for fans <span className="ob-optional">(optional)</span></label>
                  <textarea
                    className="ob-textarea"
                    placeholder="Tell fans what info they should include when booking..."
                    rows={4}
                    value={form.instructions}
                    onChange={(e) => set("instructions", e.target.value)}
                  />
                </div>

              </>
            )}

            {/* ──────────── DROPS / EXPERIENCES FORM ──────────── */}
            {(form.selectedType === "drops" || form.selectedType === "experiences") && (
              <>
                <div className="ob-field">
                  <label className="ob-label">Display name</label>
                  <input
                    className="ob-input"
                    placeholder="Enter title for your card"
                    value={form.displayName}
                    onChange={(e) => set("displayName", e.target.value)}
                  />
                </div>

                <div className="ob-field">
                  <label className="ob-label">Upload your card display image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      set("displayImage", file);
                    }}
                  />

                  {form.displayImage && (
                    <div style={{ marginTop: 10 }}>
                      <img
                        src={URL.createObjectURL(form.displayImage)}
                        alt="preview"
                        style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
                {/* Media upload */}
                <div className="ob-field">
                  <label className="ob-label">
                    Upload photos & videos
                  </label>
                  <button
                    className="ob-upload-zone"
                    onClick={() => fileRef.current?.click()}
                  >
                    <span className="ob-upload-icon">📎</span>
                    <span className="ob-upload-text">Tap to add media</span>
                    <span className="ob-upload-hint">JPG, PNG, MP4 · Max 20 MB each · Max 5 videos</span>
                  </button>
                  {uploadError && (
                    <p style={{ color: "#e74c3c", fontSize: "12px", marginTop: "6px" }}>
                      {uploadError}
                    </p>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                  accept="image/*,video/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  {form.media.length > 0 && (
                    <div className="ob-media-scroll">
                      {form.media.map((m) => (
                        <div key={m.id} className="ob-media-thumb">
                          {m.type === "image"
                            ? <img src={m.url} alt={m.name} className="ob-media-img" />
                            : <video src={m.url} className="ob-media-img" />
                          }
                          <button className="ob-media-remove" onClick={() => removeMedia(m.id)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Story */}
                <div className="ob-field">
                  <label className="ob-label">The story behind it</label>
                  <textarea
                    className={`ob-textarea ${errors.story ? "ob-input--error" : ""}`}
                    placeholder={
                      form.selectedType === "drops"
                        ? "e.g. I wore this jersey in the 2023 final..."
                        : "e.g. Join me for an intimate dinner where we'll talk cricket..."
                    }
                    rows={5}
                    value={form.story}
                    onChange={(e) => { set("story", e.target.value); clearError("story"); }}
                  />
                  <FieldError msg={errors.story} />
                </div>

                {/* Instagram promotion link */}
                <div className="ob-field">
                  <label className="ob-label">Instagram post link (for trust of fans so as to avoid fraud)</label>
                  <input
                    className={`ob-input ${errors.promoInstagramLink ? "ob-input--error" : ""}`}
                    type="url"
                    placeholder="https://instagram.com/..."
                    value={form.promoInstagramLink}
                    onChange={(e) => { set("promoInstagramLink", e.target.value); clearError("promoInstagramLink"); }}
                  />
                  <FieldError msg={errors.promoInstagramLink} />
                </div>

                {/* Pricing mode */}
                <div className="ob-field">
                  <label className="ob-label">Pricing type</label>
                  <div className="ob-seg-group">
                    {(["bid", "buyNow", "both"] as PricingMode[]).map((m) => (
                      <button
                        type="button"
                        key={m}
                        className={`ob-seg-btn ${form.pricingMode === m ? "ob-seg-btn--active" : ""}`}
                        onClick={() => { set("pricingMode", m); clearError("fixedPrice"); }}
                      >
                        {m === "bid" ? "Bid" : m === "buyNow" ? "Buy Now" : "Both"}
                      </button>
                    ))}
                  </div>
                </div>


                {/* BID fields */}
                {(form.pricingMode === "bid" || form.pricingMode === "both") && (
                  <div className="ob-sub-section">
                    <p className="ob-sub-section-label">Auction settings</p>

                    <div className="ob-field">
                      <label className="ob-label">Starting Bid (₹)</label>
                      <div className="ob-prefix-wrap">
                        <span className="ob-prefix">₹</span>
                        <input
                          className={`ob-input ob-input--prefixed ${errors.startingBid ? "ob-input--error" : ""}`}
                          type="number"
                          inputMode="numeric"
                          placeholder="1000"
                          value={form.startingBid}
                          onChange={(e) => { set("startingBid", e.target.value); clearError("startingBid"); }}
                        />
                      </div>
                      <FieldError msg={errors.startingBid} />
                    </div>

                    <div className="ob-row-2">
                      <div className="ob-field">
                        <label className="ob-label">Start date</label>
                        <input
                          className={`ob-input ${errors.startDate ? "ob-input--error" : ""}`}
                          type="date"
                          value={form.startDate}
                          onChange={(e) => { set("startDate", e.target.value); clearError("startDate"); }}
                        />
                        <FieldError msg={errors.startDate} />
                      </div>
                      <div className="ob-field">
                        <label className="ob-label">Start time</label>
                        <input
                          className={`ob-input ${errors.startTime ? "ob-input--error" : ""}`}
                          type="time"
                          value={form.startTime}
                          onChange={(e) => { set("startTime", e.target.value); clearError("startTime"); }}
                        />
                        <FieldError msg={errors.startTime} />
                      </div>
                    </div>

                    <div className="ob-row-2">
                      <div className="ob-field">
                        <label className="ob-label">End date</label>
                        <input
                          className={`ob-input ${errors.endDate ? "ob-input--error" : ""}`}
                          type="date"
                          value={form.endDate}
                          onChange={(e) => { set("endDate", e.target.value); clearError("endDate"); }}
                        />
                        <FieldError msg={errors.endDate} />
                      </div>
                      <div className="ob-field">
                        <label className="ob-label">End time</label>
                        <input
                          className={`ob-input ${errors.endTime ? "ob-input--error" : ""}`}
                          type="time"
                          value={form.endTime}
                          onChange={(e) => { set("endTime", e.target.value); clearError("endTime"); }}
                        />
                        <FieldError msg={errors.endTime} />
                      </div>
                    </div>
                  </div>
                )}

                {/* BUY NOW fields */}
                {(form.pricingMode === "buyNow" || form.pricingMode === "both") && (
                  <div className="ob-sub-section">
                    <p className="ob-sub-section-label">Buy Now price</p>
                    <div className="ob-field">
                      <label className="ob-label">Fixed Price (₹)</label>
                      <div className="ob-prefix-wrap">
                        <span className="ob-prefix">₹</span>
                        <input
                          className={`ob-input ob-input--prefixed ${errors.fixedPrice ? "ob-input--error" : ""}`}
                          type="number"
                          inputMode="numeric"
                          placeholder="25000"
                          value={form.fixedPrice}
                          onChange={(e) => { set("fixedPrice", e.target.value); clearError("fixedPrice"); }}
                        />
                      </div>
                      <FieldError msg={errors.fixedPrice} />
                    </div>
                  </div>
                )}
                {/* Drops extras */}
                {/* Item name (always shown) */}
                <div className="ob-field">
                  <label className="ob-label">Item name</label>
                  <input
                    className={`ob-input ${errors.itemName ? "ob-input--error" : ""}`}
                    type="text"
                    placeholder={form.selectedType === "drops" ? "e.g. 2023 IPL Final Jersey" : "e.g. Private Dinner in Mumbai"}
                    value={form.itemName}
                    onChange={(e) => { set("itemName", e.target.value); clearError("itemName"); }}
                  />
                  <FieldError msg={errors.itemName} />
                </div>
                {form.selectedType === "drops" && (
                  <div className="ob-sub-section">
                    <p className="ob-sub-section-label">Item details</p>

                    <div className="ob-field">
                      <label className="ob-label">Condition</label>
                      <div className="ob-chips">
                        {["New", "Used", "Signed"].map((c) => (
                          <button
                            key={c}
                            className={`ob-chip ${form.condition === c ? "ob-chip--active" : ""}`}
                            onClick={() => { set("condition", c); clearError("condition"); }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                      <FieldError msg={errors.condition} />
                    </div>

                    <div className="ob-field">
                      <label className="ob-label">Authenticity details</label>
                      <textarea
                        className={`ob-textarea ${errors.authenticity ? "ob-input--error" : ""}`}
                        placeholder="e.g. Certificate of authenticity, signed in presence..."
                        value={form.authenticity}
                        onChange={(e) => { set("authenticity", e.target.value); clearError("authenticity"); }}
                      />
                      <FieldError msg={errors.authenticity} />
                    </div>

                    <div className="ob-field">
                      <label className="ob-label">Shipping details</label>
                      <input
                        className="ob-input"
                        placeholder="e.g. Ships within 5 days, pan India"
                        value={form.shippingDetails}
                        onChange={(e) => set("shippingDetails", e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {/* Drops structured sections */}
                {form.selectedType === "drops" && (
                  <>
                    <div className="ob-sub-section">
                      <p className="ob-sub-section-label">Product Details</p>

                      <div className="ob-field">
                        <label className="ob-label">Product specifications</label>
                        <textarea
                          className="ob-textarea"
                          placeholder="Material, size, edition etc."
                          value={form.specifications}
                          onChange={(e)=>set("specifications", e.target.value)}
                        />
                      </div>

                      <div className="ob-field">
                        <label className="ob-label">Other details</label>
                        <textarea
                          className="ob-textarea"
                          placeholder="Any extra information"
                          value={form.additionalDetails}
                          onChange={(e)=>set("additionalDetails", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="ob-sub-section">
                      <p className="ob-sub-section-label">FAQ</p>

                      <div className="ob-field">
                        <label className="ob-label">Is this item authentic?</label>
                        <input
                          className="ob-input"
                          placeholder="Explain authenticity"
                          value={form.dropFaq.split("||")[0] || ""}
                          onChange={(e)=>{
                            const parts = form.dropFaq.split("||");
                            parts[0] = e.target.value;
                            set("dropFaq", parts.join("||"));
                          }}
                        />
                      </div>

                      <div className="ob-field">
                        <label className="ob-label">What is the shipping timeline?</label>
                        <input
                          className="ob-input"
                          placeholder="e.g. Ships within 5 days"
                          value={form.dropFaq.split("||")[1] || ""}
                          onChange={(e)=>{
                            const parts = form.dropFaq.split("||");
                            parts[1] = e.target.value;
                            set("dropFaq", parts.join("||"));
                          }}
                        />
                      </div>

                      <div className="ob-field">
                        <label className="ob-label">Are returns or cancellations allowed?</label>
                        <input
                          className="ob-input"
                          placeholder="Return / cancellation policy"
                          value={form.dropFaq.split("||")[2] || ""}
                          onChange={(e)=>{
                            const parts = form.dropFaq.split("||");
                            parts[2] = e.target.value;
                            set("dropFaq", parts.join("||"));
                          }}
                        />
                      </div>

                      <div className="ob-field">
                        <label className="ob-label">Any additional information?</label>
                        <input
                          className="ob-input"
                          placeholder="Optional"
                          value={form.dropFaq.split("||")[3] || ""}
                          onChange={(e)=>{
                            const parts = form.dropFaq.split("||");
                            parts[3] = e.target.value;
                            set("dropFaq", parts.join("||"));
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {form.selectedType === "experiences" && (
                  <>
                    {/* Item name (always shown) */}
                    <div className="ob-field">
                      <label className="ob-label">Item name</label>
                      <input
                        className={`ob-input ${errors.itemName ? "ob-input--error" : ""}`}
                        type="text"
                        placeholder={form.selectedType === "drops" ? "e.g. 2023 IPL Final Jersey" : "e.g. Private Dinner in Mumbai"}
                        value={form.itemName}
                        onChange={(e) => { set("itemName", e.target.value); clearError("itemName"); }}
                      />
                      <FieldError msg={errors.itemName} />
                    </div>
                    {/* About */}
                    <div className="ob-sub-section">
                      <p className="ob-sub-section-label">About Experience</p>

                      <div className="ob-field">
                        <label className="ob-label">About this experience</label>
                        <textarea
                          className="ob-textarea"
                          placeholder="Describe the experience"
                          value={form.story}
                          onChange={(e)=>{ set("story", e.target.value); clearError("story"); }}
                        />
                      </div>

                      <div className="ob-field">
                        <label className="ob-label">What fans will get</label>
                        <textarea
                          className={`ob-textarea ${errors.fanBenefits ? "ob-input--error" : ""}`}
                          placeholder="Dinner, photos, interaction..."
                          value={form.fanBenefits}
                          onChange={(e)=>{ set("fanBenefits", e.target.value); clearError("fanBenefits"); }}
                        />
                        <FieldError msg={errors.fanBenefits} />
                      </div>
                    </div>

                    {/* Logistics */}
                    <div className="ob-sub-section">
                      <p className="ob-sub-section-label">Logistics</p>

                    <div className="ob-field">
                      <label className="ob-label">Experience duration</label>
                      <select
                        className="ob-input"
                        value={form.experienceDurationType}
                        onChange={(e)=>set("experienceDurationType", e.target.value)}
                      >
                        <option value="short">Less than 1 day</option>
                        <option value="long">More than 1 day</option>
                      </select>
                    </div>

                    {/* Short duration */}
                    {form.experienceDurationType === "short" && (
                      <div className="ob-sub-section">
                        <p className="ob-sub-section-label">Schedule</p>

                        <div className="ob-row-2">
                          <input
                            className="ob-input"
                            placeholder="Hours"
                            value={form.experienceHours}
                            onChange={(e)=>set("experienceHours", e.target.value)}
                          />
                          <input
                            className="ob-input"
                            placeholder="Minutes"
                            value={form.experienceMinutes}
                            onChange={(e)=>set("experienceMinutes", e.target.value)}
                          />
                        </div>

                        <div className="ob-row-2">
                          <input
                            type="date"
                            className={`ob-input ${errors.experienceDate ? "ob-input--error" : ""}`}
                            value={form.experienceDate}
                            onChange={(e)=>{ set("experienceDate", e.target.value); clearError("experienceDate"); }}
                          />
                          <input
                            type="time"
                            className={`ob-input ${errors.experienceStartTime ? "ob-input--error" : ""}`}
                            value={form.experienceStartTime}
                            onChange={(e)=>{ set("experienceStartTime", e.target.value); clearError("experienceStartTime"); }}
                          />
                        </div>
                        <FieldError msg={errors.duration} />
                      </div>
                    )}

                    {/* Long duration */}
                    {form.experienceDurationType === "long" && (
                      <div className="ob-sub-section">
                        <p className="ob-sub-section-label">Schedule</p>

                        <div className="ob-row-2">
                          <input
                            type="date"
                            className={`ob-input ${errors.experienceStartDate ? "ob-input--error" : ""}`}
                            value={form.experienceStartDate}
                            onChange={(e)=>{ set("experienceStartDate", e.target.value); clearError("experienceStartDate"); }}
                          />
                          <input
                            type="time"
                            className={`ob-input ${errors.experienceStartTime ? "ob-input--error" : ""}`}
                            value={form.experienceStartTime}
                            onChange={(e)=>{ set("experienceStartTime", e.target.value); clearError("experienceStartTime"); }}
                          />
                        </div>

                        <div className="ob-row-2">
                          <input
                            type="date"
                            className={`ob-input ${errors.experienceEndDate ? "ob-input--error" : ""}`}
                            value={form.experienceEndDate}
                            onChange={(e)=>{ set("experienceEndDate", e.target.value); clearError("experienceEndDate"); }}
                          />
                          <input
                            type="time"
                            className={`ob-input ${errors.experienceEndTime ? "ob-input--error" : ""}`}
                            value={form.experienceEndTime}
                            onChange={(e)=>{ set("experienceEndTime", e.target.value); clearError("experienceEndTime"); }}
                          />
                        </div>
                      </div>
                    )}

                      <div className="ob-field">
                        <label className="ob-label">Number of guests</label>
                        <input className={`ob-input ${errors.guests ? "ob-input--error" : ""}`} value={form.guests} onChange={(e)=>{ set("guests", e.target.value); clearError("guests"); }} />
                        <FieldError msg={errors.guests} />
                      </div>

                      <div className="ob-field">
                        <label className="ob-label">Location</label>
                        <input className={`ob-input ${errors.location ? "ob-input--error" : ""}`} value={form.location} onChange={(e)=>{ set("location", e.target.value); clearError("location"); }} />
                        <FieldError msg={errors.location} />
                      </div>
                    </div>

                    {/* Inclusions */}
                    <div className="ob-sub-section">
                      <p className="ob-sub-section-label">Inclusions</p>

                      <div className="ob-field">
                        <label className="ob-label">Photos</label>
                        <input className="ob-input" placeholder="Will photos be included?" value={form.photosIncluded} onChange={(e)=>set("photosIncluded", e.target.value)} />
                      </div>

                      <div className="ob-field">
                        <label className="ob-label">Autograph</label>
                        <input className="ob-input" placeholder="Will autograph be provided?" value={form.autographIncluded} onChange={(e)=>set("autographIncluded", e.target.value)} />
                      </div>

                      <div className="ob-field">
                        <label className="ob-label">Cuisine</label>
                        <input className="ob-input" placeholder="e.g. Indian, Italian" value={form.cuisine} onChange={(e)=>set("cuisine", e.target.value)} />
                      </div>
                    </div>


                    {/* Cancellation / Rescheduling FAQ */}
                    <div className="ob-sub-section">
                      <p className="ob-sub-section-label">Cancellation & Rescheduling</p>

                      <div className="ob-field">
                        <label className="ob-label">Can fans cancel?</label>
                        <input
                          className="ob-input"
                          value={form.experienceFaq.split("||")[0] || ""}
                          onChange={(e)=>{
                            const p = form.experienceFaq.split("||"); p[0]=e.target.value; set("experienceFaq", p.join("||"));
                          }}
                        />
                      </div>

                      <div className="ob-field">
                        <label className="ob-label">Can fans reschedule?</label>
                        <input
                          className="ob-input"
                          value={form.experienceFaq.split("||")[1] || ""}
                          onChange={(e)=>{
                            const p = form.experienceFaq.split("||"); p[1]=e.target.value; set("experienceFaq", p.join("||"));
                          }}
                        />
                      </div>

                      <div className="ob-field">
                        <label className="ob-label">Refund policy</label>
                        <input
                          className="ob-input"
                          value={form.experienceFaq.split("||")[2] || ""}
                          onChange={(e)=>{
                            const p = form.experienceFaq.split("||"); p[2]=e.target.value; set("experienceFaq", p.join("||"));
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

      </main>

      {/* ── Sticky bottom CTA ── */}
      <div className="ob-sticky-cta">
        {Object.keys(errors).length > 0 && (
          <p className="ob-sticky-error">Fix the errors above to continue</p>
        )}
        <button className="ob-btn-primary" onClick={next} disabled={loading}>
          {loading ? (
            <span className="loading-dots">
              Submitting<span>.</span><span>.</span><span>.</span>
            </span>
          ) : (
            step < TOTAL_STEPS ? "Continue" : "Submit application"
          )}
          {!loading && (
            <span className="ob-cta-arrow">
              {step < TOTAL_STEPS ? "→" : "✓"}
            </span>
          )}
        </button>
      </div>

      <style>{styles}</style>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = `
  /* Root */
  .ob-root {
    background: #0a0a0a;
    color: #f0ede8;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: inherit;
    /* leave room for sticky CTA */
    padding-bottom: 24px;
  }

  /* Header */
  .ob-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    position: sticky;
    top: 0;
    z-index: 20;
    background: #0a0a0a;
    border-bottom: 1px solid #1a1a1a;
  }
  .ob-back-btn {
    background: none;
    border: none;
    color: #9a9085;
    font-size: 15px;
    cursor: pointer;
    padding: 8px 0;
    min-height: 44px;
    display: flex;
    align-items: center;
  }
  .ob-back-btn:hover { color: #f0ede8; }
  .ob-step-label {
    font-size: 12px;
    color: #6b6560;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-align: center;
    flex: 1;
  }
  .ob-logo {
    font-size: 15px;
    font-weight: 800;
    color: #d4a843;
    letter-spacing: -0.03em;
    min-width: 60px;
    text-align: right;
  }

  /* Progress bar */
  .ob-progress {
    display: flex;
    gap: 4px;
    padding: 0 20px;
    margin-bottom: 4px;
  }
  .ob-progress-seg {
    flex: 1;
    height: 3px;
    background: #1e1e1e;
    border-radius: 4px;
    transition: background 0.3s ease;
  }
  .ob-progress-seg--done { background: #d4a843; }

  /* Main scrollable area */
  .ob-main {
    flex: 1;
    overflow-y: auto;
    padding: 24px 20px 0;
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
  }

  /* Step container */
  .ob-step {
    animation: obEnter 0.25s ease both;
  }
  @keyframes obEnter {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ob-step-title {
    font-size: clamp(22px, 6vw, 30px);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.15;
    margin: 0 0 8px;
    color: #f0ede8;
  }
  .ob-step-sub {
    font-size: 14px;
    color: #6b6560;
    margin: 0 0 28px;
    line-height: 1.5;
  }

  /* Offer cards */
  .ob-offer-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  @media (min-width: 640px) {
    .ob-offer-grid {
      flex-direction: row;
    }
  }
  .ob-offer-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 20px 20px 20px 20px;
    background: #141414;
    border: 1.5px solid #222;
    border-radius: 16px;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.15s ease, background 0.15s ease;
    min-height: 44px;
    flex: 1;
  }
  .ob-offer-card:hover {
    border-color: #3a3a3a;
    background: #161616;
  }
  .ob-offer-card--active {
    border-color: #d4a843 !important;
    background: rgba(212, 168, 67, 0.06) !important;
  }
  .ob-offer-emoji { font-size: 28px; margin-bottom: 4px; }
  .ob-offer-label {
    font-size: 16px;
    font-weight: 700;
    color: #f0ede8;
    letter-spacing: -0.01em;
  }
  .ob-offer-sub {
    font-size: 13px;
    color: #6b6560;
    line-height: 1.4;
  }
  .ob-offer-check {
    position: absolute;
    top: 14px; right: 14px;
    width: 22px; height: 22px;
    background: #d4a843;
    border-radius: 50%;
    color: #0a0a0a;
    font-size: 12px;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
  }

  /* Fields */
  .ob-field {
    margin-bottom: 20px;
  }
  .ob-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #9a9085;
    margin-bottom: 8px;
    letter-spacing: 0.03em;
    text-transform: none;
  }
  .ob-optional {
    font-weight: 400;
    color: #4a4540;
    text-transform: none;
    letter-spacing: 0;
  }

  /* Input */
  .ob-input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    background: #141414;
    border: 1.5px solid #222;
    border-radius: 12px;
    color: #f0ede8;
    font-size: 16px; /* 16px prevents iOS zoom */
    padding: 14px 16px;
    outline: none;
    transition: border-color 0.15s ease;
    -webkit-appearance: none;
  }
  .ob-input:focus { border-color: #d4a843; }
  .ob-input--error { border-color: #c0392b !important; }
  .ob-input::placeholder { color: #3a3530; }

  /* Phone */
  .ob-phone-wrap {
    display: flex;
    align-items: center;
    background: #141414;
    border: 1.5px solid #222;
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.15s ease;
  }
  .ob-phone-wrap:focus-within { border-color: #d4a843; }
  .ob-phone-prefix {
    padding: 0 14px;
    font-size: 15px;
    color: #9a9085;
    white-space: nowrap;
    border-right: 1px solid #222;
    height: 52px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .ob-input--phone {
    border: none !important;
    border-radius: 0 !important;
    flex: 1;
    background: transparent;
  }
  .ob-input--phone:focus { border-color: transparent !important; }

  /* Instagram */
  .ob-ig-wrap {
    display: flex;
    align-items: center;
    background: #141414;
    border: 1.5px solid #222;
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.15s ease;
  }
  .ob-ig-wrap:focus-within { border-color: #d4a843; }
  .ob-ig-at {
    padding: 0 12px;
    font-size: 18px;
    color: #6b6560;
    border-right: 1px solid #222;
    height: 52px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .ob-input--ig {
    border: none !important;
    border-radius: 0 !important;
    flex: 1;
    background: transparent;
  }

  /* Prefix (₹) */
  .ob-prefix-wrap {
    display: flex;
    align-items: center;
    background: #141414;
    border: 1.5px solid #222;
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.15s ease;
  }
  .ob-prefix-wrap:focus-within { border-color: #d4a843; }
  .ob-prefix {
    padding: 0 14px;
    font-size: 18px;
    color: #d4a843;
    font-weight: 700;
    border-right: 1px solid #222;
    height: 52px;
    display: flex; align-items: center;
    flex-shrink: 0;
  }
  .ob-input--prefixed {
    border: none !important;
    border-radius: 0 !important;
    flex: 1;
    background: transparent;
  }

  /* Textarea */
  .ob-textarea {
    display: block;
    width: 100%;
    box-sizing: border-box;
    background: #141414;
    border: 1.5px solid #222;
    border-radius: 12px;
    color: #f0ede8;
    font-size: 16px;
    padding: 14px 16px;
    outline: none;
    resize: vertical;
    font-family: inherit;
    line-height: 1.6;
    transition: border-color 0.15s ease;
  }
  .ob-textarea:focus { border-color: #d4a843; }
  .ob-textarea::placeholder { color: #3a3530; }
  .ob-char-count {
    font-size: 12px;
    color: #4a4540;
    text-align: right;
    margin-top: 6px;
  }

  /* Chips */
  .ob-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .ob-chip {
    padding: 10px 16px;
    background: #141414;
    border: 1.5px solid #222;
    border-radius: 100px;
    color: #9a9085;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    min-height: 44px;
    display: flex; align-items: center;
  }
  .ob-chip:hover { border-color: #3a3a3a; color: #f0ede8; }
  .ob-chip--active {
    border-color: #d4a843 !important;
    background: rgba(212, 168, 67, 0.1) !important;
    color: #d4a843 !important;
  }

  /* Upload zone */
  .ob-upload-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    box-sizing: border-box;
    min-height: 120px;
    background: #141414;
    border: 1.5px dashed #2a2a2a;
    border-radius: 16px;
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease;
    padding: 24px;
  }
  .ob-upload-zone:hover { border-color: #d4a843; background: rgba(212,168,67,0.04); }
  .ob-upload-icon { font-size: 28px; }
  .ob-upload-text { font-size: 15px; font-weight: 600; color: #f0ede8; }
  .ob-upload-hint { font-size: 12px; color: #4a4540; }

  /* Media thumbnails */
  .ob-media-scroll {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 12px 0 4px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .ob-media-scroll::-webkit-scrollbar { display: none; }
  .ob-media-thumb {
    position: relative;
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #222;
  }
  .ob-media-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .ob-media-remove {
    position: absolute;
    top: 4px; right: 4px;
    width: 22px; height: 22px;
    background: rgba(0,0,0,0.75);
    border: none;
    border-radius: 50%;
    color: #f0ede8;
    font-size: 11px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }

  /* Segmented control */
  .ob-seg-group {
    display: flex;
    gap: 0;
    background: #141414;
    border: 1.5px solid #222;
    border-radius: 12px;
    overflow: hidden;
  }
  .ob-seg-btn {
    flex: 1;
    padding: 14px 8px;
    background: transparent;
    border: none;
    border-right: 1px solid #222;
    color: #6b6560;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    min-height: 48px;
  }
  .ob-seg-btn:last-child { border-right: none; }
  .ob-seg-btn:hover { color: #f0ede8; background: #1a1a1a; }
  .ob-seg-btn--active {
    background: rgba(212, 168, 67, 0.12) !important;
    color: #d4a843 !important;
  }

  /* Sub section */
  .ob-sub-section {
    background: #0f0f0f;
    border: 1px solid #1a1a1a;
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 20px;
  }
  .ob-sub-section-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #d4a843;
    margin: 0 0 16px;
  }

  /* 2-column row for date/time */
  .ob-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  /* Field error */
  .ob-field-error {
    font-size: 12px;
    color: #e74c3c;
    margin: 6px 0 0;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* Sticky CTA */
  .ob-sticky-cta {
    position: relative;
    margin-top: 24px;
    background: transparent;
    padding: 0 0 24px;
  }
  .ob-sticky-error {
    font-size: 12px;
    color: #e74c3c;
    text-align: center;
    margin: 0 0 8px;
  }
  .ob-btn-primary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 17px 24px;
    background: #d4a843;
    color: #0a0a0a;
    font-size: 16px;
    font-weight: 800;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
    letter-spacing: 0.01em;
    min-height: 54px;
    box-shadow: 0 4px 24px rgba(212, 168, 67, 0.25);
  }
  .ob-btn-primary:hover {
    background: #e8c060;
    box-shadow: 0 6px 32px rgba(212, 168, 67, 0.35);
  }
  .ob-btn-primary:active { transform: scale(0.98); }
  .ob-cta-arrow { font-size: 18px; }

  /* Success screen */
  .ob-success-screen {
    padding-bottom: 0;
    align-items: center;
    justify-content: center;
  }
  .ob-success-inner {
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
    padding: 40px 24px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
  .ob-success-icon {
    font-size: 64px;
    margin-bottom: 20px;
    animation: obBounce 0.6s cubic-bezier(.36,.07,.19,.97);
  }
  @keyframes obBounce {
    0%   { transform: scale(0.5); opacity: 0; }
    60%  { transform: scale(1.1); }
    100% { transform: scale(1);   opacity: 1; }
  }
  .ob-success-title {
    font-size: 36px;
    font-weight: 900;
    letter-spacing: -0.03em;
    margin: 0 0 12px;
    color: #f0ede8;
  }
  .ob-success-sub {
    font-size: 15px;
    color: #6b6560;
    line-height: 1.6;
    margin: 0 0 32px;
  }
  .ob-success-detail {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 14px 0;
    border-bottom: 1px solid #1a1a1a;
    margin-bottom: 0;
  }
  .ob-success-label { font-size: 13px; color: #4a4540; }
  .ob-success-value { font-size: 13px; font-weight: 600; color: #f0ede8; }
  .ob-success-inner .ob-btn-primary {
    margin-top: 32px;
    max-width: 280px;
  }

  /* Desktop scaling */
  @media (min-width: 640px) {
    .ob-main { padding: 32px 24px 0; }
    .ob-step-title { font-size: 28px; }
    .ob-sticky-cta { max-width: 600px; left: 50%; right: auto; transform: translateX(-50%); width: 100%; border-radius: 20px 20px 0 0; }
    .ob-btn-primary { font-size: 17px; }
  }

  /* Loading dots animation */
  .loading-dots span {
    display: inline-block;
    animation: wave 1.4s infinite;
  }
  .loading-dots span:nth-child(1) { animation-delay: 0s; }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes wave {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.5;
    }
    30% {
      transform: translateY(-4px);
      opacity: 1;
    }
  }
`;