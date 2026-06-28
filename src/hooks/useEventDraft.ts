import { useState, useEffect, useCallback } from "react";

const KEY = "veritix_event_draft";

export function useEventDraft<T>(initial: T) {
  const [draft, setDraft] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(KEY);
      return saved ? (JSON.parse(saved) as T) : initial;
    } catch { return initial; }
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
