"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Heart,
  MapPin,
  Share2,
  Ticket,
  ChevronDown,
} from "lucide-react";
import { FaDiscord, FaFacebookF, FaXTwitter } from "react-icons/fa6";

const MotionLink = motion(Link);

const trendingEvents = [
  {
    id: 1,
    title: "Metaverse Festival",
    location: "Abuja, Nigeria",
    date: "Oct 21, 2025",
    time: "7:00PM",
    price: "$50",
    category: "Music",
    image: "/djparty.png",
  },
  {
    id: 2,
    title: "Metaverse Festival",
    location: "Abuja, Nigeria",
    date: "Oct 21, 2025",
    time: "7:00PM",
    price: "0.05ETH",
    category: "Music",
    image: "/djparty.png",
  },
  {
    id: 3,
    title: "Metaverse Festival",
    location: "Abuja, Nigeria",
    date: "Oct 21, 2025",
    time: "7:00PM",
    price: "$50",
    category: "Music",
    image: "/djparty.png",
  },
  {
    id: 4,
    title: "Metaverse Festival",
    location: "Abuja, Nigeria",
    date: "Oct 21, 2025",
    time: "7:00PM",
    price: "$50",
    category: "Music",
    image: "/djparty.png",
  },
  {
    id: 5,
    title: "Metaverse Festival",
    location: "Abuja, Nigeria",
    date: "Oct 21, 2025",
    time: "7:00PM",
    price: "$50",
    category: "Music",
    image: "/djparty.png",
  },
  {
    id: 6,
    title: "Metaverse Festival",
    location: "Abuja, Nigeria",
    date: "Oct 21, 2025",
    time: "7:00PM",
    price: "$50",
    category: "Music",
    image: "/djparty.png",
  },
];

const steps = [
  {
    id: 1,
    title: "Find Your Vibe",
    description:
      "Discover live concerts, NFT drops, or virtual meetups. Whether you love music, sports, or art, we've got you covered. Filter or dive in and explore!",
  },
  {
    id: 2,
    title: "Choose Your Adventure",
    description:
      "Found your event? Pick your ticket-General, VIP, or NFT. Own, trade, or flex your NFT tickets. Your choice, your style!",
  },
  {
    id: 3,
    title: "Lock It In",
    description:
      "Secure your spot with seamless checkout and keep your ticket in your wallet for easy access anytime.",
  },
  {
    id: 4,
    title: "Show Up, Stand Out",
    description:
      "Attend your event, earn rewards, and show off your collection as proof of the moments you've owned.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 },
};

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-[#0b1025] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0f24]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-wide text-white"
          >
            VeriTix
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-white/80 lg:flex">
            <Link href="/" className="flex flex-col text-white">
              Home
              <span className="mt-2 block h-[2px] w-8 rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff]" />
            </Link>
            <Link href="/events" className="transition hover:text-white">
              Explore
            </Link>
            <Link href="#trending" className="transition hover:text-white">
              Upcoming Events
            </Link>
            <Link href="#how-it-works" className="transition hover:text-white">
              How it Works
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm text-white/80 transition hover:text-white sm:inline-flex"
            >
              Login
            </Link>
            <MotionLink
              href="/login"
              className="hidden rounded-full border border-[#3a3c77] px-6 py-2 text-sm font-semibold text-[#7c85ff] transition hover:text-white sm:inline-flex"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Connect Wallet
            </MotionLink>
            <MotionLink
              href="/register"
              className="rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-6 py-2 text-sm font-semibold text-white"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </MotionLink>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <Image
          src="/concert.png"
          alt="Crowd celebrating"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f24] via-[#0a0f24]/90 to-[#141c44]" />

        <motion.div
          className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center lg:py-20"
          {...fadeUp}
        >
          <div className="relative flex w-full max-w-lg items-end justify-center lg:w-1/2">
            <Image
              src="/pngguru.png"
              alt="Featured performers"
              width={560}
              height={520}
              className="h-auto w-full max-w-[520px] drop-shadow-[0_40px_80px_rgba(20,18,45,0.6)]"
            />
          </div>

          <div className="flex-1 space-y-6 text-center lg:text-left">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              VeriTix
            </p>
            <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Discover, Own, and Trade
              <span className="block text-[#6f7bff]">
                Event Tickets Reimagined
              </span>
            </h1>
            <p className="max-w-xl text-base text-white/80 sm:text-lg">
              Discover real-life events, mint NFT tickets, and earn rewards with
              crypto.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <MotionLink
                href="/events/create"
                className="rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-7 py-3 text-sm font-semibold text-white"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Events
              </MotionLink>
              <MotionLink
                href="#how-it-works"
                className="rounded-full border border-[#2f3378] px-7 py-3 text-sm font-semibold text-[#7c85ff]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </MotionLink>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4 text-sm text-white/80 lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <Image
                    key={item}
                    src="/avatarfemale.png"
                    alt="Community member"
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full border-2 border-[#0b1025] object-cover"
                  />
                ))}
              </div>
              <span>Join 10,000+ users collecting event NFTs</span>
            </div>
          </div>
        </motion.div>
      </section>

      <section
        id="trending"
        className="bg-gradient-to-b from-[#0b1025] via-[#111a42] to-[#0b1025] py-16"
      >
        <motion.div className="mx-auto w-full max-w-7xl px-6" {...fadeUp}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-3xl text-white sm:text-4xl">
                Trending Events
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Discover what is hot right now
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {["Weekdays", "Event Type", "Any Category"].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center gap-2 rounded-full bg-[#e6f7ff] px-5 py-2 text-xs font-semibold text-[#0b1b33]"
                >
                  {label}
                  <ChevronDown size={16} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingEvents.map((event) => (
              <motion.article
                key={event.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(10,16,40,0.5)] backdrop-blur"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span className="rounded-lg bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-3 py-1 text-white">
                    {event.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <Share2 size={16} />
                    <Heart size={16} />
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl bg-[#141b3b]">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={420}
                    height={260}
                    className="h-44 w-full object-cover"
                  />
                </div>

                <div className="mt-5 space-y-3 text-sm text-white/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-lg text-white">
                      {event.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-white/70">
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Ticket size={16} />
                      <span>{event.price}</span>
                    </div>
                    <MotionLink
                      href="/events"
                      className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-4 py-2 text-xs font-semibold text-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      More Info
                      <span className="rounded-full bg-white/20 px-2 py-1 text-[10px]">
                        →
                      </span>
                    </MotionLink>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="bg-[#0b1025] py-10">
        <motion.div
          className="mx-auto flex w-full max-w-7xl justify-center px-6"
          {...fadeUp}
        >
          <MotionLink
            href="/events"
            className="rounded-full border border-[#2f3378] px-10 py-3 text-sm font-semibold text-[#7c85ff]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Events
          </MotionLink>
        </motion.div>
      </section>

      <section
        id="how-it-works"
        className="bg-gradient-to-b from-[#0b1025] via-[#111a3c] to-[#0b1025] py-20"
      >
        <motion.div className="mx-auto w-full max-w-7xl px-6" {...fadeUp}>
          <div className="relative mt-6">
            <div className="hidden lg:block">
              <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l border-dashed border-[#39c6ff]/80" />
              <div className="grid grid-cols-[1fr_auto_1fr] grid-rows-4 gap-x-12 gap-y-16">
                <div className="flex items-start">
                  <div className="relative">
                    <Image
                      src="/steptodown.jpg"
                      alt="Explore events ticket"
                      width={360}
                      height={340}
                      className="w-full max-w-sm rotate-[-8deg] rounded-3xl shadow-[0_30px_60px_rgba(8,12,30,0.6)]"
                    />
                    <Image
                      src="/steptodownticket.jpg"
                      alt="Pick your tickets"
                      width={320}
                      height={320}
                      className="absolute -right-6 top-10 hidden w-56 rotate-[10deg] rounded-3xl shadow-[0_30px_60px_rgba(8,12,30,0.6)] md:block"
                    />
                  </div>
                </div>
                <div className="flex items-start justify-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f7ff] text-lg font-semibold text-[#0b1b33]">
                    1
                  </span>
                </div>
                <div className="flex items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                      {steps[0].title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                      {steps[0].description}
                    </p>
                  </div>
                </div>

                <div />
                <div className="flex items-start justify-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f7ff] text-lg font-semibold text-[#0b1b33]">
                    2
                  </span>
                </div>
                <div className="flex items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                      {steps[1].title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                      {steps[1].description}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                      Lock It In
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                      {steps[2].description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start justify-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f7ff] text-lg font-semibold text-[#0b1b33]">
                    3
                  </span>
                </div>
                <div className="flex items-start justify-center">
                  <div className="relative">
                    <Image
                      src="/steptodownticket.jpg"
                      alt="Secure your spot ticket"
                      width={640}
                      height={600}
                      className="w-96 rotate-[-6deg] rounded-3xl shadow-[0_30px_60px_rgba(8,12,30,0.6)] sm:w-[26rem]"
                    />
                    <Image
                      src="/steptodown.jpg"
                      alt="Attend and earn ticket"
                      width={520}
                      height={520}
                      className="absolute -right-10 top-10 hidden w-80 rotate-[12deg] rounded-3xl shadow-[0_30px_60px_rgba(8,12,30,0.6)] md:block"
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                      Show Up, Stand Out
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                      {steps[3].description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start justify-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f7ff] text-lg font-semibold text-[#0b1b33]">
                    4
                  </span>
                </div>
                <div />
              </div>
            </div>

            <div className="space-y-12 lg:hidden">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f7ff] text-base font-semibold text-[#0b1b33]">
                  1
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {steps[0].title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    {steps[0].description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f7ff] text-base font-semibold text-[#0b1b33]">
                  2
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {steps[1].title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    {steps[1].description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f7ff] text-base font-semibold text-[#0b1b33]">
                  3
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-white">Lock It In</h3>
                  <p className="mt-2 text-sm text-white/70">
                    {steps[2].description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f7ff] text-base font-semibold text-[#0b1b33]">
                  4
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Show Up, Stand Out
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    {steps[3].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="create-event" className="bg-[#0b1025] py-32">
        <motion.div
          className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1fr_1.1fr]"
          {...fadeUp}
        >
          <div className="flex items-center justify-center">
            <Image
              src="/eventaillustration.png"
              alt="Event host illustration"
              width={520}
              height={420}
              className="w-full max-w-md"
            />
          </div>

          <div>
            <h3 className="font-display text-3xl text-white">
              Make your own Event
            </h3>
            <p className="mt-4 text-sm text-white/70">
              From live concerts to NFT drops, bring your event to life with us.
              Create, promote, and sell tickets effortlessly.
            </p>
            <MotionLink
              href="/events/create"
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-10 py-3 text-sm font-semibold text-white"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Event
            </MotionLink>
          </div>
        </motion.div>
      </section>

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
              <a
                href="#top"
                className="rounded-full bg-white/10 p-2 text-white/80 transition hover:text-white"
              >
                <FaXTwitter size={16} />
              </a>
              <a
                href="#top"
                className="rounded-full bg-white/10 p-2 text-white/80 transition hover:text-white"
              >
                <FaDiscord size={16} />
              </a>
              <a
                href="#top"
                className="rounded-full bg-white/10 p-2 text-white/80 transition hover:text-white"
              >
                <FaFacebookF size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Quick Links</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <Link href="/events" className="transition hover:text-white">
                  Attendees
                </Link>
              </li>
              <li>
                <Link href="/events" className="transition hover:text-white">
                  Organiser
                </Link>
              </li>
              <li>
                <Link href="/events" className="transition hover:text-white">
                  Promoters
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="transition hover:text-white"
                >
                  How it Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Plan Events</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <Link
                  href="/events/create"
                  className="transition hover:text-white"
                >
                  Create and Setup
                </Link>
              </li>
              <li>
                <Link href="/events" className="transition hover:text-white">
                  Sell Tickets
                </Link>
              </li>
              <li>
                <Link href="/events" className="transition hover:text-white">
                  Online RSVP
                </Link>
              </li>
              <li>
                <Link href="/events" className="transition hover:text-white">
                  Online Event
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Legal</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a href="#top" className="transition hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#top" className="transition hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#top" className="transition hover:text-white">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#top" className="transition hover:text-white">
                  Host Events
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">
              Never Miss an Event
            </h4>
            <p className="text-sm text-white/70">
              Get updates on trending events, exclusive NFT drops, and crypto
              rewards.
            </p>
            <form className="flex items-center gap-3">
              <div className="flex flex-1 rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] p-[1px]">
                <div className="flex w-full items-center rounded-full bg-[#0b1025] px-4 py-2">
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    className="flex-1 bg-transparent text-xs text-white placeholder:text-white/50 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                className="whitespace-nowrap rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-4 py-2 text-xs font-semibold text-white"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
}
