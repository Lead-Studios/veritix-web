"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Toggle from "@/components/events/ui/Toggle";
import {
  getNotificationPreferences,
  patchNotificationPreference,
  type NotificationPreferences,
} from "@/lib/profile";
import { Loader2 } from "lucide-react";

const LABELS: { key: keyof NotificationPreferences; label: string }[] = [
  { key: "upcomingEvents", label: "Upcoming Events" },
  { key: "ticketConfirmations", label: "Ticket Confirmations" },
  { key: "platformUpdates", label: "Platform Updates" },
];

export default function NotificationPrefsSection() {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Set<keyof NotificationPreferences>>(new Set());

  useEffect(() => {
    getNotificationPreferences()
      .then(setPrefs)
      .catch(() => toast.error("Failed to load notification preferences."))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!prefs) return;
    setPrefs({ ...prefs, [key]: value });
    setPending((prev) => new Set(prev).add(key));
    try {
      await patchNotificationPreference(key, value);
    } catch (err) {
      setPrefs({ ...prefs, [key]: !value }); // revert
      toast.error(err instanceof Error ? err.message : "Failed to update preference.");
    } finally {
      setPending((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  return (
    <section aria-labelledby="notif-prefs-heading" className="rounded-2xl border border-white/10 bg-[#0b1025] p-6">
      <h2 id="notif-prefs-heading" className="mb-5 text-lg font-semibold text-white">
        Notification Preferences
      </h2>

      {loading ? (
        <div className="flex items-center gap-2 text-white/60">
          <Loader2 size={16} className="animate-spin" />
          <span>Loading preferences…</span>
        </div>
      ) : (
        <ul className="space-y-4">
          {LABELS.map(({ key, label }) => {
            const isPending = pending.has(key);
            return (
              <li key={key} className="flex items-center justify-between">
                <span className="text-sm text-white/80">{label}</span>
                <div className="flex items-center gap-2">
                  {isPending && <Loader2 size={14} className="animate-spin text-white/40" />}
                  <Toggle
                    checked={prefs?.[key] ?? false}
                    onChange={(val) => handleToggle(key, val)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
