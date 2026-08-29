'use client';

import useSWRMutation from 'swr/mutation';

async function checkInFetcher(url: string, { arg }: { arg: { ticketId: string } }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Check-in failed');
  }
  return res.json();
}

export function useTicketCheckIn() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/tickets/check-in',
    checkInFetcher,
  );

  const checkInOptimistic = async (ticketId: string) => {
    return trigger(
      { ticketId },
      {
        optimisticData: { success: true, ticketId, status: 'CHECKED_IN' },
        rollbackOnError: true,
        revalidate: false,
      },
    );
  };

  return { checkIn: checkInOptimistic, isMutating, error };
}
