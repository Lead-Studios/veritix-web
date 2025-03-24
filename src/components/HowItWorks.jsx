import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const steps = [
  {
    number: '1',
    title: 'Find Your Vibe',
    description: "Discover live concerts, NFT drops, or virtual meetups. Whether you love music, sports, or art, we've got you covered. Filter or dive in and explore!",
    image: '/public/images/how-it-works/1.png',
    color: 'bg-[#FFD6CC]'
  },
  {
    number: '2',
    title: 'Choose Your Adventure',
    description: 'Found your event? Pick your ticket—General, VIP, or NFT. Own, trade, or flex your NFT tickets. Your choice, your style!',
    image: '/public/images/how-it-works/2.png',
    color: 'bg-[#B4E4E0]'
  },
  {
    number: '3',
    title: 'Lock It In',
    description: "Discover live concerts, NFT drops, or virtual meetups. Whether you love music, sports, or art, we've got you covered. Filter or dive in and explore!",
    image: '/public/images/how-it-works/3.png',
    color: 'bg-[#B4E4E0]'
  },
  {
    number: '4',
    title: 'Show Up, Stand Out',
    description: "Found your event? Pick your ticket—General, VIP, or NFT. Own, trade, or flex your NFT tickets. Your choice, your style!",
    image: '/public/images/how-it-works/4.png',
    color: 'bg-[#FFD6CC]'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const HowItWorks = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div className="min-h-screen py-16 md:py-24 overflow-hidden" style={{
      background: 'linear-gradient(180deg, #011217 0%, #013237 100%)'
    }}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16 md:mb-24"
        >
          <motion.h2 
            variants={itemVariants}
            className="font-['FONTSPRING_DEMO-Poly'] text-[36px] md:text-[48px] font-semibold text-white"
          >
            How It Works
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="font-['Poly'] text-[18px] md:text-[20px] text-gray-300 max-w-2xl mx-auto"
          >
            From Discovery to Ownership: Your Event Journey, Simplified
          </motion.p>
        </motion.div>

        {/* Steps Section */}
        <div className="relative" ref={ref}>
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full flex flex-col items-center">
            {/* Top Dot */}
            <div className="w-[5px] h-[5px] rounded-full bg-[#A3E6EB]" />
            
            {/* Dotted Line */}
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: 1 }}
              className="w-[1px] h-full my-2"
              style={{
                background: 'repeating-linear-gradient(to bottom, #A3E6EB 0px, #A3E6EB 8px, transparent 8px, transparent 20px)'
              }}
            />
            
            {/* Bottom Dot */}
            <div className="w-[5px] h-[5px] rounded-full bg-[#A3E6EB]" />
          </div>

          {/* Steps List */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-32 md:space-y-40"
          >
            {steps.map((step, index) => {
              const isFirstTwo = index < 2;
              return (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  className="relative pt-[70px] lg:pt-[10px]"
                >
                  {/* Timeline Dot with Number */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute left-[46.5%] lg:left-[47.5%] xl:left-[48%] transform top-[30px] w-[50px] h-[50px] bg-[#E7FDFF] rounded-full flex items-center justify-center cursor-pointer transition-shadow hover:shadow-lg" 
                    style={{ 
                      border: '1px solid #A3E6EB',
                      zIndex: 30
                    }}
                  >
                    <span className="text-[34px] font-bold text-[#013237] -mt-1">
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Content Container */}
                  <div className={`flex ${isFirstTwo ? 'lg:justify-end lg:pr-16' : 'lg:justify-start lg:pl-16'} w-full lg:w-1/2 ${isFirstTwo ? 'lg:ml-auto' : ''} justify-center px-4 lg:px-0`} style={{ zIndex: 20 }}>
                    <div className="max-w-[30rem] relative">
                      {/* Text Content */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="px-4 lg:px-8 pt-2 pb-4 rounded-xl text-center lg:text-left"
                      >
                        <h3 className="text-[28px] lg:text-[34px] font-bold text-white mb-4">{step.title}</h3>
                        <p className=" text-[14px] lg:text-[16px] font-normal text-gray-300 leading-relaxed">{step.description}</p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Images positioning */}
                  {index === 0 && (
                    <div className="hidden lg:flex absolute left-8 -space-x-4 md:left-12" style={{ top: '120px' }}>
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        className="relative z-10"
                      >
                        <img src={steps[0].image} alt={steps[0].title} className="w-56 md:w-56 h-auto" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        className="relative z-0"
                      >
                        <img src={steps[1].image} alt={steps[1].title} className="w-56 md:w-56 h-auto" />
                      </motion.div>
                    </div>
                  )}

                  {/* Mobile Images for steps 1&2 */}
                  {index === 0 && (
                    <div className="lg:hidden flex justify-center mt-8 -space-x-4">
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        className="relative z-10"
                      >
                        <img src={steps[0].image} alt={steps[0].title} className="w-36 h-auto" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        className="relative z-0"
                      >
                        <img src={steps[1].image} alt={steps[1].title} className="w-36 h-auto" />
                      </motion.div>
                    </div>
                  )}

                  {/* Images for steps 3&4 on right */}
                  {index === 2 && (
                    <div className="hidden lg:flex absolute right-8 -space-x-4 md:right-12" style={{ top: '120px' }}>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        className="relative z-10"
                      >
                        <img src={steps[2].image} alt={steps[2].title} className="w-56 md:w-56 h-auto" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        className="relative z-0"
                      >
                        <img src={steps[3].image} alt={steps[3].title} className="w-48 md:w-56 h-auto" />
                      </motion.div>
                    </div>
                  )}

                  {/* Mobile Images for steps 3&4 */}
                  {index === 2 && (
                    <div className="lg:hidden flex justify-center mt-8 -space-x-4">
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        className="relative z-10"
                      >
                        <img src={steps[2].image} alt={steps[2].title} className="w-36 h-auto" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        className="relative z-0"
                      >
                        <img src={steps[3].image} alt={steps[3].title} className="w-36 h-auto" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 