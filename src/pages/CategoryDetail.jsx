import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { categories } from "../data/categoryData";
import EventList from "../components/events/EventList";
import SearchBlock from "../components/search/SearchBlock";
import EventToggle from "../components/events/EventToggle";
import { eventsById, validateEvent } from "../data/events";

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    // Find the category that matches the id parameter
    const foundCategory = categories.find((cat) => cat.id === id);
    console.log("Category ID:", id);
    console.log("Found category:", foundCategory);
    
    if (foundCategory) {
      setCategory(foundCategory);
      
      // Only show events for the Concert category (cat-1)
      if (id === "cat-1") {
        // Get full event objects from event IDs
        const categoryEventIds = foundCategory.events || [];
        console.log("Category event IDs:", categoryEventIds);
        
        const fullEvents = categoryEventIds
          .map(eventId => {
            const event = eventsById[eventId];
            console.log(`Event ${eventId}:`, event);
            return event;
          })
          .filter(Boolean) // Filter out any undefined events
          .filter(validateEvent); // Validate events
          
        console.log("Full category events:", fullEvents);
        setFilteredEvents(fullEvents);
      } else {
        // For all other categories, show no events
        setFilteredEvents([]);
      }
    } else {
      console.warn("Category not found:", id);
    }
    setLoading(false);
  }, [id]);

  // Handle search results
  const handleSearch = (results) => {
    // Only include results for Concert category
    if (category && id === "cat-1") {
      const categoryResults = results.filter(event => 
        category.events && category.events.includes(event.id)
      );
      setSearchResults(categoryResults);
    } else {
      setSearchResults([]);
    }
  };

  // Apply filters based on search results and active tab
  useEffect(() => {
    if (!category) return;
    
    // Only process events for Concert category
    if (id !== "cat-1") {
      setFilteredEvents([]);
      return;
    }
    
    let events = [];
    
    if (searchResults.length > 0) {
      // If we have search results, use those
      events = searchResults;
    } else {
      // Use all category events
      events = category.events
        .map(eventId => eventsById[eventId])
        .filter(Boolean)
        .filter(validateEvent);
    }
    
    console.log(`Pre-filtered category events: ${events.length}`, events);
    
    // Apply tab filter
    if (activeTab === "upcoming") {
      // Sort by date (newest first)
      events = [...events].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
      console.log("Sorted category events:", events);
    } else if (activeTab === "featured") {
      // Filter to only trending events
      events = events.filter(event => event.isTrending === true);
      console.log("Featured category events:", events);
    }
    
    console.log(`Final category events for "${activeTab}" tab: ${events.length}`, events);
    setFilteredEvents(events);
  }, [searchResults, activeTab, category, id]);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0e21] flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>;
  }

  if (!category) {
    return <div className="min-h-screen bg-[#0a0e21] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Category not found</p>
        <Link to="/explore" className="text-blue-500 hover:text-blue-400">
          Return to categories
        </Link>
      </div>
    </div>;
  }

  const handleImageError = (e) => {
    e.target.src = "/Images/hero.png"; // Default fallback image
  };

  // For non-Concert categories, create a custom message
  const getCategorySpecificNoEventMessage = () => {
    if (id === "cat-1") {
      return (
        <>
          <p className="text-xl">No events found in this category</p>
          <p className="mt-2">Check back later for upcoming concerts</p>
        </>
      );
    }
    
    // Category-specific messages
    const messages = {
      "cat-2": "No festival events currently scheduled. Check back during festival season!",
      "cat-3": "Our workshop calendar is being updated. New workshops coming soon!",
      "cat-4": "Gaming tournaments are being organized. Stay tuned for exciting events!",
      "cat-5": "Culinary events will be added to our calendar shortly.",
      "cat-6": "Nightlife events are coming soon. Get ready for unforgettable nights!",
      "cat-7": "Fitness events are being planned. Keep your workout gear ready!",
      "cat-8": "Art exhibitions will be announced shortly. Express your creativity!",
      "cat-9": "Film screenings will be added to our calendar soon. Grab your popcorn!",
      "cat-10": "Networking events are being organized. Ready to make new connections?",
      "cat-11": "Exclusive events are by invitation only. Stay tuned for VIP access!",
      "cat-12": "Beach events will be scheduled for the summer season. Get your swimsuit ready!",
    };
    
    return (
      <>
        <p className="text-xl">Coming Soon</p>
        <p className="mt-2">{messages[id] || "Events for this category will be available soon."}</p>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0e21]">
      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] overflow-hidden bg-gradient-to-b from-[#0d1128] to-[#0a0e21]">
        <div className="absolute inset-0 opacity-40">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover object-center"
            onError={handleImageError}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0e21]"></div>
        
        <div className="absolute inset-0 flex items-center justify-center flex-col text-center px-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6">
            <category.icon className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            {category.name}
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl">
            {category.description}
          </p>
        </div>
      </div>
      
      {/* Category Content */}
      <div className="container mx-auto py-10 pb-40">
        {/* Breadcrumb */}
        <div className="px-4 mb-6">
          <Link to="/explore" className="text-blue-500 hover:text-blue-400">
            ← Back to categories
          </Link>
        </div>
        
        <div className="px-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {category.name} {activeTab === "upcoming" ? "Upcoming Events" : "Featured Events"}
          </h2>
          <p className="text-gray-300">{category.description}</p>
        </div>

        {/* Show search and toggle only for Concert category */}
        {id === "cat-1" && (
          <>
            {/* Search Block */}
            <div className="px-4 mb-8">
              <SearchBlock onSearch={handleSearch} categoryId={id} />
            </div>
            
            {/* Event Toggle */}
            <div className="px-4 mb-12">
              <EventToggle activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </>
        )}

        {/* Events List */}
        {filteredEvents.length > 0 ? (
          <EventList customEvents={filteredEvents} />
        ) : (
          <div className="text-center text-gray-400 py-12">
            {getCategorySpecificNoEventMessage()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail; 