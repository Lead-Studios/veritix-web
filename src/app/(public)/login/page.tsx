import { Suspense } from "react";
import AuthLayout from "@/components/auth/auth-layout";
import LoginForm from "@/components/auth/login-form";
import SessionExpiredBanner from "@/components/auth/SessionExpiredBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | VeriTix",
  description: "Blockchain-powered ticketing on Stellar",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense>
        <SessionExpiredBanner />
      </Suspense>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
