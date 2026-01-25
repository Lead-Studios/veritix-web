'use client';

import { motion } from 'framer-motion';

interface TabSelectorProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
  tabClassName?: string;
}

export default function TabSelector<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  tabClassName = ''
}: TabSelectorProps<T>) {

  // Custom responsive widths (make sure these are in tailwind.config.js)
  const buttonWidthClass = tabs.length > 2 ? 'md:w-[315px]' : 'md:w-[514px]';

  return (
    <section className={`relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 ${className}`}>
      <div className="rounded-[20px] bg-primary-dark-blue/50 border border-[#E0E0E033] p-4 flex flex-wrap gap-4 justify-center items-center">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              relative w-full ${buttonWidthClass} px-4 py-3 rounded-[10px] font-semibold text-sm capitalize transition-all duration-300
              ${activeTab === tab
                ? 'text-white'
                : 'bg-transparent text-gray-400 hover:text-white'
              }
              ${tabClassName}
            `}
            style={activeTab === tab ? {
              background: 'linear-gradient(90deg, #4D21FF 0%, #21D4FF 100%)'
            } : undefined}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab}
          </motion.button>
        ))}
      </div>
    </section>
  );
}
