import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import './App.css';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDark, setIsDark] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const toggleTheme = () => setIsDark(!isDark);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-900/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📅 Modern Calendar App
            </h1>
            
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center">
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Beautiful Calendar Interface
            </h2>
            <p className={`text-lg max-w-2xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              A modern, responsive calendar application with smooth animations, dark mode support, 
              and intuitive navigation. Click on any date to select it and see it highlighted.
            </p>
          </div>
          
          {/* Calendar Container */}
          <div className={`w-full max-w-2xl rounded-2xl shadow-2xl transition-all duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white/90 backdrop-blur-lg'
          }`}>
            {/* Calendar Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevMonth}
                  className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  }`}
                >
                  ← Previous
                </button>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button
                  onClick={nextMonth}
                  className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  }`}
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Calendar Body */}
            <div className="p-6">
              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className={`text-center py-3 text-sm font-semibold rounded-lg ${
                    isDark ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-100'
                  }`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {allDays.map((day, index) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isCurrentDay = isToday(day);
                  const isSelected = isSameDay(day, selectedDate);

                  return (
                    <button
                      key={index}
                      onClick={() => handleDayClick(day)}
                      className={`p-4 text-sm rounded-xl transition-all duration-200 transform hover:scale-105 ${
                        isCurrentDay
                          ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white font-bold shadow-lg'
                          : isSelected
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold shadow-lg'
                          : isCurrentMonth
                          ? isDark
                            ? 'text-white hover:bg-gray-700 hover:shadow-md'
                            : 'text-gray-900 hover:bg-blue-50 hover:shadow-md'
                          : isDark
                          ? 'text-gray-500 hover:bg-gray-700'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Display */}
            <div className={`p-6 border-t rounded-b-2xl ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
              <div className="text-center">
                <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Selected Date
                </p>
                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white shadow'}`}>
                    <div className="text-2xl">📅</div>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Day Selected</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white shadow'}`}>
                    <div className="text-2xl">🗓️</div>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Month View</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white shadow'}`}>
                    <div className="text-2xl">{isDark ? '🌙' : '☀️'}</div>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{isDark ? 'Dark' : 'Light'} Mode</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mt-8">
            <div className={`p-6 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 ${
              isDark ? 'bg-gray-800' : 'bg-white/90 backdrop-blur-lg'
            }`}>
              <div className="text-4xl mb-4">🎨</div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Beautiful Design
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Modern gradients, smooth animations, and carefully crafted typography create a delightful user experience.
              </p>
            </div>
            
            <div className={`p-6 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 ${
              isDark ? 'bg-gray-800' : 'bg-white/90 backdrop-blur-lg'
            }`}>
              <div className="text-4xl mb-4">🌙</div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Dark Mode
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Toggle between light and dark themes for comfortable viewing in any lighting condition.
              </p>
            </div>
            
            <div className={`p-6 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 ${
              isDark ? 'bg-gray-800' : 'bg-white/90 backdrop-blur-lg'
            }`}>
              <div className="text-4xl mb-4">📱</div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Responsive
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Works perfectly on desktop, tablet, and mobile devices with touch-friendly controls.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calendar;