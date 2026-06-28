"use client";

import { useRef } from "react";
import { HiOutlinePrinter } from "react-icons/hi";

interface OrderReceiptPageProps {
  order: {
    id: string;
    eventName: string;
    eventDate: string;
    venue: string;
    ticketType: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: string;
    purchasedAt: string;
    ticketCode: string;
    payerEmail?: string;
  };
}

export function OrderReceiptPage({ order }: OrderReceiptPageProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-end mb-6 print:hidden">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl bg-[#4D21FF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3d18cc] transition-colors"
        >
          <HiOutlinePrinter className="w-4 h-4" />
          Print Receipt
        </button>
      </div>

      <div
        ref={printRef}
        className="rounded-2xl border border-white/10 bg-white p-8 space-y-6 text-gray-900"
      >
        <div className="text-center border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold">Receipt</h1>
          <p className="text-sm text-gray-500 mt-1">Order #{order.id.slice(0, 8).toUpperCase()}</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Event</p>
              <p className="font-semibold">{order.eventName}</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-semibold">{new Date(order.eventDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Venue</p>
              <p className="font-semibold">{order.venue}</p>
            </div>
            <div>
              <p className="text-gray-500">Ticket Type</p>
              <p className="font-semibold">{order.ticketType}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Quantity</span>
              <span className="font-semibold">{order.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Unit Price</span>
              <span className="font-semibold">{order.unitPrice} XLM</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
              <span className="font-bold">Total</span>
              <span className="font-bold">{order.totalPrice} XLM</span>
            </div>
          </div>

          {order.payerEmail && (
            <div className="text-sm">
              <p className="text-gray-500">Email</p>
              <p className="font-semibold">{order.payerEmail}</p>
            </div>
          )}

          <div className="text-sm">
            <p className="text-gray-500">Ticket Code</p>
            <p className="font-mono font-semibold text-sm">{order.ticketCode}</p>
          </div>

          <div className="text-sm">
            <p className="text-gray-500">Purchased At</p>
            <p className="font-semibold">
              {new Date(order.purchasedAt).toLocaleString()}
            </p>
          </div>

          <div className="text-sm">
            <p className="text-gray-500">Status</p>
            <p className="font-semibold capitalize">{order.status}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          <p>Veritix &middot; Stellar Network</p>
          <p className="mt-0.5">This is your official receipt. Keep it for your records.</p>
        </div>
      </div>
    </div>
  );
}
