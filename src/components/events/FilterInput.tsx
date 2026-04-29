'use client';

import React from 'react';

interface FilterInputProps {
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  focusColor?: string;
  rounded?: string;
  inputClassName?: string;
}

const focusColorMap: Record<string, { border: string; text: string; bg?: string }> = {
  '#6B8CFF': {
    border: 'focus:border-[#6B8CFF]/50',
    text: 'group-focus-within:text-[#6B8CFF]',
    bg: 'focus:bg-[#6B8CFF]/10',
  },
  'cyan-400': {
    border: 'focus:border-cyan-400/50',
    text: 'group-focus-within:text-cyan-400',
  },
  'blue-500': {
    border: 'focus:border-blue-500/50',
    text: 'group-focus-within:text-blue-500',
  },
  'emerald-500': {
    border: 'focus:border-emerald-500/50',
    text: 'group-focus-within:text-emerald-500',
  },
  'purple-500': {
    border: 'focus:border-purple-500/50',
    text: 'group-focus-within:text-purple-500',
  },
};

export default function FilterInput({
  icon: Icon,
  placeholder,
  value = '',
  onChange = () => {},
  focusColor = 'cyan-400',
  rounded = 'rounded-xl',
  inputClassName = ''
}: FilterInputProps) {
  const colorStyles = focusColorMap[focusColor] || focusColorMap['cyan-400'];

  return (
    <div className="relative group">
      <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors ${colorStyles.text}`} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full pl-12 pr-4 py-3.5 bg-primary-dark-blue/50 border border-[#E0E0E0]/20 ${rounded} text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300 ${colorStyles.border} ${colorStyles.bg || 'focus:bg-white/10'} ${inputClassName}`}
      />
    </div>
  );
}