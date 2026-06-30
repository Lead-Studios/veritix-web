import { ToastContainer } from "react-toastify";
import { Manrope, Playfair_Display } from "next/font/google";
import "./global.css";
import { AuthProvider } from "@/context/authContext";
import CookieBanner from "@/components/CookieBanner";
import OfflineBanner from "@/components/OfflineBanner";

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

export const metadata = {
  title: "VeriTix",
  description: "Blockchain-powered ticketing on Stellar",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#4d21ff" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-[#0b1025] text-white antialiased`}>
        <OfflineBanner />
        <AuthProvider>
          {children}
        </AuthProvider>
        <CookieBanner />
        <ToastContainer />
      </body>
    </html>
  );
}
