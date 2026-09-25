'use client';

import * as React from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';

const eventBasicsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  venue: z.string().min(1, 'Venue is required'),
  city: z.string().min(1, 'City is required'),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
});

export default function NewEventPage() {
  const [values, setValues] = React.useState({ title: '', description: '', venue: '', city: '', startsAt: '', endsAt: '' });

  const result = eventBasicsSchema.safeParse(values);

  return (
    <div className="space-y-3">
      <Input placeholder="Title" value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} />
      <Input placeholder="Venue" value={values.venue} onChange={(e) => setValues({ ...values, venue: e.target.value })} />
      <Input placeholder="City" value={values.city} onChange={(e) => setValues({ ...values, city: e.target.value })} />
      <DatePicker label="Start date" value={values.startsAt} onChange={(v) => setValues({ ...values, startsAt: v })} />
      <DatePicker label="End date" value={values.endsAt} onChange={(v) => setValues({ ...values, endsAt: v })} />
      {!result.success && <p className="text-sm text-destructive">Fill in every field to continue.</p>}
    </div>
  );
}
