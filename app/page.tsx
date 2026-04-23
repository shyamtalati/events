import type { Metadata } from 'next';
import { FilterBar } from '@/components/FilterBar';
import { getAllHosts, getAllTags, getUpcoming } from '@/lib/events';

export const metadata: Metadata = {
  title: 'Upcoming Events | Drexel Finance Events',
  description: 'Discover upcoming Drexel finance, recruiting, and business events in one place.',
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
          High-signal finance and business events for Drexel students. No clutter, just the events worth attending.
        </p>
      </div>

      <FilterBar events={upcomingEvents} tags={tags} hosts={hosts} />
    </section>
  );
}
