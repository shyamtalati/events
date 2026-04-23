import type { Metadata } from 'next';
import { FilterBar } from '@/components/FilterBar';
import { getAllHosts, getAllTags, getUpcoming } from '@/lib/events';

export const metadata: Metadata = {
  title: 'Upcoming Events | Drexel University Events',
  description:
    'Discover upcoming Drexel events in one place, starting with finance, career, and student organization programming as the directory expands university-wide.',
};

export default function HomePage() {
  const upcomingEvents = getUpcoming();
  const tags = getAllTags();
  const hosts = getAllHosts();

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950">Upcoming events</h1>
        <p className="mt-2 max-w-[42rem] text-[0.9375rem] leading-6 text-stone-600">
          One clean feed for campus events, starting with finance, career, and student organization programming and
          expanding university-wide.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-100 px-4 py-3 text-sm text-amber-900">
        Now including Career Development Center programming, with more campus organizations on the way.
      </div>

      <FilterBar events={upcomingEvents} tags={tags} hosts={hosts} />
    </section>
  );
}
