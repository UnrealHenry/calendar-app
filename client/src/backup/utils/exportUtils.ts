import { format, parseISO } from 'date-fns';
import type { Event, ExportOptions, ImportResult } from '../types';

// Export to iCal format
export function exportToICS(events: Event[], options: ExportOptions): string {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Calendar App//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  const filteredEvents = events.filter(event => {
    if (options.categories && options.categories.length > 0) {
      return options.categories.includes(event.category.id);
    }
    return true;
  });

  filteredEvents.forEach(event => {
    const eventDate = parseISO(event.date);
    const startDate = format(eventDate, 'yyyyMMdd');
    const endDate = format(eventDate, 'yyyyMMdd');

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${event.id}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      event.description ? `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}` : '',
      event.location ? `LOCATION:${event.location}` : '',
      `DTSTAMP:${format(new Date(), 'yyyyMMddTHHmmssZ')}`,
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');
  return icsContent.filter(line => line !== '').join('\r\n');
}

// Export to JSON
export function exportToJSON(events: Event[], options: ExportOptions): string {
  const filteredEvents = events.filter(event => {
    if (options.categories && options.categories.length > 0) {
      return options.categories.includes(event.category.id);
    }
    return true;
  });

  return JSON.stringify({
    version: '1.0',
    exportDate: new Date().toISOString(),
    events: filteredEvents,
    options
  }, null, 2);
}

// Export to CSV
export function exportToCSV(events: Event[], options: ExportOptions): string {
  const headers = ['Title', 'Date', 'Time', 'Location', 'Description', 'Category', 'Timezone'];
  const rows = [headers.join(',')];

  const filteredEvents = events.filter(event => {
    if (options.categories && options.categories.length > 0) {
      return options.categories.includes(event.category.id);
    }
    return true;
  });

  filteredEvents.forEach(event => {
    const row = [
      `"${event.title}"`,
      event.date,
      event.time || '',
      `"${event.location || ''}"`,
      `"${event.description || ''}"`,
      event.category.name,
      event.timezone
    ];
    rows.push(row.join(','));
  });

  return rows.join('\n');
}

// Download file
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import from JSON
export function importFromJSON(jsonContent: string): ImportResult {
  try {
    const data = JSON.parse(jsonContent);
    const events: Event[] = data.events || [];
    
    // Validate events
    const validEvents: Event[] = [];
    const errors: string[] = [];

    events.forEach((event, index) => {
      if (event.title && event.date) {
        validEvents.push(event);
      } else {
        errors.push(`Event ${index + 1}: Missing required fields`);
      }
    });

    return {
      success: true,
      eventsAdded: validEvents.length,
      eventsSkipped: events.length - validEvents.length,
      errors
    };
  } catch (error) {
    return {
      success: false,
      eventsAdded: 0,
      eventsSkipped: 0,
      errors: ['Invalid JSON format']
    };
  }
}

// Import from CSV
export function importFromCSV(csvContent: string): ImportResult {
  const lines = csvContent.split('\n');
  const headers = lines[0]?.split(',').map(h => h.trim()) || [];
  const events: Event[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.replace(/^"|"$/g, ''));
    
    try {
      const event: Event = {
        id: `imported-${Date.now()}-${i}`,
        title: values[0] || '',
        date: values[1] || '',
        time: values[2] || '',
        location: values[3] || '',
        description: values[4] || '',
        category: { id: 'imported', name: values[5] || 'Imported', color: '#6B7280' },
        isRecurring: false,
        timezone: (values[6] as 'local' | 'JST') || 'local',
        reminders: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (event.title && event.date) {
        events.push(event);
      } else {
        errors.push(`Row ${i + 1}: Missing required fields`);
      }
    } catch (error) {
      errors.push(`Row ${i + 1}: Invalid format`);
    }
  }

  return {
    success: errors.length === 0,
    eventsAdded: events.length,
    eventsSkipped: lines.length - 1 - events.length,
    errors
  };
} 