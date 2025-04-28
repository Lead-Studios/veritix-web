// import SignUpForm from '../components/forms/SignUpForm';
// import SignInForm from '../components/forms/SignInForm';

import BottomBanner from "../components/BottomBanner";
import HowItWorksSection from "../components/HowItWorks";

import React from "react";
import TrendingEvent from "../components/TrendingEvent";
import Hero from "../components/Hero";
import GetInTouch from "../components/GetInTouch";

function Home() {
  return (
    <div className="flex flex-col relative w-full bg-transparent ">
      <div className="mx-auto w-full">
        <Hero />
        <div>
          {/* <ImageSkeleton/> */}
          <img src="/Images/Vector.svg" className="absolute -top-52 right-0" />
        </div>
        <TrendingEvent />
        <HowItWorksSection />
        <GetInTouch />
        <BottomBanner />

        {/* <SignInForm /> */}
        {/* <SignUpForm /> */}
      </div>
    </div>
  );
}

export default Home;
