"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, MoreVertical, Search } from "lucide-react";
import { toast } from "react-toastify";
import {
  type Attendee,
  banAttendee,
  checkInAttendee,
  exportAttendeesCSV,
  fetchEventAttendees,
} from "@/lib/attendeeManagement";
import BanAttendeeDialog from "./BanAttendeeDialog";

interface AttendeesTabProps {
  eventId: string;
}

const PAGE_SIZE = 10;

export default function AttendeesTab({ eventId }: AttendeesTabProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [banningId, setBanningId] = useState<string | null>(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchEventAttendees(eventId)
      .then((data) => {
        if (!cancelled) setAttendees(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load attendees.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  // Filter by name or email (case-insensitive)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return attendees;
    return attendees.filter(
      (a) =>
        a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q),
    );
  }, [attendees, search]);

  // Reset to page 1 whenever the search narrows or widens the results
  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const handleCheckIn = async (attendee: Attendee) => {
    if (attendee.checkedIn || checkingInId) return;
    setCheckingInId(attendee.id);
    try {
      const result = await checkInAttendee(eventId, attendee.id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setAttendees((prev) =>
        prev.map((a) => (a.id === attendee.id ? { ...a, checkedIn: true } : a)),
      );
      toast.success(`Checked in ${attendee.name}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Check-in failed.");
    } finally {
      setCheckingInId(null);
    }
  };

  const handleExport = () => {
    if (attendees.length === 0) {
      toast.info("No attendees to export.");
      return;
    }
    // Export everything currently loaded for this event (not just the filtered/paged view).
    exportAttendeesCSV(attendees, eventId);
  };

  return (
    <section className="space-y-4" aria-label="Attendees">
      {/* Toolbar: search + export */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">Search attendees by name or email</span>
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#21D4FF]/70"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-lg border border-[#4D21FF]/40 bg-[#101428] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF]"
          />
        </label>

        <button
          type="button"
          onClick={handleExport}
          disabled={loading || attendees.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#4D21FF]/40 bg-[#000625] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4D21FF]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={16} aria-hidden="true" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#4D21FF]/30 bg-[#000625]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#4D21FF]/30 text-left text-xs uppercase tracking-wider text-[#21D4FF]">
              <th scope="col" className="px-6 py-4">
                Name
              </th>
              <th scope="col" className="px-6 py-4">
                Email
              </th>
              <th scope="col" className="px-6 py-4">
                Ticket Type
              </th>
              <th scope="col" className="px-6 py-4">
                Status
              </th>
              <th scope="col" className="relative px-6 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4D21FF]/20">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-[#21D4FF]/70">
                  Loading attendees…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-red-400">
                  {error}
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-white/60">
                  {attendees.length === 0
                    ? "No attendees yet."
                    : "No attendees match your search."}
                </td>
              </tr>
            ) : (
              pageRows.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-[#4D21FF]/5">
                  <td className="px-6 py-4 font-medium text-white">{a.name}</td>
                  <td className="px-6 py-4 text-[#21D4FF]/80">{a.email}</td>
                  <td className="px-6 py-4 text-[#21D4FF]/80">{a.ticketType}</td>
                  <td className="px-6 py-4">
                    {a.banned ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/30 px-3 py-1 text-xs text-red-300">
                        <span className="h-2 w-2 rounded-full bg-red-400" />
                        Banned
                      </span>
                    ) : a.checkedIn ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/30 px-3 py-1 text-xs text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Checked in
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                        <span className="h-2 w-2 rounded-full bg-white/40" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {banningId === a.id ? (
                      <span className="text-xs text-red-400">Banning…</span>
                    ) : (
                      <KebabMenu
                        attendee={a}
                        onCheckIn={() => handleCheckIn(a)}
                        onBan={() => handleOpenBanDialog(a)}
                        isCheckingIn={checkingInId === a.id}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && !error && filtered.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-2 text-sm text-white/70 sm:flex-row">
          <span aria-live="polite">
            Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span aria-current="page">
              Page {safePage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <BanAttendeeDialog
        open={showBanDialog}
        onClose={handleCloseBanDialog}
        onConfirm={handleBan}
        attendeeName={selectedAttendee?.name ?? ""}
      />
    </section>
  );
}

function KebabMenu({
  attendee,
  onCheckIn,
  onBan,
  isCheckingIn,
}: {
  attendee: Attendee;
  onCheckIn: () => void;
  onBan: () => void;
  isCheckingIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const disabled = attendee.banned || attendee.checkedIn || isCheckingIn;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D21FF] disabled:cursor-not-allowed disabled:opacity-40"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <MoreVertical size={18} />
        <span className="sr-only">Actions for {attendee.name}</span>
      </button>
      {open && (
        <div
          className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-[#101428] py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          <button
            type="button"
            onClick={() => {
              onCheckIn();
              setOpen(false);
            }}
            disabled={attendee.checkedIn}
            className="block w-full px-4 py-2 text-left text-sm text-white/90 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            role="menuitem"
          >
            {isCheckingIn ? "Checking in..." : "Mark checked in"}
          </button>
          <button
            type="button"
            onClick={() => {
              onBan();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-red-400 transition-colors hover:bg-white/5"
            role="menuitem"
          >
            Ban from event
          </button>
        </div>
      )}
    </div>
  );
}