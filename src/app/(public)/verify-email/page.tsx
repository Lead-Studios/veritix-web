"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { HiMail } from "react-icons/hi";
import PublicShell from "@/components/shared/PublicShell";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "your email";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleResend = async () => {
    setStatus("sending");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <PublicShell>
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0a1b3d] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#4D21FF]/20">
            <HiMail className="h-8 w-8 text-[#21D4FF]" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Check your inbox</h1>
          <p className="text-gray-400 text-sm mb-6">
            We sent a verification link to{" "}
            <span className="font-semibold text-white">{email}</span>. Click the
            link to activate your account.
          </p>

          {status === "sent" && (
            <p role="status" className="mb-4 text-sm text-green-400">
              ✓ Verification email resent successfully.
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="mb-4 text-sm text-red-400">
              Failed to resend. Please try again.
            </p>
          )}

          <button
            onClick={handleResend}
            disabled={status === "sending" || status === "sent"}
            className="w-full rounded-lg bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition"
          >
            {status === "sending" ? "Sending…" : "Resend Verification Email"}
          </button>

          <p className="mt-4 text-xs text-gray-500">
            Already verified?{" "}
            <a href="/login" className="text-[#21D4FF] hover:underline">
              Sign in
            </a>
          </p>
        </motion.div>
      </div>
    </PublicShell>
  );
}
