import Link from 'next/link';
import { type Event } from '@/data/events';
import { TagChip } from '@/components/TagChip';

function formatDateTime(startsAt: string, endsAt?: string) {
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

  const base = `${dateFormatter.format(start)} · ${timeFormatter.format(start)}`;
  if (!end) return base;
  return `${base} – ${timeFormatter.format(end)}`;
}

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <li>
      <Link
        href={`/events/${event.slug}`}
        className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-accent hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <p className="text-sm text-slate-500">{formatDateTime(event.startsAt, event.endsAt)}</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">{event.title}</h3>
        <p className="mt-1 text-sm text-slate-700">{event.hostOrg}</p>
        <p className="mt-1 text-sm text-slate-600">{event.location}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <TagChip key={`${event.slug}-${tag}`} label={tag} />
          ))}
        </div>
      </Link>
    </li>
  );
}
