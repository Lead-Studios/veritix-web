import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import DiscoverCategories from "../components/categories/DiscoverCategories";
import NFTInfoSection from "../components/nft/NFTInfoSection";
import EventList from "../components/events/EventList";
import SearchBlock from "../components/search/SearchBlock";
import EventToggle from "../components/events/EventToggle";
import { categories } from "../data/categoryData";
import { eventsById, validateEvent } from "../data/events";

function Events() {
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  // Initial load of all events
  useEffect(() => {
    try {
      console.log("Loading events data:", eventsById);
      // Get events as an array and make sure they're valid
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

  // Handle search results
  const handleSearch = (results) => {
    setSearchResults(results);
  };

  // Apply filters based on search results and active tab
  useEffect(() => {
    let events = [];
    
    if (searchResults.length > 0) {
      // If we have search results, use those
      events = searchResults;
    } else {
      // Otherwise get all events from the eventsById object
      events = Object.values(eventsById).filter(validateEvent);
    }
    
    console.log(`Pre-filtered events: ${events.length}`, events);
    
    // Apply tab filter
    switch (activeTab) {
      case "upcoming":
        // Sort by date (newest first)
        events = [...events].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        console.log("Sorted upcoming events:", events);
        break;
      case "featured":
        // Filter to trending events since we don't have isFeatured property
        events = events.filter(event => event.isTrending === true);
        console.log("Filtered featured events:", events);
        break;
      default:
        break;
    }
    
    console.log(`Final filtered events for "${activeTab}" tab: ${events.length}`, events);
    setFilteredEvents(events);
  }, [searchResults, activeTab]);

  // No events message consistent across both tabs
  const noEventsMessage = (
    <div className="text-center text-gray-400 py-12">
      <p className="text-xl">No events found</p>
      <p className="mt-2">Check back later for upcoming events</p>
    </div>
  );

  return (
    <>
      <Hero />
      
      <DiscoverCategories />
      
      {/* All Events Section */}
      <div className="bg-[#0a0e21] pt-8 sm:pt-16 pb-12 sm:pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              {activeTab === "upcoming" ? "Upcoming Events" : "Featured Events"}
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-blue-500 mx-auto mb-3 sm:mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              {activeTab === "upcoming" 
                ? "Discover the best upcoming events from all categories" 
                : "Browse our featured and highlighted events"}
            </p>
          </div>
          
          {/* Search Block */}
          <div className="mb-6 sm:mb-8">
            <SearchBlock onSearch={handleSearch} />
          </div>
          
          {/* Event Toggle */}
          <div className="mb-8 sm:mb-12">
            <EventToggle activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          
          {loading ? (
            <div className="text-center text-gray-400 py-8 sm:py-12">
              <p className="text-lg sm:text-xl">Loading events...</p>
            </div>
          ) : filteredEvents && filteredEvents.length > 0 ? (
            <EventList customEvents={filteredEvents} />
          ) : (
            noEventsMessage
          )}
        </div>
      </div>
      
      <NFTInfoSection />
    </>
  );
}

export default Events;
