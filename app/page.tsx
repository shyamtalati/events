import type { Metadata } from 'next';
import { EventCard } from '@/components/EventCard';
import { FilterBar } from '@/components/FilterBar';
import { getAllHosts, getAllTags, getFeaturedThisWeek, getUpcoming } from '@/lib/events';

export const metadata: Metadata = {
  title: 'Upcoming Events | Drexel University Events',
  description:
    'Discover upcoming Drexel events in one place, starting with finance, career, and student organization programming as the directory expands university-wide.',
};

export default function HomePage() {
  const upcomingEvents = getUpcoming();
  const tags = getAllTags();
  const hosts = getAllHosts();
  const featuredEvents = getFeaturedThisWeek(upcomingEvents);

  return (
    <div className="space-y-9">
      <section className="grid gap-6 border-b border-slate-200 pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-blue-700">Drexel University</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Find the campus events worth showing up for.
          </h1>
          <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-slate-600">
            A focused weekly guide to career, recruiting, speaker, and student organization events across Drexel.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:max-w-[20rem] lg:justify-end">
          {[
            `${upcomingEvents.length} upcoming events`,
            'Career-focused',
            'Updated weekly',
          ].map((label) => (
            <span key={label} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="featured-heading">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-blue-700">Featured this week</p>
            <h2 id="featured-heading" className="mt-1 text-2xl font-semibold tracking-tight text-stone-950">
              Start with these three
            </h2>
          </div>
          <p className="text-sm text-slate-600">Selected from the next seven days of programming.</p>
        </div>

        <ul className="grid gap-3 md:grid-cols-3">
          {featuredEvents.map((event) => (
            <EventCard key={event.slug} event={event} variant="featured" />
          ))}
        </ul>
      </section>

      <FilterBar events={upcomingEvents} tags={tags} hosts={hosts} />
    </div>
  );
}
