import { motion } from "framer-motion";
import { TfiLocationPin } from "react-icons/tfi";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiTwitter,
} from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import PropTypes from "prop-types";
import {
  containerVariants,
  iconHoverVariants,
  itemVariants,
} from "../utils/animationVariants";

const ContactDetails = ({ inView }) => {
  const socialIcons = {
    linkedin: FiLinkedin,
    github: FiGithub,
    twitter: FiTwitter,
    discord: SiDiscord,
  };

  return (
    <motion.div
      className="lg:w-1/2 w-full mb-8 lg:mb-0 lg:pr-8 relative flex"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="w-full bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700 flex flex-col min-h-[600px]">
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white whitespace-nowrap overflow-hidden text-ellipsis"
          variants={itemVariants}
        >
          Get in Touch
        </motion.h1>

        <motion.p
          className="text-gray-300 mb-8 sm:mb-12 w-full text-base sm:text-lg leading-relaxed"
          variants={itemVariants}
        >
          Have questions about Veritix or need assistance with our
          blockchain-powered ticketing platform? Our team is here to help you
          revolutionize your event experience.
        </motion.p>

        <div className="space-y-6 sm:space-y-8 flex-1 flex flex-col justify-center">
          {/* Phone */}
          <motion.div className="flex items-center" variants={itemVariants}>
            <motion.div
              className="bg-blue-500/20 p-3 sm:p-4 rounded-2xl mr-4 sm:mr-6 border border-blue-400/20 flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FiPhone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-400" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg sm:text-xl text-white mb-1">
                Phone
              </h3>
              <p className="text-gray-400 text-base sm:text-lg break-all">
                +1 (555) 123-4567
              </p>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div className="flex items-center" variants={itemVariants}>
            <motion.div
              className="bg-cyan-500/20 p-3 sm:p-4 rounded-2xl mr-4 sm:mr-6 border border-cyan-400/20 flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FiMail className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-cyan-400" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg sm:text-xl text-white mb-1">
                Email
              </h3>
              <p className="text-gray-400 text-base sm:text-lg break-all">
                support@veritix.io
              </p>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div className="flex items-center" variants={itemVariants}>
            <motion.div
              className="bg-purple-500/20 p-3 sm:p-4 rounded-2xl mr-4 sm:mr-6 border border-purple-400/20 flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <TfiLocationPin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-purple-400" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg sm:text-xl text-white mb-1">
                Location
              </h3>
              <p className="text-gray-400 text-base sm:text-lg break-words">
                123 Blockchain Avenue, San Francisco, CA 94105
              </p>
            </div>
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div
          className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 mt-8 sm:mt-12 justify-center sm:justify-start"
          variants={itemVariants}
        >
          {["linkedin", "github", "twitter", "discord"].map((social, index) => {
            const IconComponent = socialIcons[social];
            const colors = {
              linkedin: "from-blue-500 to-blue-600",
              github: "from-gray-500 to-gray-600",
              twitter: "from-sky-500 to-sky-600",
              discord: "from-indigo-500 to-indigo-600",
            };

            return (
              <motion.a
                key={social}
                href="#"
                className={`bg-gradient-to-br ${colors[social]} p-3 sm:p-4 rounded-2xl transition-all duration-300 flex-shrink-0`}
                variants={iconHoverVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.1 * index, duration: 0.5 },
                }}
              >
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

ContactDetails.propTypes = {
  inView: PropTypes.bool.isRequired,
};

export default ContactDetails;
