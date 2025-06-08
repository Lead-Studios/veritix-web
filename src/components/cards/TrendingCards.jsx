import { motion } from "framer-motion";
import PropTypes from "prop-types";

function TrendingCards({ type, title, amount, time, color }) {
  return (
    <motion.div
      className="h-[350px] rounded-[24px] relative flex items-center justify-center w-full bg-gradient-to-br from-[#00FFA01A] via-[#E7FDFF0A] to-[#00FFA008] hover:from-[#E7FDFF] hover:via-[#00FFA015] hover:to-[#000625] group transition-all duration-700 cursor-pointer shadow-[0_8px_32px_rgba(0,255,160,0.12)] hover:shadow-[0_20px_60px_rgba(0,255,160,0.25)] border border-[#00FFA0]/20 hover:border-[#00FFA0]/50 backdrop-blur-sm overflow-hidden"
      whileHover={{
        scale: 1.03,
        y: -8,
        rotateX: 2,
        rotateY: 2,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Modern gradient overlay with animated patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00FFA0]/5 via-transparent to-[#E7FDFF]/8 rounded-[24px] opacity-60 group-hover:opacity-100 transition-all duration-700" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-all duration-1000">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#00FFA0]/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>

      {/* Top section with enhanced styling */}
      <div className="z-30 px-[4%] flex-row flex absolute w-full justify-between top-6">
        <motion.button
          className={`px-5 py-2.5 ${
            color
              ? color
              : "bg-gradient-to-r from-[#013237] to-[#015a63] text-[#F6E8DF]"
          } rounded-[12px] font-semibold text-sm transition-all duration-400 shadow-[0_4px_16px_rgba(1,50,55,0.3)] hover:shadow-[0_8px_24px_rgba(1,50,55,0.4)]
          group-hover:bg-gradient-to-r group-hover:from-[#00FFA0] group-hover:to-[#00e691] group-hover:text-[#013237] group-hover:scale-105 backdrop-blur-sm border border-white/10 group-hover:border-[#00FFA0]/30`}
          whileHover={{ scale: 1.08, y: -1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {type}
        </motion.button>

        <div className="flex flex-row gap-3 items-center">
          <motion.div
            className="p-2 rounded-[10px] bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.img
              src="/Images/1564530_arrow_next_share_direction_icon 1.svg"
              className="w-[20px] h-[20px] transition-all duration-300 group-hover:brightness-150 filter drop-shadow-sm"
              alt="Share"
              whileHover={{
                rotate: 15,
                filter:
                  "brightness(1.5) drop-shadow(0 0 8px rgba(0,255,160,0.5))",
              }}
            />
          </motion.div>

          <motion.div
            className="p-2 rounded-[10px] bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.img
              src="/Images/icons.svg"
              className="w-[20px] h-[20px] transition-all duration-300 group-hover:scale-110 filter drop-shadow-sm"
              alt="Options"
              whileHover={{
                rotate: -15,
                filter: "drop-shadow(0 0 8px rgba(0,255,160,0.5))",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Enhanced main image with modern effects */}
      <motion.img
        src="/Images/panaParty.svg"
        alt="Event illustration"
        className="w-full h-auto top-12 absolute transition-all duration-700 group-hover:opacity-95 filter drop-shadow-lg"
        initial={{ scale: 1, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
        whileHover={{
          scale: 1.02,
          filter: "drop-shadow(0 8px 16px rgba(0,255,160,0.15))",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Modern glass morphism content card */}
      <motion.div
        className="w-[92%] lg:top-[195px] top-[205px] bg-gradient-to-br from-[#F6E8DF]/60 via-[#F6E8DF]/40 to-[#F6E8DF]/60 backdrop-blur-xl h-[135px] absolute rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-700 group-hover:bg-gradient-to-br group-hover:from-[#F6E8DF]/80 group-hover:via-[#F6E8DF]/60 group-hover:to-[#F6E8DF]/80 group-hover:shadow-[0_16px_48px_rgba(0,255,160,0.15)] border border-white/30 group-hover:border-[#00FFA0]/40 group-hover:backdrop-blur-2xl"
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ duration: 0.4 }}
      >
        {/* Content header with improved typography */}
        <div className="px-5 py-4 flex flex-row gap-4 justify-between items-start w-full">
          <motion.p
            className="text-lg font-bold leading-tight text-[#013237] group-hover:text-[#013237] transition-all duration-300 tracking-tight"
            whileHover={{ scale: 1.02, x: 2 }}
            style={{ fontWeight: 700 }}
          >
            {title}
          </motion.p>
          <motion.p
            className="font-medium text-sm leading-tight text-[#013237]/80 group-hover:text-[#013237] transition-all duration-300 bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            {time}
          </motion.p>
        </div>

        {/* Enhanced action buttons */}
        <div className="px-3 sm:px-5 py-1 sm:py-2 flex flex-row items-center justify-between gap-2 sm:gap-4">
          <motion.div
            className="flex-row flex gap-2 sm:gap-3 items-center bg-gradient-to-r from-[#E7FDFF]/90 to-[#E7FDFF]/70 p-2 sm:p-3 rounded-[12px] sm:rounded-[14px] border border-[#00FFA0]/20 transition-all duration-400
            group-hover:border-[#00FFA0]/50 group-hover:bg-gradient-to-r group-hover:from-[#E7FDFF] group-hover:to-[#E7FDFF]/90 group-hover:shadow-[0_4px_16px_rgba(0,255,160,0.2)] hover:scale-105 cursor-pointer backdrop-blur-sm min-w-0 w-fit"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <motion.img
              src="/Images/8679214_coupon_ticket_icon 1.svg"
              alt="Ticket"
              className="filter drop-shadow-sm w-4 h-4 sm:w-auto sm:h-auto flex-shrink-0"
              whileHover={{ rotate: 8, scale: 1.1 }}
            />
            <p className="font-semibold text-[#013237] text-xs sm:text-sm truncate">
              {amount}
            </p>
          </motion.div>

          <motion.div
            className="flex-row flex gap-2 sm:gap-3 items-center bg-gradient-to-r from-[#013237] to-[#015a63] p-2 sm:p-3 rounded-[12px] sm:rounded-[14px] transition-all duration-400
            group-hover:bg-gradient-to-r group-hover:from-[#00FFA0] group-hover:to-[#00e691] hover:scale-105 cursor-pointer shadow-[0_4px_16px_rgba(1,50,55,0.3)] hover:shadow-[0_8px_24px_rgba(0,255,160,0.3)] border border-white/10 group-hover:border-[#00FFA0]/30 justify-center sm:justify-start w-fit"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[#F9F9F9] text-xs sm:text-sm font-semibold group-hover:text-[#013237] transition-colors duration-300 tracking-wide whitespace-nowrap">
              More Info
            </p>
            <motion.div
              className="w-1 h-1 bg-[#F9F9F9] rounded-full group-hover:bg-[#013237] transition-colors duration-300 flex-shrink-0"
              whileHover={{ scale: 1.5 }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced glow effects */}
      <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-30 transition-all duration-700 bg-gradient-to-r from-[#00FFA0]/8 via-transparent to-[#E7FDFF]/8 pointer-events-none" />

      {/* Subtle inner glow */}
      <div className="absolute inset-[1px] rounded-[23px] opacity-0 group-hover:opacity-40 transition-all duration-500 bg-gradient-to-t from-transparent via-[#00FFA0]/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}

TrendingCards.propTypes = {
  type: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export default TrendingCards;
