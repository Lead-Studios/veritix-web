"use client";

import { useState, FormEvent } from "react";

const NEWSLETTER_ENDPOINT =
  process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT ?? "/api/newsletter";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message ?? "Subscription failed. Please try again.");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <p className="text-sm text-green-400">
        ✓ You&apos;re subscribed! Check your inbox for a confirmation.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] p-[1px]">
          <div className="flex w-full items-center rounded-full bg-[#0b1025] px-4 py-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              aria-label="Email address for newsletter"
              disabled={status === "loading"}
              className="flex-1 bg-transparent text-xs text-white placeholder:text-white/50 focus:outline-none disabled:opacity-60"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="whitespace-nowrap rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe Now"}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
