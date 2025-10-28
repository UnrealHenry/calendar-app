import React from 'react';
import { useState, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Event, EventCategory } from '../types';
import { getEventsForDate } from '../utils/eventUtils';
import { useTranslation } from 'react-i18next';
import { ja, enUS } from 'date-fns/locale';

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  categories: EventCategory[];
}

const timeSlots = Array.from({ length: 24 }, (_, i) => i);

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events, onEventClick, categories }) => {
  const { t, i18n } = useTranslation();
  
  // Get locale based on current language
  const locale = i18n.language === 'jp' ? ja : enUS;
  
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(currentDate, { locale }));

  const weekDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(currentWeek, { locale }),
      end: endOfWeek(currentWeek, { locale })
    });
  }, [currentWeek, locale]);

  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const prevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));

  const getCategoryColor = (category: EventCategory) => {
    return category?.color || '#6B7280';
  };

  const getEventsForTimeSlot = (date: Date, hour: number) => {
    const dayEvents = getEventsForDate(events, format(date, 'yyyy-MM-dd'));
    return dayEvents.filter(event => {
      const eventHour = event.time ? parseInt(event.time.split(':')[0]) : 0;
      return eventHour === hour;
    });
  };

  const formatTime = (hour: number) => {
    const timeString = hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`;
    return t(`weekView.timeSlots.${timeString.toLowerCase()}`);
  };

  const getDayName = (date: Date) => {
    return format(date, 'EEE', { locale });
  };

  const getDayNumber = (date: Date) => {
    return format(date, 'd', { locale });
  };

  return (
    <div className="w-full">
      {/* Week Header */}
      <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 rounded-2xl p-6 mb-6 shadow-xl border border-white/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            {t('weekView.weekOf', { date: format(currentWeek, 'MMM d', { locale }) })}
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={prevWeek}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 shadow-lg"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextWeek}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 shadow-lg"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-8 gap-1">
          <div className="p-2"></div> {/* Time column header */}
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`p-2 text-center rounded-lg transition-colors ${
                isSameDay(day, new Date())
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : ''
              }`}
            >
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {getDayName(day)}
              </div>
              <div className={`text-lg font-bold ${
                isSameDay(day, new Date())
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-800 dark:text-gray-200'
              }`}>
                {getDayNumber(day)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Week Timeline */}
      <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 overflow-auto">
        <div className="grid grid-cols-8 gap-1 min-w-[800px]">
          {/* Time Column */}
          <div className="space-y-1">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-16 flex items-center justify-end pr-2 text-sm text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600"
              >
                {formatTime(hour)}
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="space-y-1">
              {timeSlots.map((hour) => {
                const timeSlotEvents = getEventsForTimeSlot(day, hour);
                const isCurrentHour = hour === new Date().getHours() && isSameDay(day, new Date());

                return (
                  <div
                    key={hour}
                    className={`h-16 border-b border-gray-200 dark:border-gray-600 relative ${
                      isCurrentHour ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    {timeSlotEvents.map((event, index) => (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className="absolute left-1 right-1 top-1 bottom-1 bg-opacity-90 rounded text-xs p-1 overflow-hidden cursor-pointer hover:bg-opacity-100 transition-all"
                        style={{
                          backgroundColor: getCategoryColor(event.category),
                          zIndex: index + 1,
                        }}
                        title={`${event.title}${event.time ? ` at ${event.time}` : ''}`}
                      >
                        <div className="font-medium text-white truncate">
                          {event.title}
                        </div>
                        {event.time && (
                          <div className="text-white/80 text-[10px]">
                            {event.time}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView; 