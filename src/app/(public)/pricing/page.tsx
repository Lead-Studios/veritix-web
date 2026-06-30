"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import dynamic from "next/dynamic";

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

const pricingTiers = [
  {
    name: "Free",
    description: "Perfect for getting started",
    tickets: "Up to 50 tickets",
    fee: "5% platform fee",
    price: "$0",
    features: [
      "Up to 50 tickets per event",
      "Basic event analytics",
      "Email support",
      "Standard ticket types",
      "Basic QR code tickets",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    description: "For growing organizers",
    tickets: "Up to 500 tickets",
    fee: "3% platform fee",
    price: "$29",
    period: "/month",
    features: [
      "Up to 500 tickets per event",
      "Advanced analytics dashboard",
      "Priority email support",
      "Custom ticket designs",
      "NFT ticket minting",
      "Social media integration",
      "Promotional tools",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large-scale events",
    tickets: "Unlimited tickets",
    fee: "Custom pricing",
    price: "Custom",
    features: [
      "Unlimited tickets",
      "Dedicated account manager",
      "24/7 phone support",
      "White-label solution",
      "Custom integrations",
      "Advanced security features",
      "Multi-event management",
      "Revenue sharing options",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const comparisonFeatures = [
  { name: "Tickets per event", free: "50", pro: "500", enterprise: "Unlimited" },
  { name: "Platform fee", free: "5%", pro: "3%", enterprise: "Custom" },
  { name: "NFT ticket minting", free: false, pro: true, enterprise: true },
  { name: "Custom ticket designs", free: false, pro: true, enterprise: true },
  { name: "Analytics dashboard", free: "Basic", pro: "Advanced", enterprise: "Advanced" },
  { name: "Email support", free: "Standard", pro: "Priority", enterprise: "24/7" },
  { name: "Social media integration", free: false, pro: true, enterprise: true },
  { name: "White-label solution", free: false, pro: false, enterprise: true },
  { name: "Custom integrations", free: false, pro: false, enterprise: true },
];

const faqs = [
  {
    question: "When do I get paid?",
    answer: "Payments are processed within 5-7 business days after your event concludes. You can track your earnings in real-time through your dashboard. For Pro and Enterprise plans, expedited payment options are available.",
  },
  {
    question: "What is the platform fee?",
    answer: "The platform fee is a percentage charged on each ticket sale. Free tier has a 5% fee, Pro tier has a 3% fee, and Enterprise tier offers custom pricing based on your event volume and requirements.",
  },
  {
    question: "Is there a setup fee?",
    answer: "No, there are no setup fees for any tier. You can create events and start selling tickets immediately. Enterprise plans may have custom implementation fees for specialized integrations.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0b1025] text-white">
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
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link href="/events" className="transition hover:text-white">
              Explore
            </Link>
            <Link href="/pricing" className="flex flex-col text-white">
              Pricing
              <span className="mt-2 block h-[2px] w-8 rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff]" />
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

      <main>
        <section className="bg-gradient-to-b from-[#0b1025] via-[#111a42] to-[#0b1025] py-20">
          <motion.div className="mx-auto w-full max-w-7xl px-6 text-center" {...fadeUp}>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Pricing
            </p>
            <h1 className="font-display mt-4 text-4xl text-white sm:text-5xl lg:text-6xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
              Choose the perfect plan for your events. Start free and scale as you grow.
            </p>
          </motion.div>
        </section>

        <section className="bg-[#0b1025] py-16">
          <motion.div className="mx-auto w-full max-w-7xl px-6" {...fadeUp}>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pricingTiers.map((tier) => (
                <motion.article
                  key={tier.name}
                  className={`relative rounded-3xl border p-8 backdrop-blur ${
                    tier.popular
                      ? "border-[#4d21ff] bg-gradient-to-b from-[#1a1f3a] to-[#0f1428] shadow-[0_20px_60px_rgba(77,33,255,0.2)]"
                      : "border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(10,16,40,0.5)]"
                  }`}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-4 py-1 text-xs font-semibold text-white">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                    <p className="mt-2 text-sm text-white/70">{tier.description}</p>
                    <div className="mt-6">
                      <span className="text-5xl font-bold text-white">{tier.price}</span>
                      {tier.period && (
                        <span className="text-lg text-white/60">{tier.period}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-white/80">{tier.tickets}</p>
                    <p className="text-sm text-[#7c85ff]">{tier.fee}</p>
                  </div>

                  <ul className="mt-8 space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-white/80">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#21d4ff]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <MotionLink
                    href={`/sign-up?plan=${tier.name.toLowerCase()}`}
                    className={`mt-8 block w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition ${
                      tier.popular
                        ? "bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] text-white"
                        : "border border-[#3a3c77] text-[#7c85ff] hover:text-white"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tier.cta}
                  </MotionLink>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="bg-gradient-to-b from-[#0b1025] via-[#111a42] to-[#0b1025] py-16">
          <motion.div className="mx-auto w-full max-w-7xl px-6" {...fadeUp}>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl text-white sm:text-4xl">
                Compare Features
              </h2>
              <p className="mt-2 text-sm text-white/70">
                See what's included in each plan
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#7c85ff]">
                      Pro
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr
                      key={feature.name}
                      className={`border-b border-white/5 ${
                        index % 2 === 0 ? "bg-white/[0.02]" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-white/80">{feature.name}</td>
                      <td className="px-6 py-4 text-center text-sm text-white/80">
                        {typeof feature.free === "boolean" ? (
                          feature.free ? (
                            <Check className="mx-auto h-5 w-5 text-[#21d4ff]" />
                          ) : (
                            <span className="text-white/30">—</span>
                          )
                        ) : (
                          feature.free
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-[#7c85ff]">
                        {typeof feature.pro === "boolean" ? (
                          feature.pro ? (
                            <Check className="mx-auto h-5 w-5 text-[#21d4ff]" />
                          ) : (
                            <span className="text-white/30">—</span>
                          )
                        ) : (
                          feature.pro
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-white/80">
                        {typeof feature.enterprise === "boolean" ? (
                          feature.enterprise ? (
                            <Check className="mx-auto h-5 w-5 text-[#21d4ff]" />
                          ) : (
                            <span className="text-white/30">—</span>
                          )
                        ) : (
                          feature.enterprise
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        <section className="bg-[#0b1025] py-16">
          <motion.div className="mx-auto w-full max-w-3xl px-6" {...fadeUp}>
            <div className="mb-12 text-center">
              <h2 className="font-display text-3xl text-white sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Everything you need to know about our pricing
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                    aria-expanded={openFaq === index}
                  >
                    <span className="text-base font-semibold text-white">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-white/60" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-white/60" />
                    )}
                  </button>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-5"
                    >
                      <p className="text-sm text-white/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="bg-gradient-to-b from-[#0b1025] via-[#111a42] to-[#0b1025] py-20">
          <motion.div className="mx-auto w-full max-w-4xl px-6 text-center" {...fadeUp}>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-base text-white/80">
              Join thousands of organizers using VeriTix to create amazing events.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <MotionLink
                href="/sign-up"
                className="rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-8 py-3 text-sm font-semibold text-white"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Free
              </MotionLink>
              <MotionLink
                href="/events/create"
                className="rounded-full border border-[#2f3378] px-8 py-3 text-sm font-semibold text-[#7c85ff]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Event
              </MotionLink>
            </div>
          </motion.div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
