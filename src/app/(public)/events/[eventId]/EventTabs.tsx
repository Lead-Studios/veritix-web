'use client';

import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import TabSelector from '@/components/TabSelector';
import { AppImage } from '@/components/shared/AppImage';
import type { Event } from '@/types/event';

type TabType = 'about' | 'schedule' | 'performers';

interface EventTabsProps {
  description?: string;
  schedule?: Event['schedule'];
  performers?: Event['performers'];
  children: ReactNode;
}

export default function EventTabs({ description, schedule, performers, children }: EventTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('about');

  return (
    <>
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
                {description && (
                  <div className="space-y-4 p-4">
                    <p className="text-gray-300 leading-relaxed">{description}</p>
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
                    Whether you&apos;re a hardcore raver, casual music fan, or just looking to soak up the sun with good vibes, the Summer Dance Festival is your ticket to a weekend of freedom, connection, and movement. Let&apos;s dance the summer away!
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'schedule' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 p-4"
              >
                {schedule && schedule.length > 0 ? (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-4">Schedule</h2>
                    {schedule.map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-[#4D21FF] font-semibold text-sm w-24 shrink-0">{item.time}</div>
                        <div>
                          <p className="text-white font-semibold">{item.title}</p>
                          {item.description && <p className="text-gray-400 text-sm mt-1">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Schedule Coming Soon</h3>
                    <p className="text-gray-400">Event schedule will be announced closer to the date</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'performers' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 p-4"
              >
                {performers && performers.length > 0 ? (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-4">Performers</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {performers.map((performer, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                          {performer.image ? (
                            <AppImage
                              src={performer.image}
                              alt={performer.name}
                              width={64}
                              height={64}
                              className="w-16 h-16 rounded-full object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4D21FF] to-[#21D4FF] flex items-center justify-center text-white font-bold text-xl">
                              {performer.name.charAt(0)}
                            </div>
                          )}
                          <p className="text-white font-semibold text-sm">{performer.name}</p>
                          <p className="text-gray-400 text-xs">{performer.role}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🎤</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Performers Coming Soon</h3>
                    <p className="text-gray-400">Lineup will be announced soon</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Ticket Options - Full Width Below */}
          <div className="w-full">{children}</div>
        </div>
      </section>
    </>
  );
}
