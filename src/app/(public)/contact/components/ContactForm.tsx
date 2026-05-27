"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name) e.name = "Name is required";
    if (!formData.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = "Invalid email address";
    if (!formData.subject) e.subject = "Subject is required";
    if (!formData.message) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setApiError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setApiError(err?.message || "Failed to send your message. Please try again.");
        return;
      }

      setSuccess("Your message has been sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl contact-form-graadient backdrop-blur-xl border border-white/10 p-8 flex flex-col items-center justify-center gap-4 text-center min-h-[320px]">
        <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Message Sent!</h2>
        <p className="text-white/60 text-sm">{success}</p>
        <button onClick={() => setSuccess("")} className="mt-2 text-sm text-[#21D4FF] hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl contact-form-graadient backdrop-blur-xl border border-white/10 p-8">
      <h2 className="text-xl font-semibold mb-1">Send us a message</h2>
      <p className="text-sm text-white/60 mb-6">
        Fill out the form below and our team will get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            id="contact-name"
            label="Name"
            value={formData.name}
            error={errors.name}
            placeholder="Your name"
            autoComplete="name"
            inputMode="text"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            id="contact-email"
            label="Email"
            value={formData.email}
            error={errors.email}
            placeholder="your.email@example.com"
            type="email"
            autoComplete="email"
            inputMode="email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <Input
          id="contact-subject"
          label="Subject"
          value={formData.subject}
          error={errors.subject}
          placeholder="How can we help?"
          autoComplete="off"
          inputMode="text"
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />
        <Textarea
          id="contact-message"
          label="Message"
          value={formData.message}
          error={errors.message}
          placeholder="Please describe your inquiry in details....."
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
        {success && <p className="text-green-400 text-sm">{success}</p>}
        {apiError && <p className="text-red-400 text-sm">{apiError}</p>}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Message"}
        </motion.button>
      </form>
    </div>
  );
}

/* Small UI helpers stay here (no over-splitting) */

function Input({
  id,
  label,
  error,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-white/70">{label}</label>
      <input
        id={id}
        {...props}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-blue-500"
      />
      {error && <p id={`${id}-error`} role="alert" className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function Textarea({
  id,
  label,
  error,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-white/70">{label}</label>
      <textarea
        id={id}
        {...props}
        rows={4}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none resize-none focus:border-blue-500"
      />
      {error && <p id={`${id}-error`} role="alert" className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
