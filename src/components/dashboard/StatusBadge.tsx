export type EventStatus = 'active' | 'draft' | 'ended' | 'cancelled'

interface BadgeProps {
  text: string
  status?: EventStatus
}

const statusStyles: Record<EventStatus, { dot: string; text: string; border: string; bg: string }> = {
  active:    { dot: 'bg-[#21D4FF]', text: 'text-[#21D4FF]', border: 'border-[#4D21FF]', bg: 'bg-[#000625]' },
  draft:     { dot: 'bg-yellow-400', text: 'text-yellow-400', border: 'border-yellow-600', bg: 'bg-yellow-950/30' },
  ended:     { dot: 'bg-gray-400',   text: 'text-gray-400',   border: 'border-gray-600',   bg: 'bg-gray-900/30' },
  cancelled: { dot: 'bg-red-400',    text: 'text-red-400',    border: 'border-red-700',    bg: 'bg-red-950/30' },
}

export const StatusBadge = ({ text, status = 'active' }: BadgeProps) => {
  const s = statusStyles[status]
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${s.border} ${s.bg}`}
      aria-label={`Status: ${text}`}
    >
      <span className={`inline-block h-2 w-2 rounded-full ${s.dot}`} />
      <span className={`text-sm ${s.text}`}>{text}</span>
    </div>
  )
}
