import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import DiscoverCategories from "../components/categories/DiscoverCategories";
import NFTInfoSection from "../components/nft/NFTInfoSection";
import EventList from "../components/events/EventList";
import SearchBlock from "../components/search/SearchBlock";
import EventToggle from "../components/events/EventToggle";
import { categories } from "../data/categoryData";

function Events() {
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");

  // Handle search results
  const handleSearch = (results) => {
    setSearchResults(results);
  };

  // Apply filters based on search results and active tab
  useEffect(() => {
    let events = [...searchResults];
    
    // If no search results yet, get all events
    if (events.length === 0) {
      categories.forEach(category => {
        if (category.events && category.events.length) {
          events = [...events, ...category.events];
        }
      });
    }
    
    // Apply tab filter
    if (activeTab === "upcoming") {
      // Sort by date (newest first)
      events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    } else if (activeTab === "featured") {
      // Filter to only featured events
      events = events.filter(event => event.isFeatured);
    }
    
    setFilteredEvents(events);
  }, [searchResults, activeTab]);

  return (
    <>
      <Hero />
      
      <DiscoverCategories />
      
      {/* All Events Section */}
      <div className="bg-[#0a0e21] pt-16 pb-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {activeTab === "upcoming" ? "Upcoming Events" : "Featured Events"}
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {activeTab === "upcoming" 
                ? "Discover the best upcoming events from all categories" 
                : "Browse our featured and highlighted events"}
            </p>
          </div>
          
          <EventList customEvents={filteredEvents.length > 0 ? filteredEvents : null} />
        </div>
      </div>
      
      <NFTInfoSection />
    </>
  );
}

export default Events;
