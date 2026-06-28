"use client";

interface Event { id: string; name: string; date: string; attendees?: number; }
interface Props { events: Event[]; }

export default function PastEventsTab({ events }: Props) {
  const past = events.filter((e) => new Date(e.date) < new Date());
  if (past.length === 0)
    return <p className="text-gray-500 text-sm py-8 text-center">No past events yet.</p>;
  return (
    <ul className="divide-y divide-gray-100">
      {past.map((e) => (
        <li key={e.id} className="py-4 flex items-center justify-between">
          <div>
            <p className="font-medium">{e.name}</p>
            <p className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</p>
          </div>
          {e.attendees !== undefined && (
            <span className="text-sm text-gray-600">{e.attendees} attendees</span>
          )}
        </li>
      ))}
    </ul>
  );
}
