import React from "react";
import TrendingCards from "./cards/TrendingCards";
import { events } from "../data/Data";

type Props = {};

function TrendingEvent({}: Props) {
  return (
    <div className="h-auto w-full flex flex-col  bg-[#101428] lg:px-4 py-8 lg:py-12 items-center ">
      <div className="flex flex-col items-center mt-8 lg:mt-12   w-full">
        <div className="items-start max-w-[1400px]  px-4 mb-10 flex-col gap-4 lg:gap-0  lg:flex-row flex w-full">
          <div className="w-full ">
            <p className="text-[#E7FDFF] md:text-[28px] text-[24px] lg:text-[36px] font-semibold ">
              Trending Events
            </p>
            <p className="font-normal text-sm lg:text-base text-[#E7FDFF]">
              Discover what is hot right now
            </p>
          </div>
          <div className="flex flex-wrap w-full gap-3 lg:gap-4 lg:items-end lg:justify-end">
            <select className="bg-[#E7FDFF] leading-0 lg:text-sm text-xs rounded-full lg:h-[43px] p-2 lg:p-2 lg:px-4">
              <option className="lg:text-sm text-xs leading-0  text-[#013237] font-normal lg:font-semibold">
                Weekdays
              </option>
            </select>
            <select className="bg-[#E7FDFF] leading-0 rounded-full lg:text-sm text-xs p-2    lg:h-[43px] lg:px-4 ">
              <option className="lg:text-sm text-xs leading-0  text-[#013237] font-normal lg:font-semibold">
                Event Type
              </option>
            </select>
            <select className="bg-[#E7FDFF] leading-0 rounded-full lg:text-sm text-xs  lg:h-[43px] lg:px-4  p-2">
              <option className="lg:text-sm text-xs leading-0 text-[#013237] font-normal lg:font-semibold">
                Any Category
              </option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 xl:grid-cols-4 px-4  md:grid-cols-2 grid-cols-1 max-w-[1400px] justify-between items-center gap-8 w-full">
          {events.map((event, i) => (
            <div key={i} className="">
              <TrendingCards
                amount={event.amount}
                title={event.title}
                type={event.type}
                time={event.time}
                color={event.color}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center">
        <button className="border-[#00FFA0] text-center border rounded-[50px] px-6 py-2 text-[#00FFA0] font-normal lg:text-2xl md:text-lg text-base">
          Explore Events
        </button>
      </div>
    </div>
  );
}

export default TrendingEvent;
