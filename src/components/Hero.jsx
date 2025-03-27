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
    // <div>Hero</div>
    <section className="relative mx-auto -mt-4 overflow-hidden h-[600px] w-full">
      <div className='absolute inset-0 z-0 bg-gradient-to-r from-[#000625] to-[#455A64] h-full w-full'>
        <img src="/Images/bg.svg" alt="bg" className='h-full w-full object-cover opacity-20'
          style={{ top: 0, left: 0 }}
        />
        {/* <div className=' inset-0' /> */}
      </div>
      <div className='container relative z-10 mx-auto flex h-full items-center px-4 py-16 md:px-6'>
        <div className='grid gap-8 md:grid-cols-2 md:gap-12'>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className='flex items-center justify-center'
          >
            <div className='relative h-[400px] w-full  overflow-hidden rounded-lg  md:h-[500px]'>
              <img src="/pp.png" alt="Hero" className='h-full w-full object-cover' style={{ top: 0, left: 0 }} />

            </div>

          </motion.div>
          <motion.dev
            variant={containerVariants}
            initial='hidden'
            animate='visible'
            className='flex flex-col justify-center'
          >
            <div className="flex w-full items-center justify-center">
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="text-[64px] text-white font-bold leading-[100%] tracking-[0%] text-center font-[FONTSPRING]"
                style={{fontFamily: "FONTSPRING"}}
              >
                Discover, Own, and Trade{" "}
                <span className="whitespace-nowrap">
                  <span className="text-[#00FFA0]">Event Tickets</span> Reimagined
                </span>
              </motion.h1>
            </div>
            <div className='flex justify-center text-center mt-5'>
            <motion.p variants={itemVariants} className="w-full max-w-[578px] h-auto rounded-[50px] px-4 py-3 text-[24px] leading-[100%] text-center font-[400] font-[Poly] tracking-[0%] text-white mx-auto">
              Discover real-life events, mint NFT tickets, and earn rewards with crypto
            </motion.p>
            </div>
            <div className='flex justify-center mt-10'>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-14">
              {/* Using standard anchor tags instead of React Router */}
              <a
                href="#"
                className="w-[186px] h-[57px] text-center rounded-[50px] px-[18px] py-[14px] gap-[24px] bg-[#00FFA0] text-black text-lg font-medium shadow-md hover:bg-[#54c49b] transition"
              >
                Create Event
              </a>
              <a
                href="#"
                className="w-[158px] h-[57px] rounded-[50px] px-[18px] py-[14px] gap-[24px] border-2 border-[#00FFA0] text-[#00FFA0] text-center text-lg font-medium shadow-md hover:bg-[#81e7c2] hover:text-white transition"
                // className="inline-flex h-12 items-center justify-center rounded-full border border-[#00FFA0] bg-transparent px-6 text-sm font-medium text-[#00FFA0] shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"

              >
                Learn More
              </a>
            </motion.div>
            </div>


          </motion.dev>

        </div>

      </div>

    </section>
  )
}

export default Hero