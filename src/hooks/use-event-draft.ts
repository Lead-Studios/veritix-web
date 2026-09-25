import * as React from 'react';

const DRAFT_KEY = 'veritix:event-draft';

/** Autosaves an in-progress event creation form to localStorage. */
export function useEventDraft<T>(initial: T) {
  const [draft, setDraft] = React.useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    const saved = window.localStorage.getItem(DRAFT_KEY);
    return saved ? (JSON.parse(saved) as T) : initial;
  });
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);

  React.useEffect(() => {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setLastSavedAt(new Date());
  }, [draft]);

  const clearDraft = React.useCallback(() => {
    window.localStorage.removeItem(DRAFT_KEY);
  }, []);

  return { draft, setDraft, lastSavedAt, clearDraft };
}
