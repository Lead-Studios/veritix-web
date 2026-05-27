"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const transferSchema = z.object({
  recipientAddress: z
    .string()
    .min(1, "Recipient address is required")
    .regex(/^G[A-Z2-7]{55}$/, "Must be a valid Stellar public key (starts with G, 56 chars)"),
});

type TransferFormValues = z.infer<typeof transferSchema>;

type TransferStep = "form" | "confirm" | "pending" | "success" | "error";

interface TicketTransferModalProps {
  ticketId: string;
  ticketCode: string;
  isOpen: boolean;
  onClose: () => void;
  onTransferred?: () => void;
}

/**
 * FE-113: Ticket transfer flow for the attendee ticket detail page.
 * Validates the recipient Stellar address, shows a confirmation step,
 * then submits the transfer to the API.
 */
export function TicketTransferModal({
  ticketId,
  ticketCode,
  isOpen,
  onClose,
  onTransferred,
}: TicketTransferModalProps) {
  const [step, setStep] = useState<TransferStep>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferFormValues>({ resolver: zodResolver(transferSchema) });

  const handleClose = () => {
    reset();
    setStep("form");
    setErrorMsg("");
    onClose();
  };

  const onFormSubmit = (data: TransferFormValues) => {
    setRecipientAddress(data.recipientAddress);
    setStep("confirm");
  };

  const confirmTransfer = async () => {
    setStep("pending");
    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(ticketId)}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientAddress }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Transfer failed.");
      }
      setStep("success");
      onTransferred?.();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Transfer failed. Please try again.");
      setStep("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transfer-modal-title"
    >
      <div className="bg-[#101428] border border-[#4D21FF]/40 rounded-2xl p-6 max-w-md w-full space-y-4">
        <h2 id="transfer-modal-title" className="text-lg font-bold text-white">
          Transfer Ticket
        </h2>
        <p className="text-xs text-gray-500 font-mono">{ticketCode}</p>

        {step === "form" && (
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="recipient" className="block text-sm text-gray-400 mb-1">
                Recipient Stellar address <span className="text-red-400">*</span>
              </label>
              <input
                id="recipient"
                type="text"
                {...register("recipientAddress")}
                aria-invalid={!!errors.recipientAddress}
                placeholder="GABC…"
                className={`w-full rounded-lg bg-white/5 border px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#4D21FF] font-mono ${
                  errors.recipientAddress ? "border-red-500" : "border-white/10"
                }`}
              />
              {errors.recipientAddress && (
                <p role="alert" className="mt-1 text-xs text-red-400">
                  {errors.recipientAddress.message}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={handleClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-white/70 text-sm hover:text-white">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#4D21FF] text-white text-sm font-semibold hover:bg-[#3d18cc]">
                Continue
              </button>
            </div>
          </form>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Transfer this ticket to:
            </p>
            <p className="text-xs font-mono text-white break-all bg-white/5 rounded-lg p-3">
              {recipientAddress}
            </p>
            <p className="text-xs text-yellow-400">
              ⚠ This action is irreversible once confirmed on the Stellar network.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setStep("form")} className="flex-1 py-2.5 rounded-lg border border-white/10 text-white/70 text-sm hover:text-white">
                Back
              </button>
              <button onClick={confirmTransfer} className="flex-1 py-2.5 rounded-lg bg-[#4D21FF] text-white text-sm font-semibold hover:bg-[#3d18cc]">
                Confirm Transfer
              </button>
            </div>
          </div>
        )}

        {step === "pending" && (
          <div className="flex items-center gap-3 text-gray-300 text-sm py-4">
            <span className="w-5 h-5 border-2 border-[#4D21FF] border-t-transparent rounded-full animate-spin flex-shrink-0" />
            Submitting transfer to Stellar network…
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4">
            <p className="text-green-400 text-sm font-semibold">✓ Ticket transferred successfully.</p>
            <button onClick={handleClose} className="w-full py-2.5 rounded-lg bg-[#4D21FF] text-white text-sm font-semibold">
              Close
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="space-y-4">
            <p role="alert" className="text-red-400 text-sm">{errorMsg}</p>
            <div className="flex gap-3">
              <button onClick={handleClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-white/70 text-sm">
                Cancel
              </button>
              <button onClick={() => setStep("confirm")} className="flex-1 py-2.5 rounded-lg bg-[#4D21FF] text-white text-sm font-semibold">
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
