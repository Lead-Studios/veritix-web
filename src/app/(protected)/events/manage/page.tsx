'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { Modal } from '@/components/ui'
import { StatusBadge, EventStatus } from '@/components/dashboard/StatusBadge'
import {
  prepareDuplicateDraft,
  type DuplicableEventData,
} from '@/lib/duplicateEvent'

interface ManagedEvent {
  id: string
  name: string
  date: string
  location: string
  ticketsSold: number
  totalTickets: number
  status: EventStatus
  /**
   * Full source data used when duplicating this event into the create-event form.
   * Stored alongside the row so the kebab menu's Duplicate action can pre-fill
   * ticket types, pricing, treasury address, etc.
   */
  source: DuplicableEventData
}

type BulkAction = 'cancel' | 'duplicate'

const INITIAL_EVENTS: ManagedEvent[] = [
  {
    id: '1', name: 'Summer Music Festival', date: '2026-07-15', location: 'Central Park, NY',
    ticketsSold: 342, totalTickets: 500, status: 'active',
    source: {
      title: 'Summer Music Festival',
      description: 'A weekend of live music in Central Park.',
      startDate: '2026-07-15', endDate: '2026-07-17',
      startTime: '14:00', endTime: '23:00',
      eventType: 'physical',
      venueName: 'Central Park Great Lawn', address: 'Central Park', city: 'New York', state: 'NY', zipCode: '10024',
      tickets: [
        { name: 'General Admission', quantity: 400, price: '75', description: 'Standing access', transferable: true, resellable: true, resellPriceLimit: '110' },
        { name: 'VIP', quantity: 100, price: '200', description: 'Front-stage + lounge', transferable: true, resellable: false, resellPriceLimit: '' },
      ],
      blockchainNetwork: 'ethereum',
      treasuryAddress: '0xA1B2C3d4E5F60718293a4b5C6D7E8f9A0b1C2D3e',
      creatorRoyalty: 5,
    },
  },
  {
    id: '2', name: 'Tech Conference 2026', date: '2026-08-20', location: 'Convention Center, SF',
    ticketsSold: 156, totalTickets: 200, status: 'active',
    source: {
      title: 'Tech Conference 2026',
      description: 'Annual gathering of builders shipping on Stellar.',
      startDate: '2026-08-20', endDate: '2026-08-21',
      startTime: '09:00', endTime: '18:00',
      eventType: 'hybrid',
      venueName: 'Moscone West', address: '800 Howard St', city: 'San Francisco', state: 'CA', zipCode: '94103',
      tickets: [
        { name: 'Standard', quantity: 150, price: '120', description: 'Talks + expo', transferable: true, resellable: false, resellPriceLimit: '' },
        { name: 'Workshop Pass', quantity: 50, price: '250', description: 'Hands-on labs', transferable: false, resellable: false, resellPriceLimit: '' },
      ],
      blockchainNetwork: 'polygon',
      treasuryAddress: '0xB2C3D4E5F60718293a4b5C6D7E8f9A0b1C2D3e4F',
      creatorRoyalty: 3,
    },
  },
  {
    id: '3', name: 'Lagos Art Fair', date: '2026-06-01', location: 'Eko Hotel, Lagos',
    ticketsSold: 80, totalTickets: 300, status: 'draft',
    source: {
      title: 'Lagos Art Fair',
      description: 'Contemporary West African art showcase.',
      startDate: '2026-06-01', endDate: '2026-06-03',
      startTime: '10:00', endTime: '20:00',
      eventType: 'physical',
      venueName: 'Eko Hotel & Suites', address: 'Plot 1415 Adetokunbo Ademola St', city: 'Lagos', state: 'Lagos', zipCode: '101241',
      tickets: [
        { name: 'Day Pass', quantity: 250, price: '15', description: 'Single-day access', transferable: true, resellable: true, resellPriceLimit: '25' },
        { name: 'Weekend Pass', quantity: 50, price: '40', description: 'All three days', transferable: true, resellable: false, resellPriceLimit: '' },
      ],
      blockchainNetwork: 'ethereum',
      treasuryAddress: '0xC3D4E5F60718293a4b5C6D7E8f9A0b1C2D3e4F50',
      creatorRoyalty: 2,
    },
  },
  {
    id: '4', name: 'Afrobeats Night Out', date: '2025-12-31', location: 'O2 Arena, London',
    ticketsSold: 600, totalTickets: 600, status: 'ended',
    source: {
      title: 'Afrobeats Night Out',
      description: 'Year-end Afrobeats showcase featuring top artists.',
      startDate: '2025-12-31', endDate: '2026-01-01',
      startTime: '20:00', endTime: '02:00',
      eventType: 'physical',
      venueName: 'The O2 Arena', address: 'Peninsula Square', city: 'London', state: '', zipCode: 'SE10 0DX',
      tickets: [
        { name: 'Standing', quantity: 500, price: '60', description: 'General floor', transferable: true, resellable: true, resellPriceLimit: '90' },
        { name: 'Seated Premium', quantity: 100, price: '120', description: 'Reserved seating', transferable: true, resellable: false, resellPriceLimit: '' },
      ],
      blockchainNetwork: 'polygon',
      treasuryAddress: '0xD4E5F60718293a4b5C6D7E8f9A0b1C2D3e4F5061',
      creatorRoyalty: 4,
    },
  },
  {
    id: '5', name: 'Web3 Summit', date: '2026-03-10', location: 'Dubai World Trade Centre',
    ticketsSold: 0, totalTickets: 400, status: 'cancelled',
    source: {
      title: 'Web3 Summit',
      description: 'Cross-chain protocols and ecosystem updates.',
      startDate: '2026-03-10', endDate: '2026-03-12',
      startTime: '09:00', endTime: '17:00',
      eventType: 'physical',
      venueName: 'Dubai World Trade Centre', address: 'Sheikh Zayed Rd', city: 'Dubai', state: '', zipCode: '00000',
      tickets: [
        { name: 'Attendee', quantity: 350, price: '180', description: 'Full summit access', transferable: true, resellable: false, resellPriceLimit: '' },
        { name: 'Investor', quantity: 50, price: '500', description: 'Includes private dinner', transferable: false, resellable: false, resellPriceLimit: '' },
      ],
      blockchainNetwork: 'solana',
      treasuryAddress: '0xE5F60718293a4b5C6D7E8f9A0b1C2D3e4F506172',
      creatorRoyalty: 3,
    },
  },
]

const STATUS_LABELS: Record<EventStatus, string> = {
  active:    'Active',
  draft:     'Draft',
  ended:     'Ended',
  cancelled: 'Cancelled',
}

export default function ManageEventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<ManagedEvent[]>(INITIAL_EVENTS)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<'' | BulkAction>('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close kebab menu on outside click or Escape
  useEffect(() => {
    if (!openMenuId) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenuId(null)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [openMenuId])

  const handleDuplicateRow = (event: ManagedEvent) => {
    setOpenMenuId(null)
    prepareDuplicateDraft(event.source)
    router.push('/events/create')
  }

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
                      <div
                        ref={openMenuId === event.id ? menuRef : undefined}
                        className="relative inline-block text-left"
                      >
                        <button
                          type="button"
                          aria-label={`Open actions for ${event.name}`}
                          aria-haspopup="menu"
                          aria-expanded={openMenuId === event.id}
                          onClick={() =>
                            setOpenMenuId((prev) => (prev === event.id ? null : event.id))
                          }
                          className="rounded-md p-1.5 text-[#21D4FF]/80 transition-colors hover:bg-[#4D21FF]/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF]"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openMenuId === event.id && (
                          <div
                            role="menu"
                            aria-label={`${event.name} actions`}
                            className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-[#4D21FF]/40 bg-[#0b1025] shadow-[0_20px_40px_rgba(10,16,40,0.7)]"
                          >
                            <Link
                              role="menuitem"
                              href={`/events/manage/${event.id}`}
                              onClick={() => setOpenMenuId(null)}
                              className="block px-4 py-2 text-sm text-white transition-colors hover:bg-[#4D21FF]/30 focus-visible:bg-[#4D21FF]/30 focus-visible:outline-none"
                            >
                              Manage
                            </Link>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => handleDuplicateRow(event)}
                              className="block w-full px-4 py-2 text-left text-sm text-white transition-colors hover:bg-[#4D21FF]/30 focus-visible:bg-[#4D21FF]/30 focus-visible:outline-none"
                            >
                              Duplicate
                            </button>
                          </div>
                        )}
                      </div>
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
