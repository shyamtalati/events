'use client';

import { useMemo, useState } from 'react';
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
  initialSearch?: string;
  initialDateRange?: DateRange;
};

const dateRangeOptions: Array<{ value: DateRange; label: string }> = [
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
  { value: 'all', label: 'All' },
];

export function FilterBar({ events, tags, hosts, initialSearch = '', initialDateRange = 'all' }: FilterBarProps) {
  const [query, setQuery] = useState(initialSearch);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: 'info' | 'success' | 'error'; text: string } | null>(null);
  const [debugUrl, setDebugUrl] = useState<string | null>(null);

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
        ? 'border-rose-200 bg-rose-50 text-rose-900'
        : 'border-blue-200 bg-blue-50 text-blue-900';

  return (
    <section id="events" className="scroll-mt-28 space-y-4" aria-labelledby="feed-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-blue-700">Browse all events</p>
          <h2 id="feed-heading" className="mt-1 text-2xl font-semibold tracking-tight text-stone-950">
            Full event feed
          </h2>
        </div>
        <p className="text-sm text-slate-600">
          Showing {filtered.length} of {events.length} upcoming events
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(14rem,0.8fr)_minmax(0,1fr)] lg:items-end">
          <label className="block space-y-2">
            <span className="text-[0.8125rem] font-medium text-slate-700">Search the feed</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try resume, finance, virtual"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[0.875rem] text-stone-950 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>

          <fieldset>
            <legend className="mb-2 text-[0.8125rem] font-medium text-slate-700">Date range</legend>
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
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
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
            <legend className="mb-2 text-[0.8125rem] font-medium text-slate-700">Tags</legend>
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
                        ? 'border-accent bg-blue-50 text-blue-700'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-[0.8125rem] font-medium text-slate-700">Host organizations</legend>
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
                        ? 'border-accent bg-blue-50 text-blue-700'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {host}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        {activeFilterCount > 0 ? (
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-sm text-slate-600">
            <span>{activeFilterCount} active filter{activeFilterCount === 1 ? '' : 's'}</span>
            <button
              type="button"
              onClick={clearFilters}
              className="font-medium text-blue-700 transition hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-6">
          {groupedEvents.map((group) => (
            <section key={group.id} aria-labelledby={`events-${group.id}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-2">
                <h3 id={`events-${group.id}`} className="text-lg font-semibold tracking-tight text-stone-950">
                  {group.label}
                </h3>
                <span className="text-sm text-slate-500">
                  {group.events.length} event{group.events.length === 1 ? '' : 's'}
                </span>
              </div>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.events.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
          No events match your filters right now. Try broadening your selections or check back as more campus
          organizations are added.
        </div>
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="alerts-heading">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1fr)] lg:items-start">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-blue-700">Email alerts</p>
            <h2 id="alerts-heading" className="mt-1.5 text-lg font-semibold tracking-tight text-stone-950">
              Get a calm digest instead of a flood
            </h2>
            <p className="mt-3 text-[0.8125rem] leading-[1.65] text-slate-600">
              We send a daily email digest only when there are new matching events in the next week. No repeated
              reminders, and never more than one alert email per day.
            </p>
            <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-700">
              <p className="font-semibold text-stone-950">Current alert filter</p>
              <p className="mt-1">{alertSummary}</p>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Email addresses are encrypted at rest in Netlify Blobs and only handled inside Netlify Functions.
              Delivery credentials stay in Netlify environment variables instead of the client.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-[0.8125rem] font-medium text-slate-700">Email address</span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@drexel.edu"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.875rem] text-stone-950 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
              />
              <span className="text-[0.8125rem] leading-[1.55] text-slate-600">
                I agree to receive a filter-based email digest for matching Drexel events. We only send when there are
                new matches, and never more than once per day.
              </span>
            </label>

            <button
              type="button"
              onClick={requestConfirmationEmail}
              disabled={submitting}
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {submitting ? 'Sending confirmation...' : 'Send confirmation email'}
            </button>

            {debugUrl ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Local testing link:{' '}
                <a href={debugUrl} className="font-semibold underline decoration-amber-500 underline-offset-2">
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
