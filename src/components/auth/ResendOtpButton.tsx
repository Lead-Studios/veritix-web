"use client";
import { useState } from "react";

interface Props { email: string; }

export default function ResendOtpButton({ email }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [countdown, setCountdown] = useState(0);

  const resend = async () => {
    setStatus("loading");
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus("sent");
      setCountdown(60);
      const t = setInterval(() => setCountdown((c) => { if (c <= 1) { clearInterval(t); setStatus("idle"); return 0; } return c - 1; }), 1000);
    } else {
      setStatus("error");
    }
  };

  if (status === "sent") return <p className="text-sm text-green-600">Code resent. Retry in {countdown}s.</p>;
  if (status === "error") return <p className="text-sm text-red-500">Failed to resend. Try again.</p>;
  return (
    <button onClick={resend} disabled={status === "loading"}
      className="text-sm text-primary underline disabled:opacity-50">
      {status === "loading" ? "Sending…" : "Resend verification email"}
    </button>
  );
}
