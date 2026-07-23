'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';
import { PurchaseModal } from "@/features/events/components/PurchaseModal";
import type { Event } from '@/types/event';

interface TicketPurchaseProps {
  eventId: string;
  eventName: string;
  ticketOptions?: Event['ticketOptions'];
  organizer?: Event['organizer'];
}

export default function TicketPurchase({ eventId, eventName, ticketOptions, organizer }: TicketPurchaseProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const tickets = ticketOptions ?? [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-[#00062580]/50 border border-[#E0E0E033]/20 overflow-hidden"
      >
        <div className="bg-[#4D21FF] p-5">
          <h2 className="text-xl font-bold text-white">Ticket Options</h2>
        </div>

        <div className="p-6">
          {tickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
              {tickets.map((ticket, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => { setSelectedTicketIndex(index); setQuantity(1); }}
                  className={`p-5 rounded-xl bg-[#00062580]/50 border hover:border-white/10 transition-all duration-300 cursor-pointer ${selectedTicketIndex === index ? 'border-[#4D21FF]' : 'border-[#E0E0E033]/20'}`}
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
                    {ticket.remaining === 0 ? (
                      <span className="text-xs font-semibold text-red-400">Sold out</span>
                    ) : (
                      <p className="text-xs text-gray-300">{ticket.remaining} remaining</p>
                    )}
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

          {tickets.length > 0 && (() => {
            const selected = tickets[selectedTicketIndex];
            const isSoldOut = selected.remaining === 0;
            const maxQty = Math.min(selected.remaining, 10);
            const totalPrice = (selected.price * quantity).toFixed(4);
            return (
              <div className="border border-[#E0E0E033]/20 rounded-xl p-4 mb-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1 || isSoldOut}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20 disabled:opacity-40 transition"
                    >
                      −
                    </button>
                    <span className="text-white font-semibold w-6 text-center">{quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={quantity >= maxQty || isSoldOut}
                      onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                      className="w-8 h-8 rounded-full bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20 disabled:opacity-40 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{selected.name} × {quantity}</span>
                  <span className="text-white font-bold">{totalPrice} ETH</span>
                </div>
              </div>
            );
          })()}

          <div className="space-y-4 p-6">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setIsModalOpen(true)}
              disabled={tickets[selectedTicketIndex]?.remaining === 0}
              className="w-full max-w-[519px] py-3.5 lg:py-4.25 lg:px-17.25 lg:h-15 lg:rounded-lg  bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300 mx-auto block disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tickets[selectedTicketIndex]?.remaining === 0
                ? 'Sold Out'
                : 'Purchase Tickets'}
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
        {organizer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4  p-6"
          >
            <h3 className="text-base font-bold text-white mb-4">Event Organizer</h3>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B8CFF] to-[#5AB9EA] flex items-center justify-center text-white font-bold text-sm">
                {organizer.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 ">
                  <h4 className="font-semibold text-white text-sm">{organizer.name}</h4>
                </div>
                <p className="text-xs text-[#FFFFFF]">{organizer.description}</p>
                {organizer.verified && (
                  <span className="text-white text-sm">
                    <HiCheck className="inline w-4 h-4 mr-1 bg-green-400 border border-green-400 rounded-sm" /> Verified Organizer</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <PurchaseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventName={eventName}
        ticket={
          tickets[selectedTicketIndex]
            ? {
                name: tickets[selectedTicketIndex].name,
                description: tickets[selectedTicketIndex].description,
                benefits: tickets[selectedTicketIndex].benefits,
                price: tickets[selectedTicketIndex].price,
                remaining: tickets[selectedTicketIndex].remaining,
              }
            : null
        }
        quantity={quantity}
        eventId={eventId}
      />
    </>
  );
}
