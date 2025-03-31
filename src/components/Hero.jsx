
"use client"
import React from 'react'
import { motion } from 'framer-motion'

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
  }

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
  }

  return (
    <section className="relative mx-auto -mt-4 overflow-hidden h-[600px] w-full">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#000625] to-[#455A64] w-full h-full">
        <img
          src="/Images/bg.svg"
          alt="bg"
          className="absolute inset-0 h-full w-full object-cover opacity-30 sm:opacity-20"
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex h-full items-center px-4 py-12 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-10 items-center">

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-4xl overflow-hidden rounded-lg h-[250px] sm:mt-20 sm:h-[350px] md:h-[450px] lg:h-[500px]">
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
                <span className="text-[#00FFA0]">Event Tickets</span> Reimagined
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="w-full max-w-lg mx-auto mt-4 text-center rounded-[50px] px-4 py-3 text-[16px] sm:text-[18px] md:text-[20px] leading-[130%] text-white font-[400] font-[Poly] tracking-[0%]"
            >
              Discover real-life events, mint NFT tickets, and earn rewards with crypto.
            </motion.p>

            {/* Buttons */}
            <div className='flex justify-center sm:flex-row'>
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center md:justify-start mt-6 gap-4 md:gap-6"
            >
              <a
                href="#"
                className="flex items-center justify-center md:w-[158px] md:h-[57px] h-[40px] sm:text-center rounded-[50px] px-[18px] py-[14px]  bg-[#00FFA0] text-black md:text-lg font-medium shadow-md hover:bg-[#013237] hover:text-white transition"
              >
                Create Event
              </a>
              <a
                 href="#"
                 className="flex items-center justify-center md:w-[158px] md:h-[57px] h-[40px] rounded-[50px] px-[18px] py-[14px] gap-[24px] border-2 border-[#00FFA0] text-[#00FFA0] text-sm text-center md:text-lg font-medium shadow-md hover:bg-[#013237] hover:text-white transition"

               >
                 Learn More
               </a>
            </motion.div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero