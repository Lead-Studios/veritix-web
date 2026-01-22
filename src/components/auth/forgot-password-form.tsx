'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Input } from "../input";
import { TbUserPlus } from "react-icons/tb";
import { Button } from "../button";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const {
    handleSubmit,
    formState: { isSubmitting },
    control
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Forgot Password data:', data);
    toast.success('Magic link sent successful! (Demo)');
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
          Forgot Password
        </h2>
        <p className="text-primary-gray">No worries, we&apos;ll help you reset it and get you back to your events in no time.</p>
      </motion.div>

      <div>
        <motion.form
          className="space-y-10"
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
              placeholder="Enter your registered email address"
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
                {isSubmitting ? 'Sending Magic Link...' : 'Send Magic Link'}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
}