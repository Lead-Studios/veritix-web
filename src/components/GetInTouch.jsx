import React from 'react'
import { useInView } from 'react-intersection-observer';

import ContactDetails from './ContactDetails';
import ContactForm from './ContactForm';
  
const GetInTouch = () => {

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div className='flex justify-center items-start w-full' id='get-in-touch'>
      <div 
        className="flex flex-col lg:flex-row justify-between items-start text-white min-h-screen py-16 xl:py-24 overflow-hidden bg-[#101428] px-5 sm:px-10 lg:px-20 w-full mx-auto" 
        ref={ref}
      >
        {/* Left Column: Contact details */}
        <ContactDetails inView={inView} />

        {/* Right Column: Contact Form */}
        <ContactForm
            ref={ref}
            inView={inView}
        />
      </div>
    </div>
  )
}

export default GetInTouch;