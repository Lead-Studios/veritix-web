import { useState, useEffect, useCallback } from 'react';

const KEY = 'veritix_event_draft';

export function useEventDraft<T>(initial: T, isDraft: (val: unknown) => val is T) {
  const [draft, setDraft] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (!saved) return initial;

      const parsed = JSON.parse(saved);
      return isDraft(parsed) ? parsed : initial;
    } catch (e: unknown) {
      console.error('Failed to load or parse event draft:', e);
      return initial;
    }
  });

  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(KEY, JSON.stringify(draft));
    }, 800);
    return () => clearTimeout(id);
  }, [draft]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(KEY);
    setDraft(initial);
  }, [initial]);

  return { draft, setDraft, clearDraft };
}
