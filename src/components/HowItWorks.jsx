import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const steps = [
  {
    number: "1",
    title: "Find Your Vibe",
    description:
      "Discover live concerts, NFT drops, or virtual meetups. Whether you love music, sports, or art, we've got you covered. Filter or dive in and explore!",
    image: "/public/images/how-it-works/1.png",
    color: "bg-gradient-to-br from-[#FFD6CC] to-[#FF9A85]",
    glowColor: "rgba(255, 214, 204, 0.3)",
  },
  {
    number: "2",
    title: "Choose Your Adventure",
    description:
      "Found your event? Pick your ticket—General, VIP, or NFT. Own, trade, or flex your NFT tickets. Your choice, your style!",
    image: "/public/images/how-it-works/2.png",
    color: "bg-gradient-to-br from-[#B4E4E0] to-[#7DD3C0]",
    glowColor: "rgba(180, 228, 224, 0.3)",
  },
  {
    number: "3",
    title: "Lock It In",
    description:
      "Discover live concerts, NFT drops, or virtual meetups. Whether you love music, sports, or art, we've got you covered. Filter or dive in and explore!",
    image: "/public/images/how-it-works/3.png",
    color: "bg-gradient-to-br from-[#B4E4E0] to-[#7DD3C0]",
    glowColor: "rgba(180, 228, 224, 0.3)",
  },
  {
    number: "4",
    title: "Show Up, Stand Out",
    description:
      "Found your event? Pick your ticket—General, VIP, or NFT. Own, trade, or flex your NFT tickets. Your choice, your style!",
    image: "/public/images/how-it-works/4.png",
    color: "bg-gradient-to-br from-[#FFD6CC] to-[#FF9A85]",
    glowColor: "rgba(255, 214, 204, 0.3)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const HowItWorks = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div
      className="min-h-screen py-16 md:py-24 overflow-hidden relative"
      id="how-it-works"
      style={{
        background:
          "linear-gradient(135deg, #101428 0%, #1a1f3a 50%, #101428 100%)",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[#A3E6EB]/10 to-[#00FFA0]/10 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-[#FFD6CC]/10 to-[#FF9A85]/10 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 4 }}
          className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-[#B4E4E0]/10 to-[#7DD3C0]/10 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-[1440px] relative z-10">
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16 md:mb-24"
        >
          <motion.div variants={itemVariants} className="relative inline-block">
            <h2 className="font-['FONTSPRING_DEMO-Poly'] text-[36px] md:text-[48px] font-semibold bg-gradient-to-r from-white via-[#A3E6EB] to-white bg-clip-text text-transparent relative z-10">
              How It Works
            </h2>
            <div className="absolute inset-0 bg-gradient-to-r from-[#A3E6EB]/20 to-[#00FFA0]/20 blur-2xl rounded-full transform scale-150 opacity-30" />
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="font-['Poly'] text-[18px] md:text-[20px] text-gray-300 max-w-2xl mx-auto mt-4 leading-relaxed"
          >
            From Discovery to Ownership: Your Event Journey, Simplified
          </motion.p>
        </motion.div>

        {/* Steps Section */}
        <div className="relative" ref={ref}>
          {/* Enhanced Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full flex flex-col items-center">
            {/* Top Dot with Glow */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative"
            >
              <div className="w-[8px] h-[8px] rounded-full bg-gradient-to-r from-[#A3E6EB] to-[#00FFA0] relative z-10" />
              <div className="absolute inset-0 w-[8px] h-[8px] rounded-full bg-[#A3E6EB] blur-md opacity-60" />
            </motion.div>

            {/* Enhanced Dotted Line */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "100%", opacity: 1 }}
              transition={{ duration: 2, delay: 0.8 }}
              className="w-[2px] h-full my-2 relative"
            >
              <div
                className="w-full h-full"
                style={{
                  background:
                    "repeating-linear-gradient(to bottom, #A3E6EB 0px, #A3E6EB 12px, transparent 12px, transparent 24px)",
                  filter: "drop-shadow(0 0 4px rgba(163, 230, 235, 0.5))",
                }}
              />
            </motion.div>

            {/* Bottom Dot with Glow */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 3, duration: 0.5 }}
              className="relative"
            >
              <div className="w-[8px] h-[8px] rounded-full bg-gradient-to-r from-[#A3E6EB] to-[#00FFA0] relative z-10" />
              <div className="absolute inset-0 w-[8px] h-[8px] rounded-full bg-[#A3E6EB] blur-md opacity-60" />
            </motion.div>
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
                  {/* Enhanced Timeline Dot with Number */}
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      boxShadow: `0 0 30px ${step.glowColor}`,
                      rotate: [0, -5, 5, 0],
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: index * 0.3 + 1,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="absolute left-[44.5%] sm:left-[46.5%] lg:left-[47.5%] xl:left-[48%] transform top-[30px] w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer group"
                    style={{
                      background:
                        "linear-gradient(135deg, #E7FDFF 0%, #A3E6EB 100%)",
                      border: "2px solid #A3E6EB",
                      zIndex: 30,
                      boxShadow: `0 8px 32px ${step.glowColor}, inset 0 1px 0 rgba(255,255,255,0.2)`,
                    }}
                  >
                    <span className="text-[28px] font-bold bg-gradient-to-r from-[#013237] to-[#015a63] bg-clip-text text-transparent -mt-1 group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </span>

                    {/* Rotating Ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-[#A3E6EB]/30"
                    />
                  </motion.div>

                  {/* Enhanced Content Container */}
                  <div
                    className={`flex ${
                      isFirstTwo
                        ? "lg:justify-end lg:pr-16"
                        : "lg:justify-start lg:pl-16"
                    } w-full lg:w-1/2 ${
                      isFirstTwo ? "lg:ml-auto" : ""
                    } justify-center px-4 lg:px-0`}
                    style={{ zIndex: 20 }}
                  >
                    <motion.div
                      className="max-w-[30rem] relative"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Glass Morphism Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10" />

                      {/* Text Content */}
                      <motion.div className="px-6 lg:px-8 pt-6 pb-8 rounded-2xl text-center lg:text-left relative z-10">
                        <motion.h3
                          className="text-[28px] lg:text-[34px] font-bold mb-4 bg-gradient-to-r from-white to-[#A3E6EB] bg-clip-text text-transparent"
                          whileHover={{ scale: 1.02 }}
                        >
                          {step.title}
                        </motion.h3>
                        <p className="text-[14px] lg:text-[16px] font-normal text-gray-300 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-[#A3E6EB] to-[#00FFA0] rounded-full opacity-60" />
                        <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-[#A3E6EB] to-[#00FFA0] rounded-full opacity-40" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Enhanced Images positioning */}
                  {index === 0 && (
                    <div
                      className="hidden lg:flex absolute left-8 -space-x-4 md:left-12"
                      style={{ top: "120px" }}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -50, rotateY: -30 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        whileHover={{
                          scale: 1.05,
                          zIndex: 20,
                          rotateY: 10,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                        }}
                        className="relative z-10 rounded-2xl overflow-hidden"
                        style={{
                          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))",
                        }}
                      >
                        <img
                          src={steps[0].image}
                          alt={steps[0].title}
                          className="w-56 md:w-56 h-auto rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50, rotateY: 30 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        whileHover={{
                          scale: 1.05,
                          zIndex: 20,
                          rotateY: -10,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                        }}
                        className="relative z-0 rounded-2xl overflow-hidden"
                        style={{
                          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))",
                        }}
                      >
                        <img
                          src={steps[1].image}
                          alt={steps[1].title}
                          className="w-56 md:w-56 h-auto rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                      </motion.div>
                    </div>
                  )}

                  {/* Enhanced Mobile Images for steps 1&2 */}
                  {index === 0 && (
                    <div className="lg:hidden flex justify-center mt-8 -space-x-4">
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        className="relative z-10 rounded-xl overflow-hidden"
                      >
                        <img
                          src={steps[0].image}
                          alt={steps[0].title}
                          className="w-36 h-auto rounded-xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        className="relative z-0 rounded-xl overflow-hidden"
                      >
                        <img
                          src={steps[1].image}
                          alt={steps[1].title}
                          className="w-36 h-auto rounded-xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                      </motion.div>
                    </div>
                  )}

                  {/* Enhanced Images for steps 3&4 on right */}
                  {index === 2 && (
                    <div
                      className="hidden lg:flex absolute right-8 -space-x-4 md:right-12"
                      style={{ top: "120px" }}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: 50, rotateY: 30 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        whileHover={{
                          scale: 1.05,
                          zIndex: 20,
                          rotateY: -10,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                        }}
                        className="relative z-10 rounded-2xl overflow-hidden"
                        style={{
                          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))",
                        }}
                      >
                        <img
                          src={steps[2].image}
                          alt={steps[2].title}
                          className="w-56 md:w-56 h-auto rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50, rotateY: -30 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        whileHover={{
                          scale: 1.05,
                          zIndex: 20,
                          rotateY: 10,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                        }}
                        className="relative z-0 rounded-2xl overflow-hidden"
                        style={{
                          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))",
                        }}
                      >
                        <img
                          src={steps[3].image}
                          alt={steps[3].title}
                          className="w-48 md:w-56 h-auto rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                      </motion.div>
                    </div>
                  )}

                  {/* Enhanced Mobile Images for steps 3&4 */}
                  {index === 2 && (
                    <div className="lg:hidden flex justify-center mt-8 -space-x-4">
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        className="relative z-10 rounded-xl overflow-hidden"
                      >
                        <img
                          src={steps[2].image}
                          alt={steps[2].title}
                          className="w-36 h-auto rounded-xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        className="relative z-0 rounded-xl overflow-hidden"
                      >
                        <img
                          src={steps[3].image}
                          alt={steps[3].title}
                          className="w-36 h-auto rounded-xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
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
