import { events, type Event, type Tag } from '@/data/events';

export type DateRange = 'this-week' | 'this-month' | 'all';

const sortByStart = (a: Event, b: Event) =>
  new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();

export function getUpcoming(referenceDate = new Date()): Event[] {
  const now = referenceDate.getTime();
  return events
    .filter((event) => new Date(event.endsAt ?? event.startsAt).getTime() >= now)
    .sort(sortByStart);
}

export function getBySlug(slug: string): Event | undefined {
  return events.find((event) => event.slug === slug);
}

export function getAllTags(): Tag[] {
  return [...new Set(events.flatMap((event) => event.tags))].sort() as Tag[];
}

export function getAllHosts(): string[] {
  return [...new Set(events.map((event) => event.hostOrg))].sort();
}

export function filterEvents(
  sourceEvents: Event[],
  dateRange: DateRange,
  selectedTags: Tag[],
  selectedHosts: string[],
  referenceDate = new Date(),
): Event[] {
  const startOfDay = new Date(referenceDate);
  startOfDay.setHours(0, 0, 0, 0);

  const inDateRange = (event: Event): boolean => {
    if (dateRange === 'all') return true;

    const eventDate = new Date(event.startsAt);
    if (dateRange === 'this-week') {
      const weekEnd = new Date(startOfDay);
      weekEnd.setDate(startOfDay.getDate() + 7);
      return eventDate >= startOfDay && eventDate < weekEnd;
    }

    const monthEnd = new Date(startOfDay);
    monthEnd.setMonth(startOfDay.getMonth() + 1);
    return eventDate >= startOfDay && eventDate < monthEnd;
  };

  return sourceEvents.filter((event) => {
    const tagMatch = selectedTags.length === 0 || selectedTags.some((tag) => event.tags.includes(tag));
    const hostMatch = selectedHosts.length === 0 || selectedHosts.includes(event.hostOrg);
    return inDateRange(event) && tagMatch && hostMatch;
  });
}
