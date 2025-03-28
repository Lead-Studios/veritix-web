import React from "react";
import hero from "../assets/hero.png";

const Hero = () => {
  return (
    <div className=" bg-gradient-to-br from-[#E7FDFF] to-[#455A64] relative w-full  pt-8  text-white pb-16 px-6 md:px-16 lg:px-24 flex flex-col-reverse md:flex-row items-center justify-between">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('')" }}
      ></div>

      {/* Image */}
      <div className="relative z-10 md:w-1/2 flex justify-center">
        <img src={hero} alt="Event Group" className="object-contain" />
      </div>

      {/* Text Content */}
      <div className="relative z-10 text-center md:text-left max-w-xl">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          Discover, Own, and Trade <br />
          <span className="text-[#103F3F]">Event Tickets</span> Reimagined
        </h1>
        <p className="mt-4 text-lg text-black text-center">
          Discover real-life events, mint NFT tickets, and earn rewards with
          crypto
        </p>
        <div className="flex justify-center">
          <button className="mt-4 bg-[#103F3F] hover:bg-[#0D2F2F] text-white font-semibold py-3 px-6 rounded-full shadow-md transition">
            Create Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
