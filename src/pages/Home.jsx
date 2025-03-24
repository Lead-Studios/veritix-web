// import React from 'react';

import React from "react";

// import SignUpForm from '../components/forms/SignUpForm';
// import SignInForm from '../components/forms/SignInForm';
import HowItWorksSection from '../components/HowItWorks';

function Home() {
  return (
    <div className='mx-auto'>
      <h1 className='text-3xl font-bold text-gray-800 mb-4'>
        Welcome to Our Website
      </h1>

      <HowItWorksSection />

      {/* <SignInForm /> */}
      {/* <SignUpForm /> */}
    </div>
  );
}

export default Home;
