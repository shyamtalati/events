import type { Event, Tag } from '../data/events';
import type { DateRange } from './events';

export const ALERT_LOOKAHEAD_DAYS = 7;
export const ALERT_DIGEST_COOLDOWN_HOURS = 24;

export type AlertPreferences = {
  dateRange: DateRange;
  tags: Tag[];
  hosts: string[];
};

export type AlertStartPayload = {
  email: string;
  consent: boolean;
  preferences: AlertPreferences;
};

export type AlertStartResponse = {
  ok: boolean;
  message: string;
  debugUrl?: string;
};

export type AlertSubscriptionRecord = {
  id: string;
  encryptedEmail: string;
  emailHash: string;
  emailPreview: string;
  preferencesKey: string;
  preferences: AlertPreferences;
  status: 'active';
  cadence: 'daily';
  createdAt: string;
  updatedAt: string;
  verifiedAt: string;
  lastDigestSentAt?: string;
};

export type AlertChallengeRecord = {
  id: string;
  encryptedEmail: string;
  emailHash: string;
  emailPreview: string;
  verificationTokenHash: string;
  preferences: AlertPreferences;
  createdAt: string;
  expiresAt: string;
  ipHash?: string;
};

export function canonicalizeAlertPreferences(preferences: AlertPreferences): AlertPreferences {
  return {
    dateRange: preferences.dateRange,
    tags: [...new Set(preferences.tags)].sort() as Tag[],
    hosts: [...new Set(preferences.hosts)].sort(),
  };
}

export function getAlertPreferenceSignature(preferences: AlertPreferences): string {
  return JSON.stringify(canonicalizeAlertPreferences(preferences));
}

export function matchesAlertPreferences(
  event: Event,
  preferences: AlertPreferences,
  referenceDate = new Date(),
): boolean {
  const normalizedPreferences = canonicalizeAlertPreferences(preferences);
  const startOfDay = new Date(referenceDate);
  startOfDay.setHours(0, 0, 0, 0);

  const eventDate = new Date(event.startsAt);
  if (normalizedPreferences.dateRange === 'this-week') {
    const weekEnd = new Date(startOfDay);
    weekEnd.setDate(startOfDay.getDate() + 7);
    if (eventDate < startOfDay || eventDate >= weekEnd) {
      return false;
    }
  }

  if (normalizedPreferences.dateRange === 'this-month') {
    const monthEnd = new Date(startOfDay);
    monthEnd.setMonth(startOfDay.getMonth() + 1);
    if (eventDate < startOfDay || eventDate >= monthEnd) {
      return false;
    }
  }

  const tagMatch =
    normalizedPreferences.tags.length === 0 ||
    normalizedPreferences.tags.some((tag) => event.tags.includes(tag));
  const hostMatch =
    normalizedPreferences.hosts.length === 0 || normalizedPreferences.hosts.includes(event.hostOrg);

  return tagMatch && hostMatch;
}

export function getAlertMatches(
  events: Event[],
  preferences: AlertPreferences,
  referenceDate = new Date(),
  lookAheadDays = ALERT_LOOKAHEAD_DAYS,
): Event[] {
  const now = referenceDate.getTime();
  const windowEnd = now + lookAheadDays * 24 * 60 * 60 * 1000;

  return events.filter((event) => {
    const eventStart = new Date(event.startsAt).getTime();
    if (eventStart < now || eventStart > windowEnd) {
      return false;
    }

    return matchesAlertPreferences(event, preferences, referenceDate);
  });
}

export function describeAlertPreferences(preferences: AlertPreferences): string {
  const normalizedPreferences = canonicalizeAlertPreferences(preferences);
  const dateLabel =
    normalizedPreferences.dateRange === 'all'
      ? 'all upcoming events in the next week'
      : normalizedPreferences.dateRange === 'this-week'
        ? 'events happening this week'
        : 'events happening this month';

  const tagLabel =
    normalizedPreferences.tags.length === 0
      ? 'any tag'
      : normalizedPreferences.tags.join(', ');

  const hostLabel =
    normalizedPreferences.hosts.length === 0
      ? 'any host organization'
      : normalizedPreferences.hosts.join(', ');

  return `${dateLabel} • ${tagLabel} • ${hostLabel}`;
}

export function formatEventDateTime(startsAt: string, endsAt?: string): string {
  const start = new Date(startsAt);
  const end = endsAt ? new Date(endsAt) : null;

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const base = `${dateFormatter.format(start)} at ${timeFormatter.format(start)}`;
  if (!end) {
    return base;
  }

  return `${base} to ${timeFormatter.format(end)}`;
}
