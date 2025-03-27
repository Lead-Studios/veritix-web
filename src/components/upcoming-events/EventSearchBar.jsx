import React, { useState } from "react";

const EventSearchBar = () => {
  const [event, setEvent] = useState("Lagos Countdown");
  const [place, setPlace] = useState("Lagos");
  const [date, setDate] = useState("Any date");

  return (
    <div className="bg-[#E7FDFF] p-6 rounded-lg shadow-md flex flex-col gap-6 md:flex-row justify-between items-center">
      <div className="flex flex-col w-full md:w-1/3">
        <label className="text-gray-700 text-sm mb-1">Search Event</label>
        <input
          type="text"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          className="text-lg font-semibold text-[#103F3F] bg-transparent border-b border-[#103F3F] focus:outline-none"
        />
      </div>

      <div className="flex flex-col w-full md:w-1/3 mt-4 md:mt-0">
        <label className="text-gray-700 text-sm mb-1">Place</label>
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="text-lg font-semibold text-[#103F3F] bg-transparent border-b border-[#103F3F] focus:outline-none"
        />
      </div>

      <div className="flex flex-col w-full md:w-1/3 mt-4 md:mt-0 relative">
        <label className="text-gray-700 text-sm mb-1">Time</label>
        <select
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-lg font-semibold text-[#103F3F] bg-transparent border-b border-[#103F3F] focus:outline-none appearance-none cursor-pointer"
        >
          <option>Any date</option>
          <option>Today</option>
          <option>Tomorrow</option>
          <option>This Week</option>
        </select>
      </div>
    </div>
  );
};

export default EventSearchBar;
