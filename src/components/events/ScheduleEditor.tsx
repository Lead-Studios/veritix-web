"use client";
import { useState } from "react";

interface ScheduleItem { time: string; title: string; description: string; }
interface Props { value: ScheduleItem[]; onChange: (v: ScheduleItem[]) => void; }

const empty = (): ScheduleItem => ({ time: "", title: "", description: "" });

export default function ScheduleEditor({ value, onChange }: Props) {
  const update = (i: number, field: keyof ScheduleItem, v: string) => {
    const next = [...value]; next[i] = { ...next[i], [field]: v }; onChange(next);
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <input placeholder="Time" value={item.time} onChange={(e) => update(i, "time", e.target.value)}
            className="border rounded px-2 py-1 text-sm w-24" />
          <input placeholder="Title" value={item.title} onChange={(e) => update(i, "title", e.target.value)}
            className="border rounded px-2 py-1 text-sm flex-1" />
          <input placeholder="Description" value={item.description} onChange={(e) => update(i, "description", e.target.value)}
            className="border rounded px-2 py-1 text-sm flex-1" />
          <button onClick={() => remove(i)} className="text-red-400 text-sm px-1">x</button>
        </div>
      ))}
      <button onClick={() => onChange([...value, empty()])} className="text-sm text-primary underline">+ Add item</button>
    </div>
  );
}
