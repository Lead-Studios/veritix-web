'use client';

import * as React from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import type { User } from '@/types';

/**
 * Display name and avatar.
 *
 * The avatar is validated here rather than after the fact: the type and size
 * checks are cheap, and rejecting a 12 MB TIFF before it crosses the network is
 * the difference between an instant message and a minute of a spinner on a
 * connection that cannot carry it. The server still validates — this is a
 * courtesy, not a control.
 */

export const AVATAR_ACCEPT = 'image/png,image/jpeg,image/webp';

/** 2 MiB. Large enough for a phone photo, small enough to store per account. */
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export const AVATAR_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;

const DISPLAY_NAME_MAX = 60;

/** Human-readable size, so "too large" is actionable. */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Why a file cannot be used, or `null` when it is acceptable. Shared with the
 * tests so the rules are stated once.
 */
export function validateAvatar(file: File): string | null {
  if (!AVATAR_MIME_TYPES.includes(file.type as (typeof AVATAR_MIME_TYPES)[number])) {
    return 'Choose a PNG, JPEG, or WebP image';
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return `Images must be under ${formatBytes(AVATAR_MAX_BYTES)} — that one is ${formatBytes(file.size)}`;
  }
  if (file.size === 0) {
    return 'That file is empty';
  }
  return null;
}

export interface ProfileFormProps {
  /** Current profile, used to seed the form and the avatar preview. */
  user: User;
  className?: string;
  /** Called after a successful save, so the shell can refresh the user. */
  onSaved?: (user: User) => void;
}

export function ProfileForm({ user, className, onSaved }: ProfileFormProps) {
  const [displayName, setDisplayName] = React.useState(user.name);
  const [avatar, setAvatar] = React.useState<File | null>(null);
  const [avatarError, setAvatarError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [savedName, setSavedName] = React.useState(user.name);

  // Object URLs are created and revoked around the change that caused them, and
  // whatever is left is released on unmount. Every preview the user skipped
  // through would otherwise hold a blob for the lifetime of the page.
  const previewRef = React.useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  const applyAvatar = (file: File | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = file ? URL.createObjectURL(file) : null;
    setPreviewUrl(previewRef.current);
    setAvatar(file);
  };

  const nameError = displayName.trim().length === 0 ? 'Enter a display name' : null;
  const nameTooLong = displayName.trim().length > DISPLAY_NAME_MAX;
  const dirty = displayName.trim() !== savedName || avatar !== null;
  const blocked = nameError !== null || nameTooLong || avatarError !== null;

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      applyAvatar(null);
      setAvatarError(null);
      return;
    }

    const problem = validateAvatar(file);
    if (problem) {
      // The input is cleared so re-picking the same bad file fires a change
      // event again; leaving it selected would silently keep the old preview.
      event.target.value = '';
      applyAvatar(null);
      setAvatarError(problem);
      return;
    }

    setAvatarError(null);
    applyAvatar(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (blocked || saving) return;

    setSaving(true);
    try {
      // FormData only when there is a file: a name-only change should not carry
      // a multipart body, and a JSON body is easier for the route to validate.
      let body: FormData | { displayName: string };
      if (avatar) {
        const form = new FormData();
        form.set('displayName', displayName.trim());
        form.set('avatar', avatar);
        body = form;
      } else {
        body = { displayName: displayName.trim() };
      }

      const updated = await api.patch<User>('/settings/profile', body);
      const next = { ...user, ...updated, name: updated.name ?? displayName.trim() };

      setSavedName(next.name);
      applyAvatar(null);
      onSaved?.(next);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save your profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="profile-display-name" required>
          Display name
        </Label>
        <Input
          id="profile-display-name"
          name="displayName"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          maxLength={DISPLAY_NAME_MAX}
          autoComplete="name"
          aria-invalid={Boolean(nameError) || nameTooLong}
          aria-describedby="profile-display-name-help"
          disabled={saving}
        />
        <p id="profile-display-name-help" className="text-sm text-muted-foreground">
          {nameTooLong
            ? `Keep this under ${DISPLAY_NAME_MAX} characters`
            : nameError ?? `Shown on your tickets and to people you buy from.`}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-avatar">Avatar</Label>
        <div className="flex items-center gap-4">
          <Avatar
            src={previewUrl ?? user.avatarUrl}
            alt={displayName || 'Your profile'}
            className="size-16"
          />
          <div className="space-y-1">
            <Input
              id="profile-avatar"
              name="avatar"
              type="file"
              accept={AVATAR_ACCEPT}
              onChange={handleFile}
              disabled={saving}
              aria-invalid={Boolean(avatarError)}
              aria-describedby={avatarError ? 'profile-avatar-error' : 'profile-avatar-help'}
              className="h-auto py-1.5 file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-sm"
            />
            <p id="profile-avatar-help" className="text-sm text-muted-foreground">
              PNG, JPEG, or WebP, up to {formatBytes(AVATAR_MAX_BYTES)}.
            </p>
          </div>
        </div>
        {avatarError && (
          <p id="profile-avatar-error" role="alert" className="text-sm font-medium text-destructive">
            {avatarError}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!dirty || blocked || saving}>
          {saving && <Spinner label={null} />}
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        {dirty && !saving && <span className="text-sm text-muted-foreground">Unsaved changes</span>}
      </div>
    </form>
  );
}
