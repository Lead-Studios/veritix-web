"use client";
import { useState } from "react";

interface Props { onDeleted?: () => void; }

export default function DeleteAccount({ onDeleted }: Props) {
  const [step, setStep] = useState<"idle" | "confirm" | "loading" | "done">("idle");
  const [password, setPassword] = useState("");

  const submit = async () => {
    setStep("loading");
    const token = localStorage.getItem("auth_token") ?? "";
    const res = await fetch("/api/auth/delete-account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { setStep("done"); onDeleted?.(); }
    else setStep("confirm");
  };

  if (step === "done") return <p className="text-green-600 text-sm">Account deleted.</p>;
  if (step === "idle") return (
    <button onClick={() => setStep("confirm")} className="text-red-500 text-sm underline">Delete my account</button>
  );
  return (
    <div className="border border-red-200 rounded-xl p-4 flex flex-col gap-3">
      <p className="text-sm text-red-600 font-medium">This action is permanent. Enter your password to confirm.</p>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        placeholder="Password" className="border rounded-lg px-3 py-2 text-sm" />
      <div className="flex gap-2">
        <button onClick={submit} disabled={step === "loading" || !password}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60">
          {step === "loading" ? "Deleting…" : "Confirm Delete"}
        </button>
        <button onClick={() => setStep("idle")} className="text-sm text-gray-500">Cancel</button>
      </div>
    </div>
  );
}
