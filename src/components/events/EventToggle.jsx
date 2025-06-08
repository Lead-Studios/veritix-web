import { motion } from "framer-motion";
import PropTypes from "prop-types";

const EventToggle = ({ activeTab, onTabChange }) => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-1 border border-gray-700/50 shadow-2xl">
      {/* Background slider */}
      <motion.div
        className="absolute top-1 bottom-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg"
        initial={false}
        animate={{
          left: activeTab === "upcoming" ? "4px" : "50%",
          width: "calc(50% - 4px)",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />

      <div className="relative flex w-full">
        <button
          className={`relative z-10 py-4 px-8 w-1/2 font-semibold text-sm transition-all duration-300 rounded-xl flex items-center justify-center gap-2 ${
            activeTab === "upcoming"
              ? "text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => onTabChange("upcoming")}
        >
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            Upcoming Events
          </motion.div>
        </button>

        <button
          className={`relative z-10 py-4 px-8 w-1/2 font-semibold text-sm transition-all duration-300 rounded-xl flex items-center justify-center gap-2 ${
            activeTab === "featured"
              ? "text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => onTabChange("featured")}
        >
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </motion.div>
        </button>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 pointer-events-none" />
    </div>
  );
};

EventToggle.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default EventToggle;
