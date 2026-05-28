"use client";

/**
 * FE-124: Shows a pending state banner during Stellar ticket purchase transactions.
 * Renders nothing when there is no active transaction.
 */

export type TxState = "idle" | "pending" | "confirmed" | "failed";

interface StellarTxStatusProps {
  state: TxState;
  txHash?: string;
  onDismiss?: () => void;
}

const CONFIG: Record<
  Exclude<TxState, "idle">,
  { label: string; className: string; icon: string }
> = {
  pending: {
    label: "Transaction submitted — waiting for Stellar network confirmation…",
    className: "bg-yellow-900/60 border-yellow-700 text-yellow-300",
    icon: "⏳",
  },
  confirmed: {
    label: "Transaction confirmed on the Stellar network.",
    className: "bg-green-900/60 border-green-700 text-green-300",
    icon: "✓",
  },
  failed: {
    label: "Transaction failed. Please try again.",
    className: "bg-red-900/60 border-red-700 text-reded-300",
    icon: "✕",
  },
};

export function StellarTxStatus({ state, txHash, onDismiss }: StellarTxStatusProps) {
  if (state === "idle") return null;

  const { label, className, icon } = CONFIG[state];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${className}`}
    >
      {state === "pending" ? (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0"
          aria-hidden="true"
        />
      ) : (
        <span aria-hidden="true">{icon}</span>
      )}
      <span className="flex-1">
        {label}
        {txHash && state === "confirmed" && (
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 underline opacity-80 hover:opacity-100"
          >
            View on Explorer
          </a>
        )}
      </span>
      {onDismiss && state !== "pending" && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="ml-auto opacity-70 hover:opacity-100 text-lg leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}
