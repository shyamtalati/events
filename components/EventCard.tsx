import Link from 'next/link';
import { type Event } from '@/data/events';
import { TagChip } from '@/components/TagChip';
import { createCalendarDataUrl, createIcsFilename } from '@/lib/calendar';

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
      ? 'flex h-full flex-col rounded-lg border border-secondary/45 bg-secondary/15 p-5 shadow-[0_16px_40px_rgba(24,31,36,0.07)] transition-[border-color,box-shadow,transform,background-color] hover:-translate-y-0.5 hover:border-accent/55 hover:bg-secondary/20 hover:shadow-[0_20px_50px_rgba(24,31,36,0.1)]'
      : 'flex h-full flex-col rounded-lg border border-line bg-surface p-5 shadow-[0_10px_30px_rgba(24,31,36,0.045)] transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-[0_16px_40px_rgba(24,31,36,0.08)]';

  return (
    <li className="h-full">
      <article className={cardClassName}>
        <Link
          href={`/events/${event.slug}`}
          className="block flex-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
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

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line/70 pt-4">
          <a
            href={createCalendarDataUrl(event)}
            download={createIcsFilename(event)}
            className="rounded-lg border border-accent/35 bg-surface px-3 py-1.5 text-[0.8125rem] font-semibold text-accent transition hover:border-accent hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Add to calendar
          </a>
          <Link
            href={`/events/${event.slug}`}
            className="rounded-lg px-3 py-1.5 text-[0.8125rem] font-semibold text-body transition hover:bg-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Details
          </Link>
        </div>
      </article>
    </li>
  );
}
