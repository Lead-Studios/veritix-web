"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Input } from "../ui/input";
import { TbUserPlus } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../button";
import Link from "next/link";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { loginUser } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z
    .string("Please enter your password")
    .min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await loginUser({ email: data.email, password: data.password });
      toast.success("Login successful!");
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError("root", { message });
    }
  };

  const handleGoogleLogin = () => {
    try {
      window.location.href = "/api/auth/google";
    } catch {
      toast.error("Google sign-in failed. Please try again.");
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
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="flex flex-col justify-between h-full py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className="text-3xl md:text-4xl text-center font-bold text-gray-900 mb-8"
        variants={headerVariants}
      >
        Welcome Back
      </motion.h2>

      <div>
        <motion.form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Input
              name="email"
              control={control}
              label="Email"
              icon={<TbUserPlus />}
              type="email"
              placeholder=""
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              name="password"
              icon={<TbUserPlus />}
              control={control}
              label="Password"
              type="password"
              showForgotPassword
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {errors.root && (
                <p role="alert" className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                  {errors.root.message}
                </p>
              )}
              <Button disabled={isSubmitting} className="w-full py-4">
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      </div>

      <motion.div className="flex items-center gap-4 my-4" variants={itemVariants}>
        <div className="flex-1 h-px bg-primary-black" />
        <span className="text-sm lg:text-xl">or continue with</span>
        <div className="flex-1 h-px bg-primary-black" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            disabled={isSubmitting}
            className="w-full py-4"
            type="button"
          >
            <div className="flex items-center justify-center gap-2">
              <FcGoogle size={20} />
              <span className="text-sm font-medium">Continue with Google</span>
            </div>
          </Button>
        </motion.div>
      </motion.div>

      <motion.p className="text-center lg:text-xl mt-6" variants={itemVariants}>
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-bold">
          Sign Up
        </Link>
      </motion.p>
    </motion.div>
  );
}
