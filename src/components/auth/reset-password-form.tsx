'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Input } from "../input";
import { TbUserPlus } from "react-icons/tb";
import { Button } from "../button";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const resetPasswordSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string("Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const {
    handleSubmit,
    formState: { isSubmitting },
    control
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Reset password data:', data);
    toast.success('reset password successful! (Demo)');
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
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="flex flex-col h-full pt-26"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="mb-10 text-center space-y-5"
        variants={headerVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Create a New Password
        </h2>
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
              <Button
                disabled={isSubmitting}
                className="w-full py-4"
              >
                {isSubmitting ? 'Reseting Password...' : 'Reset Password'}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
}