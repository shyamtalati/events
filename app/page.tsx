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
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Upcoming events</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          One clean feed for Drexel events. The directory is starting with finance, career, and student organization
          programming and expanding toward a broader university-wide calendar.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
        Expanding now: university-wide events, including more programming from groups like SCDC and other campus
        organizations.
      </div>

      <FilterBar events={upcomingEvents} tags={tags} hosts={hosts} />
    </section>
  );
}
