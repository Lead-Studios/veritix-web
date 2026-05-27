"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/button";
import { getProfile, updateProfile } from "@/lib/profile";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function ProfileEditSection() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    getProfile()
      .then((data) => reset(data))
      .catch(() => toast.error("Failed to load profile."));
  }, [reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateProfile(data);
      toast.success("Profile saved!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile.");
    }
  };

  return (
    <section aria-labelledby="profile-edit-heading" className="rounded-2xl border border-white/10 bg-[#0b1025] p-6">
      <h2 id="profile-edit-heading" className="mb-5 text-lg font-semibold text-white">
        Profile
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input name="name" control={control} label="Name" />
        <Input name="email" control={control} label="Email" type="email" />
        {errors.root && (
          <p role="alert" className="text-sm text-red-500">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full py-3">
          {isSubmitting ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </section>
  );
}
