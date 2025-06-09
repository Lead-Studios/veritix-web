import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchInput from "./SearchInput";
import LocationInput from "./LocationInput";
import DateInput from "./DateInput";
import { categories } from "../../data/categoryData";
import { eventsById, validateEvent } from "../../data/events";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

const SearchBlock = ({ onSearch = () => {}, categoryId = null }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [eventCount, setEventCount] = useState(0);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Filter events based on search criteria
  const handleSearch = useCallback(() => {
    setIsSearching(true);

    setTimeout(() => {
      // Get all event objects
      let allEvents = [];

      // Only show events for Concert category
      if (categoryId === "cat-1") {
        // If searching within Concert category
        const category = categories.find((cat) => cat.id === categoryId);
        if (category && category.events) {
          allEvents = category.events
            .map((eventId) => eventsById[eventId])
            .filter(Boolean)
            .filter(validateEvent);
        }
      } else if (!categoryId) {
        // On the main events page, show all events
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

      // Apply filters
      const filteredEvents = allEvents.filter((event) => {
        // Filter by search query (event name, description, or location)
        const matchesQuery =
          searchQuery === "" ||
          (event.eventName &&
            event.eventName
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (event.description &&
            event.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (event.location &&
            event.location.toLowerCase().includes(searchQuery.toLowerCase()));

        // Filter by location
        const matchesLocation =
          location === "" ||
          (event.location &&
            event.location.toLowerCase().includes(location.toLowerCase()));

        // Filter by date
        const matchesDate =
          date === "" ||
          (event.eventDate &&
            new Date(event.eventDate).toISOString().substring(0, 10) === date);

        // Filter by category
        const matchesCategory =
          selectedCategory === "" ||
          (event.category &&
            event.category
              .toLowerCase()
              .includes(selectedCategory.toLowerCase()));

        return (
          matchesQuery && matchesLocation && matchesDate && matchesCategory
        );
      });

      console.log("Search results:", filteredEvents.length, filteredEvents);
      setEventCount(filteredEvents.length);
      onSearch(filteredEvents);
      setIsSearching(false);
    }, 500);
  }, [searchQuery, location, date, selectedCategory, categoryId, onSearch]);

  // Get total events based on category - only run once on mount or when categoryId changes
  useEffect(() => {
    let allEvents = [];

    // Only show events for Concert category
    if (categoryId === "cat-1") {
      // If searching within Concert category
      const category = categories.find((cat) => cat.id === categoryId);
      if (category && category.events) {
        const categoryEvents = category.events
          .map((eventId) => eventsById[eventId])
          .filter(Boolean)
          .filter(validateEvent);
        allEvents = categoryEvents;
      }
    } else if (!categoryId) {
      // On the main events page, show all events
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

    setEventCount(allEvents.length);
    onSearch(allEvents);
  }, [categoryId, onSearch]); // Added onSearch dependency

  // Only trigger search when user actually changes filters - debounced
  useEffect(() => {
    // Don't search on initial load when all filters are empty
    if (searchQuery || location || date || selectedCategory) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 300); // Debounce search

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, location, date, selectedCategory, handleSearch]); // Added handleSearch dependency

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setLocation("");
    setDate("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });

    // Reset to show all events
    setTimeout(() => {
      let allEvents = [];
      if (categoryId === "cat-1") {
        const category = categories.find((cat) => cat.id === categoryId);
        if (category && category.events) {
          allEvents = category.events
            .map((eventId) => eventsById[eventId])
            .filter(Boolean)
            .filter(validateEvent);
        }
      } else if (!categoryId) {
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
      setEventCount(allEvents.length);
      onSearch(allEvents);
    }, 100);
  };

  const hasActiveFilters = searchQuery || location || date || selectedCategory;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>

      <div className="relative bg-[#0f1629]/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 xl:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <FaSearch className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Find Your Perfect Event
              </h3>
              <p className="text-gray-400 text-sm">
                Search through thousands of amazing events
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearAllFilters}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
              >
                <FaTimes className="text-sm" />
                <span className="text-sm">Clear</span>
              </motion.button>
            )}

            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isAdvancedOpen
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-gray-700/50 text-gray-400 hover:bg-gray-700/70"
              }`}
            >
              <FaFilter className="text-sm" />
              <span className="text-sm">Filters</span>
            </button>
          </div>
        </div>

        {/* Main Search Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <SearchInput
                placeholder="Search events, venues, artists..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <LocationInput
                placeholder="All Locations"
                value={location}
                onChange={setLocation}
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <DateInput value={date} onChange={setDate} />
            </motion.div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {isAdvancedOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-700/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full h-12 bg-[#050726] border border-[#1c2044] rounded-lg px-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Categories</option>
                        <option value="concert">Concerts</option>
                        <option value="sports">Sports</option>
                        <option value="theater">Theater</option>
                        <option value="comedy">Comedy</option>
                        <option value="festival">Festivals</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price Range
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              min: e.target.value,
                            }))
                          }
                          className="flex-1 h-12 bg-[#050726] border border-[#1c2044] rounded-lg px-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              max: e.target.value,
                            }))
                          }
                          className="flex-1 h-12 bg-[#050726] border border-[#1c2044] rounded-lg px-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Results Summary */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              key={eventCount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center space-x-2"
            >
              {isSearching ? (
                <div className="flex items-center space-x-2 text-blue-400">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Searching...</span>
                </div>
              ) : (
                <>
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
                    <span className="text-blue-400 font-semibold">
                      {eventCount}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {eventCount === 1 ? "event found" : "events found"}
                  </span>
                </>
              )}
            </motion.div>

            {hasActiveFilters && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Filters active</span>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

SearchBlock.propTypes = {
  onSearch: PropTypes.func,
  categoryId: PropTypes.string,
};

SearchBlock.defaultProps = {
  onSearch: () => {},
  categoryId: null,
};

export default SearchBlock;
