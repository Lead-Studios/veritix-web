'use client';

import { motion } from 'framer-motion';

interface CategoryFilterProps {
  activeFilters: string[];
  onRemoveFilter: (filter: string) => void;
}

export default function CategoryFilter({ activeFilters, onRemoveFilter }: CategoryFilterProps) {
  if (activeFilters.length === 0) return null;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {activeFilters.map((filter, index) => (
        <motion.div
          key={filter}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: index * 0.05 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00062580]/50 border border-white/10 rounded-full text-sm font-medium text-white"
        >
          <span className="capitalize">{filter}</span>
          <button
            onClick={() => onRemoveFilter(filter)}
            className="ml-1 hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        </motion.div>
      ))}
    </div>
  );
}