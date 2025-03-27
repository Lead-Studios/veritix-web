import React from "react";
import ImageSkeleton from "../ImageSkeleton";

const BottomBannerSkeleton = () => {
  return (
    <div className="bg-[#000625] flex flex-col items-center justify-center px-4 py-12 sm:py-20">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-square md:order-1">
          <div className="w-full h-full bg-gray-700 rounded-lg animate-pulse">
            <ImageSkeleton />
          </div>
        </div>
        <div className="text-white text-center md:text-left md:order-0">
          <div className="h-10 bg-gray-700 rounded mb-4 sm:mb-6 w-3/4 mx-auto md:mx-0 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded mb-2 w-5/6 mx-auto md:mx-0 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded mb-6 sm:mb-8 w-2/3 mx-auto md:mx-0 animate-pulse"></div>
          <div className="bg-gray-700 rounded-full h-10 sm:h-12 w-40 mx-auto md:mx-0 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default BottomBannerSkeleton;
