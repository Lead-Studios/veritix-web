"use client";

import { useState } from "react";

interface BanAttendeeDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  attendeeName: string;
}

export default function BanAttendeeDialog({
  open,
  onClose,
  onConfirm,
  attendeeName,
}: BanAttendeeDialogProps) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm(reason);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      aria-labelledby="ban-dialog-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-xl bg-[#101428] p-6 shadow-lg">
        <h2 id="ban-dialog-title" className="text-lg font-semibold text-white">
          Ban {attendeeName}
        </h2>
        <p className="mt-2 text-sm text-white/70">
          Banning an attendee will prevent them from being checked in. This action can be
          undone.
        </p>
        <div className="mt-4">
          <label htmlFor="ban-reason" className="block text-sm font-medium text-white/90">
            Reason (optional)
          </label>
          <input
            id="ban-reason"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., violation of code of conduct"
            className="mt-1 w-full rounded-lg border border-[#4D21FF]/40 bg-[#000625] px-3 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF]"
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            Confirm Ban
          </button>
        </div>
      </div>
    </div>
  );
}