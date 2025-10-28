import type { Event, Reminder } from '../types';

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.init();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async init() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
    }
  }

  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    }
    return false;
  }

  async scheduleReminder(event: Event, reminder: Reminder): Promise<void> {
    if (!reminder.enabled || this.permission !== 'granted') return;

    const eventDate = new Date(`${event.date}T${event.time || '00:00'}`);
    const reminderTime = new Date(eventDate.getTime() - reminder.time * 60 * 1000);
    const now = new Date();

    if (reminderTime > now) {
      const delay = reminderTime.getTime() - now.getTime();
      setTimeout(() => {
        this.showNotification(event, reminder);
      }, delay);
    }
  }

  private showNotification(event: Event, reminder: Reminder): void {
    if (this.permission !== 'granted') return;

    const notification = new Notification('Calendar Reminder', {
      body: `${event.title}${event.time ? ` at ${event.time}` : ''}`,
      icon: '/favicon.ico',
      tag: event.id,
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  async showTestNotification(): Promise<void> {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    this.showNotification(
      {
        id: 'test',
        title: 'Test Notification',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        category: { id: 'test', name: 'Test', color: '#3B82F6' },
        isRecurring: false,
        timezone: 'local',
        reminders: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { id: 'test', type: 'notification', time: 0, enabled: true }
    );
  }

  cancelAllReminders(): void {
    // In a real app, you'd store timeout IDs and clear them
    // For now, we'll rely on the browser's notification system
  }
}

export const notificationService = NotificationService.getInstance(); 