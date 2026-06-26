"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-toastify";
import { Check, Clock, Copy, RefreshCw, TicketCheck } from "lucide-react";
import { useOrderStatus } from "@/hooks/useOrderStatus";

type StellarPaymentInstructionsProps = {
  orderId: string;
  destinationAddress: string;
  memo: string;
  amountXLM: string | number;
  expiresAt?: string | Date;
  expiresInMinutes?: number;
  className?: string;
};

type RetryPaymentResponse = {
  destinationAddress?: string;
  memo?: string;
  amountXLM?: string | number;
  expiresAt?: string;
};

const DEFAULT_EXPIRY_MINUTES = 15;

function normalizeAmount(amount: string | number) {
  return typeof amount === "number" ? amount.toFixed(7).replace(/\.?0+$/, "") : amount;
}

function truncateAddress(address: string) {
  if (address.length <= 18) return address;
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
}

function getInitialExpiry(expiresAt?: string | Date, expiresInMinutes = DEFAULT_EXPIRY_MINUTES) {
  if (expiresAt) return new Date(expiresAt).getTime();
  return Date.now() + expiresInMinutes * 60_000;
}

function formatRemaining(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function StellarPaymentInstructions({
  orderId,
  destinationAddress,
  memo,
  amountXLM,
  expiresAt,
  expiresInMinutes = DEFAULT_EXPIRY_MINUTES,
  className = "",
}: StellarPaymentInstructionsProps) {
  const router = useRouter();
  const [payment, setPayment] = useState({
    destinationAddress,
    memo,
    amountXLM,
    expiresAt: getInitialExpiry(expiresAt, expiresInMinutes),
  });
  const [now, setNow] = useState(() => Date.now());
  const [copiedField, setCopiedField] = useState<"destination" | "memo" | "amount" | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { data, error, isLoading, refetch } = useOrderStatus(orderId, {
    enabled: Boolean(orderId),
    intervalMs: 5000,
  });

  const amount = normalizeAmount(payment.amountXLM);
  const remainingMs = payment.expiresAt - now;
  const isExpired = remainingMs <= 0;

  const stellarPayUri = useMemo(() => {
    const params = new URLSearchParams({
      destination: payment.destinationAddress,
      amount: String(amount),
      memo: payment.memo,
    });
    return `web+stellar:pay?${params.toString()}`;
  }, [amount, payment.destinationAddress, payment.memo]);

  useEffect(() => {
    // This syncs the local payment window when the backend returns a fresh order payload.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPayment({
      destinationAddress,
      memo,
      amountXLM,
      expiresAt: getInitialExpiry(expiresAt, expiresInMinutes),
    });
  }, [amountXLM, destinationAddress, expiresAt, expiresInMinutes, memo]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (data?.status === "PAID") {
      toast.success("🎉 Tickets issued! Check your email.");
      router.push("/tickets");
    }
  }, [data?.status, router]);

  async function copyValue(field: "destination" | "memo" | "amount", value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 1800);
  }

  async function retryPayment() {
    setIsRetrying(true);
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/retry-payment`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Retry payment request failed with ${response.status}`);
      }

      const retryData = (await response.json()) as RetryPaymentResponse;
      setPayment((current) => ({
        destinationAddress: retryData.destinationAddress ?? current.destinationAddress,
        memo: retryData.memo ?? current.memo,
        amountXLM: retryData.amountXLM ?? current.amountXLM,
        expiresAt: getInitialExpiry(retryData.expiresAt, expiresInMinutes),
      }));
      setNow(Date.now());
      toast.success("Payment window refreshed.");
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not retry payment.");
    } finally {
      setIsRetrying(false);
    }
  }

  return (
    <section
      className={`rounded-2xl border border-[#4D21FF]/30 bg-[#000625]/80 p-5 text-white shadow-[0_24px_60px_rgba(0,6,37,0.35)] ${className}`}
      aria-labelledby="stellar-payment-title"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#21D4FF]">
            Stellar payment
          </p>
          <h2 id="stellar-payment-title" className="text-2xl font-bold">
            Complete your ticket payment
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-gray-300">
            Send the exact XLM amount to the destination below and include the memo. The order
            will auto-confirm once the payment is detected.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <Clock className="h-4 w-4 text-[#21D4FF]" aria-hidden="true" />
          {isExpired ? (
            <span className="font-semibold text-red-300">Payment window expired</span>
          ) : (
            <span>
              Expires in <strong>{formatRemaining(remainingMs)}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[220px_1fr]">
        <div className="rounded-xl border border-white/10 bg-white p-4">
          <QRCodeSVG value={stellarPayUri} size={188} level="M" marginSize={2} />
        </div>

        <div className="space-y-4">
          <PaymentRow
            label="Destination address"
            value={payment.destinationAddress}
            displayValue={truncateAddress(payment.destinationAddress)}
            copied={copiedField === "destination"}
            onCopy={() => copyValue("destination", payment.destinationAddress)}
          />
          <PaymentRow
            label="Memo"
            value={payment.memo}
            displayValue={payment.memo}
            copied={copiedField === "memo"}
            isCritical
            onCopy={() => copyValue("memo", payment.memo)}
          />
          <PaymentRow
            label="Amount"
            value={`${amount} XLM`}
            displayValue={`${amount} XLM`}
            copied={copiedField === "amount"}
            onCopy={() => copyValue("amount", String(amount))}
          />

          {isExpired ? (
            <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-4">
              <p className="text-sm font-semibold text-red-200">This payment window expired.</p>
              <p className="mt-1 text-sm text-red-100/80">
                Retry payment to request a fresh memo and expiry window for this order.
              </p>
              <button
                type="button"
                onClick={retryPayment}
                disabled={isRetrying}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} aria-hidden="true" />
                Retry Payment
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              <TicketCheck className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              {isLoading ? "Checking payment status..." : "Waiting for payment confirmation."}
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm text-yellow-300">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

type PaymentRowProps = {
  label: string;
  value: string;
  displayValue: string;
  copied: boolean;
  isCritical?: boolean;
  onCopy: () => void;
};

function PaymentRow({ label, value, displayValue, copied, isCritical = false, onCopy }: PaymentRowProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        isCritical ? "border-red-500/40 bg-red-950/30" : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-wide ${isCritical ? "text-red-300" : "text-gray-400"}`}>
            {label}
          </p>
          <p title={value} className="mt-1 break-all font-mono text-sm text-white">
            {displayValue}
          </p>
          {isCritical && (
            <p className="mt-2 text-sm font-semibold text-red-200">
              Required - your payment will fail without the memo
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          aria-label={`Copy ${label.toLowerCase()}`}
        >
          {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
