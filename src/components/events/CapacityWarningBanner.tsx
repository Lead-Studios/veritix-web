'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CapacityWarningBannerProps {
  sold: number;
  capacity: number;
  eventTitle: string;
  eventId: string;
}

export function CapacityWarningBanner({
  sold,
  capacity,
  eventTitle,
  eventId,
}: CapacityWarningBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const percentageSold = Math.round((sold / capacity) * 100);
  const remainingTickets = capacity - sold;

  useEffect(() => {
    const dismissed = sessionStorage.getItem(`dismissed-capacity-warning-${eventId}`);
    if (dismissed) {
      setIsDismissed(true);
    }
  }, [eventId]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem(`dismissed-capacity-warning-${eventId}`, 'true');
  };

  if (isDismissed || percentageSold < 80) {
    return null;
  }

  const isUrgent = percentageSold >= 90;
  const bannerClasses = isUrgent
    ? 'bg-red-500 border-red-600 text-white'
    : 'bg-amber-400 border-amber-500 text-gray-800';

  return (
    <div className={`p-4 mb-4 border rounded-lg ${bannerClasses}`}>
      <div className="flex items-center justify-between">
        <p>
          <span className="font-bold">⚠️ {eventTitle}</span> is {percentageSold}% sold (
          {remainingTickets} tickets remaining).
        </p>
        <div className="flex items-center">
          <Link href={`/events/manage/${eventId}/edit`}>
            <a className="px-4 py-2 mr-4 text-sm font-medium bg-white rounded-md hover:bg-gray-200">
              Increase Capacity
            </a>
          </Link>
          <button onClick={handleDismiss} className="text-lg font-bold">
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
