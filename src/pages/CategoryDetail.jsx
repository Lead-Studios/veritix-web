import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { categories } from "../data/categoryData";
import EventList from "../components/events/EventList";
import SearchBlock from "../components/search/SearchBlock";
import EventToggle from "../components/events/EventToggle";

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
    if (foundCategory) {
      setCategory(foundCategory);
      setSearchResults(foundCategory.events || []);
    }
    setLoading(false);
  }, [id]);

  // Handle search results
  const handleSearch = (results) => {
    // Only include results from this category
    if (category) {
      const categoryResults = results.filter(event => 
        category.events.some(catEvent => catEvent.id === event.id)
      );
      setSearchResults(categoryResults);
    }
  };

  // Apply filters based on search results and active tab
  useEffect(() => {
    if (!category) return;
    
    let events = [...searchResults];
    
    // If no search results, use all category events
    if (events.length === 0 && category.events) {
      events = [...category.events];
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
  }, [searchResults, activeTab, category]);

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

  return (
    <div 
      className="bg-[#0a0e21] min-h-screen" 
      style={{ marginTop: '-20px' }}
    >
      {/* Category Banner */}
      <div className="container mx-auto px-4 pt-12">
        <div className="relative w-full h-[400px] overflow-hidden rounded-2xl shadow-lg">
          <img 
            src={category.imageUrl} 
            alt={category.name} 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-[#0a0e21] opacity-60"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 
              className="text-6xl md:text-7xl font-bold uppercase tracking-widest bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent"
              style={{ 
                letterSpacing: '0.1em',
                fontFamily: 'sans-serif'
              }}
            >
              {category.name}
            </h1>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mt-8 mb-4">
        <SearchBlock onSearch={handleSearch} />
      </div>
      
      {/* Event Toggle */}
      <div className="bg-[#0a0e21] pb-8">
        <div className="container mx-auto px-4">
          <EventToggle activeTab={activeTab} onTabChange={setActiveTab} />
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

        {/* Events List */}
        <EventList customEvents={filteredEvents.length > 0 ? filteredEvents : null} />
      </div>
    </div>
  );
};

export default CategoryDetail; 