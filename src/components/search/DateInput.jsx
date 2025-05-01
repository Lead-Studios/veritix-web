import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

const DateInput = ({ value, onChange }) => {
  return (
    <div className="relative h-16">
      <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
        <FaCalendarAlt className="text-gray-400 text-lg" />
      </div>
      <input
        type="date"
        className="block w-full h-full bg-[#050726] border border-[#1c2044] rounded-md py-4 pl-14 pr-5 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
        placeholder="Date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default DateInput; 