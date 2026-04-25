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
    timeZone: 'America/New_York',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  });

  const base = `${dateFormatter.format(start)} · ${timeFormatter.format(start)}`;
  if (!end) return base;
  return `${base} – ${timeFormatter.format(end)}`;
}

type EventCardProps = {
  event: Event;
  variant?: 'default' | 'featured';
};

export function EventCard({ event, variant = 'default' }: EventCardProps) {
  const cardClassName =
    variant === 'featured'
      ? 'block h-full rounded-lg border border-secondary/45 bg-secondary/15 p-5 shadow-[0_16px_40px_rgba(24,31,36,0.07)] transition-[border-color,box-shadow,transform,background-color] hover:-translate-y-0.5 hover:border-accent/55 hover:bg-secondary/20 hover:shadow-[0_20px_50px_rgba(24,31,36,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
      : 'block h-full rounded-lg border border-line bg-surface p-5 shadow-[0_10px_30px_rgba(24,31,36,0.045)] transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-[0_16px_40px_rgba(24,31,36,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2';

  return (
    <li className="h-full">
      <Link href={`/events/${event.slug}`} className={cardClassName}>
        {variant === 'featured' ? (
          <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-attention">Featured</p>
        ) : null}
        <p className="text-[0.8125rem] font-medium text-accent">{formatDateTime(event.startsAt, event.endsAt)}</p>
        <h3 className="mt-2 text-[1.0625rem] font-semibold tracking-tight text-ink">{event.title}</h3>
        <p className="mt-2 text-[0.8125rem] font-medium text-body">{event.hostOrg}</p>
        <p className="mt-1 text-[0.8125rem] text-soft">{event.location}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {event.tags.map((tag) => (
            <TagChip key={`${event.slug}-${tag}`} label={tag} />
          ))}
        </div>
      </Link>
    </li>
  );
}
