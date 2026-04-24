import { events, type Event, type Tag } from '../data/events';

export type DateRange = 'this-week' | 'this-month' | 'all';

export type EventDateGroup = {
  id: string;
  label: string;
  events: Event[];
};

type FilterEventsOptions = {
  searchQuery?: string;
  referenceDate?: Date;
};

const sortByStart = (a: Event, b: Event) =>
  new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();

const dateGroupFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
});

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

export function getFeaturedThisWeek(sourceEvents: Event[], referenceDate = new Date(), limit = 3): Event[] {
  return filterEvents(sourceEvents, 'this-week', [], [], { referenceDate }).slice(0, limit);
}

export function groupEventsByDate(sourceEvents: Event[]): EventDateGroup[] {
  const groups = new Map<string, EventDateGroup>();

  sourceEvents.forEach((event) => {
    const id = event.startsAt.slice(0, 10);
    const existingGroup = groups.get(id);

    if (existingGroup) {
      existingGroup.events.push(event);
      return;
    }

    groups.set(id, {
      id,
      label: dateGroupFormatter.format(new Date(event.startsAt)),
      events: [event],
    });
  });

  return [...groups.values()];
}

export function filterEvents(
  sourceEvents: Event[],
  dateRange: DateRange,
  selectedTags: Tag[],
  selectedHosts: string[],
  options: FilterEventsOptions | Date = {},
): Event[] {
  const referenceDate = options instanceof Date ? options : options.referenceDate ?? new Date();
  const normalizedQuery = options instanceof Date ? '' : options.searchQuery?.trim().toLowerCase() ?? '';
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
    const searchMatch =
      normalizedQuery.length === 0 ||
      [event.title, event.hostOrg, event.location, event.description, ...event.tags]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);

    return inDateRange(event) && tagMatch && hostMatch && searchMatch;
  });
}
