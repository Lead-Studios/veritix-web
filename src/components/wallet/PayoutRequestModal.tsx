"use client";

import React, { useEffect, useRef, useState } from "react";

interface PayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PayoutFormData) => Promise<void>;
  availableBalance: number;
  currency?: string;
}

export interface PayoutFormData {
  amount: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  narration: string;
}

const BANKS = [
  { code: "044", name: "Access Bank" },
  { code: "050", name: "EcoBank" },
  { code: "011", name: "First Bank" },
  { code: "058", name: "GTBank" },
  { code: "030", name: "Heritage Bank" },
  { code: "301", name: "Jaiz Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "039", name: "Stanbic IBTC" },
  { code: "232", name: "Sterling Bank" },
  { code: "032", name: "Union Bank" },
  { code: "033", name: "UBA" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
];

function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const PayoutRequestModal: React.FC<PayoutRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableBalance,
  currency = "NGN",
}) => {
  const [form, setForm] = useState<PayoutFormData>({
    amount: 0,
    bankCode: "",
    accountNumber: "",
    accountName: "",
    narration: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PayoutFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Trap focus and handle Escape
  useEffect(() => {
    if (!isOpen) return;
    firstInputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.amount || form.amount <= 0) next.amount = "Enter a valid amount";
    if (form.amount > availableBalance)
      next.amount = `Max ${formatCurrency(availableBalance, currency)}`;
    if (!form.bankCode) next.bankCode = "Select a bank";
    if (!/^\d{10}$/.test(form.accountNumber))
      next.accountNumber = "Account number must be 10 digits";
    if (!form.accountName.trim()) next.accountName = "Enter account name";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-[#0f1a2e] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="payout-modal-title" className="text-lg font-semibold text-white">
            Request Payout
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close payout modal"
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500"
          >
            ✕
          </button>
        </div>

        <p className="mb-5 text-sm text-gray-400">
          Available balance:{" "}
          <span className="font-semibold text-white">
            {formatCurrency(availableBalance, currency)}
          </span>
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Amount */}
          <div>
            <label htmlFor="payout-amount" className="mb-1 block text-xs font-medium text-gray-300">
              Amount
            </label>
            <input
              ref={firstInputRef}
              id="payout-amount"
              type="number"
              min={1}
              max={availableBalance}
              value={form.amount || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: Number(e.target.value) }))
              }
              aria-describedby={errors.amount ? "payout-amount-error" : undefined}
              aria-invalid={!!errors.amount}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus-visible:border-purple-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
              placeholder="0"
            />
            {errors.amount && (
              <p id="payout-amount-error" role="alert" className="mt-1 text-xs text-red-400">
                {errors.amount}
              </p>
            )}
          </div>

          {/* Bank */}
          <div>
            <label htmlFor="payout-bank" className="mb-1 block text-xs font-medium text-gray-300">
              Bank
            </label>
            <select
              id="payout-bank"
              value={form.bankCode}
              onChange={(e) =>
                setForm((f) => ({ ...f, bankCode: e.target.value }))
              }
              aria-invalid={!!errors.bankCode}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus-visible:border-purple-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
            >
              <option value="">Select bank…</option>
              {BANKS.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
            {errors.bankCode && (
              <p role="alert" className="mt-1 text-xs text-red-400">
                {errors.bankCode}
              </p>
            )}
          </div>

          {/* Account number */}
          <div>
            <label htmlFor="payout-acct" className="mb-1 block text-xs font-medium text-gray-300">
              Account Number
            </label>
            <input
              id="payout-acct"
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={form.accountNumber}
              onChange={(e) =>
                setForm((f) => ({ ...f, accountNumber: e.target.value.replace(/\D/g, "") }))
              }
              aria-invalid={!!errors.accountNumber}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus-visible:border-purple-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
              placeholder="0000000000"
            />
            {errors.accountNumber && (
              <p role="alert" className="mt-1 text-xs text-red-400">
                {errors.accountNumber}
              </p>
            )}
          </div>

          {/* Account name */}
          <div>
            <label htmlFor="payout-name" className="mb-1 block text-xs font-medium text-gray-300">
              Account Name
            </label>
            <input
              id="payout-name"
              type="text"
              value={form.accountName}
              onChange={(e) =>
                setForm((f) => ({ ...f, accountName: e.target.value }))
              }
              aria-invalid={!!errors.accountName}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus-visible:border-purple-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
              placeholder="As on bank records"
            />
            {errors.accountName && (
              <p role="alert" className="mt-1 text-xs text-red-400">
                {errors.accountName}
              </p>
            )}
          </div>

          {/* Narration */}
          <div>
            <label htmlFor="payout-narration" className="mb-1 block text-xs font-medium text-gray-300">
              Narration <span className="text-gray-500">(optional)</span>
            </label>
            <input
              id="payout-narration"
              type="text"
              maxLength={100}
              value={form.narration}
              onChange={(e) =>
                setForm((f) => ({ ...f, narration: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus-visible:border-purple-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
              placeholder="e.g. Event proceeds"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-700 py-2 text-sm text-gray-300 hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Request Payout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PayoutRequestModal;