import React from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";

const EventCard = ({ imageUrl, eventName, eventDate, location, price }) => {
  // Format the date string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Extract time from date string
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const endHours = (hours + 3) % 24; // Assuming events last 3 hours
    const endAmpm = endHours >= 12 ? 'PM' : 'AM';
    const formattedEndHours = endHours % 12 || 12;
    
    return `${formattedHours}:${formattedMinutes} ${ampm} - ${formattedEndHours}:${formattedMinutes} ${endAmpm}`;
  };

  const defaultImage = "/Images/placeholder.png";

  return (
    <div className="w-full bg-[#0d1128] rounded-xl overflow-hidden mb-4 hover:shadow-lg transition-all border border-[#1c2044] hover:border-blue-500">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="w-full md:w-72 h-56 md:h-64 overflow-hidden">
          <img 
            src={imageUrl || defaultImage} 
            alt={eventName} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = defaultImage }}
          />
        </div>
        
        {/* Content */}
        <div className="flex-grow p-6 flex flex-col md:flex-row justify-between">
          {/* Event Details */}
          <div className="md:pr-6">
            <h3 className="text-white font-semibold text-2xl mb-4">{eventName}</h3>
            
            <div className="flex items-center text-gray-400 text-sm mb-3">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              {formatDate(eventDate)}
            </div>
            
            <div className="flex items-center text-gray-400 text-sm mb-3">
              <FaClock className="mr-2 text-blue-500" />
              {formatTime(eventDate)}
            </div>
            
            <div className="flex items-center text-gray-400 text-sm">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              {location}
            </div>
          </div>
          
          {/* Price and Button */}
          <div className="mt-6 md:mt-0 flex flex-col items-end justify-between">
            <div className="text-indigo-500 font-bold text-xl text-right">
              {price || "0.05 ETH"}
            </div>
            
            <button className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-medium py-3 px-8 rounded-full text-sm transition-all duration-300">
              Get Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
