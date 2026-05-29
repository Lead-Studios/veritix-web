'use client';

import Link from 'next/link';
import { FaDiscord, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import NewsletterForm from '@/components/NewsletterForm';

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050a1f] py-16">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.3fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="inline-block h-2 w-2 rounded-full bg-[#7c85ff]" />
            VeriTix
          </div>
          <p className="text-sm text-white/70">
            Your gateway to unforgettable events-live, virtual, or in the
            metaverse. Discover, own, and trade NFT tickets, earn crypto
            rewards, and join a community of event lovers. The future of
            ticketing starts here.
          </p>
          <div className="flex items-center gap-3">
            <a href="#top" className="rounded-full bg-white/10 p-2 text-white/80 transition hover:text-white">
              <FaXTwitter size={16} />
            </a>
            <a href="#top" className="rounded-full bg-white/10 p-2 text-white/80 transition hover:text-white">
              <FaDiscord size={16} />
            </a>
            <a href="#top" className="rounded-full bg-white/10 p-2 text-white/80 transition hover:text-white">
              <FaFacebookF size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li><Link href="/events" className="transition hover:text-white">Attendees</Link></li>
            <li><Link href="/events/create" className="transition hover:text-white">Organiser</Link></li>
            <li><Link href="/events" className="transition hover:text-white">Promoters</Link></li>
            <li><Link href="#how-it-works" className="transition hover:text-white">How it Works</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Plan Events</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li><Link href="/events/create" className="transition hover:text-white">Create and Setup</Link></li>
            <li><Link href="/events" className="transition hover:text-white">Sell Tickets</Link></li>
            <li><Link href="/events" className="transition hover:text-white">Online RSVP</Link></li>
            <li><Link href="/events" className="transition hover:text-white">Online Event</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Legal</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li><Link href="/privacy" className="transition hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="transition hover:text-white">Terms of Service</Link></li>
            <li><Link href="/cookies" className="transition hover:text-white">Cookie Policy</Link></li>
            <li><Link href="/events/create" className="transition hover:text-white">Host Events</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white">Never Miss an Event</h4>
          <p className="text-sm text-white/70">
            Get updates on trending events, exclusive NFT drops, and crypto rewards.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </footer>
  );
}
