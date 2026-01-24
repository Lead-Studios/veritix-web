'use client';

import { useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';

export default function BackButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className="px-5 py-3 bg-primary-light-blue rounded-2xl text-sm flex items-center gap-4">
      Back <FaArrowRight size={16} />
    </button>
  );
}
