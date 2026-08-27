import type { Organizer } from '@/types/organizer';

const mockOrganizers: Record<string, Organizer> = {
  'org-1': {
    id: 'org-1',
    name: 'Rhythm Nation Collective',
    bio: 'Pioneers of immersive electronic music events.',
    events: [],
    bannerImage: '/placeholder-banner.jpg',
    logo: '/placeholder-logo.png',
    socials: {
      twitter: 'https://twitter.com/rhythmnation',
      website: 'https://rhythmnation.com',
    },
  },
  'org-2': {
    id: 'org-2',
    name: 'Beat Collective',
    bio: 'Your source for the best underground hip-hop and lo-fi beats.',
    events: [],
    bannerImage: '/placeholder-banner.jpg',
    logo: '/placeholder-logo.png',
    socials: {
      twitter: 'https://twitter.com/beatcollective',
      website: 'https://beatcollective.com',
    },
  },
};

export async function fetchOrganizerById(id: string): Promise<Organizer | null> {
  return mockOrganizers[id] ?? null;
}
