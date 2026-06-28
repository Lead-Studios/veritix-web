"use client";

import { useState } from "react";
import { ResaleListingForm } from "./ResaleListingForm";

interface ResaleListingProps {
  ticketId: string;
  originalPrice: number;
  ticketType: string;
  eventName: string;
}

export function ResaleListing({ ticketId, originalPrice, ticketType, eventName }: ResaleListingProps) {
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="rounded-2xl border border-green-700/40 bg-green-900/20 p-8 text-center space-y-3">
        <div className="text-4xl">🎫</div>
        <h2 className="text-xl font-bold text-white">Listed for Resale</h2>
        <p className="text-sm text-gray-400">
          Your {ticketType} ticket for <span className="text-white">{eventName}</span> is now listed on the resale
          marketplace. You will be notified when a buyer is found.
        </p>
        <p className="text-xs text-gray-500">
          Manage your listing from your ticket details page.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#020718]/80 p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white">Resell Your Ticket</h2>
        <p className="text-sm text-gray-400 mt-1">
          List your {ticketType} ticket for <span className="text-white">{eventName}</span> at or below the maximum
          allowed price.
        </p>
      </div>
      <ResaleListingForm ticketId={ticketId} originalPrice={originalPrice} onSuccess={() => setSuccess(true)} />
    </div>
  );
}
