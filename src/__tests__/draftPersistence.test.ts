import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/apiClient', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import { apiClient } from '../lib/apiClient';
import { loadDraft, saveDraft, type EventDraft } from '../lib/draftPersistence';

const DRAFT_STORAGE_KEY = 'veritix_event_draft';

describe('draftPersistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('writes the draft to localStorage before calling the API', async () => {
    const formData = { title: 'Draft title' };
    const serverDraft = {
      id: 'draft-1',
      formData,
      savedAt: new Date().toISOString(),
    };

    vi.mocked(apiClient.post).mockImplementationOnce(async () => {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored as string).formData).toEqual(formData);
      return serverDraft;
    });

    await saveDraft(formData as never);

    const stored = JSON.parse(
      localStorage.getItem(DRAFT_STORAGE_KEY) as string,
    ) as EventDraft;
    expect(stored.formData).toEqual(formData);
    expect(apiClient.post).toHaveBeenCalledWith('/api/events/drafts', { formData });
  });

  it('returns the local draft when the API request fails', async () => {
    const formData = { title: 'Fallback draft' };

    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('non-OK'));

    const result = await saveDraft(formData as never);

    expect(result.formData).toEqual(formData);
    expect(result.savedAt).toBeDefined();
    expect(
      JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) as string).formData,
    ).toEqual(formData);
  });

  it('returns localStorage data when the API is unavailable', async () => {
    const localDraft = {
      id: 'draft-2',
      formData: { title: 'Stored draft' },
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(localDraft));

    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('offline'));

    const result = await loadDraft('draft-2');

    expect(result).toEqual(localDraft);
  });

  it('purges drafts older than seven days on load', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-10T00:00:00.000Z'));

    const staleDraft = {
      id: 'draft-3',
      formData: { title: 'Old draft' },
      savedAt: '2026-07-28T00:00:00.000Z',
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(staleDraft));

    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('offline'));

    const result = await loadDraft('draft-3');

    expect(result).toBeNull();
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
  });
});
