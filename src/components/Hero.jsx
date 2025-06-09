"use client";
// import React from "react";
import { motion } from "framer-motion";
import CreateEventButton from "./hero/CreateEventButton";
import LearnMoreButton from "./hero/LearnMoreButton";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        ease: "easeInOut",
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative mx-auto overflow-hidden h-[700px] sm:h-[650px] md:h-[600px] w-full pt-24 sm:pt-20 md:pt-16">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#000625] to-[#455A64] w-full h-full">
        <img
          src="/Images/bg.svg"
          alt="bg"
          className="absolute inset-0 h-full w-full object-cover opacity-30 sm:opacity-20"
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex h-full items-center px-4 py-8 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-10 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-4xl overflow-hidden rounded-lg h-[220px] sm:h-[320px] md:h-[400px] lg:h-[450px]">
              <img
                src="/Images/hero.png"
                alt="Hero"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Text Content Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center text-center md:text-left"
          >
            {/* Title */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight md:leading-[100%] md:text-center font-[FONTSPRING]"
              style={{ fontFamily: "FONTSPRING" }}
            >
              Discover, Own, and Trade{" "}
              <span className="block sm:inline">
                <motion.span
                  className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent"
                  animate={{
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                >
                  Event Tickets
                </motion.span>{" "}
                Reimagined
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="w-full max-w-lg mx-auto mt-6 mb-8 text-center rounded-[50px] px-4 py-3 text-[16px] sm:text-[18px] md:text-[20px] leading-[130%] text-white font-[400] font-[Poly] tracking-[0%]"
            >
              Discover real-life events, mint NFT tickets, and earn rewards with
              crypto.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 mt-2"
            >
              <CreateEventButton href="/create-ticket" />
              <LearnMoreButton href="#learn-more" text="Learn More" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
