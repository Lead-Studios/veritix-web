"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { Input } from "../ui/input";
import { TbUserPlus } from "react-icons/tb";
import { Button } from "../button";
import Link from "next/link";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { IoWallet } from "react-icons/io5";
import PasswordStrengthGuide from "./PasswordStrengthGuide";

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Please enter a valid email address"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type FormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    setError
  } = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const passwordValue = useWatch({ control, name: "password", defaultValue: "" });

  const onSubmit = async (data: FormValues) => {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      if (result?.errors && typeof result.errors === "object") {
        Object.entries(result.errors).forEach(([field, message]) => {
          // react-hook-form field error injection
          // @ts-ignore
          setError(field as keyof FormValues, {
            type: "server",
            message: String(message),
          });
        });
      }

      throw new Error(result?.message || "Registration failed");
    }

    toast.success("Account created successfully");

    // router.push("/login");

  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
  }
};

  const handleGoogleSignUp = () => {
    console.log("Google sign up clicked");
    toast.success("Google sign up (Demo)");
  };

  const handleWalletSignUp = () => {
    console.log("Wallet sign up clicked");
    toast.success("Wallet sign up (Demo)");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="flex flex-col justify-between min-h-screen md:min-h-0 md:h-full py-6 px-4 md:px-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className="text-3xl md:text-4xl text-center font-bold text-gray-900 mb-8"
        variants={itemVariants}
      >
        Create Your Account
      </motion.h2>

      <div className="flex-1 flex flex-col justify-center">
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-5"
          variants={containerVariants}
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={itemVariants}
          >
            <Input
              name="firstName"
              control={control}
              label="First Name"
              icon={<TbUserPlus />}
              type="text"
              placeholder="Enter your Firstname"
            />
            <Input
              name="lastName"
              control={control}
              label="Last Name"
              icon={<TbUserPlus />}
              type="text"
              placeholder="Enter your Lastname"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              name="username"
              control={control}
              label="Username"
              icon={<TbUserPlus />}
              type="text"
              placeholder="Enter your Username"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              name="email"
              control={control}
              label="Email"
              icon={<TbUserPlus />}
              type="email"
              placeholder="Enter your Email Address"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              name="password"
              control={control}
              label="Password"
              icon={<TbUserPlus />}
              type="password"
              placeholder="Enter your Password"
            />
            <PasswordStrengthGuide password={passwordValue} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                disabled={isSubmitting}
                className="w-full py-3 md:py-4 text-base md:text-lg mt-2"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      </div>

      <motion.div
        className="flex items-center gap-4 my-4"
        variants={itemVariants}
      >
        <div className="flex-1 h-px bg-primary-black"></div>
        <span className="text-sm lg:text-xl">or register with</span>
        <div className="flex-1 h-px bg-primary-black"></div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
        variants={itemVariants}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={handleGoogleSignUp}
            variant="outline"
            disabled={isSubmitting}
            className="w-full py-3 md:py-4 text-base md:text-lg mt-2"
          >
            <div className="flex items-center gap-2">
              <FcGoogle />
              <p className="text-sm font-medium">Google</p>
            </div>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={handleWalletSignUp}
            variant="outline"
            disabled={isSubmitting}
            className="w-full py-3 md:py-4 text-base md:text-lg mt-2"
          >
            <div className="flex items-center gap-2">
              <IoWallet />
              <p className="text-sm font-medium">Wallet</p>
            </div>
          </Button>
        </motion.div>
      </motion.div>

      <motion.p className="text-center lg:text-xl mt-6" variants={itemVariants}>
        Already have an account?{" "}
        <Link href="/login" className="font-bold">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}
