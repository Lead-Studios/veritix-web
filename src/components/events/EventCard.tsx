'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Event } from '@/types/event';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { HiCalendar, HiClock, HiLocationMarker, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useFavorite } from '@/hooks/useFavorite';
import { CapacityProgressBar } from '@/components/events/EventCapacityProgress';

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  music: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
  },
  festival: {
    bg: 'bg-pink-500/20',
    text: 'text-pink-300',
    border: 'border-pink-500/30',
  },
  sports: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
  },
  art: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
  },
  theater: {
    bg: 'bg-rose-500/20',
    text: 'text-rose-300',
    border: 'border-rose-500/30',
  },
  comedy: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-300',
    border: 'border-yellow-500/30',
  },
  conference: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
  },
  workshop: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
  },
};

export function getCategoryBadgeStyle(category?: string): string {
  if (!category) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  const normalized = category.toLowerCase().trim();
  const style = CATEGORY_STYLES[normalized];
  if (style) {
    return `${style.bg} ${style.text} ${style.border}`;
  }
  return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
}

function FavoriteToggle({ eventId }: { eventId: string }) {
  const { isLiked, toggle } = useFavorite(eventId);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      className="p-1.5 rounded-full hover:bg-white/10 text-rose-500 transition-colors"
      aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isLiked ? <HiHeart className="w-5 h-5 fill-current" /> : <HiOutlineHeart className="w-5 h-5" />}
    </button>
  );
}

interface EventCardProps {
  event: Event;
  index?: number;
}

function EventCard({ event, index = 0 }: EventCardProps) {
  const imageSrc = (event.image ?? event.imageUrl ?? '/images/events/event.png') as string;
  const imageSrc = (event.image ?? event.imageUrl ?? "/images/events/event.png") as string;
  const eventDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : event.date ?? 'Date TBD';
  const eventTime = event.time ?? 'Time TBD';
    : event.date ?? "Date TBD";
  const eventTime = event.time ?? "Time TBD";
  const soldCount = event.sold ?? event.soldTickets ?? event.attendees ?? 0;
  const hasCapacity = typeof event.capacity === 'number' && event.capacity > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <div className="relative overflow-hidden rounded-xl bg-primary-dark-blue/50 border border-[#E0E0E0]/20 hover:border-white/10 transition-all duration-300 group">
        <div className="flex flex-col sm:flex-row gap-0">
          {/* Event Image - Top on mobile, Left on larger */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden">
            <Link 
              href={`/events/${event.id}`}
              prefetch
              className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-[#6B8CFF] focus:ring-inset"
              aria-label={`View details for ${event.name}`}
            />
            <Image
              src={imageSrc}
              alt={event.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 12rem"
            />
            {/* Pattern overlay for texture */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.2) 1px, transparent 0)`,
              backgroundSize: '16px 16px'
            }} />
          </div>

          {/* Event Details - Bottom on mobile, Right on larger */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
            <div className="space-y-3">
              {event.category && (
                <div>
                  <Link
                    href={`/events?category=${encodeURIComponent(event.category.toLowerCase())}`}
                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border capitalize transition-all duration-200 hover:scale-105 ${getCategoryBadgeStyle(
                      event.category
                    )}`}
                    aria-label={`Category: ${event.category}`}
                  >
                    {event.category}
                  </Link>
                </div>
              )}
              {/* Event Name and Price - Same Line */}
              <div className="flex items-start justify-between gap-3">
                <Link 
                  href={`/events/${event.id}`}
                  prefetch
                  className="text-xl font-semibold text-white group-hover:text-gray-200 transition-colors flex-1 focus:outline-none focus:ring-2 focus:ring-[#6B8CFF] focus:ring-offset-2 focus:ring-offset-[#101428] rounded"
                >
                  {event.name}
                </Link>
                <div className="flex items-center gap-2">
                  <FavoriteToggle eventId={event.id} />
                  <div className="text-xl font-bold text-[#6B8CFF] whitespace-nowrap">
                    {event.price}
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-6 text-gray-400 text-sm">
                  <HiCalendar className="w-4 h-4 shrink-0" />
                  <span>{eventDate}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <HiClock className="w-4 h-4 shrink-0" />
                  <span>{eventTime}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <HiLocationMarker className="w-4 h-4 shrink-0" />
                  <span>{event.location}</span>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              {hasCapacity && (
                <div className="pt-2">
                  <CapacityProgressBar
                    sold={soldCount}
                    total={event.capacity!}
                  />
                </div>
              )}
            </div>

            {/* Button */}
            <div className="flex items-center justify-end mt-4">
              <Link 
                href={`/events/${event.id}`}
                prefetch
                className="px-6 py-2.5 bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#6B8CFF] focus:ring-offset-2 focus:ring-offset-[#101428]"
              >
                Get Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(EventCard);
