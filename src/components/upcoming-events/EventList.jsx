import React, { useState } from "react";
import TrendingCards from "../cards/TrendingCards";
import { events } from "../../data/Data";

const ITEMS_PER_PAGE = 8;

const EventList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);

  const paginatedEvents = events.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col items-center w-full bg-[#E7FDFF] pb-10">
      {/* Event Grid */}
      <div className="grid lg:grid-cols-3 xl:grid-cols-4 px-4 md:grid-cols-2 grid-cols-1 max-w-[1400px] justify-between items-center gap-8 w-full">
        {paginatedEvents.map((event, i) => (
          <div key={i}>
            <TrendingCards
              amount={event.amount}
              title={event.title}
              type={event.type}
              time={event.time}
              color={event.color}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-6 py-2 rounded-lg shadow-md font-semibold transition ${
            currentPage === 1
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#3C6363] text-white hover:bg-[#2A4B4B]"
          }`}
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-10 h-10 flex items-center justify-center rounded-md text-lg font-bold ${
                currentPage === index + 1
                  ? "bg-[#103F3F] text-white"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-6 py-2 rounded-lg shadow-md font-semibold transition ${
            currentPage === totalPages
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#3C6363] text-white hover:bg-[#2A4B4B]"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EventList;
