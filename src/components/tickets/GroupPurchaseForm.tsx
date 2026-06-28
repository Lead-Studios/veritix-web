"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const attendeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
});

const groupSchema = z.object({
  attendees: z.array(attendeeSchema).min(1, "Add at least one attendee"),
});

type GroupFormValues = z.infer<typeof groupSchema>;

interface GroupPurchaseFormProps {
  ticketTypeId: string;
  ticketTypeName: string;
  unitPrice: number;
  maxQuantity: number;
  onSuccess?: () => void;
}

export function GroupPurchaseForm({
  ticketTypeId,
  ticketTypeName,
  unitPrice,
  maxQuantity,
  onSuccess,
}: GroupPurchaseFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: { attendees: [{ name: "", email: "" }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "attendees" });

  const onSubmit = async (data: GroupFormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/tickets/${ticketTypeId}/group-purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketTypeId,
          attendees: data.attendees,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Group purchase failed.");
      }
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const total = fields.length * unitPrice;

  if (success) {
    return (
      <div className="rounded-2xl border border-green-700/40 bg-green-900/20 p-8 text-center space-y-3">
        <div className="text-4xl">🎉</div>
        <h2 className="text-xl font-bold text-white">Purchase Complete!</h2>
        <p className="text-sm text-gray-400">
          {fields.length} {ticketTypeName} ticket{fields.length > 1 ? "s" : ""} purchased for{" "}
          <span className="text-white">{fields.length} attendee{fields.length > 1 ? "s" : ""}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#020718]/80 p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white">Group Purchase</h2>
        <p className="text-sm text-gray-400 mt-1">
          {ticketTypeName} &middot; {unitPrice} XLM each
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">Attendee {index + 1}</span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  placeholder="Name"
                  {...register(`attendees.${index}.name`)}
                  aria-invalid={!!errors.attendees?.[index]?.name}
                  className={`w-full rounded-lg bg-white/5 border px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#4D21FF] ${
                    errors.attendees?.[index]?.name ? "border-red-500" : "border-white/10"
                  }`}
                />
                {errors.attendees?.[index]?.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.attendees[index]!.name!.message}</p>
                )}
              </div>
              <div>
                <input
                  placeholder="Email"
                  type="email"
                  {...register(`attendees.${index}.email`)}
                  aria-invalid={!!errors.attendees?.[index]?.email}
                  className={`w-full rounded-lg bg-white/5 border px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#4D21FF] ${
                    errors.attendees?.[index]?.email ? "border-red-500" : "border-white/10"
                  }`}
                />
                {errors.attendees?.[index]?.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.attendees[index]!.email!.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {fields.length < maxQuantity && (
          <button
            type="button"
            onClick={() => append({ name: "", email: "" })}
            className="w-full py-2.5 rounded-lg border border-dashed border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
          >
            + Add another attendee
          </button>
        )}

        {serverError && (
          <p role="alert" className="text-xs text-red-400">{serverError}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-sm text-gray-400">
            {fields.length} &times; {unitPrice} XLM
          </span>
          <span className="text-lg font-bold text-white">{total} XLM</span>
        </div>

        <button
          type="submit"
          disabled={submitting || fields.length === 0}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] text-white font-semibold hover:opacity-95 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Processing…" : `Purchase ${fields.length} Ticket${fields.length !== 1 ? "s" : ""}`}
        </button>
      </form>
    </div>
  );
}
