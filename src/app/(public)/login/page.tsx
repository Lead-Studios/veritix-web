import AuthLayout from "@/src/components/auth/auth-layout";
import LoginForm from "@/src/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | VeriTix",
  description: "Blockchain-powered ticketing on Stellar",
};

export default function page() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
