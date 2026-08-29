'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  checkedIn: boolean;
}

export default function AttendeeTable({ attendees }: { attendees: Attendee[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: attendees.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="h-[500px] overflow-auto border border-white/10 rounded-xl bg-[#101428]"
    >
      <div
        className="w-full relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const attendee = attendees[virtualRow.index];
          return (
            <div
              key={attendee.id}
              className="absolute top-0 left-0 w-full flex items-center px-4 border-b border-white/5 text-sm text-gray-200"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <span className="w-1/4 font-medium text-white">{attendee.name}</span>
              <span className="w-1/3 text-gray-400">{attendee.email}</span>
              <span className="w-1/4">{attendee.ticketType}</span>
              <span
                className={`w-1/6 text-xs font-semibold ${attendee.checkedIn ? 'text-emerald-400' : 'text-amber-400'}`}
              >
                {attendee.checkedIn ? 'Checked In' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
