'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiCalendar, HiClock, HiLocationMarker, HiUsers, HiShare, HiHeart, HiCheck, HiArrowLeft } from 'react-icons/hi';
import TabSelector from '@/components/TabSelector';
import WalletConnectModal from '@/components/events/WalletConnectModal';
import { getEventById } from '@/mocks/events';
type TabType = 'about' | 'schedule' | 'performers';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const event = getEventById(params.eventId as string);

  if (!event) {
    return (
      <div className="min-h-screen bg-primary-dark-blue flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Event Not Found</h1>
          <p className="text-gray-400">The event you're looking for doesn't exist.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/events')}
            className="mt-6 px-8 py-3 bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl"
          >
            Back to Events
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark-blue">
      {/* Hero Section */}
      <section className="relative h-80 overflow-hidden">
        {/* Background Image with large text overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }} />

          {/* Large background text with event name */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="text-[12rem] font-black text-orange-600/30 uppercase tracking-tight leading-none whitespace-nowrap">
              {event.name}
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
              <div className="flex items-start justify-between">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                  {event.name}
                </h1>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <HiShare className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className={`
                      p-2.5 rounded-full backdrop-blur-sm transition-all duration-300
                      ${isLiked
                        ? 'bg-pink-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                      }
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

      {/* Event Info Bar */}
      <section className="relative ">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="p-2">
                <HiCalendar className="w-5 h-5 text-[#4D21FF]" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">{event.date}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="p-2">
                <HiClock className="w-5 h-5 text-[#4D21FF]" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">{event.time}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 ">
                <HiLocationMarker className="w-5 h-5 text-[#4D21FF]" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">{event.venue}</p>
              </div>
            </motion.div>

            {event.attendees && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className="p-2.5 ">
                  <HiUsers className="w-5 h-5 text-[#4D21FF]" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{event.attendees}+ attendees</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <TabSelector
        tabs={['about', 'schedule', 'performers']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content */}
      <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-8">
          {/* Main Content */}
          <div className="space-y-8">
            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {event.description && (
                  <div className="space-y-4 p-4">
                    <p className="text-gray-300 leading-relaxed">{event.description}</p>
                  </div>
                )}

                <div className="space-y-4 p-4">
                  <h2 className="text-2xl font-bold text-white">What to expect:</h2>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>Live performances from internationally acclaimed DJs and artists</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Dance battles, workshops, and flash mobs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-pink-400 mt-1">•</span>
                      <span>Themed stages from house, EDM, Afrobeat, and more</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>Food trucks, art installations, and wellness lounges</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>After-dark glow parties and sunrise dance sessions</span>
                    </li>
                  </ul>
                </div>

                <div className="p-2 ">
                  <p className="text-gray-300 leading-relaxed">
                    Whether you're a hardcore raver, casual music fan, or just looking to soak up the sun with good vibes, the Summer Dance Festival is your ticket to a weekend of freedom, connection, and movement. Let's dance the summer away!
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'schedule' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-white mb-2">Schedule Coming Soon</h3>
                <p className="text-gray-400">Event schedule will be announced closer to the date</p>
              </motion.div>
            )}

            {activeTab === 'performers' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🎤</div>
                <h3 className="text-2xl font-bold text-white mb-2">Performers Coming Soon</h3>
                <p className="text-gray-400">Lineup will be announced soon</p>
              </motion.div>
            )}
          </div>

          {/* Ticket Options - Full Width Below */}
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-[#00062580]/50 border border-[#E0E0E033]/20 overflow-hidden"
            >
              <div className="bg-[#4D21FF] p-5">
                <h2 className="text-xl font-bold text-white">Ticket Options</h2>
              </div>

              <div className="p-6">
                {event.ticketOptions && event.ticketOptions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                    {event.ticketOptions.map((ticket, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-5 rounded-xl bg-[#00062580]/50 border hover:border-white/10 transition-all duration-300 ${index === 0 ? 'border-[#4D21FF]' : 'border-[#E0E0E033]/20'}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-base font-bold text-white">{ticket.name}</h3>
                          {ticket.popular && (
                            <span className="px-8 py-3 rounded-full text-xs font-bold  text-[#4D21FF] border border-[#4D21FF]">
                              Popular
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 mb-3">{ticket.description}</p>

                        {ticket.benefits.length > 0 && (
                          <ul className="space-y-1.5 mb-4">
                            {ticket.benefits.map((benefit, i) => (
                              <li key={i} className="text-xs text-gray-400">
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex items-end justify-between p-3 ">
                          <div>
                            <div className="text-xl font-bold text-[#4D21FF]">
                              {ticket.price} ETH
                            </div>
                          </div>
                          <p className="text-xs text-gray-300">{ticket.remaining} remaining</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🎫</div>
                    <p className="text-gray-400 text-sm">Ticket info coming soon</p>
                  </div>
                )}

                <div className="space-y-4 p-6">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setIsModalOpen(true)}
                    className="w-full max-w-[519px] py-3.5 lg:py-4.25 lg:px-17.25 lg:h-15 lg:rounded-lg  bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300 mx-auto block"
                  >
                    Connect Wallet to Purchase
                  </motion.button>

                  <p className="text-xs text-gray-500 leading-relaxed p-6 align-left max-w-xl">
                    All tickets are minted as unique NFTs on the Ethereum blockchain — secure, verifiable, and yours to own!
                    Tickets are fully transferable and resellable via official marketplace or any compatible platform.
                    Gas fees are not included in the listed prices and may vary at checkout.
                    Gain exclusive digital collectibles and perks with select ticket tiers
                  </p>
                </div>
              </div>
               {/* Event Organizer - Below Tickets */}
            {event.organizer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4  p-6"
              >
                <h3 className="text-base font-bold text-white mb-4">Event Organizer</h3>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B8CFF] to-[#5AB9EA] flex items-center justify-center text-white font-bold text-sm">
                    {event.organizer.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 ">
                      <h4 className="font-semibold text-white text-sm">{event.organizer.name}</h4>
                   
                    </div>
                    <p className="text-xs text-[#FFFFFF]">{event.organizer.description}</p>
                       {event.organizer.verified && (
                        <span className="text-white text-sm">
                          <HiCheck className="inline w-4 h-4 mr-1 bg-green-400 border border-green-400 rounded-sm" /> Verified Organizer</span>
                      )}
                  </div>
                </div>
              </motion.div>
            )}
            </motion.div>

          </div>
        </div>
      </section>

      <WalletConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
