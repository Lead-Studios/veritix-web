import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b1025] flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <p className="text-[#6B8CFF] text-sm font-semibold uppercase tracking-widest">404</p>
        <h1 className="text-4xl font-bold text-white">Page Not Found</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
