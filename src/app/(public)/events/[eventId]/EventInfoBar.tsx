'use client';

import { motion } from 'framer-motion';
import { HiCalendar, HiClock, HiLocationMarker, HiUsers } from 'react-icons/hi';

interface EventInfoBarProps {
  date?: string;
  time?: string;
  venue: string;
  attendees?: number;
}

export default function EventInfoBar({ date, time, venue, attendees }: EventInfoBarProps) {
  return (
    <section className="relative">
      <div className="container mx-auto px-6 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="p-2">
              <HiCalendar className="w-5 h-5 text-[#4D21FF]" />
            </div>
            <div>
              <p className="text-sm text-white font-medium">{date}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="p-2">
              <HiClock className="w-5 h-5 text-[#4D21FF]" />
            </div>
            <div>
              <p className="text-sm text-white font-medium">{time}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 ">
              <HiLocationMarker className="w-5 h-5 text-[#4D21FF]" />
            </div>
            <div>
              <p className="text-sm text-white font-medium">{venue}</p>
            </div>
          </motion.div>

          {attendees && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="p-2.5 ">
                <HiUsers className="w-5 h-5 text-[#4D21FF]" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">{attendees}+ attendees</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
