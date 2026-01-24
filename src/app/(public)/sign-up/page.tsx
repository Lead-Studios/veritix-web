import AuthLayout from "@/src/components/auth/auth-layout";
import SignUpForm from "@/src/components/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | VeriTix",
  description: "Blockchain-powered ticketing on Stellar",
};

export default function page() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  )
}
