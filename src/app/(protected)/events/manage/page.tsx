'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Modal } from '@/components/ui'
import { StatusBadge, EventStatus } from '@/components/dashboard/StatusBadge'

interface ManagedEvent {
  id: string
  name: string
  date: string
  location: string
  ticketsSold: number
  totalTickets: number
  status: EventStatus
}

type BulkAction = 'cancel' | 'duplicate'

const INITIAL_EVENTS: ManagedEvent[] = [
  { id: '1', name: 'Summer Music Festival',  date: '2026-07-15', location: 'Central Park, NY',          ticketsSold: 342, totalTickets: 500, status: 'active' },
  { id: '2', name: 'Tech Conference 2026',   date: '2026-08-20', location: 'Convention Center, SF',     ticketsSold: 156, totalTickets: 200, status: 'active' },
  { id: '3', name: 'Lagos Art Fair',         date: '2026-06-01', location: 'Eko Hotel, Lagos',          ticketsSold: 80,  totalTickets: 300, status: 'draft' },
  { id: '4', name: 'Afrobeats Night Out',    date: '2025-12-31', location: 'O2 Arena, London',          ticketsSold: 600, totalTickets: 600, status: 'ended' },
  { id: '5', name: 'Web3 Summit',            date: '2026-03-10', location: 'Dubai World Trade Centre',  ticketsSold: 0,   totalTickets: 400, status: 'cancelled' },
]

const STATUS_LABELS: Record<EventStatus, string> = {
  active:    'Active',
  draft:     'Draft',
  ended:     'Ended',
  cancelled: 'Cancelled',
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<ManagedEvent[]>(INITIAL_EVENTS)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<'' | BulkAction>('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const selectedCount = selectedIds.size
  const allSelected = events.length > 0 && selectedCount === events.length
  const someSelected = selectedCount > 0 && !allSelected

  const selectedEvents = useMemo(
    () => events.filter((e) => selectedIds.has(e.id)),
    [events, selectedIds],
  )

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelectedIds((prev) =>
      prev.size === events.length ? new Set() : new Set(events.map((e) => e.id)),
    )
  }

  const handleApply = () => {
    if (!bulkAction || selectedCount === 0) return
    // Cancel is irreversible — require explicit confirmation.
    if (bulkAction === 'cancel') {
      setConfirmOpen(true)
      return
    }
    runBulkAction(bulkAction)
  }

  const runBulkAction = (action: BulkAction) => {
    if (action === 'cancel') {
      setEvents((prev) =>
        prev.map((e) => (selectedIds.has(e.id) ? { ...e, status: 'cancelled' } : e)),
      )
    } else if (action === 'duplicate') {
      setEvents((prev) => {
        const copies: ManagedEvent[] = prev
          .filter((e) => selectedIds.has(e.id))
          .map((e) => ({
            ...e,
            id: `${e.id}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: `${e.name} (Copy)`,
            ticketsSold: 0,
            status: 'draft',
          }))
        return [...prev, ...copies]
      })
    }
    setSelectedIds(new Set())
    setBulkAction('')
    setConfirmOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#101428] py-10 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Manage Events</h1>
          <Link
            href="/events/create"
            className="rounded-lg bg-[linear-gradient(135deg,#4D21FF_0%,#21D4FF_100%)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D21FF]"
          >
            + Create Event
          </Link>
        </div>

        {/* Bulk-action toolbar */}
        <div
          className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-[#4D21FF]/30 bg-[#000625] px-4 py-3"
          role="toolbar"
          aria-label="Bulk actions"
        >
          <span className="text-sm text-[#21D4FF]/80" aria-live="polite">
            {selectedCount > 0
              ? `${selectedCount} selected`
              : 'Select rows to enable bulk actions'}
          </span>

          <label htmlFor="bulk-action" className="sr-only">
            Bulk action
          </label>
          <select
            id="bulk-action"
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value as '' | BulkAction)}
            disabled={selectedCount === 0}
            className="ml-auto rounded-lg border border-[#4D21FF]/40 bg-[#101428] px-3 py-2 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Bulk action…</option>
            <option value="cancel">Cancel</option>
            <option value="duplicate">Duplicate</option>
          </select>

          <button
            type="button"
            onClick={handleApply}
            disabled={selectedCount === 0 || !bulkAction}
            className="rounded-lg bg-[linear-gradient(135deg,#4D21FF_0%,#21D4FF_100%)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D21FF] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#4D21FF]/30 bg-[#000625]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#4D21FF]/30 text-left text-xs uppercase tracking-wider text-[#21D4FF]">
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    aria-label="Select all events"
                    className="h-4 w-4 cursor-pointer accent-[#4D21FF]"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected
                    }}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Tickets Sold</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4D21FF]/20">
              {events.map((event) => {
                const checked = selectedIds.has(event.id)
                return (
                  <tr
                    key={event.id}
                    className={`transition-colors hover:bg-[#4D21FF]/5 ${checked ? 'bg-[#4D21FF]/10' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        aria-label={`Select ${event.name}`}
                        className="h-4 w-4 cursor-pointer accent-[#4D21FF]"
                        checked={checked}
                        onChange={() => toggleRow(event.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{event.name}</td>
                    <td className="px-6 py-4 text-[#21D4FF]/80">
                      {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-[#21D4FF]/80">{event.location}</td>
                    <td className="px-6 py-4 text-[#21D4FF]/80">
                      {event.ticketsSold} / {event.totalTickets}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={event.status} text={STATUS_LABELS[event.status]} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/events/manage/${event.id}`}
                        className="text-[#4D21FF] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF]"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation dialog for irreversible bulk actions */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Cancel selected events?"
        description={`This will cancel ${selectedCount} event${selectedCount === 1 ? '' : 's'}. This action cannot be undone.`}
        size="sm"
      >
        <ul className="mb-5 max-h-40 list-disc overflow-auto rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/80">
          {selectedEvents.map((e) => (
            <li key={e.id}>{e.name}</li>
          ))}
        </ul>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setConfirmOpen(false)}
            className="rounded-lg border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF]"
          >
            Keep events
          </button>
          <button
            type="button"
            onClick={() => runBulkAction('cancel')}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            Yes, cancel events
          </button>
        </div>
      </Modal>
    </div>
  )
}
