"use client";

import React, { useState } from "react";
import BasicInformation from "@/components/events/create/BasicInformation";
import DateAndTime from "@/components/events/create/DateAndTime";
import Location from "@/components/events/create/Location";
import TicketInformation from "@/components/events/create/TicketInformation";
import BlockchainSetting from "@/components/events/create/BlockchainSetting";
import EventSummary from "@/components/events/create/EventSummary";

export interface EventFormData {
  // Basic Information
  title: string;
  description: string;
  coverImage: File | null;
  gallery: File[];
  
  // Date & Time
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  
  // Location
  eventType: "physical" | "online" | "hybrid";
  venueName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Ticket Information
  tickets: Array<{
    name: string;
    quantity: number;
    price: string;
    description: string;
    transferable: boolean;
    resellable: boolean;
    resellPriceLimit: string;
  }>;
  
  // Blockchain Setting
  blockchainNetwork: "ethereum" | "polygon" | "solana";
  treasuryAddress: string;
  creatorRoyalty: number;
}

const initialFormData: EventFormData = {
  title: "",
  description: "",
  coverImage: null,
  gallery: [],
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  eventType: "physical",
  venueName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  tickets: [
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
  blockchainNetwork: "ethereum",
  treasuryAddress: "",
  creatorRoyalty: 3,
};

export default function CreateEventPage() {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);

  const updateFormData = (updates: Partial<EventFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleCreateEvent = () => {
    // TODO: Implement event creation logic
    console.log("Creating event:", formData);
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft logic
    console.log("Saving draft:", formData);
  };

  return (
    <div className="min-h-screen bg-[#0a0e21] text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900/50 to-blue-800/30 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-white">Veritix</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Title Section */}
      <div className="px-8 py-6 bg-gradient-to-r from-[#0a0e21] to-blue-900/20">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-200 bg-clip-text text-transparent mb-2">
          Create New Event
        </h2>
        <p className="text-gray-300">
          Fill in the details below to create your blockchain-powered event.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex gap-8 px-8 py-6">
        {/* Left Column - Form */}
        <div className="flex-1 space-y-8 overflow-y-auto max-h-[calc(100vh-120px)] pr-4">
          <BasicInformation
            formData={formData}
            updateFormData={updateFormData}
          />
          <DateAndTime formData={formData} updateFormData={updateFormData} />
          <Location formData={formData} updateFormData={updateFormData} />
          <TicketInformation
            formData={formData}
            updateFormData={updateFormData}
          />
          <BlockchainSetting
            formData={formData}
            updateFormData={updateFormData}
          />
        </div>

        {/* Right Column - Event Summary & Actions */}
        <div className="w-96 flex-shrink-0 space-y-6">
          <EventSummary formData={formData} />
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleCreateEvent}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-200 hover:from-blue-800 hover:to-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Create Event
            </button>
            <button
              onClick={handleSaveDraft}
              className="w-full bg-white text-gray-900 border-2 border-gray-300 hover:border-gray-400 font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
