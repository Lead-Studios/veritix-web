import React from "react";
import ImageSkeleton from "../ImageSkeleton";

const TrendingEventsSkeleton = () => {
  return (
    <div className="h-auto w-full flex flex-col bg-[#101428] lg:px-4 py-8 lg:py-12 items-center">
      {/* Section Header Skeleton */}
      <div className="flex flex-col items-center mt-8 lg:mt-12 w-full">
        <div className="items-start max-w-[1400px] px-4 mb-10 flex-col gap-4 lg:gap-0 lg:flex-row flex w-full">
          <div className="w-full">
            <div className="h-6 w-40 bg-gray-700 rounded-md animate-pulse mb-2"></div>
            <div className="h-4 w-60 bg-gray-700 rounded-md animate-pulse"></div>
          </div>
          <div className="flex flex-wrap w-full gap-3 lg:gap-4 lg:items-end lg:justify-end">
            <div className="h-10 w-28 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-10 w-28 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-10 w-28 bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Event Cards Skeleton */}
        <div className="grid lg:grid-cols-3 xl:grid-cols-4 px-4 md:grid-cols-2 grid-cols-1 max-w-[1400px] justify-between items-center gap-8 w-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-full bg-gray-800 p-4 rounded-lg animate-pulse"
            >
              <div className="h-40 w-full bg-gray-700 rounded-md">
                <ImageSkeleton />
              </div>
              <div className="h-6 w-3/4 bg-gray-700 rounded-md mt-3"></div>
              <div className="h-4 w-1/2 bg-gray-700 rounded-md mt-2"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="mt-12 flex flex-col items-center">
        <div className="h-10 w-40 bg-gray-700 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default TrendingEventsSkeleton;
