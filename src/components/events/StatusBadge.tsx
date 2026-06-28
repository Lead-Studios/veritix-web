"use client";

type Status = "DRAFT" | "PUBLISHED" | "CANCELLED" | "POSTPONED" | "COMPLETED";
interface Props { status: Status; onAction?: (action: string) => void; }

const COLORS: Record<Status, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  POSTPONED: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};
const ACTIONS: Record<Status, string[]> = {
  DRAFT: ["Publish"],
  PUBLISHED: ["Cancel", "Postpone"],
  POSTPONED: ["Publish", "Cancel"],
  CANCELLED: [],
  COMPLETED: [],
};

export default function StatusBadge({ status, onAction }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${COLORS[status]}`}>{status}</span>
      {ACTIONS[status].map((action) => (
        <button key={action} onClick={() => onAction?.(action)}
          className="text-xs border rounded-full px-3 py-0.5 hover:bg-gray-50">{action}</button>
      ))}
    </div>
  );
}
