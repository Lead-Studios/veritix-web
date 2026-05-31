'use client';

import { useState, useMemo, useEffect, useRef, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiLocationMarker, HiCalendar } from 'react-icons/hi';
import { useSearchParams } from 'next/navigation';
import CategoryFilter from '@/components/events/CategoryFilter';
import FilterInput from '@/components/events/FilterInput';
import TabSelector from '@/components/TabSelector';
import { useEvents } from '@/hooks/useEvents';
import EventCard from '@/components/events/EventCard';
import { EmptyState } from '@/components/EmptyState';

const PAGE_SIZE = 9;

type ViewMode = 'upcoming' | 'featured';

function EventsPageContent() {
  const { events, loading, error } = useEvents();
  const [activeFilters, setActiveFilters] = useState<string[]>(['music', 'festival']);
  const [viewMode, setViewMode] = useState<ViewMode>('upcoming');
  
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [locationFilter, setLocationFilter] = useState(() => searchParams.get('location') || '');
  const [dateFilter, setDateFilter] = useState(() => searchParams.get('date') || '');

  // Sync state if URL query params change
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setLocationFilter(searchParams.get('location') || '');
    setDateFilter(searchParams.get('date') || '');
  }, [searchParams]);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filteredEvents = useMemo(() => {
    let list = viewMode === 'featured' ? events.filter((e) => e.featured) : events;
    if (activeFilters.length > 0) list = list.filter((e) => activeFilters.includes(e.category));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
    }
    if (locationFilter.trim()) {
      const loc = locationFilter.toLowerCase();
      list = list.filter((e) => e.location.toLowerCase().includes(loc) || e.venue.toLowerCase().includes(loc));
    }
    if (dateFilter.trim()) list = list.filter((e) => e.date.toLowerCase().includes(dateFilter.toLowerCase()));
    return list;
  }, [events, activeFilters, viewMode, searchQuery, locationFilter, dateFilter]);

  // Reset visible count when filters change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [activeFilters, viewMode, searchQuery, locationFilter, dateFilter]);

  // Infinite scroll via IntersectionObserver
  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredEvents.length));
  }, [filteredEvents.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) loadMore(); }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEvents.length;

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
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
                <span className="text-[#6B8CFF]">FESTIVAL</span>
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
                value={locationFilter}
                onChange={setLocationFilter}
                focusColor="#6B8CFF"
                rounded="rounded-lg"
                inputClassName="py-3"
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <FilterInput
                icon={HiCalendar}
                placeholder="Date"
                value={dateFilter}
                onChange={setDateFilter}
                focusColor="#6B8CFF"
                rounded="rounded-lg"
                inputClassName="py-3"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CategoryFilter activeFilters={activeFilters} onRemoveFilter={removeFilter} onClearAll={() => setActiveFilters([])} />
            <motion.p
              key={filteredEvents.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 font-medium text-sm"
            >
              {!error && `${filteredEvents.length} events found`}
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
        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <div className="w-12 h-12 border-4 border-[#6B8CFF]/30 border-t-[#6B8CFF] rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading events...</p>
          </motion.div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
              <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-white font-semibold text-lg">Unable to load events</h3>
              <p className="text-gray-400 text-sm max-w-md">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Events List */}
        {!loading && !error && (
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
                {visibleEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
                {hasMore && (
                  <div ref={sentinelRef} className="flex justify-center py-6">
                    <div className="w-8 h-8 border-4 border-[#6B8CFF]/30 border-t-[#6B8CFF] rounded-full animate-spin" />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <EmptyState
                  variant="search"
                  title="No events found"
                  description="Try adjusting your filters or search query to find more events"
                  action={{
                    label: "Clear Filters",
                    onClick: () => {
                      setActiveFilters([]);
                      setSearchQuery('');
                      setLocationFilter('');
                      setDateFilter('');
                    },
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#101428] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#6B8CFF]/30 border-t-[#6B8CFF] rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading events page...</p>
      </div>
    }>
      <EventsPageContent />
    </Suspense>
  );
}
