'use client';

import { motion } from 'framer-motion';

const testimonials = [
  { name: 'Alex M.', quote: 'VeriTix made buying tickets so easy — and knowing they\'re on-chain gives me peace of mind.', role: 'Event Attendee' },
  { name: 'Sarah K.', quote: 'As an organizer, the analytics and NFT ticketing have transformed how I run events.', role: 'Event Organizer' },
  { name: 'James T.', quote: 'No more fake tickets at the door. The QR verification is instant and reliable.', role: 'Gate Operator' },
];

export default function LandingTestimonials() {
  return (
    <section className="bg-[#0b1025] py-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="font-display text-3xl text-white sm:text-4xl text-center mb-2">What People Say</h2>
          <p className="text-sm text-white/70 text-center mb-10">Trusted by attendees, organizers, and operators</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                <p className="text-sm text-white/80 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/50">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
