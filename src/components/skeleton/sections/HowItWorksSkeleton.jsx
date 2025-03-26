import React from "react";
import ImageSkeleton from "../ImageSkeleton";

const HowItWorksSkeleton = () => {
  return (
    <div
      className="min-h-screen py-16 md:py-24 overflow-hidden bg-[#101428]"
      id="how-it-works"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        {/* Header Skeleton */}
        <div className="text-center mb-16 md:mb-24">
          <div className="mx-auto mb-4 bg-gray-700 rounded h-8 w-40 animate-pulse"></div>
          <div className="mx-auto bg-gray-700 rounded h-4 w-64 animate-pulse"></div>
        </div>

        {/* Timeline Skeleton */}
        <div className="relative">
          {/* Vertical Line Skeleton */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full flex flex-col items-center">
            <div className="w-[5px] h-[5px] rounded-full bg-gray-700 animate-pulse"></div>
            <div
              className="w-[1px] h-full my-2 animate-pulse"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, #A3E6EB 0px, #A3E6EB 8px, transparent 8px, transparent 20px)"
              }}
            ></div>
            <div className="w-[5px] h-[5px] rounded-full bg-gray-700 animate-pulse"></div>
          </div>

          {/* Steps Skeleton */}
          <div className="space-y-32 md:space-y-40">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="relative pt-[70px] lg:pt-[10px] animate-pulse">
                {/* Timeline Dot Skeleton */}
                <div
                  className="absolute left-[44.5%] sm:left-[46.5%] lg:left-[47.5%] xl:left-[48%] transform top-[30px] w-[50px] h-[50px] bg-gray-700 rounded-full flex items-center justify-center"
                ></div>

                {/* Content Skeleton */}
                <div
                  className={`flex ${
                    index < 2 ? "lg:justify-end lg:pr-16" : "lg:justify-start lg:pl-16"
                  } w-full lg:w-1/2 ${index < 2 ? "lg:ml-auto" : ""} justify-center px-4 lg:px-0`}
                  style={{ zIndex: 20 }}
                >
                  <div className="max-w-[30rem] relative">
                    <div className="px-4 lg:px-8 pt-2 pb-4 rounded-xl space-y-2">
                      <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>

                {/* Image Skeletons for larger screens */}
                {index === 0 && (
                  <div
                    className="hidden lg:flex absolute left-8 -space-x-4 md:left-12"
                    style={{ top: "120px" }}
                  >
                    <div className="w-56 h-40 bg-gray-700 rounded animate-pulse">
                      <ImageSkeleton/>
                    </div>
                    <div className="w-56 h-40 bg-gray-700 rounded animate-pulse">
                      <ImageSkeleton/>
                    </div>
                  </div>
                )}
                {index === 2 && (
                  <div
                    className="hidden lg:flex absolute right-8 -space-x-4 md:right-12"
                    style={{ top: "120px" }}
                  >
                    <div className="w-56 h-40 bg-gray-700 rounded animate-pulse">
                    <ImageSkeleton/>
                    </div>
                    <div className="w-48 h-40 bg-gray-700 rounded animate-pulse">
                    <ImageSkeleton/>
                    </div>
                  </div>
                )}

                {/* Mobile Image Skeletons */}
                {index === 0 && (
                  <div className="lg:hidden flex justify-center mt-8 -space-x-4">
                    <div className="w-36 h-24 bg-gray-700 rounded animate-pulse">
                    <ImageSkeleton/>
                    </div>
                    <div className="w-36 h-24 bg-gray-700 rounded animate-pulse">
                    <ImageSkeleton/>
                    </div>
                  </div>
                )}
                {index === 2 && (
                  <div className="lg:hidden flex justify-center mt-8 -space-x-4">
                    <div className="w-36 h-24 bg-gray-700 rounded animate-pulse">
                    <ImageSkeleton/>
                    </div>
                    <div className="w-36 h-24 bg-gray-700 rounded animate-pulse">
                    <ImageSkeleton/>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSkeleton;
