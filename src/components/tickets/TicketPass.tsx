"use client";

import React from "react";

export type WalletStatus = "confirmed" | "pending" | "failed";
export type TransferState = "none" | "transferable" | "transfer-pending" | "transferred";

export interface AttendeeTicket {
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  ticketType: string;
  ticketCode: string;
  walletStatus: WalletStatus;
  transferState: TransferState;
  ownerAddress?: string;
}

const WALLET_BADGE: Record<WalletStatus, { label: string; className: string }> = {
  confirmed: { label: "On-chain confirmed", className: "bg-green-900/60 text-green-300 border border-green-700" },
  pending:   { label: "Pending confirmation", className: "bg-yellow-900/60 text-yellow-300 border border-yellow-700" },
  failed:    { label: "Chain error", className: "bg-red-900/60 text-red-300 border border-red-700" },
};

const TRANSFER_BADGE: Record<TransferState, { label: string; className: string } | null> = {
  none:             null,
  transferable:     { label: "Transferable", className: "bg-blue-900/60 text-blue-300 border border-blue-700" },
  "transfer-pending": { label: "Transfer pending", className: "bg-yellow-900/60 text-yellow-300 border border-yellow-700" },
  transferred:      { label: "Transferred", className: "bg-gray-700/60 text-gray-400 border border-gray-600" },
};

/** Minimal inline QR using an SVG grid — no external dependency required. */
function QRCode({ value }: { value: string }) {
  // Deterministic pseudo-random grid from the ticket code string
  const SIZE = 11;
  const cells: boolean[][] = Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => {
      // Always fill the three finder-pattern corners
      const inCorner =
        (r < 3 && c < 3) ||
        (r < 3 && c >= SIZE - 3) ||
        (r >= SIZE - 3 && c < 3);
      if (inCorner) return true;
      const hash = [...value].reduce((acc, ch) => acc ^ (ch.charCodeAt(0) * (r * SIZE + c + 1)), 0);
      return hash % 3 !== 0;
    })
  );

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-40 h-40"
      aria-label={`QR code for ticket ${value}`}
      role="img"
    >
      {cells.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="white" />
          ) : null
        )
      )}
    </svg>
  );
}

interface TicketPassProps {
  ticket: AttendeeTicket;
  onTransfer?: () => void;
}

export function TicketPass({ ticket, onTransfer }: TicketPassProps) {
  const walletBadge = WALLET_BADGE[ticket.walletStatus];
  const transferBadge = TRANSFER_BADGE[ticket.transferState];
  const isTransferred = ticket.transferState === "transferred";

  return (
    <article
      className={`rounded-2xl overflow-hidden border ${
        isTransferred ? "border-gray-700 opacity-60" : "border-[#4D21FF]/60"
      } bg-[#101428] max-w-sm w-full`}
      aria-label={`Ticket pass for ${ticket.eventName}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
          {ticket.ticketType}
        </p>
        <h2 className="text-xl font-bold text-white mt-0.5 leading-tight">
          {ticket.eventName}
        </h2>
      </div>

      {/* QR */}
      <div className="flex justify-center bg-[#0b0f1e] py-6">
        <div className="bg-[#1a1f3a] p-3 rounded-xl">
          <QRCode value={ticket.ticketCode} />
        </div>
      </div>

      {/* Ticket code */}
      <div className="text-center py-2 bg-[#0b0f1e]">
        <p className="text-xs text-gray-500 tracking-widest font-mono">
          {ticket.ticketCode}
        </p>
      </div>

      {/* Perforated divider */}
      <div className="flex items-center px-4 py-1 bg-[#101428]">
        <div className="w-5 h-5 rounded-full bg-[#0b0f1e] -ml-6 flex-shrink-0" />
        <div className="flex-1 border-t-2 border-dashed border-gray-700 mx-2" />
        <div className="w-5 h-5 rounded-full bg-[#0b0f1e] -mr-6 flex-shrink-0" />
      </div>

      {/* Event details */}
      <div className="px-5 py-4 space-y-2 text-sm text-gray-300">
        <div className="flex justify-between">
          <span className="text-gray-500">Date</span>
          <span>{ticket.eventDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Time</span>
          <span>{ticket.eventTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Venue</span>
          <span className="text-right max-w-[60%]">{ticket.venue}</span>
        </div>
        {ticket.ownerAddress && (
          <div className="flex justify-between">
            <span className="text-gray-500">Wallet</span>
            <span className="font-mono text-xs text-gray-400 truncate max-w-[60%]">
              {ticket.ownerAddress}
            </span>
          </div>
        )}
      </div>

      {/* Status badges */}
      <div className="px-5 pb-4 flex flex-wrap gap-2">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${walletBadge.className}`}>
          {walletBadge.label}
        </span>
        {transferBadge && (
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${transferBadge.className}`}>
            {transferBadge.label}
          </span>
        )}
      </div>

      {/* Transfer action */}
      {ticket.transferState === "transferable" && onTransfer && (
        <div className="px-5 pb-5">
          <button
            onClick={onTransfer}
            className="w-full py-2.5 rounded-lg bg-[#4D21FF] hover:bg-[#3d18cc] text-white text-sm font-semibold transition-colors"
          >
            Transfer Ticket
          </button>
        </div>
      )}

      {ticket.transferState === "transfer-pending" && (
        <div className="px-5 pb-5">
          <p className="text-xs text-yellow-400 text-center">
            Transfer in progress — awaiting on-chain confirmation.
          </p>
        </div>
      )}

      {isTransferred && (
        <div className="px-5 pb-5">
          <p className="text-xs text-gray-500 text-center">
            This ticket has been transferred to another wallet.
          </p>
        </div>
      )}
    </article>
  );
}
