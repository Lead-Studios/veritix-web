import { ToastContainer } from "react-toastify";
import { Manrope, Playfair_Display } from "next/font/google";
import "./global.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-[#0b1025] text-white`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
