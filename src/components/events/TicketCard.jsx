import React from "react";

const TicketCard = ({ type, price, available, description, popular, onClick }) => (
  <div
    className="bg-[#181c3a] rounded-xl p-4 sm:p-6 flex flex-col justify-between mb-4 border border-[#23264a] transition cursor-pointer hover:border-indigo-500 hover:shadow-lg relative group w-full"
    tabIndex={0}
    role="button"
    onClick={onClick}
    style={{ minHeight: 220 }}
  >
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-white mb-2 sm:mb-0 sm:mr-3">{type}</h3>
      {popular && (
        <span className="px-3 py-1 rounded-full border border-indigo-500 text-indigo-400 font-semibold text-xs sm:text-sm self-start sm:self-auto group-hover:bg-indigo-500 group-hover:text-white transition">
          Popular
        </span>
      )}
    </div>
    {description && (
      <ul className="text-gray-400 text-xs sm:text-sm mb-2 list-disc list-inside space-y-1">
        {description.map((line, idx) => (
          <li key={idx} className="line-clamp-2">{line}</li>
        ))}
      </ul>
    )}
    <div className="flex-1 min-h-[40px]"></div>
    <div className="flex items-end justify-between absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
      <span className="text-indigo-400 font-bold text-lg mb-1">{price}</span>
      <span className="text-gray-400 text-xs">{available} remaining</span>
    </div>
  </div>
);

export default TicketCard; 