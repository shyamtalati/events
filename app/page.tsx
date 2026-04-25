import type { Metadata } from 'next';
import { EventCard } from '@/components/EventCard';
import { FilterBar } from '@/components/FilterBar';
import { getAllHosts, getAllTags, getFeaturedThisWeek, getUpcoming } from '@/lib/events';

export const metadata: Metadata = {
  title: 'Upcoming Events | Campus Event Guide',
  description:
    'Discover career fairs, recruiting sessions, networking nights, workshops, speaker events, and student organization programming in one calm campus event guide.',
};

export default function HomePage() {
  const upcomingEvents = getUpcoming();
  const tags = getAllTags();
  const hosts = getAllHosts();
  const featuredEvents = getFeaturedThisWeek(upcomingEvents);

  return (
    <div className="space-y-16">
      <section className="-mx-4 border-y border-warm/70 bg-warm/35 px-4 py-10 sm:-mx-6 sm:px-6 sm:py-14 lg:-mx-8 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-accent">
              University event discovery
            </p>
            <h1 className="mt-4 max-w-[46rem] text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3.5rem] lg:leading-[1.02]">
              Find the campus events worth showing up for.
            </h1>
            <p className="mt-5 max-w-2xl text-[1.0625rem] leading-8 text-body">
              A focused weekly guide to career fairs, networking nights, recruiting sessions, workshops, speaker
              events, and student organization programming.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                'Career fairs',
                'Recruiting sessions',
                'Networking nights',
                'Workshops',
                'Speaker events',
                'Student org programming',
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-lg border border-surface/80 bg-surface/75 px-3 py-2 text-sm font-medium text-body shadow-sm"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-surface/80 bg-surface/80 p-4 shadow-[0_18px_45px_rgba(24,31,36,0.08)]">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { value: upcomingEvents.length, label: 'upcoming events' },
                { value: 'Weekly', label: 'curated rhythm' },
                { value: 'Career', label: 'and student life focus' },
              ].map((item) => (
                <div key={`${item.value}-${item.label}`} className="rounded-lg border border-line bg-surface p-4">
                  <p className="text-2xl font-semibold tracking-tight text-ink">{item.value}</p>
                  <p className="mt-1 text-sm text-body">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6" aria-labelledby="featured-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-attention">
              Featured this week
            </p>
            <h2 id="featured-heading" className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              A few timely places to start
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-body">Selected from the next seven days of programming.</p>
        </div>

        <ul className="grid gap-4 md:grid-cols-3">
          {featuredEvents.map((event) => (
            <EventCard key={event.slug} event={event} variant="featured" />
          ))}
        </ul>
      </section>

      <FilterBar events={upcomingEvents} tags={tags} hosts={hosts} />
    </div>
  );
}
