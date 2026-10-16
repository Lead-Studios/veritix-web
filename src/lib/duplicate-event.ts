import type { VeritixEvent } from '@/types';

/**
 * Builds a draft copy of an event: same details, tiers, and splits,
 * with dates cleared so the organizer picks new ones before publishing.
 */
export function duplicateEvent(source: VeritixEvent): Omit<VeritixEvent, 'id' | 'slug'> {
  return {
    title: `${source.title} (copy)`,
    description: source.description,
    coverImageUrl: source.coverImageUrl,
    venue: source.venue,
    city: source.city,
    startsAt: '',
    endsAt: '',
    status: 'draft',
    organizer: source.organizer,
    tiers: source.tiers.map((tier) => ({ ...tier, quantitySold: 0 })),
  };
}
