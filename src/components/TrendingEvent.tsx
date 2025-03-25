import React from "react";
import TrendingCards from "./cards/TrendingCards";

type Props = {};

function TrendingEvent({}: Props) {
  return (
    <div className="h-auto w-full flex flex-col  bg-[#013237] px-4  items-center ">
      <div className="flex flex-col items-center  w-full">
        <div className="items-start max-w-[1400px] px-4 flex-col flex w-full">
          <p className="text-[#E7FDFF] text-[36px] font-semibold ">
            Trending Events
          </p>
          <p className="font-normal text-base text-[#E7FDFF]">
            Discover what is hot right now
          </p>
        </div>
        <div className="grid lg:grid-cols-3 xl:grid-cols-4 px-4  md:grid-cols-2 grid-cols-1 max-w-[1400px] justify-between items-center gap-y-8 w-full">
          {events.map((event, i) => (
            <div key={i} className="w-[300px]">
              <TrendingCards />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrendingEvent;
const events = [
  {
    type: "music",
    title: "Meterverse Festival",
    time: "Sat, Oct 21 · 7:00 PM",
    amount: "From $50",
  },
  {
    type: "music",
    title: "Meterverse Festival",
    time: "Sat, Oct 21 · 7:00 PM",
    amount: "From $50",
  },
  {
    type: "music",
    title: "Meterverse Festival",
    time: "Sat, Oct 21 · 7:00 PM",
    amount: "From $50",
  },
  {
    type: "music",
    title: "Meterverse Festival",
    time: "Sat, Oct 21 · 7:00 PM",
    amount: "From $50",
  },
  {
    type: "music",
    title: "Meterverse Festival",
    time: "Sat, Oct 21 · 7:00 PM",
    amount: "From $50",
  },
  {
    type: "music",
    title: "Meterverse Festival",
    time: "Sat, Oct 21 · 7:00 PM",
    amount: "From $50",
  },
  {
    type: "music",
    title: "Meterverse Festival",
    time: "Sat, Oct 21 · 7:00 PM",
    amount: "From $50",
  },
  {
    type: "music",
    title: "Meterverse Festival",
    time: "Sat, Oct 21 · 7:00 PM",
    amount: "From $50",
  },
];
