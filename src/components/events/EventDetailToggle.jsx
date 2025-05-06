import React from "react";

const EventDetailToggle = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-[#050726] rounded-xl overflow-hidden mb-8">
      <div className="flex w-full">
        <button
          className={`py-3 sm:py-4 px-3 sm:px-8 w-1/3 font-medium text-xs sm:text-sm transition-all duration-300 ${
            activeTab === "about"
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
          onClick={() => onTabChange("about")}
        >
          About
        </button>
        <button
          className={`py-3 sm:py-4 px-3 sm:px-8 w-1/3 font-medium text-xs sm:text-sm transition-all duration-300 ${
            activeTab === "schedule"
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
          onClick={() => onTabChange("schedule")}
        >
          Schedule
        </button>
        <button
          className={`py-3 sm:py-4 px-3 sm:px-8 w-1/3 font-medium text-xs sm:text-sm transition-all duration-300 ${
            activeTab === "performers"
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
          onClick={() => onTabChange("performers")}
        >
          Performers
        </button>
      </div>
    </div>
  );
};

export default EventDetailToggle; 