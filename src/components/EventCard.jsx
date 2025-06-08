import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaHeart,
  FaShare,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const EventCard = ({
  id,
  imageUrl,
  eventName,
  eventDate,
  location,
  price,
  viewMode = "grid",
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const endHours = (hours + 3) % 24;
    const endAmpm = endHours >= 12 ? "PM" : "AM";
    const formattedEndHours = endHours % 12 || 12;

    return `${formattedHours}:${formattedMinutes} ${ampm} - ${formattedEndHours}:${formattedMinutes} ${endAmpm}`;
  };

  const defaultImage = "/Images/placeholder.png";

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02 }}
        className="w-full bg-gradient-to-r from-[#0d1128] to-[#1a1f3a] rounded-2xl overflow-hidden border border-[#1c2044] hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-80 h-56 md:h-64 overflow-hidden">
            <img
              src={imageUrl || defaultImage}
              alt={eventName}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Action Buttons */}
            <div
              className={`absolute top-4 right-4 flex space-x-2 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsLiked(!isLiked);
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isLiked
                    ? "bg-red-500 text-white"
                    : "bg-black/30 text-white hover:bg-red-500"
                }`}
              >
                <FaHeart className="text-sm" />
              </button>
              <button className="p-2 rounded-full bg-black/30 text-white hover:bg-blue-500 backdrop-blur-sm transition-colors">
                <FaShare className="text-sm" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow p-6 flex flex-col md:flex-row justify-between">
            {/* Event Details */}
            <div className="md:pr-6 flex-grow">
              <h3 className="text-white font-bold text-2xl mb-4 hover:text-blue-400 transition-colors">
                {eventName}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center text-gray-400 text-sm">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <FaCalendarAlt className="text-blue-400 text-xs" />
                  </div>
                  <span>{formatDate(eventDate)}</span>
                </div>

                <div className="flex items-center text-gray-400 text-sm">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                    <FaClock className="text-green-400 text-xs" />
                  </div>
                  <span>{formatTime(eventDate)}</span>
                </div>

                <div className="flex items-center text-gray-400 text-sm">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                    <FaMapMarkerAlt className="text-purple-400 text-xs" />
                  </div>
                  <span>{location}</span>
                </div>
              </div>
            </div>

            {/* Price and Button */}
            <div className="mt-6 md:mt-0 flex flex-col items-end justify-between min-w-[140px]">
              <div className="text-right mb-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  {price || "0.05 ETH"}
                </div>
                <div className="text-gray-500 text-sm">Starting from</div>
              </div>

              <Link
                to={`/event/${id}`}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Tickets
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view (card format)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-gradient-to-br from-[#0d1128] to-[#1a1f3a] rounded-2xl overflow-hidden border border-[#1c2044] hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl || defaultImage}
          alt={eventName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Price Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
            {price || "0.05 ETH"}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`absolute top-4 right-4 flex space-x-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isLiked
                ? "bg-red-500 text-white"
                : "bg-black/30 text-white hover:bg-red-500"
            }`}
          >
            <FaHeart className="text-sm" />
          </button>
          <button className="p-2 rounded-full bg-black/30 text-white hover:bg-blue-500 backdrop-blur-sm transition-colors">
            <FaShare className="text-sm" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-white font-bold text-xl mb-3 hover:text-blue-400 transition-colors line-clamp-2">
          {eventName}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-400 text-sm">
            <FaCalendarAlt className="mr-2 text-blue-400" />
            <span>{formatDate(eventDate)}</span>
          </div>

          <div className="flex items-center text-gray-400 text-sm">
            <FaClock className="mr-2 text-green-400" />
            <span>{formatTime(eventDate)}</span>
          </div>

          <div className="flex items-center text-gray-400 text-sm">
            <FaMapMarkerAlt className="mr-2 text-purple-400" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <Link
          to={`/event/${id}`}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 block text-center"
        >
          Get Tickets
        </Link>
      </div>
    </motion.div>
  );
};

EventCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  imageUrl: PropTypes.string,
  eventName: PropTypes.string.isRequired,
  eventDate: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  viewMode: PropTypes.oneOf(["grid", "list"]),
};

EventCard.defaultProps = {
  imageUrl: "/Images/placeholder.png",
  viewMode: "grid",
};

export default EventCard;
