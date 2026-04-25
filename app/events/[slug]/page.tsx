import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TagChip } from '@/components/TagChip';
import { events } from '@/data/events';
import { getBySlug } from '@/lib/events';

type EventPageProps = {
  params: {
    slug: string;
  };
};

function formatDateTime(startsAt: string, endsAt?: string) {
  const start = new Date(startsAt);
  const end = endsAt ? new Date(endsAt) : null;

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  });
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  });

  if (!end) return `${dateFormatter.format(start)} · ${timeFormatter.format(start)}`;
  return `${dateFormatter.format(start)} · ${timeFormatter.format(start)} – ${timeFormatter.format(end)}`;
}

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export function generateMetadata({ params }: EventPageProps): Metadata {
  const event = getBySlug(params.slug);

  if (!event) {
    return {
      title: 'Event not found | Campus Event Guide',
    };
  }

  return {
    title: `${event.title} | Campus Event Guide`,
    description: event.description,
  };
}

export default function EventDetailPage({ params }: EventPageProps) {
  const event = getBySlug(params.slug);

  if (!event) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6 rounded-lg border border-line bg-surface p-6 shadow-[0_16px_40px_rgba(24,31,36,0.06)] sm:p-8">
      <div>
        <Link
          href="/"
          className="text-sm font-medium text-accent hover:text-accent/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          ← Back to events
        </Link>
        <h1 className="mt-4 text-[1.625rem] font-semibold tracking-tight text-ink sm:text-3xl">{event.title}</h1>
      </div>

      <div className="space-y-2 text-sm text-body sm:text-base">
        <p>
          <span className="font-semibold text-ink">When:</span> {formatDateTime(event.startsAt, event.endsAt)}
        </p>
        <p>
          <span className="font-semibold text-ink">Where:</span> {event.location}
        </p>
        <p>
          <span className="font-semibold text-ink">Host:</span> {event.hostOrg}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {event.tags.map((tag) => (
          <TagChip key={`${event.slug}-${tag}`} label={tag} />
        ))}
      </div>

      <p className="whitespace-pre-line text-sm leading-7 text-body sm:text-base">{event.description}</p>

      {event.rsvpUrl ? (
        <a
          href={event.rsvpUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          RSVP / Register
        </a>
      ) : null}
    </article>
  );
}
