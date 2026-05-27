import Link from 'next/link';

export default function EventNotFound() {
  return (
    <div className="min-h-screen bg-[#0b1025] flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <div className="text-6xl">🎫</div>
        <h1 className="text-4xl font-bold text-white">Event Not Found</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          This event doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/events"
          className="inline-block rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Browse Events
        </Link>
      </div>
    </div>
  );
}
