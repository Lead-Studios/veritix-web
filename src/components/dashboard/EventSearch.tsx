"use client";
import { useState } from "react";

interface Event { id: string; name: string; date: string; status: string; }
interface Props { events: Event[]; }

export default function EventSearch({ events }: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = events.filter((e) => {
    const matchesQuery = e.name.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your events…" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm">
          {["all","DRAFT","PUBLISHED","CANCELLED"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <ul className="divide-y">
        {filtered.map((e) => (
          <li key={e.id} className="py-3 flex justify-between text-sm">
            <span>{e.name}</span>
            <span className="text-gray-500">{e.status}</span>
          </li>
        ))}
        {filtered.length === 0 && <li className="py-8 text-center text-gray-400">No events match.</li>}
      </ul>
    </div>
  );
}
