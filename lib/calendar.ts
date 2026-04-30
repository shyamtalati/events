import { type Event } from '../data/events';

const siteUrl = 'https://universityevent.netlify.app';
const defaultDurationMs = 60 * 60 * 1000;

function getEventEnd(event: Event) {
  if (event.endsAt) {
    return new Date(event.endsAt);
  }

  return new Date(new Date(event.startsAt).getTime() + defaultDurationMs);
}

function toUtcCalendarDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function foldIcsLine(line: string) {
  if (line.length <= 74) {
    return line;
  }

  const lines = [line.slice(0, 74)];
  let rest = line.slice(74);

  while (rest.length > 0) {
    lines.push(` ${rest.slice(0, 73)}`);
    rest = rest.slice(73);
  }

  return lines.join('\r\n');
}

function getEventUrl(event: Event) {
  return `${siteUrl}/events/${event.slug}`;
}

function getCalendarDescription(event: Event) {
  return [
    event.description,
    event.rsvpUrl ? `RSVP: ${event.rsvpUrl}` : null,
    `Event page: ${getEventUrl(event)}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function createGoogleCalendarUrl(event: Event) {
  const start = new Date(event.startsAt);
  const end = getEventEnd(event);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toUtcCalendarDate(start)}/${toUtcCalendarDate(end)}`,
    details: getCalendarDescription(event),
    location: event.location,
    ctz: 'America/New_York',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function createIcsCalendar(event: Event) {
  const start = new Date(event.startsAt);
  const end = getEventEnd(event);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Campus Event Guide//University Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.slug}@universityevent.netlify.app`,
    `DTSTAMP:${toUtcCalendarDate(new Date())}`,
    `DTSTART:${toUtcCalendarDate(start)}`,
    `DTEND:${toUtcCalendarDate(end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(getCalendarDescription(event))}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    `URL:${getEventUrl(event)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return `${lines.map(foldIcsLine).join('\r\n')}\r\n`;
}

export function createCalendarDataUrl(event: Event) {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(createIcsCalendar(event))}`;
}

export function createIcsFilename(event: Event) {
  return `${event.slug}.ics`;
}
