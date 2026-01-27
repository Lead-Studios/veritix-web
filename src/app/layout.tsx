import { ToastContainer } from "react-toastify";
import { Manrope, Playfair_Display } from "next/font/google";
import "./global.css";

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
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-[#0b1025] text-white antialiased`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
