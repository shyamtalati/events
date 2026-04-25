import type { Metadata } from 'next';
import Image from 'next/image';
import { EventCard } from '@/components/EventCard';
import { FilterBar } from '@/components/FilterBar';
import { getAllHosts, getAllTags, getFeaturedThisWeek, getUpcoming } from '@/lib/events';

const eventMoments = [
  {
    label: 'Meet recruiters',
    title: 'Career fairs and info sessions',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
    alt: 'Students gathered around a table during a campus networking event.',
  },
  {
    label: 'Build skills',
    title: 'Workshops and interview prep',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    alt: 'A laptop open for a focused workshop session.',
  },
  {
    label: 'Hear ideas',
    title: 'Speaker events and panels',
    image:
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80',
    alt: 'An audience listening to a speaker at a lecture hall event.',
  },
  {
    label: 'Find people',
    title: 'Student org programming',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    alt: 'Students collaborating together around a table.',
  },
];

export const metadata: Metadata = {
  title: 'Campus Event Guide | Find the Events Worth Showing Up For',
  description:
    'Discover career fairs, recruiting sessions, networking nights, workshops, speaker events, and student organization programming in one calm campus event guide.',
};

export default function HomePage() {
  const upcomingEvents = getUpcoming();
  const tags = getAllTags();
  const hosts = getAllHosts();
  const featuredEvents = getFeaturedThisWeek(upcomingEvents);

  return (
    <div className="space-y-12 pb-8 sm:space-y-14">
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-y border-warm/80 bg-warm/40 sm:-mt-10">
        <div className="mx-auto max-w-[90rem] px-4 pb-4 pt-10 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pb-12 lg:pt-14">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.28em] text-accent">
              University event discovery
            </p>
            <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-[4.75rem] lg:leading-[0.95]">
              Find the campus events worth showing up for.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-[1.125rem] leading-8 text-body sm:text-xl sm:leading-9">
              A focused weekly guide to career fairs, networking nights, recruiting sessions, workshops, speaker
              events, and student organization programming.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#events"
                className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(63,154,174,0.22)] transition hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Explore events
              </a>
              <a
                href="/?range=this-week#events"
                className="rounded-lg border border-line bg-surface/85 px-5 py-3 text-sm font-semibold text-ink shadow-sm transition hover:border-secondary hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                See this week
              </a>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-[82rem]">
            <div className="landing-media-rail grid auto-cols-[minmax(15.5rem,1fr)] grid-flow-col gap-3 overflow-x-auto rounded-lg border border-surface/80 bg-surface/50 p-3 shadow-[0_24px_60px_rgba(24,31,36,0.08)] lg:grid-flow-row lg:grid-cols-4 lg:overflow-visible">
              {eventMoments.map((moment, index) => (
                <article
                  key={moment.label}
                  className={`group relative min-h-[11rem] overflow-hidden rounded-lg border border-surface/70 bg-ink shadow-[0_18px_38px_rgba(24,31,36,0.08)] lg:min-h-[17rem] ${
                    index % 2 === 0 ? 'lg:translate-y-5' : 'lg:-translate-y-2'
                  }`}
                >
                  <Image
                    src={moment.image}
                    alt={moment.alt}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
                    priority={index < 2}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-ink/25" aria-hidden="true" />
                  <div className="absolute inset-x-4 bottom-4">
                    <p className="inline-flex rounded-lg border border-surface/70 bg-surface/95 px-3 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-accent shadow-sm">
                      {moment.label}
                    </p>
                    <h2 className="mt-3 rounded-lg bg-surface/95 px-3 py-2 text-lg font-semibold tracking-tight text-ink shadow-sm">
                      {moment.title}
                    </h2>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-5 grid max-w-4xl gap-3 sm:grid-cols-3">
            {[
              { value: upcomingEvents.length, label: 'upcoming events' },
              { value: 'Updated', label: 'weekly' },
              { value: 'Career-focused', label: 'and student life ready' },
            ].map((item) => (
              <div
                key={`${item.value}-${item.label}`}
                className="rounded-lg border border-line bg-surface/90 p-4 text-center shadow-sm"
              >
                <p className="text-2xl font-semibold tracking-tight text-ink">{item.value}</p>
                <p className="mt-1 text-sm text-body">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label="What students can discover">
        {[
          {
            eyebrow: 'Plan the week',
            title: 'A calmer way to choose where your time goes.',
            copy: 'The homepage now opens like a guide, then moves naturally into featured events and the full calendar.',
          },
          {
            eyebrow: 'Find the signal',
            title: 'Career, business, finance, and community programming in one place.',
            copy: 'Students can scan for recruiting, networking, workshops, speakers, and organization-led events without jumping between channels.',
          },
          {
            eyebrow: 'Built to expand',
            title: 'Theme-ready structure for more universities later.',
            copy: 'The palette is still driven by CSS variables, so new university themes can be layered in without rewriting the interface.',
          },
        ].map((item) => (
          <article key={item.eyebrow} className="rounded-lg border border-line bg-surface p-5 shadow-[0_14px_36px_rgba(24,31,36,0.045)]">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-attention">{item.eyebrow}</p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-body">{item.copy}</p>
          </article>
        ))}
      </section>

      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-surface py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="space-y-6" aria-labelledby="featured-heading">
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
          </div>
        </div>
      </section>

      <FilterBar events={upcomingEvents} tags={tags} hosts={hosts} />
    </div>
  );
}
