"use client";

import React, { useMemo, useEffect } from "react";
import Image from "next/image";
import { EventFormData } from "@/app/(protected)/events/create/page";
import { describeRecurrence } from "@/lib/recurrence";

interface EventSummaryProps {
  formData: EventFormData;
}

export default function EventSummary({ formData }: EventSummaryProps) {
  const coverImageUrl = useMemo(
    () => (formData.coverImage ? URL.createObjectURL(formData.coverImage) : null),
    [formData.coverImage]
  );

  useEffect(() => {
    return () => {
      if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
    };
  }, [coverImageUrl]);
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
        <div className="w-full h-32 bg-gray-800 rounded-lg overflow-hidden relative">
          {formData.coverImage ? (
            <Image
              src={coverImageUrl!}
              alt="Event cover"
              fill
              unoptimized
              className="object-cover"
              sizes="100vw"
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

        {/* Recurrence */}
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">Recurrence</p>
          <p className="text-base text-white">
            {describeRecurrence(formData.recurrence)}
          </p>
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

        {/* Ticket totals & pricing */}
        {formData.tickets.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-400 mb-2">Pricing Overview</p>
            <div className="space-y-1">
              {formData.tickets.filter((t) => t.name).map((t, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-300 truncate max-w-[60%]">{t.name || 'Unnamed'}</span>
                  <span className="text-white font-medium">
                    {t.price ? `${t.price} ETH` : 'Free'} &times; {t.quantity || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Draft completeness */}
        <div>
          <p className="text-sm font-medium text-gray-400 mb-2">Completeness</p>
          <div className="space-y-1">
            {[
              { label: 'Title', done: !!formData.title },
              { label: 'Dates', done: !!(formData.startDate && formData.endDate) },
              { label: 'Location', done: !!(formData.eventType === 'online' || formData.venueName || formData.address) },
              { label: 'Tickets', done: formData.tickets.some((t) => t.name) },
              { label: 'Treasury address', done: !!formData.treasuryAddress },
            ].map(({ label, done }) => (
              <div key={label} className="flex items-center gap-2 text-xs">
                <span className={done ? 'text-green-400' : 'text-gray-500'}>{done ? '✓' : '○'}</span>
                <span className={done ? 'text-gray-300' : 'text-gray-500'}>{label}</span>
              </div>
            ))}
          </div>
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
