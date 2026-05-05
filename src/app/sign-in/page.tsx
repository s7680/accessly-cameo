"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";

export default function SignInPage() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const router = useRouter();


  // NOTE: Do NOT handle onboarding logic here.
  // Redirect decisions should be handled in /auth/callback after OAuth.

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleContinue = async () => {
    if (cooldown > 0) {
      alert(`Wait ${cooldown}s before retry`);
      return;
    }

    if (!isValidEmail(inputValue.trim())) {
      alert("Enter a valid email");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: inputValue,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to send OTP");
      return;
    }

    setStep("otp");
    setCooldown(60);

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGoogleContinue = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      alert("Google login failed");
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleSubmitOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      alert("Enter complete OTP");
      return;
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email: inputValue,
      token: enteredOtp,
      type: "email",
    });

    if (error) {
      console.error(error);
      alert("Invalid OTP");
      return;
    }

    router.push("/");
  };

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "#F7F6F2",
        fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=Instrument+Serif:ital@0;1&display=swap');

        * { box-sizing: border-box; }

        .signin-card {
          width: 100%;
          max-width: 440px;
          background: #FFFFFF;
          border-radius: 20px;
          padding: 40px 36px 36px;
          box-shadow:
            0 1px 2px rgba(0,0,0,0.04),
            0 4px 12px rgba(0,0,0,0.06),
            0 16px 40px rgba(0,0,0,0.06);
        }

        @media (max-width: 480px) {
          .signin-card {
            padding: 32px 20px 28px;
            border-radius: 16px;
          }
        }

        .brand-mark {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 32px;
        }

        .brand-dot {
          width: 28px;
          height: 28px;
          background: #1A1A1A;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-dot span {
          width: 10px;
          height: 10px;
          background: #F7F6F2;
          border-radius: 50%;
          display: block;
        }

        .brand-name {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: 17px;
          color: #1A1A1A;
          letter-spacing: -0.01em;
        }

        .title {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(26px, 6vw, 32px);
          font-weight: 400;
          color: #1A1A1A;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin: 0 0 8px;
        }

        .subtitle {
          font-size: 14px;
          color: #888880;
          margin: 0 0 28px;
          line-height: 1.5;
          font-weight: 400;
        }

        .input-wrap {
          position: relative;
          margin-bottom: 12px;
        }

        .signin-input {
          width: 100%;
          height: 48px;
          border: 1.5px solid #E8E7E2;
          border-radius: 12px;
          padding: 0 16px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1A1A1A;
          background: #FAFAF8;
          outline: none;
          transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
          -webkit-appearance: none;
        }

        .signin-input::placeholder {
          color: #B8B6B0;
        }

        .signin-input:focus {
          border-color: #1A1A1A;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.06);
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #E8E7E2;
        }

        .divider-text {
          font-size: 12px;
          color: #B8B6B0;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .google-btn {
          width: 100%;
          height: 48px;
          border: 1.5px solid #E8E7E2;
          border-radius: 12px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          color: #1A1A1A;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
          letter-spacing: -0.01em;
        }

        .google-btn:hover {
          background: #F7F6F2;
          border-color: #D0CFC9;
        }

        .google-btn:active {
          background: #EEEDEA;
        }

        .footer-note {
          margin-top: 24px;
          font-size: 12px;
          color: #B8B6B0;
          text-align: center;
          line-height: 1.6;
        }

        .footer-note a {
          color: #888880;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      `}</style>

      <div className="signin-card">
        {/* Brand mark */}
        <div className="brand-mark">
          <div className="brand-dot"><span /></div>
          <span className="brand-name">Accessly</span>
        </div>

        {/* Title */}
        <h1 className="title">Sign in to<br />Accessly</h1>
        <p className="subtitle">Enter your email to receive an OTP</p>

        {step === "email" && (
          <>
            <div className="input-wrap">
              <input
                className="signin-input"
                type="text"
                placeholder="Email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                disabled={loading}
              />
            </div>

            <Button
              variant="primary"
              onClick={handleContinue}
              disabled={!isValidEmail(inputValue) || loading || cooldown > 0}
              style={{ width: "100%", minHeight: "48px" }}
            >
              {loading ? "Sending link…" : "Send OTP"}
            </Button>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            <button className="google-btn" onClick={handleGoogleContinue} type="button" disabled={loading}>
              Continue with Google
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "16px" }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  style={{
                    width: "48px",
                    height: "48px",
                    textAlign: "center",
                    fontSize: "18px",
                    borderRadius: "10px",
                    border: "1.5px solid #E8E7E2",
                    background: "#FAFAF8",
                  }}
                />
              ))}
            </div>

            <Button
              variant="primary"
              onClick={handleSubmitOtp}
              style={{ width: "100%", minHeight: "48px" }}
            >
              Verify OTP
            </Button>
          </>
        )}

        {/* Footer */}
        <p className="footer-note">
          By continuing, you agree to our{" "}
          <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
}