import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const lightTheme: Theme = {
  name: 'Light',
  isDark: false,
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
  surface: 'rgba(255,255,255,0.6)',
  text: '#1F2937',
};

const darkTheme: Theme = {
  name: 'Dark',
  isDark: true,
  primary: '#60A5FA',
  secondary: '#A78BFA',
  background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
  surface: 'rgba(30,41,59,0.6)',
  text: '#F9FAFB',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(lightTheme);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('calendar-theme');
    if (savedTheme === 'dark') {
      setThemeState(darkTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (theme.isDark) {
      root.classList.add('dark');
      localStorage.setItem('calendar-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('calendar-theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(theme.isDark ? lightTheme : darkTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme.isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 