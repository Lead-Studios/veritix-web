// import SignUpForm from '../components/forms/SignUpForm';
// import SignInForm from '../components/forms/SignInForm';
import HowItWorksSection from '../components/HowItWorks';

import React from "react";

function Home() {
  return (
    <div className="mx-auto">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">
        Welcome to Our Website
      </h1>

      <HowItWorksSection />

      {/* <SignInForm /> */}
      {/* <SignUpForm /> */}
    </div>
  );
}

export default Home;
