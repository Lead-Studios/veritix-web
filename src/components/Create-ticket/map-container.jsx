"use client";

import { useEffect, useState, lazy, Suspense } from "react";

// Lazy load the map component
const Map = lazy(() => import("./map"));

export default function MapContainer() {
  const [coordinates, setCoordinates] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    // Get user's location if they allow it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates([position.coords.latitude, position.coords.longitude]);
          setIsMapReady(true);
        },
        () => {
          // Default coordinates if user denies location access
          setCoordinates([40.7128, -74.006]); // New York
          setIsMapReady(true);
        }
      );
    } else {
      // Default coordinates if geolocation is not supported
      setCoordinates([40.7128, -74.006]); // New York
      setIsMapReady(true);
    }
  }, []);

  return (
    <div className="space-y-2">
      <div className="h-[300px] rounded-md overflow-hidden border border-[#1e293b]">
        {isMapReady && coordinates ? (
          <Suspense
            fallback={
              <div className="w-full h-full bg-[#0f172a] flex items-center justify-center">
                <p className="text-gray-400">Loading map...</p>
              </div>
            }
          >
            <Map center={coordinates} setCoordinates={setCoordinates} />
          </Suspense>
        ) : (
          <div className="w-full h-full bg-[#0f172a] flex items-center justify-center">
            <p className="text-gray-400">Loading map...</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center text-[#6366f1] text-xs">
        <MapPinIcon className="h-4 w-4 mr-1" />
        <span>Map integration will update your venue location</span>
      </div>
    </div>
  );
}

function MapPinIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
