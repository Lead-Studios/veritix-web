"use client";

export default function ProtectedSkeleton() {
  return (
    <div className="animate-pulse min-h-screen bg-white p-6">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-gray-100 rounded" />)}
      </div>
    </div>
  );
}
