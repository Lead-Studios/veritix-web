import Link from "next/link";
import { FaDiscord, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import NewsletterForm from "@/components/NewsletterForm";
import { StellarNetworkBadge } from "@/components/shared/StellarNetworkBadge";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0f24]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-semibold tracking-wide text-white" aria-label="VeriTix home">
            VeriTix
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm text-white/80 lg:flex">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <Link href="/events" className="transition hover:text-white">Explore</Link>
            <Link href="/#how-it-works" className="transition hover:text-white">How it Works</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <StellarNetworkBadge />
            <Link href="/login" className="hidden text-sm text-white/80 transition hover:text-white sm:inline-flex">
              Login
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-6 py-2 text-sm font-semibold text-white"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-[#050a1f] py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.3fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-white">
              <span className="inline-block h-2 w-2 rounded-full bg-[#7c85ff]" />
              VeriTix
            </div>
            <p className="text-sm text-white/70">
              Your gateway to unforgettable events — live, virtual, or in the metaverse.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="rounded-full bg-white/10 p-2 text-white/80 transition hover:text-white">
                <FaXTwitter size={16} />
              </a>
              <a href="#" aria-label="Discord" className="rounded-full bg-white/10 p-2 text-white/80 transition hover:text-white">
                <FaDiscord size={16} />
              </a>
              <a href="#" aria-label="Facebook" className="rounded-full bg-white/10 p-2 text-white/80 transition hover:text-white">
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
              <li><Link href="/#how-it-works" className="transition hover:text-white">How it Works</Link></li>
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
    </>
  );
}
