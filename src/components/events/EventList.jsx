import React, { useState, useEffect } from "react";
import EventCard from "../EventCard";
import { categories } from "../../data/categoryData";
import { eventsById, validateEvent } from "../../data/events";

const EventList = ({ categoryId = null, customEvents = null }) => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    // If customEvents are provided, use those
    if (customEvents) {
      // Validate all events
      const validEvents = customEvents.filter(validateEvent);
      setEvents(validEvents);
      return;
    }
    
    let allEvents = [];
    if (categoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      if (category && category.events) {
        allEvents = category.events
          .map(eventId => eventsById[eventId])
          .filter(Boolean) // filter out undefined
          .filter(validateEvent); // validate events
      }
    } else {
      // Collect all events from all categories
      const eventIdSet = new Set();
      categories.forEach(category => {
        if (category.events && category.events.length) {
          category.events.forEach(eventId => eventIdSet.add(eventId));
        }
      });
      allEvents = Array.from(eventIdSet)
        .map(eventId => eventsById[eventId])
        .filter(Boolean)
        .filter(validateEvent);
    }
    
    // Sort events by date (newest first)
    allEvents.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
    setEvents(allEvents);
  }, [categoryId, customEvents]);

  // Reset to first page when events change
  useEffect(() => {
    setCurrentPage(1);
  }, [events]);

  // Get current page items
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const currentEvents = events.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!events.length) {
    return (
      <div className="w-full py-10 text-center">
        <p className="text-gray-400">No events found</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      {/* Events List */}
      <div className="space-y-8">
        {currentEvents.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            imageUrl={event.imageUrl}
            eventName={event.eventName}
            eventDate={event.eventDate}
            location={event.location}
            price={event.price}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-10 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-6 py-2 rounded-lg shadow-md font-semibold transition ${
              currentPage === 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={`page-${index + 1}`}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-md text-lg font-bold ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-[#121631] text-gray-300 hover:bg-[#1c2044]"
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
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EventList; 