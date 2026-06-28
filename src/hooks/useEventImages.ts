import { useMemo } from "react";

interface EventWithCover { coverImage?: string | null; name: string; }

export function useEventImages(events: EventWithCover[] | undefined) {
  const images = useMemo(
    () =>
      (events ?? []).slice(0, 4).map((e) => ({
        src: e.coverImage ?? null,
        alt: e.name,
      })),
    [events]
  );
  return images;
}
