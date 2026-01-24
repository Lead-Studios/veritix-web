'use client';

import { useState } from 'react';
import { HiSearch, HiLocationMarker, HiCalendar } from 'react-icons/hi';
import { motion } from 'framer-motion';
import FilterInput from './FilterInput';

interface SearchFiltersProps {
  onSearch?: (query: string) => void;
  onLocationChange?: (location: string) => void;
  onDateChange?: (date: string) => void;
}

export default function SearchFilters({ 
  onSearch, 
  onLocationChange, 
  onDateChange 
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row gap-4"
    >
      {/* Search Input */}
      <div className="w-full md:max-w-128.5 h-17">
        <FilterInput
          icon={HiSearch}
          placeholder="Search events, artists, or venues"
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            onSearch?.(value);
          }}
          focusColor="cyan-400"
        />
      </div>

      {/* Location Input */}
      <div className="w-full md:w-65 h-17">
        <FilterInput
          icon={HiLocationMarker}
          placeholder="Location"
          value={location}
          onChange={(value) => {
            setLocation(value);
            onLocationChange?.(value);
          }}
          focusColor="purple-400"
        />
      </div>

      {/* Date Input */}
      <div className="w-full md:w-65 h-17">
        <FilterInput
          icon={HiCalendar}
          placeholder="Date"
          value={date}
          onChange={(value) => {
            setDate(value);
            onDateChange?.(value);
          }}
          focusColor="pink-400"
        />
      </div>
    </motion.div>
  );
}