'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationForm } from '@/components/settings/notification-form';
import { PasswordForm } from '@/components/settings/password-form';
import { ProfileForm } from '@/components/settings/profile-form';
import type { User } from '@/types';

/**
 * Settings shell.
 *
 * `routes.settings` has been in the sidebar and behind the auth guard since
 * before anything rendered here, so the guard was protecting an empty page. This
 * fills it in.
 *
 * The active tab lives in the `?tab=` query string rather than in component
 * state, so a section is linkable, survives a reload, and steps correctly
 * through browser history — the same reasoning behind `useEventFilters`. The
 * first tab is left out of the URL so `/settings` stays canonical, and the
 * rewrite touches `tab` only, leaving unrelated parameters alone.
 *
 * Sections are split across issues: profile, account, and notifications are
 * built here, while wallet management (#975) is tracked separately, so that tab
 * is a placeholder rather than a half-built feature.
 *
 * The account is read from the settings API rather than from a session prop,
 * because the app router does not hand arbitrary props to a page and the repo
 * has no auth service to read a user from a cookie. The endpoint belongs to the
 * settings API work (#977), the same as the three the forms submit to.
 */

export const SETTINGS_TABS = ['profile', 'account', 'notifications', 'wallet'] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number];

export const DEFAULT_SETTINGS_TAB: SettingsTab = 'profile';

export const SETTINGS_ACCOUNT_PATH = '/settings/profile';

const TAB_LABELS: Record<SettingsTab, string> = {
  profile: 'Profile',
  account: 'Account',
  notifications: 'Notifications',
  wallet: 'Wallet',
};

/**
 * Read the tab out of the query string, falling back to the first for anything
 * unrecognised. An unknown value is a stale bookmark, not an error.
 */
export function parseSettingsTab(value: string | null | undefined): SettingsTab {
  return SETTINGS_TABS.includes(value as SettingsTab)
    ? (value as SettingsTab)
    : DEFAULT_SETTINGS_TAB;
}

function SettingsFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-10 w-80" />
      <Skeleton className="h-64 w-full max-w-xl" />
    </div>
  );
}

function SettingsContent({ user, onSaved }: { user: User; onSaved: (user: User) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = parseSettingsTab(searchParams.get('tab'));

  const setTab = React.useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next === DEFAULT_SETTINGS_TAB) params.delete('tab');
      else params.set('tab', next);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, account, and what we email you about.
        </p>
      </header>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          {SETTINGS_TABS.map((value) => (
            <TabsTrigger key={value} value={value}>
              {TAB_LABELS[value]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="max-w-xl">
          <ProfileForm user={user} onSaved={onSaved} />
        </TabsContent>

        <TabsContent value="account" className="max-w-xl">
          <PasswordForm />
        </TabsContent>

        <TabsContent value="notifications" className="max-w-xl">
          <NotificationForm />
        </TabsContent>

        <TabsContent value="wallet" className="max-w-xl">
          {/* Wallet management is #975. The tab exists so the section is
              reachable and the URL round-trips, not to half-build it. */}
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            Wallet management is not available yet.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * The profile is read once and then owned here, so a rename made in the profile
 * tab is reflected in the shell without a refetch — and the cache is rewritten
 * rather than revalidated, because we already hold the server's answer.
 */
function SettingsShell() {
  const { data, error, mutate } = useSWR<User>(SETTINGS_ACCOUNT_PATH, fetcher);

  if (error) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        </header>
        <p role="alert" className="text-sm font-medium text-destructive">
          Could not load your account. Try again in a moment.
        </p>
      </div>
    );
  }

  if (!data) return <SettingsFallback />;

  return <SettingsContent user={data} onSaved={(user) => void mutate(user, { revalidate: false })} />;
}

export default function SettingsPage() {
  return (
    // useSearchParams needs a Suspense boundary during static rendering.
    <Suspense fallback={<SettingsFallback />}>
      <SettingsShell />
    </Suspense>
  );
}
