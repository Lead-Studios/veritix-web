"use client";

import { useState, useEffect } from "react";

interface Transfer {
  from: string;
  to: string;
  date: string;
  reason: string;
}

interface TransferHistoryProps {
  ticketId: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function relativeDate(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function TransferHistory({ ticketId }: TransferHistoryProps) {
  const [open, setOpen] = useState(false);
  const [transfers, setTransfers] = useState<Transfer[] | null>(null);

  useEffect(() => {
    if (!open || transfers !== null) return;
    fetch(`/api/tickets/${ticketId}/transfers`)
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
      .then(setTransfers);
  }, [open, ticketId, transfers]);

  const steps = transfers
    ? [
        { label: "Issued to", name: transfers[0]?.from ?? "Original owner", date: null, reason: null },
        ...transfers.map((t) => ({ label: "Transferred to", name: t.to, date: t.date, reason: t.reason })),
      ]
    : [];

  return (
    <div className="rounded-xl border border-white/10 bg-[#020718]/80 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-white"
        aria-expanded={open}
      >
        <span>Transfer History</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5">
          {transfers === null ? (
            <p className="text-xs text-gray-500">Loading…</p>
          ) : transfers.length === 0 ? (
            <p className="text-xs text-gray-500">
              No transfers — this ticket has not been transferred.
            </p>
          ) : (
            <div className="space-y-0">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#1a1f3a] border border-[#4D21FF]/40 flex items-center justify-center text-xs font-semibold text-[#6B8CFF] flex-shrink-0">
                      {getInitials(step.name)}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-0.5 h-6 bg-gray-700 my-1" />
                    )}
                  </div>
                  <div className="pt-1 pb-4">
                    <p className="text-sm text-white">
                      {step.label}{" "}
                      <span className="font-semibold">{step.name}</span>
                      {step.reason && (
                        <span className="ml-1 text-xs text-gray-400">({step.reason})</span>
                      )}
                    </p>
                    {step.date && (
                      <p className="text-xs text-gray-500 mt-0.5">{relativeDate(step.date)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
