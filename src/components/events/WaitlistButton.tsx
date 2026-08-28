'use client';

import { useState } from 'react';

export default function WaitlistButton({
  isSoldOut,
}: {
  eventId: string;
  isSoldOut: boolean;
}) {
  const [joined, setJoined] = useState(false);
  const [queuePos, setQueuePos] = useState<number | null>(null);

  if (!isSoldOut) return null;

  const handleJoin = async () => {
    // Call waitlist API endpoint
    setJoined(true);
    setQueuePos(14);
  };

  return (
    <div className="space-y-2">
      {!joined ? (
        <button
          onClick={handleJoin}
          className="w-full py-3 px-6 rounded-xl font-medium bg-amber-500 hover:bg-amber-400 text-black transition-colors"
        >
          Join Waitlist
        </button>
      ) : (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
          <p className="text-sm font-semibold text-amber-300">You are on the waitlist!</p>
          <p className="text-xs text-gray-300 pt-1">Queue position: #{queuePos}</p>
        </div>
      )}
    </div>
  );
}
