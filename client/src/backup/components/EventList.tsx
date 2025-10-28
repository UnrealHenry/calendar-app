import React from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { ClockIcon, MapPinIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import type { CalendarEvent, EventCategory } from '../types';
import { formatEventTime } from '../utils/eventUtils';

interface EventListProps {
  events: CalendarEvent[];
  selectedDate: string;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  categories: EventCategory[];
}

const EventList: React.FC<EventListProps> = ({
  events,
  selectedDate,
  onEditEvent,
  onDeleteEvent,
  categories
}) => {
  const { t } = useTranslation();

  const getCategoryColor = (category: EventCategory) => {
    return category?.color || '#6B7280';
  };

  const getCategoryName = (category: EventCategory) => {
    return category?.name || t('events.categories.uncategorized');
  };

  if (events.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
        </h3>
        <p className="text-gray-500 text-center py-8">
          {t('events.noEvents')}
          <br />
          {t('events.clickToAdd')}
        </p>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 shadow-xl border border-white/20">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
      </h3>
      
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm"
            style={{ borderLeft: `4px solid ${getCategoryColor(event.category)}` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">
                  {event.title}
                </h4>
                
                {event.description && (
                  <p className="text-gray-600 text-sm mb-2">
                    {event.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {event.time && (
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{formatEventTime(event.time, event.timezone)}</span>
                      {event.timezone === 'JST' && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                          JST
                        </span>
                      )}
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                
                {event.isRecurring && (
                  <div className="mt-2">
                    <span
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: getCategoryColor(event.category) + '20',
                        color: getCategoryColor(event.category)
                      }}
                    >
                      {getCategoryName(event.category)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditEvent(event);
                  }}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  title={t('events.edit')}
                >
                  <PencilIcon className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteEvent(event.id);
                  }}
                  className="p-1 rounded hover:bg-red-100 transition-colors"
                  title={t('events.delete')}
                >
                  <TrashIcon className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList; 