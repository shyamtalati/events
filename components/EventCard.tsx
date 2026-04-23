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
    <li className="h-full">
      <Link
        href={`/events/${event.slug}`}
        className="block h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-[border-color,box-shadow] hover:border-accent hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <p className="text-[0.8125rem] text-slate-500">{formatDateTime(event.startsAt, event.endsAt)}</p>
        <h3 className="mt-1 text-[1.0625rem] font-semibold tracking-tight text-stone-950">{event.title}</h3>
        <p className="mt-0.5 text-[0.8125rem] text-slate-700">{event.hostOrg}</p>
        <p className="mt-0.5 text-[0.8125rem] text-slate-600">{event.location}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {event.tags.map((tag) => (
            <TagChip key={`${event.slug}-${tag}`} label={tag} />
          ))}
        </div>
      </Link>
    </li>
  );
}
