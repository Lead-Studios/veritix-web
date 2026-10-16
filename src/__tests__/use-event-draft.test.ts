import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useEventDraft } from '@/hooks/use-event-draft';

const KEY = 'veritix:event-draft';
const INITIAL = { title: '', city: '' };

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useEventDraft', () => {
  it('starts from the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useEventDraft(INITIAL));

    expect(result.current.draft).toEqual(INITIAL);
    expect(result.current.lastSavedAt).toBeNull();
  });

  it('restores a stored draft', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ title: 'Jazz', city: 'Lagos' }));

    const { result } = renderHook(() => useEventDraft(INITIAL));

    expect(result.current.draft).toEqual({ title: 'Jazz', city: 'Lagos' });
  });

  it('does not write anything on mount', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ title: 'Jazz', city: 'Lagos' }));
    const setItem = vi.spyOn(Storage.prototype, 'setItem');

    renderHook(() => useEventDraft(INITIAL));

    expect(setItem).not.toHaveBeenCalled();
    expect(window.localStorage.getItem(KEY)).toBe(
      JSON.stringify({ title: 'Jazz', city: 'Lagos' }),
    );
  });

  it('falls back to the initial value when the stored text is not valid JSON', () => {
    window.localStorage.setItem(KEY, '{not json');

    const { result } = renderHook(() => useEventDraft(INITIAL));

    expect(result.current.draft).toEqual(INITIAL);
  });

  it('falls back to the initial value when the stored value has the wrong shape', () => {
    window.localStorage.setItem(KEY, JSON.stringify(['not', 'an', 'object']));

    const { result } = renderHook(() => useEventDraft(INITIAL));

    expect(result.current.draft).toEqual(INITIAL);
  });

  it('does not throw when reading storage is not allowed', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });

    const { result } = renderHook(() => useEventDraft(INITIAL));

    expect(result.current.draft).toEqual(INITIAL);
  });

  it('saves after an edit and records when', () => {
    const { result } = renderHook(() => useEventDraft(INITIAL));

    act(() => result.current.setDraft({ title: 'Jazz', city: 'Lagos' }));

    expect(result.current.draft).toEqual({ title: 'Jazz', city: 'Lagos' });
    expect(JSON.parse(window.localStorage.getItem(KEY) ?? 'null')).toEqual({
      title: 'Jazz',
      city: 'Lagos',
    });
    expect(result.current.lastSavedAt).toBeInstanceOf(Date);
  });

  it('applies functional updates on top of each other within one tick', () => {
    const { result } = renderHook(() => useEventDraft(INITIAL));

    act(() => {
      result.current.setDraft((d) => ({ ...d, title: 'Jazz' }));
      result.current.setDraft((d) => ({ ...d, city: 'Lagos' }));
    });

    expect(result.current.draft).toEqual({ title: 'Jazz', city: 'Lagos' });
  });

  it('keeps working in memory when writing to storage fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    const { result } = renderHook(() => useEventDraft(INITIAL));

    act(() => result.current.setDraft({ title: 'Jazz', city: '' }));

    expect(result.current.draft).toEqual({ title: 'Jazz', city: '' });
    expect(result.current.lastSavedAt).toBeNull();
  });

  it('clears the stored draft', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ title: 'Jazz', city: 'Lagos' }));
    const { result } = renderHook(() => useEventDraft(INITIAL));

    act(() => result.current.clearDraft());

    expect(window.localStorage.getItem(KEY)).toBeNull();
    expect(result.current.draft).toEqual(INITIAL);
  });

  it('keeps a stable draft object when the caller passes a new literal each render', () => {
    const { result, rerender } = renderHook(() => useEventDraft({ title: '', city: '' }));
    const first = result.current.draft;

    rerender();

    expect(result.current.draft).toBe(first);
  });
});
