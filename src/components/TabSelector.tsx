'use client';

import { useRef } from 'react';
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
  const buttonWidthClass = tabs.length > 2 ? 'md:w-[315px]' : 'md:w-[514px]';
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      next = 0;
    } else if (e.key === 'End') {
      next = tabs.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    onTabChange(tabs[next]);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className={`relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 ${className}`}>
      <div
        role="tablist"
        className="rounded-[20px] bg-primary-dark-blue/50 border border-[#E0E0E033] p-4 flex flex-wrap gap-4 justify-center items-center"
      >
        {tabs.map((tab, index) => (
          <motion.button
            key={tab}
            ref={(el) => { tabRefs.current[index] = el; }}
            role="tab"
            aria-selected={activeTab === tab}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => onTabChange(tab)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`
              relative w-full ${buttonWidthClass} px-4 py-3 rounded-[10px] font-semibold text-sm capitalize transition-all duration-300
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
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
