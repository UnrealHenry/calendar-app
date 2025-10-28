import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday as isTodayDate, addMonths, subMonths } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import type { Event, CalendarEvent, EventCategory } from '../types';
import { getEventsForDate } from '../utils/eventUtils';

interface CalendarProps {
  selectedDate: Date;
  events: Event[];
  onDateSelect: (date: Date) => void;
  onAddEvent: (date: string, time?: string) => void;
  categories: EventCategory[];
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  events,
  onDateSelect,
  onAddEvent,
  categories
}) => {
  const { t, i18n } = useTranslation();
  
  // Get locale based on current language
  const locale = i18n.language === 'jp' ? ja : enUS;
  
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Get days from previous month to fill the first week
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDayClick = (day: Date) => {
    onDateSelect(day);
  };

  const handleAddEventClick = (day: Date) => {
    onAddEvent(format(day, 'yyyy-MM-dd'));
  };

  // Get day names based on language
  const getDayNames = () => {
    if (i18n.language === 'jp') {
      return ['日', '月', '火', '水', '木', '金', '土'];
    }
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  };

  // Get month name
  const getMonthName = () => {
    return format(currentMonth, 'MMMM yyyy', { locale });
  };

  // Get events for a specific date
  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  // Get category color
  const getCategoryColor = (category: EventCategory) => {
    return category?.color || '#6B7280';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Calendar App
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 shadow-lg"
            >
              ←
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">
              {getMonthName()}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 shadow-lg"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 shadow-xl border border-white/20">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {getDayNames().map((day, index) => (
            <div
              key={index}
              className="text-center py-3 font-semibold text-gray-600 text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {allDays.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isTodayDate(day);
            const isSelected = isSameDay(day, selectedDate);

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-600 last:border-r-0 ${
                  isCurrentMonth
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500'
                }`}
              >
                {/* Date Number */}
                <div
                  className={`text-sm font-medium mb-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 rounded p-1 transition-colors ${
                    isCurrentDay
                      ? 'bg-blue-600 text-white'
                      : isSelected
                      ? 'bg-blue-500 text-white'
                      : isCurrentMonth
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  {format(day, 'd')}
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded cursor-pointer truncate transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: getCategoryColor(event.category) + '20',
                        color: getCategoryColor(event.category),
                        border: `1px solid ${getCategoryColor(event.category)}30`
                      }}
                      onClick={() => handleAddEventClick(day)}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Info */}
      <div className="mt-6 backdrop-blur-xl bg-white/30 rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Selected Date
        </h3>
        <p className="text-gray-600">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </p>
        <button
          onClick={() => handleAddEventClick(selectedDate)}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Event for This Date
        </button>
      </div>
    </div>
  );
};

export default Calendar; 