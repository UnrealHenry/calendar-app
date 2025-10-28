import { format, parseISO, addWeeks, addMonths, isBefore, isAfter, startOfDay } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import type { Event, CalendarEvent, EventFormData } from '../types';

// Event colors
export const EVENT_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Gray', value: '#6B7280' },
];

// Generate recurring events
export function generateRecurringEvents(event: Event): CalendarEvent[] {
  if (!event.isRecurring || !event.recurrenceType || !event.recurrenceEnd) {
    return [{ ...event, displayDate: event.date }];
  }

  const events: CalendarEvent[] = [];
  const startDate = parseISO(event.date);
  const endDate = parseISO(event.recurrenceEnd);
  let currentDate = startDate;

  while (isBefore(currentDate, endDate) || format(currentDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
    events.push({
      ...event,
      displayDate: format(currentDate, 'yyyy-MM-dd'),
    });

    if (event.recurrenceType === 'weekly') {
      currentDate = addWeeks(currentDate, 1);
    } else if (event.recurrenceType === 'monthly') {
      currentDate = addMonths(currentDate, 1);
    }
  }

  return events;
}

// Get events for a specific date
export function getEventsForDate(events: Event[], date: string): CalendarEvent[] {
  const allEvents: CalendarEvent[] = [];
  
  events.forEach(event => {
    const recurringEvents = generateRecurringEvents(event);
    allEvents.push(...recurringEvents);
  });

  return allEvents.filter(event => event.displayDate === date);
}

// Format time based on timezone
export function formatEventTime(time: string, timezone: 'local' | 'JST'): string {
  if (!time) return '';
  
  const today = new Date();
  const timeString = `${format(today, 'yyyy-MM-dd')}T${time}`;
  
  if (timezone === 'JST') {
    return formatInTimeZone(parseISO(timeString), 'Asia/Tokyo', 'HH:mm');
  }
  
  return time;
}

// Convert time between timezones
export function convertTimeBetweenTimezones(
  time: string, 
  fromTimezone: 'local' | 'JST', 
  toTimezone: 'local' | 'JST'
): string {
  if (!time) return '';
  
  const today = new Date();
  const timeString = `${format(today, 'yyyy-MM-dd')}T${time}`;
  
  if (fromTimezone === toTimezone) return time;
  
  if (fromTimezone === 'JST' && toTimezone === 'local') {
    // Convert from JST to local
    const jstTime = toZonedTime(parseISO(timeString), 'Asia/Tokyo');
    return format(jstTime, 'HH:mm');
  } else if (fromTimezone === 'local' && toTimezone === 'JST') {
    // Convert from local to JST
    const localTime = parseISO(timeString);
    return formatInTimeZone(localTime, 'Asia/Tokyo', 'HH:mm');
  }
  
  return time;
}

// Local storage utilities
export function saveEventsToStorage(events: Event[]): void {
  localStorage.setItem('calendar-events', JSON.stringify(events));
}

export function loadEventsFromStorage(): Event[] {
  const stored = localStorage.getItem('calendar-events');
  return stored ? JSON.parse(stored) : [];
}

// Create new event
export function createEvent(formData: EventFormData): Event {
  const now = new Date().toISOString();
  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: formData.title,
    description: formData.description,
    date: formData.date,
    time: formData.time,
    location: formData.location,
    color: formData.color,
    isRecurring: formData.isRecurring,
    recurrenceType: formData.recurrenceType,
    recurrenceEnd: formData.recurrenceEnd,
    timezone: formData.timezone,
    createdAt: now,
    updatedAt: now,
  };
}

// Update event
export function updateEvent(events: Event[], eventId: string, updates: Partial<Event>): Event[] {
  return events.map(event => 
    event.id === eventId 
      ? { ...event, ...updates, updatedAt: new Date().toISOString() }
      : event
  );
}

// Delete event
export function deleteEvent(events: Event[], eventId: string): Event[] {
  return events.filter(event => event.id !== eventId);
} 