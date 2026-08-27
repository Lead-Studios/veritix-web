export interface PayoutRecord {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Settled' | 'Failed';
  transactionRef: string;
}




export async function fetchOrganizerPayouts(organizerId: string): Promise<PayoutRecord[]> {
  const response = await fetch(`/api/organizers/${organizerId}/payouts`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch payout history: ${response.statusText}`);
  }

  return response.json();
}