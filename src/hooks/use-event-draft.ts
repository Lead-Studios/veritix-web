import * as React from 'react';

const DRAFT_KEY = 'veritix:event-draft';

/**
 * Storage access is wrapped everywhere: `localStorage` can throw (a `SecurityError`
 * in some private windows, `QuotaExceededError` when full) and the stored text can
 * be anything, so none of it may be allowed to throw while rendering.
 */
function readStored(): string | null {
  try {
    return window.localStorage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
}

/** The server has no storage, so the draft is always the initial value there. */
function readServer(): string | null {
  return null;
}

/** Returns false when the value could not be persisted. */
function writeStored(raw: string): boolean {
  try {
    window.localStorage.setItem(DRAFT_KEY, raw);
    return true;
  } catch {
    return false;
  }
}

function removeStored(): boolean {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
    return true;
  } catch {
    return false;
  }
}

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

/** Re-reads on in-app writes and on changes made by another tab (`storage` event). */
function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === DRAFT_KEY) onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** A stored value is only trusted if it has the same basic shape as the initial one. */
function isCompatible(value: unknown, initial: unknown): boolean {
  if (isPlainObject(initial)) return isPlainObject(value);
  if (Array.isArray(initial)) return Array.isArray(value);
  return typeof value === typeof initial;
}

function parseDraft<T>(raw: string | null, initial: T): T {
  if (raw === null) return initial;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isCompatible(parsed, initial) ? (parsed as T) : initial;
  } catch {
    return initial;
  }
}

/**
 * Autosaves an in-progress event creation form to localStorage.
 *
 * - Reads go through `useSyncExternalStore`, so the stored draft is picked up
 *   without a state-setting effect and without a hydration mismatch.
 * - A corrupt, wrongly shaped, or unreadable stored value falls back to `initial`.
 * - Nothing is written until the user edits the draft, so mounting never overwrites
 *   what was just read.
 * - If storage is unavailable, the draft still works for the life of the component;
 *   it just is not persisted.
 */
export function useEventDraft<T>(initial: T) {
  // Keep the first `initial`: callers usually pass a fresh literal every render.
  const [initialValue] = React.useState(initial);
  const stored = React.useSyncExternalStore(subscribe, readStored, readServer);
  // Set only when a write failed; holds the draft in memory instead.
  const [memory, setMemory] = React.useState<{ raw: string | null } | null>(null);
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);

  const raw = memory ? memory.raw : stored;
  const draft = React.useMemo(() => parseDraft(raw, initialValue), [raw, initialValue]);

  // Latest raw value, so functional updates and quick consecutive edits build on
  // each other rather than on the render-time snapshot.
  const latestRaw = React.useRef(raw);
  React.useEffect(() => {
    latestRaw.current = raw;
  }, [raw]);

  const setDraft = React.useCallback(
    (next: T | ((previous: T) => T)) => {
      const previous = parseDraft(latestRaw.current, initialValue);
      const value = typeof next === 'function' ? (next as (previous: T) => T)(previous) : next;
      const nextRaw = JSON.stringify(value);

      latestRaw.current = nextRaw;
      if (writeStored(nextRaw)) {
        setMemory(null);
        setLastSavedAt(new Date());
        notify();
      } else {
        setMemory({ raw: nextRaw });
      }
    },
    [initialValue],
  );

  const clearDraft = React.useCallback(() => {
    latestRaw.current = null;
    if (removeStored()) {
      setMemory(null);
      notify();
    } else {
      setMemory({ raw: null });
    }
    setLastSavedAt(null);
  }, []);

  return { draft, setDraft, lastSavedAt, clearDraft };
}
