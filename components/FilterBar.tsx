'use client';

import Link from 'next/link';
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

type EventViewMode = 'calendar' | 'list';

const dateRangeOptions: Array<{ value: DateRange; label: string }> = [
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
  { value: 'all', label: 'All' },
];

const viewOptions: Array<{ value: EventViewMode; label: string }> = [
  { value: 'calendar', label: 'Calendar' },
  { value: 'list', label: 'List' },
];

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const monthLabelFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

const eventTimeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/New_York',
});

function readDateRange(value: string | null): DateRange | null {
  if (value === 'this-week' || value === 'this-month' || value === 'all') {
    return value;
  }

  return null;
}

function getStartOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getStartOfEventMonth(startsAt: string) {
  const [year, month] = startsAt.slice(0, 7).split('-').map(Number);

  return new Date(year, month - 1, 1);
}

function formatDateId(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function buildCalendarDays(monthDate: Date) {
  const monthStart = getStartOfMonth(monthDate);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());
  const todayId = formatDateId(new Date());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const id = formatDateId(date);

    return {
      id,
      dayNumber: date.getDate(),
      inCurrentMonth: date.getMonth() === monthDate.getMonth(),
      isToday: id === todayId,
    };
  });
}

function formatEventTime(startsAt: string) {
  return eventTimeFormatter.format(new Date(startsAt));
}

export function FilterBar({ events, tags, hosts }: FilterBarProps) {
  const [query, setQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [viewMode, setViewMode] = useState<EventViewMode>('calendar');
  const [calendarMonth, setCalendarMonth] = useState(() =>
    events[0] ? getStartOfEventMonth(events[0].startsAt) : getStartOfMonth(new Date()),
  );
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
  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);
  const eventsByDate = useMemo(() => {
    const groups = new Map<string, Event[]>();

    filtered.forEach((event) => {
      const dateId = event.startsAt.slice(0, 10);
      const existingEvents = groups.get(dateId);

      if (existingEvents) {
        existingEvents.push(event);
        return;
      }

      groups.set(dateId, [event]);
    });

    return groups;
  }, [filtered]);
  const calendarMonthEventCount = useMemo(
    () => {
      const monthPrefix = `${calendarMonth.getFullYear()}-${`${calendarMonth.getMonth() + 1}`.padStart(2, '0')}`;

      return filtered.filter((event) => event.startsAt.startsWith(monthPrefix)).length;
    },
    [calendarMonth, filtered],
  );
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

  const moveCalendarMonth = (monthOffset: number) => {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + monthOffset, 1));
  };

  const goToCurrentMonth = () => {
    setCalendarMonth(getStartOfMonth(new Date()));
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
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="inline-flex rounded-lg border border-line bg-surface p-1 shadow-sm" aria-label="Event view">
            {viewOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={viewMode === option.value}
                onClick={() => setViewMode(option.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                  viewMode === option.value
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-body hover:bg-muted hover:text-ink'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-body shadow-sm">
            Showing {filtered.length} of {events.length} upcoming events
          </p>
        </div>
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
          {viewMode === 'calendar' ? (
            <section
              className="rounded-lg border border-line bg-surface shadow-[0_14px_36px_rgba(24,31,36,0.055)]"
              aria-labelledby="calendar-view-heading"
            >
              <div className="flex flex-col gap-4 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-accent">
                    Calendar view
                  </p>
                  <h3 id="calendar-view-heading" className="mt-1 text-xl font-semibold tracking-tight text-ink">
                    {monthLabelFormatter.format(calendarMonth)}
                  </h3>
                  <p className="mt-1 text-sm text-body">
                    {calendarMonthEventCount} matching event{calendarMonthEventCount === 1 ? '' : 's'} this month
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => moveCalendarMonth(-1)}
                    className="rounded-lg border border-line bg-surface px-3 py-2 text-sm font-semibold text-body transition hover:border-secondary hover:bg-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={goToCurrentMonth}
                    className="rounded-lg border border-line bg-surface px-3 py-2 text-sm font-semibold text-body transition hover:border-secondary hover:bg-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCalendarMonth(1)}
                    className="rounded-lg border border-line bg-surface px-3 py-2 text-sm font-semibold text-body transition hover:border-secondary hover:bg-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[48rem]">
                  <div className="grid grid-cols-7 border-b border-line bg-muted/60">
                    {weekdayLabels.map((weekday) => (
                      <div key={weekday} className="px-3 py-2 text-center text-[0.75rem] font-semibold text-body">
                        {weekday}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7">
                    {calendarDays.map((day) => {
                      const dayEvents = eventsByDate.get(day.id) ?? [];

                      return (
                        <div
                          key={day.id}
                          className={`min-h-[9.75rem] border-b border-r border-line p-2 ${
                            day.inCurrentMonth ? 'bg-surface' : 'bg-muted/35'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`grid h-7 w-7 place-items-center rounded-full text-sm font-semibold ${
                                day.isToday
                                  ? 'bg-accent text-white'
                                  : day.inCurrentMonth
                                    ? 'text-ink'
                                    : 'text-soft'
                              }`}
                            >
                              {day.dayNumber}
                            </span>
                            {dayEvents.length > 0 ? (
                              <span className="text-[0.6875rem] font-semibold text-accent">
                                {dayEvents.length}
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-2 max-h-28 space-y-1 overflow-y-auto pr-1">
                            {dayEvents.map((event) => (
                              <Link
                                key={event.slug}
                                href={`/events/${event.slug}`}
                                className="block rounded-md border border-accent/30 bg-accent/10 px-2 py-1.5 text-left transition hover:border-accent/55 hover:bg-accent/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                              >
                                <span className="block text-[0.6875rem] font-semibold text-accent">
                                  {formatEventTime(event.startsAt)}
                                </span>
                                <span className="mt-0.5 block text-[0.75rem] font-semibold leading-4 text-ink">
                                  {event.title}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {calendarMonthEventCount === 0 ? (
                <p className="border-t border-line px-4 py-3 text-sm text-body sm:px-5">
                  No matching events in {monthLabelFormatter.format(calendarMonth)}. Try the next month or switch to
                  list view to scan everything that matches your filters.
                </p>
              ) : null}
            </section>
          ) : (
            groupedEvents.map((group) => (
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
            ))
          )}
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
