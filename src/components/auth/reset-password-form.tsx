"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import z from "zod";
import { Input } from "../ui/input";
import { TbUserPlus } from "react-icons/tb";
import { Button } from "../button";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import PasswordStrengthGuide from "./PasswordStrengthGuide";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

const resetPasswordSchema = z
  .object({
    password: z
      .string("Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const passwordValue = useWatch({ control, name: "password", defaultValue: "" });

  // No token — show recovery path immediately
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-20">
        <h2 className="text-2xl font-bold">Invalid or Expired Link</h2>
        <p className="text-primary-gray max-w-sm">
          This password reset link is missing or has expired. Request a new one
          to continue.
        </p>
        <Link
          href="/forgot-password"
          className="mt-4 inline-block rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-8 py-3 text-sm font-semibold text-white"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message: string = err?.message ?? "";
        if (res.status === 400 || message.toLowerCase().includes("expired") || message.toLowerCase().includes("invalid")) {
          toast.error("This reset link has expired or is invalid. Please request a new one.");
        } else {
          toast.error(message || "Failed to reset password. Please try again.");
        }
        return;
      }

      toast.success("Password reset successful! You can now log in.");
      router.push("/login");
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="flex flex-col h-full pt-26"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="mb-10 text-center space-y-5" variants={headerVariants}>
        <h2 className="text-3xl md:text-4xl font-bold">Create a New Password</h2>
        <p className="text-primary-gray">Make it strong, make it secure. 🔒</p>
      </motion.div>

      <div>
        <motion.form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Input
              name="password"
              icon={<TbUserPlus />}
              control={control}
              label="New Password"
              type="password"
              placeholder="Please enter a new password"
            />
            <PasswordStrengthGuide password={passwordValue} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              name="confirmPassword"
              icon={<TbUserPlus />}
              control={control}
              label="Confirm Password"
              type="password"
              placeholder="Please confirm your new password"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button disabled={isSubmitting} className="w-full py-4">
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
}
