import React, { useEffect } from "react";
import image from "../assets/image.png";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer"; 

function Home() {
  const controls = useAnimation(); 
  const [ref, inView] = useInView({
    threshold: 0.2, 
    triggerOnce: true, 
  });

  // Variants for the animation
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        staggerChildren: 0.3, 
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  // Trigger animation when the section comes into view
  useEffect(() => {
    if (inView) {
      controls.start("visible"); 
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref} 
      className="bg-[#000625] flex flex-col items-center justify-center px-4 py-12 sm:py-20"
      variants={containerVariants}
      initial="hidden"
      animate={controls} 
      exit="exit"
    >
      {/* Main Content */}
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Illustration Section */}
        <motion.div
          className="relative aspect-square md:order-1"
          variants={itemVariants}
        >
          <img
            src={image}
            alt="Event creation illustration"
            className="object-contain w-full h-full"
          />
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="text-white text-center md:text-left md:order-0"
          variants={itemVariants}
        >
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight"
            variants={itemVariants}
          >
            Make your own Event
          </motion.h1>
          <motion.p
            className="text-gray-300 mb-6 sm:mb-8 max-w-md mx-auto md:mx-0 text-base sm:text-lg"
            variants={itemVariants}
          >
            From live concerts to NFT drops, bring your event to life with us.
            Create, promote, and sell tickets effortlessly.
          </motion.p>
          <motion.button
            className="bg-[#00FFA0] text-black hover:bg-[#00cc6e] transition-colors duration-300 px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold"
            variants={itemVariants}
          >
            Create Event
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Home;