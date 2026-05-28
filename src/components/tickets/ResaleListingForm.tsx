"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const resaleSchema = z.object({
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Price must be a positive number"),
});

type ResaleFormValues = z.infer<typeof resaleSchema>;

interface ResaleListingFormProps {
  ticketId: string;
  originalPrice: number;
  maxResellPercent?: number; // e.g. 150 means max 1.5× original
  onSuccess?: () => void;
}

/**
 * FE-117: Resale listing form shown when resale is enabled for a ticket type.
 */
export function ResaleListingForm({
  ticketId,
  originalPrice,
  maxResellPercent = 150,
  onSuccess,
}: ResaleListingFormProps) {
  const maxPrice = (originalPrice * maxResellPercent) / 100;
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResaleFormValues>({
    resolver: zodResolver(
      resaleSchema.refine(
        (v) => Number(v.price) <= maxPrice,
        { message: `Price cannot exceed ${maxResellPercent}% of original (${maxPrice.toFixed(2)} XLM)`, path: ["price"] }
      )
    ),
  });

  const onSubmit = async (data: ResaleFormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(ticketId)}/resale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: Number(data.price) }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Failed to list ticket for resale.");
      }
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-green-700 bg-green-900/30 p-4 text-sm text-green-300 text-center">
        ✓ Ticket listed for resale successfully.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <h3 className="text-sm font-semibold text-white">List for Resale</h3>
      <p className="text-xs text-gray-400">
        Original price: <span className="text-gray-300">{originalPrice} XLM</span> · Max:{" "}
        <span className="text-gray-300">{maxPrice.toFixed(2)} XLM</span>
      </p>

      <div>
        <label htmlFor="resale-price" className="block text-xs text-gray-400 mb-1">
          Resale price (XLM) <span className="text-red-400">*</span>
        </label>
        <input
          id="resale-price"
          type="number"
          step="0.01"
          min="0.01"
          {...register("price")}
          aria-invalid={!!errors.price}
          placeholder={`e.g. ${originalPrice}`}
          className={`w-full rounded-lg bg-white/5 border px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#4D21FF] ${
            errors.price ? "border-red-500" : "border-white/10"
          }`}
        />
        {errors.price && (
          <p role="alert" className="mt-1 text-xs text-red-400">
            {errors.price.message}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="text-xs text-red-400">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 rounded-lg bg-[#4D21FF] hover:bg-[#3d18cc] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Listing…" : "List for Resale"}
      </button>
    </form>
  );
}
