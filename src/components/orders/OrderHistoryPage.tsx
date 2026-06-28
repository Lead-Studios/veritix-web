"use client";

import { useState } from "react";
import useSWR from "swr";
import { HiOutlineRefresh } from "react-icons/hi";

interface Order {
  id: string;
  eventName: string;
  eventDate: string;
  ticketType: string;
  quantity: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "refunded" | "failed";
  createdAt: string;
}

const STATUS_CONFIG: Record<Order["status"], { label: string; className: string }> = {
  confirmed: { label: "Confirmed", className: "bg-green-900/60 text-green-300 border border-green-700" },
  pending: { label: "Pending", className: "bg-yellow-900/60 text-yellow-300 border border-yellow-700" },
  refunded: { label: "Refunded", className: "bg-gray-700/60 text-gray-400 border border-gray-600" },
  failed: { label: "Failed", className: "bg-red-900/60 text-red-300 border border-red-700" },
};

async function fetcher(url: string): Promise<Order[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export function OrderHistoryPage() {
  const { data: orders, error, isLoading, mutate } = useSWR("/api/orders/my", fetcher, {
    refreshInterval: 30_000,
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Order History</h1>
          <p className="text-sm text-gray-400 mt-1">View your past ticket purchases and their status.</p>
        </div>
        <button
          onClick={() => mutate()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:border-white/20 transition-colors disabled:opacity-50"
        >
          <HiOutlineRefresh className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-700/30 bg-red-900/10 p-4 text-sm text-red-300">
          Failed to load orders. Please try again.
        </div>
      )}

      {isLoading && !orders && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {orders && orders.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#020718]/80 p-12 text-center space-y-3">
          <p className="text-4xl">🎫</p>
          <h2 className="text-lg font-semibold text-white">No Orders Yet</h2>
          <p className="text-sm text-gray-400">When you purchase tickets, they will appear here.</p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status];
            const isExpanded = expandedId === order.id;

            return (
              <div
                key={order.id}
                className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-white truncate">{order.eventName}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.ticketType} &middot; {order.quantity} ticket{order.quantity > 1 ? "s" : ""} &middot;{" "}
                        {order.totalPrice} XLM
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                      <span className="text-gray-600 text-sm">{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">Order ID</span>
                        <p className="text-white font-mono mt-0.5">{order.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Event Date</span>
                        <p className="text-white mt-0.5">{new Date(order.eventDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
