"use client";

import React from "react";
import { EventFormData } from "@/app/(protected)/events/create/page";

interface EventSummaryProps {
  formData: EventFormData;
}

export default function EventSummary({ formData }: EventSummaryProps) {
  const formatDate = (date: string, time: string) => {
    if (!date) return "Not set yet";
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (time) {
      const [hours, minutes] = time.split(":");
      const formattedTime = new Date(
        2000,
        0,
        1,
        parseInt(hours),
        parseInt(minutes)
      ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return `${formattedDate} at ${formattedTime}`;
    }
    return formattedDate;
  };

  const getDateRange = () => {
    if (!formData.startDate && !formData.endDate) return "Not set yet";
    const start = formatDate(formData.startDate, formData.startTime);
    const end = formatDate(formData.endDate, formData.endTime);
    if (formData.startDate === formData.endDate) {
      return start;
    }
    return `${start} - ${end}`;
  };

  const getLocation = () => {
    if (formData.eventType === "online") return "Online Event";
    if (!formData.venueName && !formData.address) return "No venue Specified";
    return formData.venueName || formData.address || "No venue Specified";
  };

  const getTicketTypes = () => {
    if (formData.tickets.length === 0) return "No tickets yet";
    const ticketNames = formData.tickets
      .filter((t) => t.name)
      .map((t) => t.name);
    return ticketNames.length > 0 ? ticketNames.join(", ") : "No title yet";
  };

  const getBlockchain = () => {
    if (!formData.blockchainNetwork) return "No network selected";
    return formData.blockchainNetwork.charAt(0).toUpperCase() +
      formData.blockchainNetwork.slice(1);
  };

  return (
    <div className="bg-gray-900/80 rounded-xl p-6 border border-gray-800 text-white">
      <h3 className="text-xl font-bold mb-6 text-white">Event Summary</h3>

      <div className="space-y-4">
        {/* Cover Image Preview */}
        <div className="w-full h-32 bg-gray-800 rounded-lg overflow-hidden">
          {formData.coverImage ? (
            <img
              src={URL.createObjectURL(formData.coverImage)}
              alt="Event cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No image
            </div>
          )}
        </div>

        {/* Event Title */}
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">Event Title</p>
          <p className="text-base font-semibold text-white">
            {formData.title || "No title yet"}
          </p>
        </div>

        {/* Date & Time */}
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">Date & Time</p>
          <p className="text-base text-white">{getDateRange()}</p>
        </div>

        {/* Location */}
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">Location</p>
          <p className="text-base text-white">{getLocation()}</p>
        </div>

        {/* Ticket Types */}
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">Ticket Types</p>
          <p className="text-base text-white">{getTicketTypes()}</p>
        </div>

        {/* Blockchain */}
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">Blockchain</p>
          <p className="text-base text-white">{getBlockchain()}</p>
        </div>
      </div>
    </div>
  );
}
