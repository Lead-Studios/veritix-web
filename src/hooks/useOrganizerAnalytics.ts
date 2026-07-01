import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export type OrganizerAnalytics = {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  recentActivity: { date: string; action: string }[];
};

export function useOrganizerAnalytics(organizerId: string) {
  const { data, error, isLoading } = useSWR<OrganizerAnalytics>(
    organizerId ? `/api/organizers/${organizerId}/analytics` : null,
    fetcher,
    { dedupingInterval: 60_000, revalidateOnFocus: false }
  );

  return { data, error, isLoading };
}
