// import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const CategoryCard = ({ icon, title, description, count, id, isMobile }) => {
  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    hover: {
      opacity: 1,
      scale: 1.2,
      transition: { duration: 0.3 },
    },
  };

  // Responsive design - more compact for mobile horizontal scroll
  if (isMobile) {
    return (
      <motion.div
        className="relative flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-[#0a0e21] via-[#0f1429] to-[#1a1f3a] border border-[#1c2044]/50 backdrop-blur-sm overflow-hidden group cursor-pointer h-44 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 rounded-2xl"
          variants={glowVariants}
        />

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
          <div className="absolute top-8 right-4 w-0.5 h-0.5 bg-purple-400 rounded-full animate-pulse delay-300" />
          <div className="absolute bottom-4 left-6 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-pulse delay-700" />
        </div>

        {/* Enhanced count badge */}
        <motion.div
          className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1.5 rounded-full z-20 shadow-lg font-semibold"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {count}+
        </motion.div>

        {/* Animated icon */}
        <motion.div
          className="text-blue-400 mb-2 text-3xl relative z-10"
          variants={iconVariants}
        >
          {icon}
        </motion.div>

        {/* Enhanced typography */}
        <motion.h3
          className="text-blue-300 font-bold text-base mb-1 relative z-10 group-hover:text-blue-200 transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          {title}
        </motion.h3>

        <p className="text-gray-400 text-xs text-center line-clamp-2 relative z-10 group-hover:text-gray-300 transition-colors">
          {description}
        </p>

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

        <Link
          to={`/category/${id}`}
          className="absolute inset-0 z-10"
          aria-label={`View ${title} category`}
        />
      </motion.div>
    );
  }

  // Enhanced desktop design
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-br from-[#0a0e21] via-[#0f1429] to-[#1a1f3a] border border-[#1c2044]/50 backdrop-blur-sm overflow-hidden group cursor-pointer h-72 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-purple-500/8 to-cyan-500/12 rounded-3xl"
        variants={glowVariants}
      />

      {/* Enhanced floating particles */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <div className="absolute top-12 right-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-8 left-12 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-16 right-6 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-1000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3e%3cpath d='m 40 0 l 0 40 m -40 0 l 40 0' fill='none' stroke='%23ffffff' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`,
          }}
        />
      </div>

      {/* Enhanced count badge with glow */}
      <motion.div
        className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white text-sm px-4 py-2 rounded-full z-20 shadow-lg font-bold backdrop-blur-sm border border-white/20"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        }}
      >
        {count}+
      </motion.div>

      {/* Large animated icon with glow */}
      <motion.div
        className="text-blue-400 mb-6 text-6xl relative z-10 filter drop-shadow-lg"
        variants={iconVariants}
        style={{
          filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))",
        }}
      >
        {icon}
      </motion.div>

      {/* Enhanced title with gradient */}
      <motion.h3
        className="bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent font-bold text-2xl mb-3 relative z-10 text-center"
        whileHover={{ scale: 1.05 }}
      >
        {title}
      </motion.h3>

      {/* Enhanced description */}
      <p className="text-gray-400 text-sm text-center relative z-10 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed max-w-xs">
        {description}
      </p>

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Enhanced shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-in-out" />

      {/* Hover indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
      />

      <Link
        to={`/category/${id}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${title} category`}
      />
    </motion.div>
  );
};

// PropTypes validation
CategoryCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
};

CategoryCard.defaultProps = {
  isMobile: false,
};

export default CategoryCard;
