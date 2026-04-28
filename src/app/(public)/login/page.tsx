import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";
import SessionExpiredBanner from "@/components/auth/SessionExpiredBanner";

export const metadata = {
  title: "Login | VeriTix",
  description: "Blockchain-powered ticketing on Stellar",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1025] px-6 text-white">
      <div className="w-full max-w-md space-y-4">
        <Suspense>
          <SessionExpiredBanner />
        </Suspense>
        <LoginForm />
      </div>
    </main>
  );
}
