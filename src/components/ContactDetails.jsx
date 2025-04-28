import React from 'react'
import { motion } from 'framer-motion';
import { TfiLocationPin } from 'react-icons/tfi';
import { FiGithub, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi';
import { containerVariants, iconHoverVariants, itemVariants } from '../utils/animationVariants';


const ContactDetails = ({ inView }) => {
  return (
    <motion.div 
        className="lg:w-1/2 w-full mb-8 lg:mb-0 lg:pr-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
    >
    <motion.h1 
      className="text-4xl font-semibold mb-4"
      variants={itemVariants}
    >
      Get in Touch
    </motion.h1>
    <motion.p 
      className="text-gray-300 mb-10 sm:w-11/12 w-full"
      variants={itemVariants}
    >
      Have questions about Veritix or need assistance with our blockchain-powered ticketing platform? 
      Our team is here to help you revolutionize your event experience.
    </motion.p>
    
    <div className="space-y-8">
      {/* Phone */}
      <motion.div 
        className="flex items-center"
        variants={itemVariants}
      >
        <motion.div 
          className="bg-[#4D21FF33] p-3 rounded-full mr-4"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <FiPhone className="w-6 h-6 text-[#4D21FF]" />
        </motion.div>
        <div>
          <h3 className="font-medium">Phone</h3>
          <p className="text-gray-400">+1 (555) 123-4567</p>
        </div>
      </motion.div>
      
      {/* Email */}
      <motion.div 
        className="flex items-center"
        variants={itemVariants}
      >
        <motion.div 
          className="bg-[#4D21FF33] p-3 rounded-full mr-4"
          whileHover={{ scale: 1.1}}
          transition={{ duration: 0.2 }}
        >
          <FiMail className="w-6 h-6 text-[#4D21FF]" />
        </motion.div>
        <div>
          <h3 className="font-medium">Email</h3>
          <p className="text-gray-400">support@veritix.io</p>
        </div>
      </motion.div>
      
      {/* Location */}
      <motion.div 
        className="flex items-center"
        variants={itemVariants}
      >
        <motion.div 
          className="bg-[#4D21FF33] p-3 rounded-full mr-4"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <TfiLocationPin className="w-6 h-6 text-[#4D21FF]" />
        </motion.div>
        <div>
          <h3 className="font-medium">Location</h3>
          <p className="text-gray-400">123 Blockchain Avenue, San Francisco, CA 94105</p>
        </div>
      </motion.div>
    </div>
    
    {/* Social Links */}
    <motion.div 
      className="flex mt-10 space-x-4"
      variants={itemVariants}
    >
      {['linkedin', 'github', 'twitter', 'discord'].map((social, index) => (
        <motion.a 
          key={social}
          href="#" 
          className="bg-[#4D21FF33] p-3 rounded-full transition duration-300"
          variants={iconHoverVariants}
          whileHover="hover"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            transition: { delay: 0.5 + (index * 0.1), duration: 0.5 } 
          }}
        >
          {social === 'linkedin' && <FiLinkedin className="text-[#4D21FF]" size={24} />}
          {social === 'github' && <FiGithub className="text-[#4D21FF]" size={24} />}
          {social === 'twitter' && <FiLinkedin className="text-[#4D21FF]" size={24} />}
          {social === 'discord' && <FiGithub className="text-[#4D21FF]" size={24} />}
        </motion.a>
      ))}
    </motion.div>
  </motion.div>
  )
}

export default ContactDetails;
