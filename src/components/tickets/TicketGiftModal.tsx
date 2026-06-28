"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const giftSchema = z.object({
  recipientEmail: z.string().email("Please enter a valid email address"),
  message: z.string().max(500, "Message must be under 500 characters").optional(),
});

type GiftFormValues = z.infer<typeof giftSchema>;

interface TicketGiftModalProps {
  ticketId: string;
  eventName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TicketGiftModal({ ticketId, eventName, onClose, onSuccess }: TicketGiftModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GiftFormValues>({
    resolver: zodResolver(giftSchema),
  });

  const onSubmit = async (data: GiftFormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(ticketId)}/gift`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Failed to gift ticket.");
      }
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="rounded-2xl border border-white/10 bg-[#020718] w-full max-w-md p-6 space-y-5">
        {success ? (
          <div className="text-center space-y-3 py-6">
            <div className="text-4xl">🎁</div>
            <h2 className="text-xl font-bold text-white">Ticket Gifted!</h2>
            <p className="text-sm text-gray-400">
              Your ticket for <span className="text-white">{eventName}</span> has been sent.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-lg bg-[#4D21FF] hover:bg-[#3d18cc] text-white text-sm font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Gift Ticket</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-xl" aria-label="Close">
                &times;
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Send your ticket for <span className="text-white">{eventName}</span> to someone else.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <label htmlFor="recipientEmail" className="block text-xs text-gray-400 mb-1">
                  Recipient email <span className="text-red-400">*</span>
                </label>
                <input
                  id="recipientEmail"
                  type="email"
                  {...register("recipientEmail")}
                  aria-invalid={!!errors.recipientEmail}
                  className={`w-full rounded-lg bg-white/5 border px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#4D21FF] ${
                    errors.recipientEmail ? "border-red-500" : "border-white/10"
                  }`}
                  placeholder="friend@example.com"
                />
                {errors.recipientEmail && (
                  <p role="alert" className="mt-1 text-xs text-red-400">
                    {errors.recipientEmail.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-xs text-gray-400 mb-1">
                  Personal message (optional)
                </label>
                <textarea
                  id="message"
                  rows={3}
                  {...register("message")}
                  aria-invalid={!!errors.message}
                  className={`w-full rounded-lg bg-white/5 border px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#4D21FF] resize-none ${
                    errors.message ? "border-red-500" : "border-white/10"
                  }`}
                  placeholder="Hope you enjoy the show!"
                />
                {errors.message && (
                  <p role="alert" className="mt-1 text-xs text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>
              {serverError && (
                <p role="alert" className="text-xs text-red-400">{serverError}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm font-medium hover:border-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-lg bg-[#4D21FF] hover:bg-[#3d18cc] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending…" : "Send Gift"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
