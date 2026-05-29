"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { fetchMyTickets, type UserTicket } from "@/lib/ticketHelpers";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyTickets()
      .then(setTickets)
      .catch(() => setError("Failed to load tickets."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-40" />
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <EmptyState
          title="No tickets yet"
          description="You haven't purchased any tickets. Browse upcoming events and grab your spot!"
          action={{
            label: "Browse Events",
            onClick: () => {
              window.location.href = "/events";
            },
          }}
          icon={
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4v-3a2 2 0 00-2-2H5z"
              />
            </svg>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold text-white">My Tickets</h1>
      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          href={`/tickets/${ticket.id}`}
          className="block bg-[#101428] border border-[#4D21FF]/40 rounded-xl p-4 hover:border-[#4D21FF] transition-colors"
        >
          <p className="font-semibold text-white">{ticket.eventName}</p>
          <p className="text-sm text-gray-400 mt-1">
            {ticket.ticketType} · {ticket.eventDate}
          </p>
          <span
            className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${
              ticket.status === "active"
                ? "bg-green-900/60 text-green-300"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {ticket.status}
          </span>
        </Link>
      ))}
    </div>
  );
}
