import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaHeart, FaShareAlt, FaRegSadTear, FaRegFrown } from "react-icons/fa";
import EventDetailToggle from './EventDetailToggle';
import TicketList from './TicketList';
import EventDetailTabContent from './EventDetailTabContent';
import { eventsById } from '../../data/events';

const EventDetail = () => {
  const { eventId } = useParams();
  const event = eventsById[eventId];
  const [activeTab, setActiveTab] = useState('about');
  const navigate = useNavigate();

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e21] px-4">
        <div className="bg-[#181c3a] rounded-2xl shadow-xl p-10 flex flex-col items-center max-w-md w-full">
          <FaRegFrown className="text-6xl text-blue-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Event Not Found</h1>
          <p className="text-gray-400 mb-6 text-center">
            Sorry, we couldn't find details for this event.<br />
            It may have been removed or the link is incorrect.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Format date in more compact way for mobile
  const formatCompactDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#0a0e21]">
      {/* Banner Section - Improved for mobile */}
      <div className="container mx-auto px-4 pt-28">
        <div className="relative h-[250px] sm:h-[400px] w-full rounded-2xl overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.eventName}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-70"></div>
          
          {/* Content area with better spacing for mobile */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-12">
            <div className="flex items-end justify-between w-full">
              <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight max-w-[75%] sm:max-w-[80%]">
                {event.eventName}
              </h1>
              <div className="flex space-x-2 sm:space-x-4 self-start sm:self-end mt-2 sm:mt-0">
                <button
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/90 border border-gray-200 text-black text-sm sm:text-xl transition hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  onClick={() => console.log('Share event')}
                  aria-label="Share Event"
                >
                  <FaShareAlt />
                </button>
                <button
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/90 border border-gray-200 text-black text-sm sm:text-xl transition hover:bg-pink-600 hover:text-white hover:border-pink-600"
                  onClick={() => console.log('Add to favourites')}
                  aria-label="Add to Favourites"
                >
                  <FaHeart />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Event Details - Compact row for mobile */}
        <div className="flex items-center justify-start space-x-4 overflow-x-auto pb-2 mb-8 sm:mb-16 text-gray-400 no-scrollbar">
          <div className="flex items-center whitespace-nowrap flex-shrink-0">
            <FaCalendarAlt className="mr-1 sm:mr-2 text-blue-500 text-sm sm:text-base" />
            <span className="text-xs sm:text-base">
              <span className="hidden sm:inline">{formatDate(event.eventDate)}</span>
              <span className="sm:hidden">{formatCompactDate(event.eventDate)}</span>
            </span>
          </div>
          <span className="text-gray-500">•</span>
          <div className="flex items-center whitespace-nowrap flex-shrink-0">
            <FaClock className="mr-1 sm:mr-2 text-blue-500 text-sm sm:text-base" />
            <span className="text-xs sm:text-base">{formatTime(event.eventDate)}</span>
          </div>
          <span className="text-gray-500">•</span>
          <div className="flex items-center whitespace-nowrap flex-shrink-0">
            <FaMapMarkerAlt className="mr-1 sm:mr-2 text-blue-500 text-sm sm:text-base" />
            <span className="text-xs sm:text-base">{event.location}</span>
          </div>
        </div>

        <EventDetailToggle activeTab={activeTab} onTabChange={setActiveTab} />

        <EventDetailTabContent tab={activeTab} event={event} />

        {/* Only show TicketList for Rock Night Live (e1) for now */}
        {eventId === 'e1' && <TicketList eventId={eventId} />}
        
      </div>
    </div>
  );
};

export default EventDetail; 