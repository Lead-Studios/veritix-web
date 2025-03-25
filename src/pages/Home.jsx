import React from 'react';
import { Link } from 'react-router-dom';
import { IoTicket } from 'react-icons/io5';
import { motion } from 'framer-motion';

function Footer() {
  const footerVariants = {
    hidden: { opacity: 0, y: 100 }, // Increased y for more travel distance
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 10, // Reduced stiffness for a more sluggish effect
        damping: 10, // Reduced damping for longer oscillations
        duration: 9.5, // Increased duration for overall slower animation
      },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, // increase duration for a little bit slower effect
      },
    },
  };

  return (
    <motion.footer
      className='bg-[#000625] text-[#E7FDFF] py-12'
      variants={footerVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
    >
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-wrap gap-8'>
          {/* Brand Section */}
          <div className='w-full  lg:w-[320px]'>
            <div className='flex items-center space-x-1'>
              <IoTicket className='w-5 h-5 sm:w-8 sm:h-7 rotate-[80deg]' />
              <img
                src={'/veritix_logo.svg'}
                alt='Veritixlogo'
                className='w-14 h-14 sm:w-16 sm:h-16'
              />
            </div>
            <p className='text-gray-300 text-sm mt-4 max-md:w-full max-lg:w-[70%]'>
              Your gateway to unforgettable events—live, virtual, or in the
              metaverse. Discover, own, and trade NFT tickets, earn crypto
              rewards, and join a community of event lovers. The future of
              ticketing starts here.
            </p>
            <div className='flex space-x-4 pt-4'>
              <a
                href='https://x.com'
                target='_blank'
                rel='noopener noreferrer'
                className=' rounded-full '
              >
                <img
                  src={'/Images/x_logo.svg'}
                  alt='Twitter'
                  className='w-7 h-7'
                />
              </a>
              <a
                href='https://discord.com'
                target='_blank'
                rel='noopener noreferrer'
                className=' rounded-full '
              >
                <img
                  src={'/Images/discord_logo.svg'}
                  alt='Discord'
                  className='w-7 h-7'
                />
              </a>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className=' rounded-full '
              >
                <img
                  src={'/Images/facebook_logo.svg'}
                  alt='Facebook'
                  className='w-7 h-7'
                />
              </a>
            </div>
          </div>

          {/* Links Sections Container */}
          <div className='flex flex-1 flex-wrap gap-8 justify-between'>
            {/* Quick Links */}
            <div className='max-[575px]:w-[180px] max-md:w-[160px] max-[812px]:w-[200px]'>
              <h4 className='font-semibold mb-4'>Quick Links</h4>
              <div className='flex flex-col space-y-2 text-sm text-gray-300'>
                <motion.a
                  href='/attendees'
                  className='hover:text-[#00FFA0]'
                  variants={linkVariants}
                  whileHover='hover'
                >
                  Attendees
                </motion.a>
                <motion.a
                  href='/organiser'
                  className='hover:text-[#00FFA0]'
                  variants={linkVariants}
                  whileHover='hover'
                >
                  Organiser
                </motion.a>
                <motion.a
                  href='/promoters'
                  className='hover:text-[#00FFA0]'
                  variants={linkVariants}
                  whileHover='hover'
                >
                  Promoters
                </motion.a>
                <motion.a
                  href='/about'
                  className='hover:text-[#00FFA0]'
                  variants={linkVariants}
                  whileHover='hover'
                >
                  How it Works
                </motion.a>
              </div>
            </div>

            {/* Plan Events */}
            <div className='max-[575px]:w-[180px] max-md:w-[160px] max-[812px]:w-[200px]'>
              <h4 className='font-semibold mb-4'>Plan Events</h4>
              <div className='flex flex-col space-y-2 text-sm text-gray-300'>
                <motion.a
                  href='/create-and-setup'
                  className='hover:text-[#00FFA0]'
                  variants={linkVariants}
                  whileHover='hover'
                >
                  Create and Setup
                </motion.a>
                <motion.a
                  href='/sell-tickets'
                  className='hover:text-[#00FFA0]'
                  variants={linkVariants}
                  whileHover='hover'
                >
                  Sell Tickets
                </motion.a>
                <motion.a
                  href='/online-rsvp'
                  className='hover:text-[#00FFA0]'
                  variants={linkVariants}
                  whileHover='hover'
                >
                  Online RSVP
                </motion.a>
                <motion.a
                  href='/online-event'
                  className='hover:text-[#00FFA0]'
                  variants={linkVariants}
                  whileHover='hover'
                >
                  Online Event
                </motion.a>
              </div>
            </div>

            {/* Legal */}
            <div className='max-[575px]:w-[180px] max-md:w-[160px] max-[812px]:w-[200px]'>
              <h4 className='font-semibold mb-4'>Legal</h4>
              <div className='flex flex-col space-y-2 text-sm text-gray-300'>
                <motion.a
                  href='/privacy-policy'
                  className='hover:text-[#00FFA0]'
                  variants={linkVariants}
                  whileHover='hover'
                >
                  Privacy Policy
                </motion.a>
                <motion.a
                  href='/terms'
                  className='hover:text-[#00FFA0]'
                  variants={linkVariants}
                  whileHover='hover'
                >
                  Terms of Service
                </motion.a>
                <motion.a
                  href='/cookie-policy'
                  className='hover:text-[#00FFA0]'
                  variants={linkVariants}
                  whileHover='hover'
                >
                  Cookie Policy
                </motion.a>
                <motion.a
                  href='/host-events'
                  className='hover:text-[#00FFA0]'
                  variants={linkVariants}
                  whileHover='hover'
                >
                  Host Events
                </motion.a>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className='max-w-full md:max-w-[360px] w-full lg:max-w-[480px] min-[1180px]:max-w-[360px]'>
              <h4 className='font-semibold mb-2'>Never Miss an Event</h4>
              <p className='text-sm text-gray-300 mb-4'>
                Get updates on trending events, exclusive NFT drops, and crypto
                rewards
              </p>
              <div className='flex flex-row gap-2 sm:gap-0 border border-[#00FFA0] rounded-full'>
                <input
                  type='email'
                  placeholder='Enter your email address...'
                  className='w-full h-12 sm:w-auto flex-1 px-4 py-2 bg-transparent rounded-full sm:rounded-r-none text-white text-sm focus:outline-none'
                />
                <button className='w-auto whitespace-nowrap px-4 sm:px-6 py-2 bg-[#00FFA0] text-[#000625] rounded-full font-semibold text-sm hover:bg-[#00FFA0]/90 transition-colors'>
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-12 pt-8 border-t border-[#E7FDFF] text-center text-[#E7FDFF] text-sm'>
          <p>Copyright © {new Date().getFullYear()} Veritix</p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
