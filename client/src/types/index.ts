export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  time?: string; // HH:mm format
  location?: string;
  color?: string;
  category: EventCategory;
  isRecurring: boolean;
  recurrenceType?: 'weekly' | 'monthly';
  recurrenceEnd?: string; // ISO date string
  timezone: 'local' | 'JST';
  reminders: Reminder[];
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent extends Event {
  displayDate: string; // The actual date this event should be displayed on
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  color: string;
  category: EventCategory;
  isRecurring: boolean;
  recurrenceType: 'weekly' | 'monthly';
  recurrenceEnd: string;
  timezone: 'local' | 'JST';
  reminders: Reminder[];
}

export interface EventCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Reminder {
  id: string;
  type: 'notification' | 'email';
  time: number; // minutes before event
  enabled: boolean;
}

export interface CalendarView {
  type: 'month' | 'week' | 'year' | 'agenda';
  title: string;
  icon: string;
}

export interface Theme {
  name: string;
  isDark: boolean;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
}

export interface ExportOptions {
  format: 'ics' | 'json' | 'csv';
  dateRange: {
    start: string;
    end: string;
  };
  includeRecurring: boolean;
  categories?: string[];
}

export interface ImportResult {
  success: boolean;
  eventsAdded: number;
  eventsSkipped: number;
  errors: string[];
} 