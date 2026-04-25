'use client';

import { useEffect, useMemo, useState } from 'react';
import { type Event, type Tag } from '@/data/events';
import { EventCard } from '@/components/EventCard';
import { filterEvents, groupEventsByDate, type DateRange } from '@/lib/events';
import {
  canonicalizeAlertPreferences,
  describeAlertPreferences,
  type AlertStartPayload,
  type AlertStartResponse,
} from '@/lib/alerts';

type FilterBarProps = {
  events: Event[];
  tags: Tag[];
  hosts: string[];
};

const dateRangeOptions: Array<{ value: DateRange; label: string }> = [
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
  { value: 'all', label: 'All' },
];

function readDateRange(value: string | null): DateRange | null {
  if (value === 'this-week' || value === 'this-month' || value === 'all') {
    return value;
  }

  return null;
}

export function FilterBar({ events, tags, hosts }: FilterBarProps) {
  const [query, setQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: 'info' | 'success' | 'error'; text: string } | null>(null);
  const [debugUrl, setDebugUrl] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get('q') ?? '';
    const rangeParam = readDateRange(params.get('range'));

    if (queryParam) {
      setQuery(queryParam);
    }

    if (rangeParam) {
      setDateRange(rangeParam);
    }

    if (window.location.hash === '#events') {
      const scrollToEvents = () => {
        document.getElementById('events')?.scrollIntoView({ block: 'start' });
      };

      window.requestAnimationFrame(scrollToEvents);
      window.setTimeout(scrollToEvents, 250);
    }
  }, []);

  const toggleTag = (tag: Tag) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const toggleHost = (host: string) => {
    setSelectedHosts((current) =>
      current.includes(host) ? current.filter((item) => item !== host) : [...current, host],
    );
  };

  const filtered = useMemo(
    () => filterEvents(events, dateRange, selectedTags, selectedHosts, { searchQuery: query }),
    [dateRange, events, query, selectedHosts, selectedTags],
  );
  const groupedEvents = useMemo(() => groupEventsByDate(filtered), [filtered]);
  const alertPreferences = useMemo(
    () =>
      canonicalizeAlertPreferences({
        dateRange,
        tags: selectedTags,
        hosts: selectedHosts,
      }),
    [dateRange, selectedHosts, selectedTags],
  );
  const alertSummary = useMemo(() => describeAlertPreferences(alertPreferences), [alertPreferences]);
  const activeFilterCount =
    (query.trim().length > 0 ? 1 : 0) +
    (dateRange !== 'all' ? 1 : 0) +
    selectedTags.length +
    selectedHosts.length;

  const clearFilters = () => {
    setQuery('');
    setDateRange('all');
    setSelectedTags([]);
    setSelectedHosts([]);
  };

  const readJson = async <T,>(response: Response) => {
    const data = (await response.json().catch(() => null)) as T | null;
    if (!data) {
      throw new Error('The server returned an invalid response.');
    }

    return data;
  };

  const requestConfirmationEmail = async () => {
    setSubmitting(true);
    setFeedback(null);
    setDebugUrl(null);

    try {
      const payload: AlertStartPayload = {
        email,
        consent,
        preferences: alertPreferences,
      };

      const response = await fetch('/api/alerts/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await readJson<AlertStartResponse>(response);
      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'We could not send the confirmation email.');
      }

      setEmail('');
      setConsent(false);
      setDebugUrl(result.debugUrl ?? null);
      setFeedback({ tone: 'info', text: result.message });
    } catch (error) {
      setFeedback({
        tone: 'error',
        text: error instanceof Error ? error.message : 'We could not send the confirmation email.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const feedbackClassName =
    feedback?.tone === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : feedback?.tone === 'error'
        ? 'border-attention/35 bg-attention/10 text-ink'
        : 'border-accent/25 bg-accent/10 text-ink';

  return (
    <section id="events" className="scroll-mt-28 space-y-6" aria-labelledby="feed-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-accent">Browse all events</p>
          <h2 id="feed-heading" className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Explore the full calendar
          </h2>
        </div>
        <p className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-body shadow-sm">
          Showing {filtered.length} of {events.length} upcoming events
        </p>
      </div>

      <div className="rounded-lg border border-line bg-surface p-5 shadow-[0_14px_36px_rgba(24,31,36,0.055)]">
        <div className="grid gap-4 lg:grid-cols-[minmax(14rem,0.8fr)_minmax(0,1fr)] lg:items-end">
          <label className="block space-y-2">
            <span className="text-[0.8125rem] font-medium text-body">Search the feed</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try resume, finance, virtual"
              className="h-11 w-full rounded-lg border border-line bg-muted/60 px-3 text-[0.875rem] text-ink outline-none transition placeholder:text-soft focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/20"
            />
          </label>

          <fieldset>
            <legend className="mb-2 text-[0.8125rem] font-medium text-body">Date range</legend>
            <div className="flex flex-wrap gap-2">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={dateRange === option.value}
                  onClick={() => setDateRange(option.value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    dateRange === option.value
                      ? 'border-accent bg-accent text-white'
                      : 'border-line bg-surface text-body hover:border-secondary hover:bg-secondary/10'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <fieldset>
            <legend className="mb-2 text-[0.8125rem] font-medium text-body">Tags</legend>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                      active
                        ? 'border-accent bg-accent/10 text-ink'
                        : 'border-line bg-surface text-body hover:border-secondary hover:bg-secondary/10'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-[0.8125rem] font-medium text-body">Host organizations</legend>
            <div className="max-h-36 overflow-y-auto rounded-lg border border-line bg-muted/40 p-2">
              <div className="flex flex-wrap gap-2">
                {hosts.map((host) => {
                  const active = selectedHosts.includes(host);
                  return (
                    <button
                      key={host}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleHost(host)}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                        active
                          ? 'border-accent bg-surface text-ink shadow-sm'
                          : 'border-transparent bg-transparent text-body hover:border-secondary/45 hover:bg-secondary/10'
                      }`}
                    >
                      {host}
                    </button>
                  );
                })}
              </div>
            </div>
          </fieldset>
        </div>

        {activeFilterCount > 0 ? (
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm text-body">
            <span>{activeFilterCount} active filter{activeFilterCount === 1 ? '' : 's'}</span>
            <button
              type="button"
              onClick={clearFilters}
              className="font-medium text-accent transition hover:text-accent/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-8">
          {groupedEvents.map((group) => (
            <section key={group.id} aria-labelledby={`events-${group.id}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
                <h3 id={`events-${group.id}`} className="text-lg font-semibold tracking-tight text-ink">
                  {group.label}
                </h3>
                <span className="text-sm text-soft">
                  {group.events.length} event{group.events.length === 1 ? '' : 's'}
                </span>
              </div>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.events.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-line bg-surface p-8 text-center text-sm text-body">
          No events match your filters right now. Try broadening your selections or check back as more campus
          organizations are added.
        </div>
      )}

      <section className="rounded-lg border border-line bg-surface p-6 shadow-[0_14px_36px_rgba(24,31,36,0.055)]" aria-labelledby="alerts-heading">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1fr)] lg:items-start">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-accent">Email alerts</p>
            <h2 id="alerts-heading" className="mt-1.5 text-lg font-semibold tracking-tight text-ink">
              Get a calm digest instead of a flood
            </h2>
            <p className="mt-3 text-[0.8125rem] leading-[1.65] text-body">
              We send a daily email digest only when there are new matching events in the next week. No repeated
              reminders, and never more than one alert email per day.
            </p>
            <div className="mt-4 border-t border-line pt-4 text-sm text-body">
              <p className="font-semibold text-ink">Current alert filter</p>
              <p className="mt-1">{alertSummary}</p>
            </div>
            <p className="mt-4 text-xs leading-5 text-soft">
              Email addresses are encrypted at rest in Netlify Blobs and only handled inside Netlify Functions.
              Delivery credentials stay in Netlify environment variables instead of the client.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-[0.8125rem] font-medium text-body">Email address</span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@school.edu"
                className="w-full rounded-lg border border-line bg-muted/50 px-3 py-2 text-[0.875rem] text-ink outline-none transition placeholder:text-soft focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/20"
              />
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-line text-accent focus:ring-accent"
              />
              <span className="text-[0.8125rem] leading-[1.55] text-body">
                I agree to receive a filter-based email digest for matching campus events. We only send when there are
                new matches, and never more than once per day.
              </span>
            </label>

            <button
              type="button"
              onClick={requestConfirmationEmail}
              disabled={submitting}
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-soft"
            >
              {submitting ? 'Sending confirmation...' : 'Send confirmation email'}
            </button>

            {debugUrl ? (
              <div className="rounded-lg border border-warm bg-warm/25 p-3 text-sm text-ink">
                Local testing link:{' '}
                <a href={debugUrl} className="font-semibold text-accent underline decoration-accent/40 underline-offset-2">
                  Confirm email alerts
                </a>
              </div>
            ) : null}

            {feedback ? <p className={`rounded-lg border px-3 py-2 text-sm ${feedbackClassName}`}>{feedback.text}</p> : null}
          </div>
        </div>
      </section>
    </section>
  );
}
