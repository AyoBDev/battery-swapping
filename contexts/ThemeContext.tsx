'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  isPresentation: boolean;
  toggleDark: () => void;
  togglePresentation: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [isPresentation, setIsPresentation] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.style.fontSize = isPresentation ? '24px' : '16px';
  }, [isPresentation]);

  const toggleDark = useCallback(() => setIsDark(prev => !prev), []);
  const togglePresentation = useCallback(() => setIsPresentation(prev => !prev), []);

  return (
    <ThemeContext.Provider value={{ isDark, isPresentation, toggleDark, togglePresentation }}>
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
