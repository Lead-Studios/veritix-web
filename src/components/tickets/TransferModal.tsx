"use client";
import { useState } from "react";

interface Props { ticketId: string; onClose: () => void; onTransferred?: () => void; }

export default function TransferModal({ ticketId, onClose, onTransferred }: Props) {
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const transfer = async () => {
    if (!recipient.trim()) return;
    setStatus("loading");
    const res = await fetch(`/api/tickets/${ticketId}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
      body: JSON.stringify({ recipientEmail: recipient }),
    });
    if (res.ok) { setStatus("done"); onTransferred?.(); }
    else setStatus("idle");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-80 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-semibold">Transfer Ticket</h2>
        {status === "done" ? <p className="text-green-600 text-sm">Ticket transferred!</p> : (<>
          <input value={recipient} onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient email" className="border rounded-lg px-3 py-2 text-sm" />
          <button onClick={transfer} disabled={status === "loading"}
            className="bg-primary text-white py-2 rounded-lg text-sm disabled:opacity-60">
            {status === "loading" ? "Transferring…" : "Confirm Transfer"}
          </button>
        </>)}
        <button onClick={onClose} className="text-xs text-gray-400">Cancel</button>
      </div>
    </div>
  );
}
