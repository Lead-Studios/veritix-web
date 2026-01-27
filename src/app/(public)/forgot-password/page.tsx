import AuthLayout from "@/components/auth/auth-layout";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | VeriTix",
  description: "Blockchain-powered ticketing on Stellar",
};

export default function page() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
