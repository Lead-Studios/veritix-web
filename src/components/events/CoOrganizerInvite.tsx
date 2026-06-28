"use client";
import { useState } from "react";

interface Props { eventId: string; onInvited?: (email: string) => void; }

export default function CoOrganizerInvite({ eventId, onInvited }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  const handleInvite = async () => {
    if (!email) return;
    setStatus("loading");
    await fetch(`/api/events/${eventId}/co-organizers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
      body: JSON.stringify({ email }),
    });
    setStatus("sent");
    onInvited?.(email);
  };

  return (
    <div className="flex gap-2 mt-4">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="co-organizer@email.com"
        className="flex-1 border rounded-lg px-3 py-2 text-sm" />
      <button onClick={handleInvite} disabled={status === "loading" || status === "sent"}
        className="bg-primary text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60">
        {status === "sent" ? "Invited!" : "Invite"}
      </button>
    </div>
  );
}
