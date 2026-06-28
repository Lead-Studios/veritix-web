"use client";

import { useCallback, useState } from "react";
import { HiOutlineClipboardCopy, HiOutlineCheck } from "react-icons/hi";

interface PaymentInstructionsProps {
  amount: number;
  assetCode?: string;
  destinationAddress: string;
  memo?: string;
  memoType?: "text" | "id" | "hash";
  expiresAt?: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
      aria-label={`Copy ${text}`}
    >
      {copied ? <HiOutlineCheck className="w-3.5 h-3.5" /> : <HiOutlineClipboardCopy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export function StellarPaymentInstructions({
  amount,
  assetCode = "XLM",
  destinationAddress,
  memo,
  memoType = "text",
  expiresAt,
}: PaymentInstructionsProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#020718]/80 p-6 space-y-6 max-w-lg">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-900/40 border border-blue-500/30 px-3 py-1 text-xs text-blue-300 mb-3">
          Stellar Network
        </div>
        <h2 className="text-xl font-bold text-white">Payment Instructions</h2>
        <p className="text-sm text-gray-400 mt-1">
          Send exactly <span className="text-white font-semibold">{amount} {assetCode}</span> to the address below.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Destination Address</span>
              <CopyButton text={destinationAddress} />
            </div>
            <p className="text-sm font-mono text-white break-all bg-white/5 rounded-lg px-3 py-2 border border-white/5">
              {destinationAddress}
            </p>
          </div>

          {memo && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Memo ({memoType})</span>
                <CopyButton text={memo} />
              </div>
              <p className="text-sm font-mono text-yellow-300 break-all bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                {memo}
              </p>
            </div>
          )}

          <div>
            <span className="text-xs text-gray-500">Amount</span>
            <p className="text-lg font-bold text-white mt-0.5">
              {amount} <span className="text-sm font-normal text-gray-400">{assetCode}</span>
            </p>
          </div>
        </div>

        {expiresAt && (
          <p className="text-xs text-gray-500 text-center">
            These instructions expire at {new Date(expiresAt).toLocaleString()}
          </p>
        )}

        <div className="rounded-xl border border-yellow-700/30 bg-yellow-900/10 p-4 text-xs text-yellow-300 space-y-1">
          <p className="font-semibold">Important</p>
          <ul className="list-disc list-inside text-yellow-200/80 space-y-0.5">
            <li>Send only {assetCode} on the Stellar network.</li>
            {memo && <li>The memo <strong>must</strong> be included for your payment to be credited.</li>}
            <li>Transactions typically confirm in 3&ndash;5 seconds.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
