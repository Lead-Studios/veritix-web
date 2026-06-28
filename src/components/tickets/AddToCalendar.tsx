"use client";

import { useCallback } from "react";
import { HiOutlineCalendar } from "react-icons/hi";

interface AddToCalendarProps {
  eventName: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
}

function buildGoogleCalendarUrl(event: AddToCalendarProps): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.eventName,
    details: event.description ?? "",
    location: event.location ?? "",
    dates: `${event.startDate.replace(/[-:]/g, "").replace(/\.\d{3}/, "")}/${event.endDate.replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcsContent(event: AddToCalendarProps): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Veritix//AddToCalendar//EN",
    "BEGIN:VEVENT",
    `DTSTART:${event.startDate.replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTEND:${event.endDate.replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `SUMMARY:${event.eventName}`,
    `DESCRIPTION:${event.description ?? ""}`,
    `LOCATION:${event.location ?? ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function AddToCalendar(event: AddToCalendarProps) {
  const googleUrl = buildGoogleCalendarUrl(event);

  const handleDownloadIcs = useCallback(() => {
    const ics = buildIcsContent(event);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.eventName.replace(/\s+/g, "_")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }, [event]);

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-[#4D21FF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3d18cc] transition-colors"
      >
        <HiOutlineCalendar className="w-4 h-4" />
        Google Calendar
      </a>
      <button
        onClick={handleDownloadIcs}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:border-white/20 transition-colors"
      >
        <HiOutlineCalendar className="w-4 h-4" />
        Download .ics
      </button>
    </div>
  );
}
