'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  role: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Alex Martinez',
    quote: 'VeriTix made buying tickets so easy — and knowing they\'re on-chain gives me peace of mind. The NFT collectibles are a bonus!',
    role: 'Event Attendee',
    avatar: 'AM',
    rating: 5,
  },
  {
    id: '2',
    name: 'Sarah Kim',
    quote: 'As an organizer, the analytics and NFT ticketing have transformed how I run events. Revenue tracking is transparent and instant.',
    role: 'Event Organizer',
    avatar: 'SK',
    rating: 5,
  },
  {
    id: '3',
    name: 'James Thompson',
    quote: 'No more fake tickets at the door. The QR verification is instant and reliable. Our gate operations are 50% faster now.',
    role: 'Gate Operator',
    avatar: 'JT',
    rating: 4,
  },
  {
    id: '4',
    name: 'Emily Chen',
    quote: 'I love being able to resell my tickets on the secondary market without worrying about scams. The smart contracts handle everything.',
    role: 'Concert Goer',
    avatar: 'EC',
    rating: 5,
  },
  {
    id: '5',
    name: 'Michael Roberts',
    quote: 'The platform fee is reasonable for the features you get. NFT minting, analytics, and 24/7 support — worth every penny.',
    role: 'Festival Organizer',
    avatar: 'MR',
    rating: 5,
  },
  {
    id: '6',
    name: 'Lisa Wang',
    quote: 'Finally, a ticketing platform that understands crypto. I can pay with ETH and my tickets are immediately in my wallet.',
    role: 'Crypto Enthusiast',
    avatar: 'LW',
    rating: 5,
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= rating ? 'fill-[#21d4ff] text-[#21d4ff]' : 'text-white/30'}
        />
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4 backdrop-blur"
    >
      <StarRating rating={testimonial.rating} />
      <p className="text-sm text-white/80 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4d21ff] to-[#21d4ff] text-sm font-semibold text-white">
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{testimonial.name}</p>
          <p className="text-xs text-white/50">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function LandingTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    quote: '',
    rating: 5,
  });

  // Auto-scroll on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Thank you for your testimonial! It will be reviewed before being published.');
        setIsFormOpen(false);
        setFormData({ name: '', email: '', role: '', quote: '', rating: 5 });
      } else {
        alert('There was an error submitting your testimonial. Please try again.');
      }
    } catch (error) {
      alert('There was an error submitting your testimonial. Please try again.');
    }
  };

  return (
    <section className="bg-[#0b1025] py-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="font-display text-3xl text-white sm:text-4xl text-center mb-2">
            What People Say
          </h2>
          <p className="text-sm text-white/70 text-center mb-10">
            Trusted by attendees, organizers, and operators
          </p>

          {/* Mobile Carousel */}
          <div className="lg:hidden mb-10">
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="px-4"
                >
                  <TestimonialCard testimonial={testimonials[currentIndex]} />
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-2 rounded-full transition ${
                      index === currentIndex ? 'bg-[#21d4ff]' : 'bg-white/30'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={handlePrevious}
                  className="rounded-full border border-white/20 p-2 text-white/80 transition hover:text-white"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="rounded-full border border-white/20 p-2 text-white/80 transition hover:text-white"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6 mb-10">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          {/* Submit Testimonial Button */}
          <div className="text-center">
            <motion.button
              onClick={() => setIsFormOpen(true)}
              className="rounded-full border border-[#2f3378] px-8 py-3 text-sm font-semibold text-[#7c85ff] transition hover:text-white"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Share Your Experience
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Testimonial Submission Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1025] p-6 backdrop-blur"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Share Your Experience</h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-full p-2 text-white/60 transition hover:text-white"
                  aria-label="Close form"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-[#4d21ff] focus:outline-none"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-[#4d21ff] focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-white/80 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-[#4d21ff] focus:outline-none"
                    placeholder="e.g., Event Attendee, Organizer"
                  />
                </div>

                <div>
                  <label htmlFor="quote" className="block text-sm font-medium text-white/80 mb-2">
                    Your Experience
                  </label>
                  <textarea
                    id="quote"
                    required
                    rows={4}
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-[#4d21ff] focus:outline-none resize-none"
                    placeholder="Share your experience with VeriTix..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating })}
                        className="transition hover:scale-110"
                      >
                        <Star
                          size={24}
                          className={
                            rating <= formData.rating
                              ? 'fill-[#21d4ff] text-[#21d4ff]'
                              : 'text-white/30'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-6 py-3 text-sm font-semibold text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Submit Testimonial
                </motion.button>

                <p className="text-xs text-white/50 text-center">
                  Your testimonial will be reviewed by our team before being published.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
