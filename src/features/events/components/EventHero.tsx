"use client";

import Image from "next/image";
import Link from "next/link";
import { HiCalendar, HiLocationMarker, HiUsers } from "react-icons/hi";
import type { Event } from "@/types/event";

interface EventHeroProps {
  event: Event;
  onShare: () => void;
  shareCopied: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  DRAFT: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  CANCELLED: "bg-red-500/20 text-red-300 border-red-500/40",
  COMPLETED: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  POSTPONED: "bg-orange-500/20 text-orange-300 border-orange-500/40",
};

export function EventHero({ event, onShare, shareCopied }: EventHeroProps) {
  const statusStyle = STATUS_STYLES[event.status] ?? STATUS_STYLES.PUBLISHED;
  const organizerId = event.organizerId ?? event.organizer?.name?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="relative">
      {/* Banner */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
        <Image
          src={event.imageUrl ?? "/djparty.png"}
          alt={event.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f24] via-[#0a0f24]/40 to-transparent" />
      </div>

      {/* Info overlay */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="-mt-16 relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusStyle}`}>
              {event.status}
            </span>
            <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              {event.name}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <HiCalendar className="h-4 w-4 text-[#21D4FF]" />
                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                {" · "}
                {new Date(event.eventDate).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <HiLocationMarker className="h-4 w-4 text-[#21D4FF]" />
                {event.venue}{event.city ? `, ${event.city}` : ""}
              </span>
              {event.attendees != null && (
                <span className="flex items-center gap-1.5">
                  <HiUsers className="h-4 w-4 text-[#21D4FF]" />
                  {event.attendees.toLocaleString()} attending
                </span>
              )}
            </div>

            {event.organizer && (
              <p className="text-sm text-white/60">
                Organized by{" "}
                <Link
                  href={`/organizer/${organizerId}`}
                  className="text-[#21D4FF] hover:underline"
                >
                  {event.organizer.name}
                </Link>
                {event.organizer.verified && (
                  <span className="ml-1 text-xs text-emerald-400">✓ Verified</span>
                )}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onShare}
            className="shrink-0 rounded-full border border-[#4D21FF]/40 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4D21FF]/20"
          >
            {shareCopied ? "Link copied!" : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}
