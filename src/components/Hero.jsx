"use client"
import React from 'react'
import { motion } from 'framer-motion'


const Hero = () => {

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0},
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
    <section className='relative  mx-auto mt-[80px] overflow-hidden opacity-90'>
        <div className='absolute inset-0 z-0'>
            <img src="/Images/bg.svg" alt="bg" className='absolute h-full w-full object-cover'
            style={{ top: 0, left: 0 }}
            />
            <div className='absolute inset-0 bg-gradient-to-r from-[#000625] to-[#455A64]' />
        </div>
        <div className='container relative z-10 mx-auto flex h-full items-center px-4 py-16 md:px-6'>
            <div className='grid gap-8 md:grid-cols-2 md:gap-12'>
                <motion.div
                initial={{opacity:0, x: -50}}
                animate={{opacity:1, x: 0}}
                transition={{duration:0.7, ease: "easeOut"}}
                className='flex items-center justify-center'
                >
                <div className='relative h-[400px] w-full  overflow-hidden rounded-lg shadow-xl md:h-[500px]'>
                    <img src="/pep.svg" alt="Hero" className='h-full w-full object-cover' style={{top:0, left:0}} />

                </div>

                </motion.div>
                <motion.dev
                variant={containerVariants}
                initial='hidden'
                animate='visible'
                className='flex flex-col justify-center'
                >
                    <motion.h1
                    variants={itemVariants}
                    className='mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl'
                    >
                        Discover, Own, and Trade 
                        Event Tickets Reimagined
                    </motion.h1>
                    <motion.p variants={itemVariants} className="flex justify-center mb-8 max-w-md text-lg text-white/90 md:text-xl">
                    Discover real-life events, mint NFT tickets, and earn rewards with crypto
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              {/* Using standard anchor tags instead of React Router */}
              <a
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#00FFA0] px-6 text-sm font-medium text-primary shadow transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Create Event
              </a>
              <a
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#00FFA0] bg-transparent px-6 text-sm font-medium text-[#00FFA0] shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Learn More
              </a>
            </motion.div>

                </motion.dev>

            </div>

        </div>

    </section>
  )
}

export default Hero