"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import TabSelector from "@/components/TabSelector";
import AttendeesTab from "@/components/events/manage/AttendeesTab";
import { TicketTypeRow } from "@/components/events/manage/TicketTypeRow";
import EventAnalyticsTab from "@/features/events/components/EventAnalyticsTab";
import { useEventInventory } from "@/hooks/useEventInventory";
import { performEventAction } from "@/lib/eventActions";

export interface ManagedEvent {
  id: string;
  name: string;
  status: string;
  description?: string;
  location?: string;
  capacity?: number;
  soldTickets?: number;
  revenue?: number;
  scanRate?: number;
}

interface Props {
  event: ManagedEvent;
  onEventUpdate: (updated: Partial<ManagedEvent>) => void;
}

const TABS = ["Overview", "Edit", "Ticket Types", "Attendees", "Analytics"] as const;
type Tab = (typeof TABS)[number];

const STATUS_TRANSITIONS: Record<string, { action: string; label: string; cls: string }[]> = {
  DRAFT: [{ action: "publish", label: "Publish", cls: "bg-emerald-600 hover:bg-emerald-500" }],
  PUBLISHED: [
    { action: "unpublish", label: "Unpublish", cls: "bg-yellow-600 hover:bg-yellow-500" },
    { action: "cancel", label: "Cancel Event", cls: "bg-red-600 hover:bg-red-500" },
    { action: "archive", label: "Mark Complete", cls: "bg-blue-600 hover:bg-blue-500" },
  ],
  POSTPONED: [{ action: "publish", label: "Re-publish", cls: "bg-emerald-600 hover:bg-emerald-500" }],
};

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  DRAFT: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  CANCELLED: "bg-red-500/20 text-red-300 border-red-500/40",
  COMPLETED: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  POSTPONED: "bg-orange-500/20 text-orange-300 border-orange-500/40",
};

const ACTION_STATUS_MAP: Record<string, string> = {
  publish: "PUBLISHED",
  unpublish: "DRAFT",
  cancel: "CANCELLED",
  archive: "COMPLETED",
};

export default function EventManagementTabs({ event, onEventUpdate }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editName, setEditName] = useState(event.name);
  const [editDesc, setEditDesc] = useState(event.description ?? "");
  const [editLocation, setEditLocation] = useState(event.location ?? "");
  const [editSaving, setEditSaving] = useState(false);

  const { data: ticketTypes, loading: invLoading, error: invError, refresh } =
    useEventInventory(event.id);

  const statusKey = event.status.toUpperCase();
  const statusStyle = STATUS_STYLES[statusKey] ?? STATUS_STYLES.DRAFT;
  const transitions = STATUS_TRANSITIONS[statusKey] ?? [];
  const capacity = event.capacity ?? 0;
  const sold = event.soldTickets ?? 0;
  const pct = capacity > 0 ? Math.min(Math.round((sold / capacity) * 100), 100) : 0;

  const handleAction = async () => {
    if (!confirmAction) return;
    setSubmitting(true);
    try {
      const result = await performEventAction(event.id, confirmAction as never);
      if (!result.success) { toast.error(result.message); return; }
      toast.success(result.message);
      onEventUpdate({ status: ACTION_STATUS_MAP[confirmAction] });
      setConfirmAction(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditSaving(true);
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDesc, location: editLocation }),
      });
      if (!res.ok) throw new Error("Save failed");
      onEventUpdate({ name: editName, description: editDesc, location: editLocation });
      toast.success("Event updated.");
    } catch {
      toast.error("Failed to save changes.");
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <>
      <TabSelector<Tab>
        tabs={TABS as unknown as Tab[]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="!px-0"
      />

      {activeTab === "Overview" && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Status", value: <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyle}`}>{event.status}</span> },
              { label: "Tickets Sold", value: `${sold} / ${capacity || "—"}` },
              { label: "Revenue", value: event.revenue != null ? `$${event.revenue.toLocaleString()}` : "—" },
              { label: "Scan Rate", value: event.scanRate != null ? `${event.scanRate}%` : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-[#4D21FF]/30 bg-[#0a0f24] p-4">
                <p className="mb-2 text-xs text-[#21D4FF]/70">{label}</p>
                <p className="text-xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          {capacity > 0 && (
            <div className="rounded-xl border border-[#4D21FF]/30 bg-[#0a0f24] p-5">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-white">Capacity</span>
                <span className="text-[#21D4FF]/80">{pct}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-gradient-to-r from-[#4D21FF] to-[#21D4FF]"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-white/50">{Math.max(capacity - sold, 0)} spots remaining</p>
            </div>
          )}

          {transitions.length > 0 && (
            <div className="rounded-xl border border-[#4D21FF]/30 bg-[#0a0f24] p-5">
              <h3 className="mb-3 text-sm font-semibold text-white">Status Controls</h3>
              <div className="flex flex-wrap gap-3">
                {transitions.map(({ action, label, cls }) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => setConfirmAction(action)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${cls}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "Edit" && (
        <form onSubmit={handleEditSave} className="mt-6 space-y-5">
          {[
            { id: "edit-name", label: "Event Name", value: editName, onChange: setEditName, type: "input" as const },
            { id: "edit-location", label: "Location", value: editLocation, onChange: setEditLocation, type: "input" as const },
          ].map(({ id, label, value, onChange }) => (
            <div key={id}>
              <label className="mb-1 block text-sm font-medium text-white" htmlFor={id}>{label}</label>
              <input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-[#4D21FF]/40 bg-[#101428] px-4 py-2.5 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF]"
              />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm font-medium text-white" htmlFor="edit-desc">Description</label>
            <textarea
              id="edit-desc"
              rows={5}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full rounded-lg border border-[#4D21FF]/40 bg-[#101428] px-4 py-2.5 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF]"
            />
          </div>
          <button
            type="submit"
            disabled={editSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {editSaving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {editSaving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      )}

      {activeTab === "Ticket Types" && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Ticket Types</h2>
            <button type="button" onClick={refresh} className="text-xs text-[#21D4FF] hover:underline">Refresh</button>
          </div>
          {invError ? (
            <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {invError} <button type="button" onClick={refresh} className="underline">Try again</button>
            </div>
          ) : invLoading && ticketTypes.length === 0 ? (
            <p className="text-sm text-[#21D4FF]/70">Loading…</p>
          ) : ticketTypes.length === 0 ? (
            <p className="text-sm text-[#21D4FF]/70">No ticket types found.</p>
          ) : (
            <ul className="space-y-3" aria-live="polite">
              {ticketTypes.map((t) => <TicketTypeRow key={t.id} ticket={t} />)}
            </ul>
          )}
        </div>
      )}

      {activeTab === "Attendees" && (
        <div className="mt-6"><AttendeesTab eventId={event.id} /></div>
      )}

      {activeTab === "Analytics" && (
        <div className="mt-6"><EventAnalyticsTab eventId={event.id} /></div>
      )}

      <Modal
        open={!!confirmAction}
        onClose={() => { if (!submitting) setConfirmAction(null); }}
        title="Confirm action"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-yellow-700/40 bg-yellow-950/20 p-4">
            <AlertTriangle className="mt-0.5 shrink-0 text-yellow-400" size={20} />
            <p className="text-sm text-yellow-100/90">
              Are you sure you want to <strong>{confirmAction}</strong> &ldquo;{event.name}&rdquo;?
            </p>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setConfirmAction(null)} disabled={submitting}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={handleAction} disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#4D21FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4D21FF]/80 disabled:opacity-60">
              {submitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              {submitting ? "Processing…" : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
