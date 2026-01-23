"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};

    if (!formData.name) e.name = "Name is required";
    if (!formData.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      e.email = "Invalid email address";
    if (!formData.subject) e.subject = "Subject is required";
    if (!formData.message) e.message = "Message is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");

    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess("Your message has been sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    }, 1200);
  };

  return (
    <div className="rounded-2xl contact-form-graadient backdrop-blur-xl border border-white/10 p-8">
      <h2 className="text-xl font-semibold mb-1">Send us a message</h2>
      <p className="text-sm text-white/60 mb-6">
        Fill out the form below and our team will get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Name"
            value={formData.name}
            error={errors.name}
            placeholder="Your name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email"
            value={formData.email}
            error={errors.email}
            placeholder="your.email@example.com"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <Input
          label="Subject"
          value={formData.subject}
          error={errors.subject}
          placeholder="your.email@example.com"
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
        />
        <Textarea
          label="Message"
          value={formData.message}
          error={errors.message}
          placeholder="Please describe your inquiry in details....."
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />
        {success && <p className="text-green-400 text-sm">{success}</p>}
        {/* contact-form-graadient-btn */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium bg-gradient-to-r from-[#4D21FF] to-[#21D4FF]"
        >
          {loading ? "Sending..." : "Send Message"}
        </motion.button>
      </form>
    </div>
  );
}

/* Small UI helpers stay here (no over-splitting) */

function Input({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm text-white/70">{label}</label>
      <input
        {...props}
        className="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-blue-500"
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function Textarea({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="text-sm text-white/70">{label}</label>
      <textarea
        {...props}
        rows={4}
        className="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none resize-none focus:border-blue-500"
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
