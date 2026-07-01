"use client";

import { useState } from "react";
import useSWR from "swr";

interface Payout {
  id: string;
  date: string;
  amount: number;
  eventName: string;
  status: "Pending" | "Sent";
  reference: string;
}

interface PayoutsResponse {
  data: Payout[];
  hasMore: boolean;
}

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token") ?? "";
}

async function fetchPayouts(page: number): Promise<PayoutsResponse> {
  const res = await fetch(`/api/organizer/payouts?page=${page}&limit=10`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch payouts");
  return res.json() as Promise<PayoutsResponse>;
}

function formatCurrency(n: number) {
  return `₦ ${n.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

export function PayoutHistory() {
  const [page, setPage] = useState(1);
  const [allPayouts, setAllPayouts] = useState<Payout[]>([]);

  const { data, error, isLoading } = useSWR(
    `payouts-page-${page}`,
    () => fetchPayouts(page),
    {
      revalidateOnFocus: false,
      onSuccess: (res) => {
        setAllPayouts((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      },
    }
  );

  const hasMore = data?.hasMore ?? false;

  if (isLoading && page === 1) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-400">Failed to load payout history.</p>
    );
  }

  if (allPayouts.length === 0) {
    return <p className="text-sm text-gray-500">No payouts yet.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm text-left text-white/80">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase text-[#21D4FF]">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {allPayouts.map((payout) => (
              <tr key={payout.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(payout.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3">{payout.eventName}</td>
                <td className="px-4 py-3 font-semibold text-white">{formatCurrency(payout.amount)}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{payout.reference}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      payout.status === "Sent"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {payout.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={isLoading}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2 text-sm text-[#21D4FF] transition hover:bg-white/10 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
