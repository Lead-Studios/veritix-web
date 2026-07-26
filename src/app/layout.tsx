import { ToastContainer } from "react-toastify";
import { Manrope, Playfair_Display } from "next/font/google";
import type { Metadata } from "next";
import "./global.css";
import { AuthProvider } from "@/context/authContext";
import { validateEnvironment } from "@/lib/envValidation";
import { KeyboardShortcutHelp } from "@/components/KeyboardShortcutHelp";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VeriTix",
    template: "%s | VeriTix",
  },
  description: "Blockchain-powered ticketing on Stellar",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://veritix.io",
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  validateEnvironment();
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${bodyFont.variable} ${displayFont.variable} bg-[#0b1025] text-white antialiased`}
      >
        {/* Skip-to-content link for keyboard users */}
        <a
          href="#main-content"
          className="absolute left-[-9999px] z-[9999] rounded-b bg-purple-700 px-4 py-2 text-sm font-semibold text-white no-underline focus-visible:left-1/2 focus-visible:-translate-x-1/2 focus-visible:outline-none"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <KeyboardShortcutHelp />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
        </AuthProvider>
        <ToastContainer
          aria-label="Notifications"
          position="bottom-right"
          closeOnClick
          pauseOnFocusLoss
        />
      </body>
    </html>
  );
}
