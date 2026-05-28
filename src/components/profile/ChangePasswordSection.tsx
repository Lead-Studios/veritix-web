"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/button";
import { changePassword } from "@/lib/profile";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordSection() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully!");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password.");
    }
  };

  return (
    <section aria-labelledby="change-password-heading" className="rounded-2xl border border-white/10 bg-[#0b1025] p-6">
      <h2 id="change-password-heading" className="mb-5 text-lg font-semibold text-white">
        Change Password
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          name="currentPassword"
          control={control}
          label="Current Password"
          type="password"
        />
        <Input
          name="newPassword"
          control={control}
          label="New Password"
          type="password"
        />
        <Input
          name="confirmPassword"
          control={control}
          label="Confirm New Password"
          type="password"
        />
        {errors.root && (
          <p role="alert" className="text-sm text-red-500">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full py-3">
          {isSubmitting ? "Updating…" : "Update Password"}
        </Button>
      </form>
    </section>
  );
}
