import { useState } from "react";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const LocationInput = ({ value, onChange, placeholder = "Location" }) => {
  const [isFocused, setIsFocused] = useState(false);

  const clearLocation = () => {
    onChange("");
  };

  return (
    <motion.div
      className="relative h-16 group"
      whileHover={{ scale: 1.01 }}
      whileFocus={{ scale: 1.01 }}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg blur-sm transition-opacity duration-300 ${
          isFocused ? "opacity-100" : "opacity-0 group-hover:opacity-50"
        }`}
      ></div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none z-10">
          <FaMapMarkerAlt
            className={`text-lg transition-colors duration-200 ${
              isFocused ? "text-green-400" : "text-gray-400"
            }`}
          />
        </div>

        <input
          type="text"
          className="block w-full h-full bg-[#050726]/80 backdrop-blur-sm border border-[#1c2044] rounded-lg py-4 pl-14 pr-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 focus:outline-none transition-all duration-200 hover:border-gray-600"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clearLocation}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors duration-200"
            type="button"
          >
            <FaTimes className="text-sm" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

LocationInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

LocationInput.defaultProps = {
  placeholder: "Location",
};

export default LocationInput;
