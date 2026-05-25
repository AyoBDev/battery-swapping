'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function DarkModeToggle() {
  const { isDark, isPresentation, toggleDark, togglePresentation } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleDark}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="text-sm">{isDark ? '☀️' : '🌙'}</span>
      </button>
      <button
        onClick={togglePresentation}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
          isPresentation ? 'bg-emerald-500/30 ring-1 ring-emerald-400' : 'bg-white/10 hover:bg-white/20'
        }`}
        title={isPresentation ? 'Exit presentation mode' : 'Enter presentation mode'}
      >
        <span className="text-sm">📺</span>
      </button>
    </div>
  );
}
