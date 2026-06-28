"use client";
import { useState } from "react";

interface QRModalProps { qrUrl: string; ticketId: string; }

export default function QRModal({ qrUrl, ticketId }: QRModalProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="text-sm underline">View QR</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="font-semibold text-lg">Ticket #{ticketId}</h2>
            <img src={qrUrl} alt="QR code" className="w-64 h-64 object-contain" />
            <button onClick={() => setOpen(false)} className="text-sm text-gray-500">Close</button>
          </div>
        </div>
      )}
    </>
  );
}
