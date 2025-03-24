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
    description: 'Found your event? Pick your ticket—General, VIP, or NFT. Own, trade, or flex your NFT tickets. Your choice, your style!"',
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
    description: 'Found your event? Pick your ticket—General, VIP, or NFT. Own, trade, or flex your NFT tickets. Your choice, your style!"',
    image: '/public/images/how-it-works/4.png',
    color: 'bg-[#FFD6CC]'
  }
];

const HowItWorks = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    initialInView: true
  });

  return (
    <div className="min-h-screen py-16" style={{
      background: 'linear-gradient(180deg, #011217 0%, #013237 100%)'
    }}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[36px] font-semibold text-white text-center">How It Works</h2>
          <p className="text-[18px] text-gray-300">
            From Discovery to Ownership: Your Event Journey, Simplified
          </p>
        </motion.div>

        {/* Steps Section */}
        <div className="relative" ref={ref}>
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full flex flex-col items-center">
            {/* Top Dot */}
            <div className="w-[4px] h-[4px] rounded-full bg-[#A3E6EB]" />
            
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
            <div className="w-[4px] h-[4px] rounded-full bg-[#A3E6EB]" />
          </div>

          {/* Steps List */}
          <div className="space-y-32">
            {steps.map((step, index) => {
              const isFirstTwo = index < 2;
              return (
                <motion.div
                  key={step.number}
                  className="relative"
                >
                  {/* Timeline Dot with Number */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="absolute left-[48%] top-[10%] transform -translate-x-1/2 w-[50px] h-[50px] bg-[#E7FDFF] rounded-full flex items-center justify-center z-10 shadow-lg" 
                  >
                    <span className="text-[34px] font-bold text-[#013237] -mt-1">
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Content Container */}
                  <div className={`flex ${isFirstTwo ? 'justify-end pr-16' : 'justify-start pl-16'} w-1/2 ${isFirstTwo ? 'ml-auto' : ''}`}>
                    <div className="max-w-[30rem]">
                      {/* Text Content */}
                      <motion.div
                        initial={{ opacity: 0, x: isFirstTwo ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="px-8 pt-2 pb-4 rounded-xl"
                      >
                        <h3 className="text-[34px] font-bold text-white mb-4">{step.title}</h3>
                        <p className="text-[16px] font-normal text-gray-300 leading-normal">{step.description}</p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Images positioning */}
                  {index === 0 && (
                    <div className="absolute left-8 top-32 flex -space-x-4">
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10"
                      >
                        <img src={steps[0].image} alt={steps[0].title} className="w-48 h-auto" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-0"
                      >
                        <img src={steps[1].image} alt={steps[1].title} className="w-48 h-auto" />
                      </motion.div>
                    </div>
                  )}

                  {/* Images for steps 3&4 on right */}
                  {index === 2 && (
                    <div className="absolute right-8 top-32 flex -space-x-4">
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10"
                      >
                        <img src={steps[2].image} alt={steps[2].title} className="w-48 h-auto" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-0"
                      >
                        <img src={steps[3].image} alt={steps[3].title} className="w-48 h-auto" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 