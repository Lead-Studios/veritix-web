import React, { useState, useEffect } from "react";
import SearchInput from "./SearchInput";
import LocationInput from "./LocationInput";
import DateInput from "./DateInput";
import { categories } from "../../data/categoryData";

const SearchBlock = ({ onSearch = () => {} }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [eventCount, setEventCount] = useState(0);
  const [results, setResults] = useState([]);

  // Get total events from all categories
  useEffect(() => {
    let count = 0;
    let allEvents = [];
    
    categories.forEach(category => {
      if (category.events && category.events.length) {
        count += category.events.length;
        allEvents = [...allEvents, ...category.events];
      }
    });
    
    setEventCount(count);
    setResults(allEvents);
  }, []);

  // Filter events based on search criteria
  const handleSearch = () => {
    let filteredEvents = [];
    let count = 0;
    
    categories.forEach(category => {
      if (category.events && category.events.length) {
        const filtered = category.events.filter(event => {
          // Filter by search query
          const matchesQuery = searchQuery === "" || 
            event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());
          
          // Filter by location
          const matchesLocation = location === "" || 
            event.location.toLowerCase().includes(location.toLowerCase());
          
          // Filter by date (simplified for demo purposes)
          const matchesDate = date === "" || 
            new Date(event.eventDate).toLocaleDateString().includes(date);
          
          return matchesQuery && matchesLocation && matchesDate;
        });
        
        count += filtered.length;
        filteredEvents = [...filteredEvents, ...filtered];
      }
    });
    
    setEventCount(count);
    setResults(filteredEvents);
    onSearch(filteredEvents);
  };

  // Trigger search on any filter change
  useEffect(() => {
    handleSearch();
  }, [searchQuery, location, date]);

  return (
    <div className="bg-[#0a0e21] py-10">
      <div className="container mx-auto px-4">
        <div className="bg-[#0f1334] rounded-xl p-10 shadow-lg border border-[#1c2044]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Search Input Component */}
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
            />
            
            {/* Location Input Component */}
            <LocationInput
              value={location}
              onChange={setLocation}
            />
            
            {/* Date Input Component */}
            <DateInput
              value={date}
              onChange={setDate}
            />
          </div>
          
          {/* Results Count */}
          <div className="flex justify-end">
            <p className="text-white">{eventCount} events found</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBlock; 