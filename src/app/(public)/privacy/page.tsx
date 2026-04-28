import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | VeriTix",
  description: "VeriTix Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0b1025] text-white px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link href="/" className="text-sm text-white/60 hover:text-white transition">← Back to Home</Link>

        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-white/60 text-sm">Last updated: April 2026</p>

        <section className="space-y-4 text-white/80 text-sm leading-relaxed">
          <p>
            VeriTix (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your personal
            information. This Privacy Policy explains how we collect, use, and safeguard data
            when you use our platform.
          </p>

          <h2 className="text-lg font-semibold text-white">Information We Collect</h2>
          <p>
            We collect information you provide directly (such as your email address and wallet
            address during registration), as well as usage data generated when you interact with
            our services.
          </p>

          <h2 className="text-lg font-semibold text-white">How We Use Your Information</h2>
          <p>
            We use your information to operate and improve the platform, process ticket
            transactions, send service-related communications, and comply with legal obligations.
          </p>

          <h2 className="text-lg font-semibold text-white">Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share data with service providers who
            assist us in operating the platform, subject to confidentiality obligations.
          </p>

          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <p>
            For privacy-related inquiries, please contact us via our{" "}
            <Link href="/contact" className="underline hover:text-white">contact page</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
