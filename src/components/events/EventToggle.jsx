import React from "react";

const EventToggle = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-[#050726] rounded-xl overflow-hidden">
      <div className="flex w-full">
        <button
          className={`py-4 px-8 w-1/2 font-medium text-sm transition-all duration-300 ${
            activeTab === "upcoming"
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
          onClick={() => onTabChange("upcoming")}
        >
          Upcoming Events
        </button>
        <button
          className={`py-4 px-8 w-1/2 font-medium text-sm transition-all duration-300 ${
            activeTab === "featured"
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
          onClick={() => onTabChange("featured")}
        >
          Featured
        </button>
      </div>
    </div>
  );
};

export default EventToggle; 