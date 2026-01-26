"use client";

import React from "react";
import { EventFormData } from "@/app/(protected)/events/create/page";
import Toggle from "../ui/Toggle";

interface TicketInformationProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
}

export default function TicketInformation({
  formData,
  updateFormData,
}: TicketInformationProps) {
  const addTicketType = () => {
    updateFormData({
      tickets: [
        ...formData.tickets,
        {
          name: "",
          quantity: 0,
          price: "",
          description: "",
          transferable: true,
          resellable: false,
          resellPriceLimit: "",
        },
      ],
    });
  };

  const updateTicket = (index: number, updates: Partial<EventFormData["tickets"][0]>) => {
    const newTickets = [...formData.tickets];
    newTickets[index] = { ...newTickets[index], ...updates };
    updateFormData({ tickets: newTickets });
  };

  const removeTicket = (index: number) => {
    if (formData.tickets.length > 1) {
      const newTickets = formData.tickets.filter((_, i) => i !== index);
      updateFormData({ tickets: newTickets });
    }
  };

  return (
    <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          4
        </div>
        <h2 className="text-2xl font-bold text-white">Ticket Information</h2>
      </div>

      <div className="space-y-8">
        {formData.tickets.map((ticket, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4v-3a2 2 0 00-2-2H5z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-white">
                  Ticket Type {index + 1}
                </h3>
              </div>
              {formData.tickets.length > 1 && (
                <button
                  onClick={() => removeTicket(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Ticket Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ticket Name
                </label>
                <input
                  type="text"
                  value={ticket.name}
                  onChange={(e) => updateTicket(index, { name: e.target.value })}
                  placeholder="e.g. VIP, General admission"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              {/* Quantity and Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quantity Available
                  </label>
                  <input
                    type="number"
                    value={ticket.quantity}
                    onChange={(e) =>
                      updateTicket(index, {
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (ETH)
                  </label>
                  <input
                    type="text"
                    value={ticket.price}
                    onChange={(e) => updateTicket(index, { price: e.target.value })}
                    placeholder="e.g. 0.05"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={ticket.description}
                  onChange={(e) =>
                    updateTicket(index, { description: e.target.value })
                  }
                  placeholder="Enter benefits, restriction etc."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              {/* Blockchain Settings */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-gray-300">
                  Blockchain Settings
                </h4>

                {/* Transferable */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">
                    Allow ticket holders to transfer tickets to others
                  </label>
                  <Toggle
                    checked={ticket.transferable}
                    onChange={(checked) =>
                      updateTicket(index, { transferable: checked })
                    }
                  />
                </div>

                {/* Resellable */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">
                    Allow ticket holders to resell tickets on secondary market
                  </label>
                  <Toggle
                    checked={ticket.resellable}
                    onChange={(checked) =>
                      updateTicket(index, { resellable: checked })
                    }
                  />
                </div>

                {/* Resell Price Limit */}
                {ticket.resellable && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Resell Price Limit ($)
                    </label>
                    <input
                      type="text"
                      value={ticket.resellPriceLimit}
                      onChange={(e) =>
                        updateTicket(index, { resellPriceLimit: e.target.value })
                      }
                      placeholder="e.g. 75"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum percentage of original price (0-100%)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add Another Ticket Type Button */}
        <button
          onClick={addTicketType}
          className="w-full border-2 border-dashed border-gray-700 hover:border-blue-600 rounded-lg py-4 flex items-center justify-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Another Ticket Type
        </button>
      </div>
    </section>
  );
}
