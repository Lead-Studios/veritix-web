'use client'

import Link from 'next/link'
import { Ticket, Globe, ShieldCheck, LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export type ActivityType = 'ticket_sold' | 'event_published' | 'verification_scan'

export interface ActivityEntry {
  id: string
  type: ActivityType
  description: string
  timestamp: string // ISO string
}

const TYPE_META: Record<ActivityType, { Icon: LucideIcon; color: string }> = {
  ticket_sold:        { Icon: Ticket,      color: 'text-[#21D4FF]' },
  event_published:    { Icon: Globe,       color: 'text-green-400' },
  verification_scan:  { Icon: ShieldCheck, color: 'text-yellow-400' },
}

function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// Demo data — replace with real API call when backend is ready
const DEMO_FEED: ActivityEntry[] = [
  { id: '1', type: 'ticket_sold',       description: 'Ticket sold for Summer Music Festival',  timestamp: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: '2', type: 'event_published',   description: 'Tech Conference 2026 published',          timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: '3', type: 'verification_scan', description: 'Entry scan at Lagos Art Fair',            timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: '4', type: 'ticket_sold',       description: 'Ticket sold for Tech Conference 2026',   timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: '5', type: 'ticket_sold',       description: 'Ticket sold for Summer Music Festival',  timestamp: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: '6', type: 'verification_scan', description: 'Entry scan at Summer Music Festival',    timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: '7', type: 'event_published',   description: 'Lagos Art Fair published',               timestamp: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: '8', type: 'ticket_sold',       description: 'Ticket sold for Lagos Art Fair',         timestamp: new Date(Date.now() - 10 * 3600000).toISOString() },
  { id: '9', type: 'ticket_sold',       description: 'Ticket sold for Tech Conference 2026',   timestamp: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: '10', type: 'verification_scan', description: 'Entry scan at Tech Conference 2026',   timestamp: new Date(Date.now() - 20 * 3600000).toISOString() },
]

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="h-8 w-8 rounded-full bg-[#4D21FF]/20 shrink-0" />
      <div className="flex-1 space-y-1">
        <div className="h-3 w-3/4 rounded bg-[#4D21FF]/20" />
        <div className="h-2 w-1/4 rounded bg-[#4D21FF]/10" />
      </div>
    </div>
  )
}

export const RecentActivity = () => {
  const [feed, setFeed] = useState<ActivityEntry[] | null>(null)

  useEffect(() => {
    // Simulate async fetch; swap for real API call later
    const t = setTimeout(() => setFeed(DEMO_FEED), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      aria-label="Recent activity"
      className="rounded-xl border border-[#4D21FF]/40 bg-[#000625]/60 p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-[#21D4FF]">Recent Activity</p>
        <Link href="/events" className="text-xs text-[#4D21FF] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4D21FF]">
          View all
        </Link>
      </div>

      <ul className="space-y-4">
        {feed === null
          ? Array.from({ length: 5 }).map((_, i) => <li key={i}><SkeletonRow /></li>)
          : feed.slice(0, 10).map((entry) => {
              const { Icon, color } = TYPE_META[entry.type]
              return (
                <li key={entry.id} className="flex items-start gap-3">
                  <span className={`mt-0.5 shrink-0 ${color}`} aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm text-white">{entry.description}</p>
                    <p className="text-xs text-[#21D4FF]/70">{relativeTime(entry.timestamp)}</p>
                  </div>
                </li>
              )
            })}
      </ul>
    </section>
  )
}
