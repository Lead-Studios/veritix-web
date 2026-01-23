'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiLocationMarker, HiCalendar } from 'react-icons/hi';
import CategoryFilter from '@/src/components/events/CategoryFilter';
import FilterInput from '@/src/components/events/FilterInput';
import TabSelector from '@/src/components/TabSelector';
import { getFeaturedEvents, mockEvents } from '@/src/types/MockEvents';
import EventCard from '@/src/components/events/EventCard';
type ViewMode = 'upcoming' | 'featured';

export default function EventsPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>(['music', 'festival']);
  const [viewMode, setViewMode] = useState<ViewMode>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter events based on active filters
  const filteredEvents = useMemo(() => {
    let events = viewMode === 'featured' ? getFeaturedEvents() : mockEvents;

    // Filter by categories
    if (activeFilters.length > 0) {
      events = events.filter(event => activeFilters.includes(event.category));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      events = events.filter(event =>
        event.name.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query)
      );
    }

    return events;
  }, [activeFilters, viewMode, searchQuery]);

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  return (
    <div className="min-h-screen bg-[#101428]">
      <section className="relative overflow-hidden">
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative h-60 sm:h-70 md:h-100 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/events/event.png)' }} />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <div className="relative h-full flex items-center justify-center px-8">
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-center"
              >
                <span className="text-[#6B8CFF]">
                  FESTIVAL
                </span>
              </motion.h1>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-2xl border border-[#E0E0E033]/20 bg-primary-dark-blue/50 p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <FilterInput
                icon={HiSearch}
                placeholder="Search events, artists, or venues"
                value={searchQuery}
                onChange={setSearchQuery}
                focusColor="#6B8CFF"
                rounded="rounded-lg"
                inputClassName="py-3"
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <FilterInput
                icon={HiLocationMarker}
                placeholder="Location"
                focusColor="#6B8CFF"
                rounded="rounded-lg"
                inputClassName="py-3"
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <FilterInput
                icon={HiCalendar}
                placeholder="Date"
                focusColor="#6B8CFF"
                rounded="rounded-lg"
                inputClassName="py-3"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CategoryFilter
              activeFilters={activeFilters}
              onRemoveFilter={removeFilter}
            />
            <motion.p
              key={filteredEvents.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 font-medium text-sm"
            >
              {filteredEvents.length} events found
            </motion.p>
          </div>
        </div>
      </section>

      <TabSelector
        tabs={['Upcoming Events', 'Featured']}
        activeTab={viewMode === 'upcoming' ? 'Upcoming Events' : 'Featured'}
        onTabChange={(tab) => setViewMode(tab === 'Upcoming Events' ? 'upcoming' : 'featured')}
      />

      <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        <AnimatePresence mode="wait">
          {filteredEvents.length > 0 ? (
            <motion.div
              key={`${viewMode}-${activeFilters.join('-')}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {filteredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-20 space-y-4"
            >
              <div className="text-4xl sm:text-6xl">🔍</div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">No events found</h3>
              <p className="text-gray-400 text-center max-w-md text-sm sm:text-base">
                Try adjusting your filters or search query to find more events
              </p>
              <motion.button
                onClick={() => {
                  setActiveFilters([]);
                  setSearchQuery('');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 sm:px-8 py-3 bg-linear-to-r from-[#6B8CFF] to-[#5AB9EA] text-white font-semibold rounded-xl transition-all duration-300"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}