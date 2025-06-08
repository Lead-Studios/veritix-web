import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import EventCard from "../EventCard";
import { categories } from "../../data/categoryData";
import { eventsById, validateEvent } from "../../data/events";

const EventList = ({
  categoryId = null,
  customEvents = null,
  viewMode = "grid",
}) => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = viewMode === "grid" ? 6 : 5;

  useEffect(() => {
    if (customEvents) {
      const validEvents = customEvents.filter(validateEvent);
      setEvents(validEvents);
      return;
    }

    let allEvents = [];
    if (categoryId) {
      const category = categories.find((cat) => cat.id === categoryId);
      if (category && category.events) {
        allEvents = category.events
          .map((eventId) => eventsById[eventId])
          .filter(Boolean)
          .filter(validateEvent);
      }
    } else {
      const eventIdSet = new Set();
      categories.forEach((category) => {
        if (category.events && category.events.length) {
          category.events.forEach((eventId) => eventIdSet.add(eventId));
        }
      });
      allEvents = Array.from(eventIdSet)
        .map((eventId) => eventsById[eventId])
        .filter(Boolean)
        .filter(validateEvent);
    }

    allEvents.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
    setEvents(allEvents);
  }, [categoryId, customEvents, viewMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [events]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="w-full px-4">
      {/* Events Grid/List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "space-y-6"
        }
      >
        {currentEvents.map((event) => (
          <motion.div key={event.id} variants={itemVariants}>
            <EventCard
              id={event.id}
              imageUrl={event.imageUrl}
              eventName={event.eventName}
              eventDate={event.eventDate}
              location={event.location}
              price={event.price}
              viewMode={viewMode}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center mt-12 space-x-2"
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentPage === 1
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              const isActive = currentPage === pageNum;

              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110"
                      : "bg-[#121631] text-gray-300 hover:bg-[#1c2044] hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentPage === totalPages
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
            }`}
          >
            Next
          </button>
        </motion.div>
      )}
    </div>
  );
};

EventList.propTypes = {
  categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customEvents: PropTypes.array,
  viewMode: PropTypes.oneOf(["grid", "list"]),
};

EventList.defaultProps = {
  categoryId: null,
  customEvents: null,
  viewMode: "grid",
};

export default EventList;
