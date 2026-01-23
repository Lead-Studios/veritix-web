import { ToastContainer } from "react-toastify";
import "./global.css";

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
      <body className="text-primary-black">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
