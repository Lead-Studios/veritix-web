'use client';

import { motion } from 'framer-motion';

interface FilterInputProps {
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  focusColor?: string;
  rounded?: string;
  inputClassName?: string;
}

export default function FilterInput({
  icon: Icon,
  placeholder,
  value = '',
  onChange = () => {},
  focusColor = 'cyan-400',
  rounded = 'rounded-xl',
  inputClassName = ''
}: FilterInputProps) {
  return (
    <div className="relative group">
      <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[${focusColor}] transition-colors`} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full pl-12 pr-4 py-3.5 bg-primary-dark-blue/50 border border-[#E0E0E0]/20 ${rounded} text-white placeholder:text-gray-500 focus:outline-none focus:border-[${focusColor}]/50 focus:bg-white/10 transition-all duration-300 ${inputClassName}`}
      />
    </div>
  );
}