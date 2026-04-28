import Link from "next/link";

export const metadata = {
  title: "Terms of Service | VeriTix",
  description: "VeriTix Terms of Service",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#0b1025] text-white px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link href="/" className="text-sm text-white/60 hover:text-white transition">← Back to Home</Link>

        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-white/60 text-sm">Last updated: April 2026</p>

        <section className="space-y-4 text-white/80 text-sm leading-relaxed">
          <p>
            By accessing or using VeriTix, you agree to be bound by these Terms of Service.
            Please read them carefully before using the platform.
          </p>

          <h2 className="text-lg font-semibold text-white">Use of the Platform</h2>
          <p>
            You may use VeriTix only for lawful purposes and in accordance with these Terms.
            You are responsible for maintaining the security of your wallet and account credentials.
          </p>

          <h2 className="text-lg font-semibold text-white">Ticket Purchases</h2>
          <p>
            All ticket purchases are final unless otherwise stated by the event organizer.
            Tickets are issued as NFTs on the Stellar blockchain and are subject to the
            organizer&apos;s transfer and refund policies.
          </p>

          <h2 className="text-lg font-semibold text-white">Prohibited Conduct</h2>
          <p>
            You may not use the platform to engage in fraud, scalping beyond permitted limits,
            or any activity that violates applicable law or the rights of others.
          </p>

          <h2 className="text-lg font-semibold text-white">Limitation of Liability</h2>
          <p>
            VeriTix is provided &quot;as is&quot;. To the maximum extent permitted by law, we disclaim
            all warranties and limit our liability for indirect or consequential damages.
          </p>

          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <p>
            Questions about these Terms? Reach us via our{" "}
            <Link href="/contact" className="underline hover:text-white">contact page</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
