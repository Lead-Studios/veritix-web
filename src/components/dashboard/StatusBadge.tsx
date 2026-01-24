interface BadgeProps {
  text: string
}

export const StatusBadge = ({ text }: BadgeProps) => (
  <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 border-[#4D21FF] bg-[#000625]">
    <span className="inline-block h-2 w-2 rounded-full bg-[#21D4FF]" />
    <span className="text-sm text-[#21D4FF]">{text}</span>
  </div>
)

