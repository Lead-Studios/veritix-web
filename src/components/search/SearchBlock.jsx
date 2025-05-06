import React, { useState, useEffect } from "react";
import SearchInput from "./SearchInput";
import LocationInput from "./LocationInput";
import DateInput from "./DateInput";
import { categories } from "../../data/categoryData";
import { eventsById, validateEvent } from "../../data/events";

const SearchBlock = ({ onSearch = () => {}, categoryId = null }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [eventCount, setEventCount] = useState(0);
  const [results, setResults] = useState([]);

  // Get total events based on category
  useEffect(() => {
    let allEvents = [];
    
    // Only show events for Concert category
    if (categoryId === "cat-1") {
      // If searching within Concert category
      const category = categories.find(cat => cat.id === categoryId);
      if (category && category.events) {
        const categoryEvents = category.events
          .map(eventId => eventsById[eventId])
          .filter(Boolean)
          .filter(validateEvent);
        allEvents = categoryEvents;
      }
    } else if (!categoryId) {
      // On the main events page, show all events
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
    
    setEventCount(allEvents.length);
    setResults(allEvents);
    onSearch(allEvents);
  }, [categoryId]);

  // Filter events based on search criteria
  const handleSearch = () => {
    // Get all event objects
    let allEvents = [];
    
    // Only show events for Concert category
    if (categoryId === "cat-1") {
      // If searching within Concert category
      const category = categories.find(cat => cat.id === categoryId);
      if (category && category.events) {
        allEvents = category.events
          .map(eventId => eventsById[eventId])
          .filter(Boolean)
          .filter(validateEvent);
      }
    } else if (!categoryId) {
      // On the main events page, show all events
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
    
    // Apply filters
    const filteredEvents = allEvents.filter(event => {
      // Filter by search query (event name, description, or location)
      const matchesQuery = searchQuery === "" || 
        (event.eventName && event.eventName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by location
      const matchesLocation = location === "" || 
        (event.location && event.location.toLowerCase().includes(location.toLowerCase()));
      
      // Filter by date
      const matchesDate = date === "" ||
        (event.eventDate && new Date(event.eventDate).toISOString().substring(0, 10) === date);
      
      return matchesQuery && matchesLocation && matchesDate;
    });
    
    console.log("Search results:", filteredEvents.length, filteredEvents);
    setEventCount(filteredEvents.length);
    setResults(filteredEvents);
    onSearch(filteredEvents);
  };

  // Trigger search on any filter change
  useEffect(() => {
    handleSearch();
  }, [searchQuery, location, date]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="bg-[#181c3a] rounded-xl p-4 xl:py-6 xl:px-8">
      <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-4">
        <div className="flex-grow">
          <SearchInput
            placeholder="Search events, venues, artists..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <div className="flex-grow">
          <LocationInput
            placeholder="All Locations"
            value={location}
            onChange={setLocation}
          />
        </div>
        <div className="flex-grow">
          <DateInput value={date} onChange={setDate} />
        </div>
      </form>
      <div className="mt-3 text-sm text-gray-400">
        <span>{eventCount} events found</span>
      </div>
    </div>
  );
};

export default SearchBlock; 