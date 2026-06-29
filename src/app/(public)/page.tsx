"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Heart,
  MapPin,
  Share2,
  Ticket,
  ChevronDown,
  Search,
} from "lucide-react";
import useSWR from "swr";
import { howItWorksSteps } from "@/mocks/landing";
import { fetchEvents } from "@/lib/eventsApi";
import type { Event } from "@/types/event";

import { WalletButton } from "@/components/navbar/WalletButton";
 const LandingTestimonials = dynamic(
   () => import("@/components/landing/LandingTestimonials"),
   { ssr: false, loading: () => <div className="bg-[#0b1025] py-20 h-64 animate-pulse" /> }
);

const LandingFooter = dynamic(
  () => import("@/components/landing/LandingFooter"),
  { ssr: false, loading: () => <div className="bg-[#050a1f] py-16 h-48 animate-pulse" /> }
);

const MotionLink = motion(Link);

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
  viewport: { once: true, amount: 0.2 },
};

function TrendingEventCard({ event }: { event: Event }) {
  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";
  return (
    <motion.article
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
          src={event.imageUrl ?? "/djparty.png"}
          alt={event.name}
          width={420}
          height={260}
          className="h-44 w-full object-cover"
        />
      </div>

      <div className="mt-5 space-y-3 text-sm text-white/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{event.venue}</span>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg text-white">{event.name}</h3>
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
            href={`/events/${event.id}`}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-4 py-2 text-xs font-semibold text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            More Info
            <span className="rounded-full bg-white/20 px-2 py-1 text-[10px]">→</span>
          </MotionLink>
        </div>
      </div>
    </motion.article>
  );
}

function EventCardSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 w-16 rounded-lg bg-white/10" />
        <div className="flex gap-3">
          <div className="h-4 w-4 rounded bg-white/10" />
          <div className="h-4 w-4 rounded bg-white/10" />
        </div>
      </div>
      <div className="mt-4 h-44 rounded-2xl bg-white/10" />
      <div className="mt-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-4 w-16 rounded bg-white/10" />
        </div>
        <div className="h-5 w-3/4 rounded bg-white/10" />
        <div className="h-4 w-1/2 rounded bg-white/10" />
        <div className="flex justify-between pt-2">
          <div className="h-6 w-16 rounded bg-white/10" />
          <div className="h-8 w-24 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [searchQ, setSearchQ] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const { data: allEvents, isLoading: eventsLoading } = useSWR<Event[]>("events", fetchEvents, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  const trendingEvents = (() => {
    if (!allEvents) return [];
    const featured = allEvents.filter((e) => e.featured);
    const display = featured.length >= 3 ? featured : [...featured, ...allEvents.filter((e) => !e.featured)];
    return display.slice(0, 3);
  })();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQ.trim()) params.set("q", searchQ.trim());
    if (searchLocation.trim()) params.set("location", searchLocation.trim());
    if (searchDate.trim()) params.set("date", searchDate.trim());
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div id="top" className="min-h-screen bg-[#0b1025] text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0f24]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-wide text-white"
            aria-label="VeriTix home"
          >
            VeriTix
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm text-white/80 lg:flex">
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
              href="/sign-up"
              className="rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-6 py-2 text-sm font-semibold text-white"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </MotionLink>
          </div>
        </div>
      </header>

      <main id="main-content">
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

            <form onSubmit={handleSearchSubmit} className="mt-8 w-full max-w-2xl mx-auto lg:mx-0 rounded-2xl md:rounded-full bg-[#101428]/80 border border-white/10 p-2 md:p-3 shadow-xl backdrop-blur flex flex-col md:flex-row gap-2 md:gap-0 md:items-center">
              <div className="flex-1 flex items-center px-3 border-b md:border-b-0 md:border-r border-white/10 pb-2 md:pb-0">
                <Search className="text-[#6f7bff] mr-2 h-5 w-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search events, artists..."
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none text-white placeholder:text-white/40"
                  aria-label="Event name or keyword"
                />
              </div>
              <div className="flex-1 flex items-center px-3 border-b md:border-b-0 md:border-r border-white/10 pb-2 md:pb-0">
                <MapPin className="text-[#6f7bff] mr-2 h-5 w-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none text-white placeholder:text-white/40"
                  aria-label="Event location"
                />
              </div>
              <div className="flex-1 flex items-center px-3 pb-2 md:pb-0">
                <Calendar className="text-[#6f7bff] mr-2 h-5 w-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Date..."
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none text-white placeholder:text-white/40"
                  aria-label="Event date"
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto rounded-xl md:rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95 shadow-md flex items-center justify-center gap-2"
              >
                <span>Search</span>
              </button>
            </form>

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
            {eventsLoading
              ? [0, 1, 2].map((i) => <EventCardSkeleton key={i} />)
              : trendingEvents.map((event) => (
                  <TrendingEventCard key={event.id} event={event} />
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
                      {howItWorksSteps[0].title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                      {howItWorksSteps[0].description}
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
                      {howItWorksSteps[1].title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                      {howItWorksSteps[1].description}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                      Lock It In
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                      {howItWorksSteps[2].description}
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
                      {howItWorksSteps[3].description}
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
                    {howItWorksSteps[0].title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    {howItWorksSteps[0].description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f7ff] text-base font-semibold text-[#0b1b33]">
                  2
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {howItWorksSteps[1].title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    {howItWorksSteps[1].description}
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
                    {howItWorksSteps[2].description}
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
                    {howItWorksSteps[3].description}
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

      </main>

      <LandingTestimonials />
      <LandingFooter />
    </div>
  );
}