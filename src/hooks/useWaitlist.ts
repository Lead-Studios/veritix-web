import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";

export const useWaitlist = (eventId: string, initialPosition: number | null) => {
  const [position, setPosition] = useState(initialPosition);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const joinWaitlist = async () => {
    if (status === "unauthenticated") {
      router.push(`/login?next=/events/${eventId}`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/waitlist`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to join waitlist");
      const { position } = await res.json();
      setPosition(position);
      toast.success("You are on the waitlist! We will notify you if tickets become available.");
    } catch (error) {
      toast.error("There was an issue joining the waitlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const leaveWaitlist = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/waitlist`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to leave waitlist");
      setPosition(null);
    } catch (error) {
      toast.error("There was an issue leaving the waitlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    position,
    isLoading,
    joinWaitlist,
    leaveWaitlist,
  };
};