'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Input } from "../input";
import { TbUserPlus } from "react-icons/tb";
import { Button } from "../button";
import Link from "next/link";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string('Please enter your password').min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const {
    handleSubmit,
    formState: { isSubmitting },
    control
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Login data:', data);
    toast.success("Login successful! (Demo)")
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
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
              <Button
                disabled={isSubmitting}
                className="w-full py-4"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      </div>

      <motion.p
        className="text-center lg:text-xl mt-6"
        variants={itemVariants}
      >
        Don&apos;t have an account?{' '}
        <Link
          href="/sign-up"
          className="font-bold"
        >
          Sign Up
        </Link>
      </motion.p>
    </motion.div>
  );
}