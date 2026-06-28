"use client";
import { useState } from "react";

interface Props { ticketId: string; onRequested?: () => void; }

export default function CancellationRequest({ ticketId, onRequested }: Props) {
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"done">("idle");

  const submit = async () => {
    if (!reason.trim()) return;
    setStatus("loading");
    await fetch(`/api/tickets/${ticketId}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
      body: JSON.stringify({ reason }),
    });
    setStatus("done");
    onRequested?.();
  };

  if (status === "done") return <p className="text-green-600 text-sm">Cancellation request submitted.</p>;
  return (
    <div className="flex flex-col gap-3">
      <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
        placeholder="Why are you cancelling?" className="border rounded-lg p-3 text-sm w-full" />
      <button onClick={submit} disabled={status==="loading"}
        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60">
        {status==="loading" ? "Submitting..." : "Request Cancellation"}
      </button>
    </div>
  );
}
