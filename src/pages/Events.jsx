import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import DiscoverCategories from "../components/categories/DiscoverCategories";
import NFTInfoSection from "../components/nft/NFTInfoSection";
import EventList from "../components/events/EventList";
import SearchBlock from "../components/search/SearchBlock";
import EventToggle from "../components/events/EventToggle";
import { eventsById, validateEvent } from "../data/events";
import { FaTh, FaList, FaSort } from "react-icons/fa";

function Events() {
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("date"); // date, price, popularity

  // Initial load of all events
  useEffect(() => {
    try {
      console.log("Loading events data:", eventsById);
      let allEventObjects = Object.values(eventsById).filter(validateEvent);
      console.log("Valid events:", allEventObjects);

      if (allEventObjects.length === 0) {
        console.warn("No valid events found in data.");
      }

      setFilteredEvents(allEventObjects);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((results) => {
    setSearchResults(results);
  }, []);

  useEffect(() => {
    let events = [];

    if (searchResults.length > 0) {
      events = searchResults;
    } else {
      events = Object.values(eventsById).filter(validateEvent);
    }

    console.log(`Pre-filtered events: ${events.length}`, events);

    switch (activeTab) {
      case "upcoming":
        events = [...events].sort(
          (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
        );
        break;
      case "featured":
        events = events.filter((event) => event.isTrending === true);
        break;
      default:
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case "price":
        events = [...events].sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^0-9.]/g, "") || 0);
          const priceB = parseFloat(b.price?.replace(/[^0-9.]/g, "") || 0);
          return priceA - priceB;
        });
        break;
      case "popularity":
        events = [...events].sort(
          (a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0)
        );
        break;
      case "date":
      default:
        events = [...events].sort(
          (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
        );
        break;
    }

    console.log(
      `Final filtered events for "${activeTab}" tab: ${events.length}`,
      events
    );
    setFilteredEvents(events);
  }, [searchResults, activeTab, sortBy]);

  const noEventsMessage = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center text-gray-400 py-16"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-content">
        <FaTh className="text-3xl text-gray-600" />
      </div>
      <p className="text-2xl font-semibold mb-2">No events found</p>
      <p className="text-gray-500">
        Try adjusting your filters or check back later for new events
      </p>
    </motion.div>
  );

  return (
    <>
      <Hero />

      <DiscoverCategories />

      {/* Enhanced Events Section */}
      <div className="bg-[#0a0e21] pt-8 sm:pt-16 pb-12 sm:pb-20">
        <div className="container mx-auto px-4">
          {/* Modern Header with Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-4"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {activeTab === "upcoming"
                  ? "Upcoming Events"
                  : "Featured Events"}
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full ml-4"></div>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base mb-6">
              {activeTab === "upcoming"
                ? "Discover the best upcoming events from all categories"
                : "Hand-picked featured events you won't want to miss"}
            </p>

            {/* Event Count Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full border border-blue-500/30">
              <span className="text-blue-400 font-medium">
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "Event" : "Events"} Found
              </span>
            </div>
          </motion.div>

          {/* Enhanced Search Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 sm:mb-12"
          >
            <SearchBlock onSearch={handleSearch} />
          </motion.div>

          {/* Controls Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 sm:mb-12"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Event Toggle */}
              <div className="w-full lg:w-auto">
                <EventToggle activeTab={activeTab} onTabChange={setActiveTab} />
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#0d1128] border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 appearance-none pr-8"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="price">Sort by Price</option>
                    <option value="popularity">Sort by Popularity</option>
                  </select>
                  <FaSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-[#0d1128] rounded-lg border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 transition-colors ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 transition-colors ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Event List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {loading ? (
              <div className="text-center text-gray-400 py-16">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-xl">Loading events...</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              <EventList events={filteredEvents} viewMode={viewMode} />
            ) : (
              noEventsMessage
            )}
          </motion.div>
        </div>
      </div>

      <NFTInfoSection />
    </>
  );
}

export default Events;
