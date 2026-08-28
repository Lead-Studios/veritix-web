import type { Organizer } from '@/types/organizer';

export const mockOrganizers: Record<string, Organizer> = {
  'rhythm-nation-collective': {
    id: 'rhythm-nation-collective',
    name: 'Rhythm Nation Collective',
    avatar: '/images/organizers/rhythm-nation.png',
    description: 'Bringing immersive music experiences to life',
    verified: true,
  },
  'beat-collective': {
    id: 'beat-collective',
    name: 'Beat Collective',
    avatar: '/images/organizers/beat-collective.png',
    description: 'Electronic music events since 2015',
    verified: true,
  },
};
