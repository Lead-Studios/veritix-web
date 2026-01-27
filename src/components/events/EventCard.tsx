'use client';

import Link from 'next/link';
import { Event } from '@/types/event';
import { motion } from 'framer-motion';
import { HiCalendar, HiClock, HiLocationMarker } from 'react-icons/hi';

interface EventCardProps {
  event: Event;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
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
      <Link 
        href={`/events/${event.id}`}
        className="group block"
      >
        <div className="relative overflow-hidden rounded-xl bg-primary-dark-blue/50 border border-[#E0E0E0]/20  hover:border-white/10 transition-all duration-300">
          <div className="flex flex-col sm:flex-row gap-0">
            {/* Event Image - Top on mobile, Left on larger */}
            <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover"
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
                {/* Event Name and Price - Same Line */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold text-white group-hover:text-gray-200 transition-colors flex-1">
                    {event.name}
                  </h3>
                  <div className="text-xl font-bold text-[#6B8CFF] whitespace-nowrap">
                    {event.price}
                  </div>
                </div>

                {/* Event Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-6 text-gray-400 text-sm">
                    <HiCalendar className="w-4 h-4 shrink-0" />
                    <span>{event.date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <HiClock className="w-4 h-4 shrink-0" />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <HiLocationMarker className="w-4 h-4 shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="flex items-center justify-end mt-4">
                <button className="px-6 py-2.5 bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
                  Get Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
