import { describe, expect, it, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  EMPTY_EVENT_FILTERS,
  EVENT_FILTER_KEYS,
  parseEventFilters,
  toSearchParams,
  useEventFilters,
} from '@/hooks/use-event-filters';

/**
 * `next/navigation` is mocked so the hook can be driven the way the App Router
 * drives it: the URL is owned by the test, and `router.replace` both records the
 * call and applies the new query to `paramsRef`, as the real router would. A
 * component only sees the new params after it re-renders.
 */
const { replaceMock, paramsRef } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  paramsRef: { current: new URLSearchParams() },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/events',
  useSearchParams: () => paramsRef.current,
}));

/** The URL the hook asked the router to navigate to, or null if it did not. */
function lastReplaceTarget(): string {
  expect(replaceMock).toHaveBeenCalled();
  return replaceMock.mock.calls.at(-1)?.[0] as string;
}

beforeEach(() => {
  replaceMock.mockReset();
  replaceMock.mockImplementation((url: string) => {
    paramsRef.current = new URLSearchParams(url.split('?')[1] ?? '');
  });
  paramsRef.current = new URLSearchParams();
});

describe('parseEventFilters', () => {
  it('returns every filter key, blank when the URL has none', () => {
    expect(parseEventFilters(new URLSearchParams())).toEqual(EMPTY_EVENT_FILTERS);
  });

  it('reads all known filters back out of the URL', () => {
    const params = new URLSearchParams('q=jazz&city=Lagos&date=2026-10-17&sort=title');

    expect(parseEventFilters(params)).toEqual({
      q: 'jazz',
      city: 'Lagos',
      date: '2026-10-17',
      sort: 'title',
    });
  });

  it('tolerates a missing search params object', () => {
    expect(parseEventFilters(null)).toEqual(EMPTY_EVENT_FILTERS);
  });
});

describe('toSearchParams', () => {
  it('omits blank filters so the URL stays clean', () => {
    const query = toSearchParams({
      q: '',
      city: 'Lagos',
      date: '  ',
      sort: 'startsAt',
    }).toString();

    expect(query).toBe('city=Lagos&sort=startsAt');
  });
});

describe('useEventFilters', () => {
  it('reads the initial state back from the URL', () => {
    paramsRef.current = new URLSearchParams('q=jazz&city=Lagos&sort=title');

    const { result } = renderHook(() => useEventFilters());

    expect(result.current.filters).toEqual({
      q: 'jazz',
      city: 'Lagos',
      date: '',
      sort: 'title',
    });
  });

  it('writes the expected query parameters when a filter changes', () => {
    const { result, rerender } = renderHook(() => useEventFilters());

    act(() => result.current.setFilter('city', 'Lagos'));

    expect(lastReplaceTarget()).toBe('/events?city=Lagos');

    // The router has applied the first change and the component re-rendered.
    // Keys are serialised in a fixed order (q, city, date, sort), not call order.
    rerender();
    act(() => result.current.setFilter('q', 'jazz'));

    expect(lastReplaceTarget()).toBe('/events?q=jazz&city=Lagos');
  });

  it('keeps both changes when two filters are set before the router re-renders', () => {
    const { result } = renderHook(() => useEventFilters());

    act(() => {
      result.current.setFilter('city', 'Lagos');
      result.current.setFilter('q', 'jazz');
    });

    expect(lastReplaceTarget()).toBe('/events?q=jazz&city=Lagos');
  });

  it('applies a change on top of existing filters when called twice in one tick', () => {
    paramsRef.current = new URLSearchParams('date=2026-10-17&city=Abuja');
    const { result } = renderHook(() => useEventFilters());

    act(() => {
      result.current.setFilter('date', '');
      result.current.setFilter('city', 'Lagos');
    });

    expect(lastReplaceTarget()).toBe('/events?city=Lagos');
  });

  it('follows the URL again after it changes elsewhere', () => {
    const { result, rerender } = renderHook(() => useEventFilters());

    act(() => result.current.setFilter('city', 'Lagos'));
    // Back/forward navigation replaces the whole query.
    paramsRef.current = new URLSearchParams('q=rock');
    rerender();

    act(() => result.current.setFilter('sort', 'title'));

    expect(lastReplaceTarget()).toBe('/events?q=rock&sort=title');
  });

  it('drops a filter from the URL when it is cleared', () => {
    paramsRef.current = new URLSearchParams('q=jazz&city=Lagos');

    const { result } = renderHook(() => useEventFilters());

    act(() => result.current.setFilter('q', ''));

    expect(lastReplaceTarget()).toBe('/events?city=Lagos');
  });

  it('removes every filter parameter on clear-all', () => {
    paramsRef.current = new URLSearchParams(
      'q=jazz&city=Lagos&date=2026-10-17&sort=title',
    );

    const { result } = renderHook(() => useEventFilters());

    act(() => result.current.clearAll());

    const target = lastReplaceTarget();

    expect(target).toBe('/events');
    for (const key of EVENT_FILTER_KEYS) {
      expect(target).not.toContain(`${key}=`);
    }
  });

  it('keeps scroll position when rewriting the URL', () => {
    const { result } = renderHook(() => useEventFilters());

    act(() => result.current.setFilter('sort', '-startsAt'));

    expect(replaceMock.mock.calls.at(-1)?.[1]).toEqual({ scroll: false });
  });
});
