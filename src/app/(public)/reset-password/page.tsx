import AuthLayout from "@/components/auth/auth-layout";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | VeriTix",
  description: "Blockchain-powered ticketing on Stellar",
};

export default function page() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  )
}
