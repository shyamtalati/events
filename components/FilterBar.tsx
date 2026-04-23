'use client';

import { useMemo, useState } from 'react';
import { type Event, type Tag } from '@/data/events';
import { EventCard } from '@/components/EventCard';
import { filterEvents, type DateRange } from '@/lib/events';

type FilterBarProps = {
  events: Event[];
  tags: Tag[];
  hosts: string[];
};

export function FilterBar({ events, tags, hosts }: FilterBarProps) {
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);

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
    () => filterEvents(events, dateRange, selectedTags, selectedHosts),
    [dateRange, events, selectedHosts, selectedTags],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="space-y-4">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-slate-700">Date range</legend>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'this-week', label: 'This Week' },
                { value: 'this-month', label: 'This Month' },
                { value: 'all', label: 'All' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDateRange(option.value as DateRange)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
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

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-slate-700">Tags</legend>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
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
            <legend className="mb-2 text-sm font-medium text-slate-700">Host organizations</legend>
            <div className="flex flex-wrap gap-2">
              {hosts.map((host) => {
                const active = selectedHosts.includes(host);
                return (
                  <button
                    key={host}
                    type="button"
                    onClick={() => toggleHost(host)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
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
      </section>

      {filtered.length > 0 ? (
        <ul className="space-y-3">
          {filtered.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
          No events match your filters right now. Try broadening your selections.
        </div>
      )}
    </div>
  );
}
