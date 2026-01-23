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
  const buttonWidth = tabs.length > 2 ? 'md:w-78.75' : 'md:w-128.5'; 
  // 315px = 78.75 * 4, 514px = 128.5 * 4

  return (
    <section className={`relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 ${className}`}>
      <div className="rounded-[20px] bg-primary-dark-blue/50 border border-[#E0E0E033]/20 p-4 flex flex-wrap gap-2 justify-center">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              relative w-full ${buttonWidth} px-4 py-3 rounded-[10px] font-semibold text-sm capitalize transition-all duration-300
              ${activeTab === tab
                ? 'bg-linear-to-r from-[#4D21FF] to-[#21D4FF] text-white'
                : 'bg-transparent text-gray-400 hover:text-white'
              }
              ${tabClassName}
            `}
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