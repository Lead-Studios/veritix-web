import { ToastContainer } from "react-toastify";
import { Manrope, Playfair_Display } from "next/font/google";
import "./global.css";
import { AuthProvider } from "@/context/authContext";
import { ThemeProvider } from "@/context/ThemeContext";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-[#0b1025] dark:bg-[#0b1025] text-white antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
