import React from "react";
import Hero from "../components/Hero";
import EventSearchBar from "../components/upcoming-events/EventSearchBar";
import EventList from "../components/upcoming-events/EventList";

function Events() {
  return (
    <>
      <Hero />
      <div className="bg-[#E7FDFF]">
        <div className="w-[70%] mx-auto -translate-y-14 z-10 relative  ">
          <EventSearchBar />
        </div>
        <EventList />
      </div>
    </>
  );
}

export default Events;
