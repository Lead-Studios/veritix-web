'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiCheck, HiHeart, HiShare } from 'react-icons/hi';
import { Breadcrumb } from '@/components/ui';
import { useFavorite } from '@/hooks/useFavorite';

interface EventHeroProps {
  eventId: string;
  eventName: string;
  image?: string;
}

export default function EventHero({ eventId, eventName, image }: EventHeroProps) {
  const router = useRouter();
  const { isLiked, isPending, error: favoriteError, toggle: toggleFavorite } = useFavorite(eventId);
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: eventName, url });
      } catch {
        // user cancelled or error - do nothing
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  return (
    <>
      <section className="relative h-80 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />

          {/* Large background text with event name */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="text-[12rem] font-black text-orange-600/30 uppercase tracking-tight leading-none whitespace-nowrap">
              {eventName}
            </div>
          </div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
              >
                <HiArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </motion.button>
              <Breadcrumb
                className="text-white/70"
                items={[
                  { label: "Events", href: "/events" },
                  { label: eventName },
                ]}
              />
              <div className="flex items-start justify-between">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                  {eventName}
                </h1>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    aria-label={shareCopied ? 'Link copied!' : 'Share event'}
                    className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
                  >
                    {shareCopied ? <HiCheck className="w-5 h-5 text-green-400" /> : <HiShare className="w-5 h-5" />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleFavorite}
                    disabled={isPending}
                    aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                    aria-pressed={isLiked}
                    className={`
                      p-2.5 rounded-full backdrop-blur-sm transition-all duration-300
                      ${isLiked
                        ? 'bg-pink-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                      }
                      ${isPending ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                  >
                    <HiHeart className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {favoriteError && (
        <div role="alert" className="bg-red-900/80 text-red-200 text-sm px-4 py-2 text-center">
          {favoriteError}
        </div>
      )}
    </>
  );
}
