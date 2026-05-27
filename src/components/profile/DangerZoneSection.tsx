"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-toastify";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/button";
import { deleteAccount } from "@/lib/profile";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Props {
  /** The signed-in user's email, used for confirmation matching */
  userEmail: string;
}

const makeSchema = (email: string) =>
  z.object({
    email: z.string().refine((v) => v === email, {
      message: "Email does not match your account email",
    }),
  });

export default function DangerZoneSection({ userEmail }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const schema = makeSchema(userEmail);
  type FormValues = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onConfirm = async (data: FormValues) => {
    try {
      await deleteAccount(data.email);
      toast.success("Account deleted.");
      logout();
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete account.");
    }
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <section
      aria-labelledby="danger-zone-heading"
      className="rounded-2xl border border-red-500/30 bg-[#0b1025] p-6"
    >
      <h2 id="danger-zone-heading" className="mb-2 text-lg font-semibold text-red-400">
        Danger Zone
      </h2>
      <p className="mb-4 text-sm text-white/60">
        Permanently delete your account and all associated data. This action cannot be undone.
      </p>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-red-500 bg-transparent text-red-400 hover:bg-red-500/10"
      >
        Delete Account
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        title="Delete Account"
        description="This action is permanent and cannot be undone. Type your email address to confirm."
        size="sm"
      >
        <form onSubmit={handleSubmit(onConfirm)} className="space-y-4" noValidate>
          <Input
            name="email"
            control={control}
            label="Your email address"
            type="email"
            placeholder={userEmail}
          />
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 border border-red-500 bg-red-600 text-white hover:bg-red-700"
            >
              {isSubmitting ? "Deleting…" : "Delete Account"}
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
