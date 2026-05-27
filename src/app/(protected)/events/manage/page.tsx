'use client'

import Link from 'next/link'
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

const MOCK_EVENTS: ManagedEvent[] = [
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

        <div className="overflow-x-auto rounded-xl border border-[#4D21FF]/30 bg-[#000625]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#4D21FF]/30 text-left text-xs uppercase tracking-wider text-[#21D4FF]">
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Tickets Sold</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4D21FF]/20">
              {MOCK_EVENTS.map((event) => (
                <tr key={event.id} className="transition-colors hover:bg-[#4D21FF]/5">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
