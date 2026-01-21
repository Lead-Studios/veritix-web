"use client";

import { motion } from "framer-motion";
import ContactInfo from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";
import Navbar from "@/src/components/Navbar";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen  bg-gradient-to-br from-[#020617] via-[#020617] to-[#0a1b3d] text-white">
        <main className="mx-auto max-w-7xl px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ContactInfo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ContactForm />
          </motion.div>
        </main>
      </div>
    </>
  );
}
