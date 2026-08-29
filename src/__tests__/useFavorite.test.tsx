import { renderHook, act } from '@testing-library/react';
import { useFavorite } from '../hooks/useFavorite';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useFavorite hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('toggles favorites and persists state', () => {
    const { result } = renderHook(() => useFavorite('event-123'));
    expect(result.current.isFavorite).toBe(false);

    act(() => {
      result.current.toggleFavorite();
    });
    expect(result.current.isFavorite).toBe(true);
    expect(localStorage.getItem('favorites')).toContain('event-123');
  });
});
