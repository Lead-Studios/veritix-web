import React from "react";
import TrendingCards from "./cards/TrendingCards";

type Props = {};

function TrendingEvent({}: Props) {
  return (
    <div className="h-auto w-full flex flex-col  bg-[#101428] px-4 py-12 items-center ">
      <div className="flex flex-col items-center mt-12   w-full">
        <div className="items-start max-w-[1400px]  px-4 mb-10 flex-col gap-4 lg:gap-0  lg:flex-row flex w-full">
          <div className="w-full ">
            <p className="text-[#E7FDFF] text-[36px] font-semibold ">
              Trending Events
            </p>
            <p className="font-normal text-base text-[#E7FDFF]">
              Discover what is hot right now
            </p>
          </div>
          <div className="flex flex-wrap w-full gap-3 lg:gap-4 lg:items-end lg:justify-end">
            <select className="bg-[#E7FDFF]  rounded-full lg:h-[43px] p-2 px-4">
              <option className="text-sm  text-[#013237] font-normal lg:font-semibold">
                Weekdays
              </option>
            </select>
            <select className="bg-[#E7FDFF] rounded-full    lg:h-[43px] lg:px-4  p-2">
              <option className="text-sm  text-[#013237] font-normal lg:font-semibold">
                Event Type
              </option>
            </select>
            <select className="bg-[#E7FDFF] rounded-full  lg:h-[43px] lg:px-4  p-2">
              <option className="text-sm text-[#013237] font-normal lg:font-semibold">
                Any Category
              </option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 xl:grid-cols-4 px-4  md:grid-cols-2 grid-cols-1 max-w-[1400px] justify-between items-center gap-8 w-full">
          {events.map((event, i) => (
            <div key={i} className="">
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
