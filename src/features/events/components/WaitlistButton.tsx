"use client";

import { useWaitlist } from "@/hooks/useWaitlist";
import { Button } from "@/components/ui/button";

interface WaitlistButtonProps {
  eventId: string;
  initialPosition: number | null;
}

export const WaitlistButton = ({ eventId, initialPosition }: WaitlistButtonProps) => {
  const { position, isLoading, joinWaitlist, leaveWaitlist } = useWaitlist(
    eventId,
    initialPosition
  );

  if (position !== null) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-gray-600">
          You are #{position} on the waitlist
        </p>
        <Button
          onClick={leaveWaitlist}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? "Leaving..." : "Leave Waitlist"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={joinWaitlist}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "Joining..." : "Join Waitlist"}
    </Button>
  );
};