import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | VeriTix",
  description: "VeriTix Cookie Policy",
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#0b1025] text-white px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link href="/" className="text-sm text-white/60 hover:text-white transition">← Back to Home</Link>

        <h1 className="text-4xl font-bold">Cookie Policy</h1>
        <p className="text-white/60 text-sm">Last updated: April 2026</p>

        <section className="space-y-4 text-white/80 text-sm leading-relaxed">
          <p>
            VeriTix uses cookies and similar technologies to provide, improve, and secure our
            services. This Cookie Policy explains what cookies we use and why.
          </p>

          <h2 className="text-lg font-semibold text-white">What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website.
            They help us remember your preferences and understand how you use our platform.
          </p>

          <h2 className="text-lg font-semibold text-white">Cookies We Use</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><span className="font-medium text-white">Essential cookies</span> – required for the platform to function (e.g., session management).</li>
            <li><span className="font-medium text-white">Analytics cookies</span> – help us understand usage patterns to improve the experience.</li>
            <li><span className="font-medium text-white">Preference cookies</span> – remember your settings across visits.</li>
          </ul>

          <h2 className="text-lg font-semibold text-white">Managing Cookies</h2>
          <p>
            You can control cookies through your browser settings. Disabling essential cookies
            may affect platform functionality.
          </p>

          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <p>
            For cookie-related questions, contact us via our{" "}
            <Link href="/contact" className="underline hover:text-white">contact page</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
