/**
 * Custom hooks unit tests (FE-232 related).
 * Covers useEvents, useOrganizerAnalytics, useFavorite.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEvents, invalidateEvents } from '@/hooks/useEvents';
import { useOrganizerAnalytics } from '@/hooks/useOrganizerAnalytics';
import { useFavorite } from '@/hooks/useFavorite';

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('swr', () => {
  const mockMutate = vi.fn().mockResolvedValue(undefined);
  return {
    default: vi.fn(() => ({
      data: undefined,
      error: undefined,
      isLoading: true,
    })),
    mutate: mockMutate,
  };
});

// ── useEvents ────────────────────────────────────────────────────────────────

describe('useEvents', () => {
  it('returns loading state initially', () => {
    const { result } = renderHook(() => useEvents());
    expect(result.current.loading).toBe(true);
    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('invalidateEvents calls mutate', async () => {
    const swr = await import('swr');
    const mutate = (swr as unknown as { mutate: ReturnType<typeof vi.fn> }).mutate;
    invalidateEvents();
    expect(mutate).toHaveBeenCalled();
  });
});

// ── useOrganizerAnalytics ────────────────────────────────────────────────────

describe('useOrganizerAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading state initially', () => {
    const { result } = renderHook(() => useOrganizerAnalytics());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('accepts from/to options', () => {
    const { result } = renderHook(() =>
      useOrganizerAnalytics({ from: '2025-01-01', to: '2025-01-31' }),
    );
    expect(result.current.loading).toBe(true);
  });

  it('accepts organizerId option', () => {
    const { result } = renderHook(() => useOrganizerAnalytics({ organizerId: 'org-1' }));
    expect(result.current.loading).toBe(true);
  });
});

// ── useFavorite ──────────────────────────────────────────────────────────────

describe('useFavorite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with isLiked false when not in localStorage', () => {
    const { result } = renderHook(() => useFavorite('event-1'));
    expect(result.current.isLiked).toBe(false);
  });

  it('initializes with isLiked true when in localStorage', () => {
    localStorage.setItem('veritix_favorites', JSON.stringify(['event-1']));
    const { result } = renderHook(() => useFavorite('event-1'));
    expect(result.current.isLiked).toBe(true);
  });

  it('toggle adds ID to favorites', async () => {
    const { result } = renderHook(() => useFavorite('event-1'));
    expect(result.current.isLiked).toBe(false);

    await result.current.toggle();
    expect(result.current.isLiked).toBe(true);

    const stored = JSON.parse(localStorage.getItem('veritix_favorites') ?? '[]');
    expect(stored).toContain('event-1');
  });

  it('toggle again removes ID from favorites', async () => {
    localStorage.setItem('veritix_favorites', JSON.stringify(['event-1']));
    const { result } = renderHook(() => useFavorite('event-1'));
    expect(result.current.isLiked).toBe(true);

    await result.current.toggle();
    expect(result.current.isLiked).toBe(false);

    const stored = JSON.parse(localStorage.getItem('veritix_favorites') ?? '[]');
    expect(stored).not.toContain('event-1');
  });

  it('localStorage persists favorites across hook instances', async () => {
    const { result: r1 } = renderHook(() => useFavorite('event-1'));
    await r1.current.toggle();

    const { result: r2 } = renderHook(() => useFavorite('event-1'));
    expect(r2.current.isLiked).toBe(true);
  });
});
