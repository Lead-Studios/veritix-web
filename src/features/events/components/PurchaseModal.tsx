"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { StellarPaymentInstructions } from "@/components/payment/StellarPaymentInstructions";
import type { TicketOption } from "./TicketSelector";

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  eventName: string;
  ticket: TicketOption | null;
  quantity: number;
  eventId: string;
}

interface OrderResponse {
  destinationAddress: string;
  memo: string;
  amount: number;
  expiresAt: string;
}

export function PurchaseModal({
  open,
  onClose,
  eventName,
  ticket,
  quantity,
  eventId,
}: PurchaseModalProps) {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!ticket) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          ticketType: ticket.name,
          quantity,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message ?? "Order failed");
      }
      const data = (await res.json()) as OrderResponse;
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOrder(null);
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={order ? "Payment Instructions" : "Confirm Purchase"}
      size="md"
    >
      {order ? (
        <StellarPaymentInstructions
          amount={order.amount}
          destinationAddress={order.destinationAddress}
          memo={order.memo}
          memoType="text"
          expiresAt={order.expiresAt}
        />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-white/70">
            You are about to purchase{" "}
            <span className="font-semibold text-white">
              {quantity} × {ticket?.name}
            </span>{" "}
            for <span className="font-semibold text-white">{eventName}</span>.
          </p>
          {ticket && (
            <div className="rounded-xl border border-[#4D21FF]/30 bg-[#0a0f24] p-4 text-sm">
              <div className="flex justify-between text-white/70">
                <span>Price per ticket</span>
                <span className="text-white">{ticket.price} ETH</span>
              </div>
              <div className="mt-2 flex justify-between font-semibold">
                <span className="text-white">Total</span>
                <span className="text-[#21D4FF]">
                  {(ticket.price * quantity).toFixed(3)} ETH
                </span>
              </div>
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-400">{error}</p>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {loading ? "Processing…" : "Confirm & Pay"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
