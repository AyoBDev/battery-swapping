'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function DarkModeToggle() {
  const { isDark, isPresentation, toggleDark, togglePresentation } = useTheme();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={toggleDark}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white/70" />}
      </button>
      <button
        onClick={togglePresentation}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
          isPresentation ? 'bg-emerald-500/30 ring-1 ring-emerald-400' : 'bg-white/10 hover:bg-white/20'
        }`}
        title={isPresentation ? 'Exit presentation mode' : 'Enter presentation mode'}
      >
        <Monitor className={`w-4 h-4 ${isPresentation ? 'text-emerald-300' : 'text-white/70'}`} />
      </button>
    </div>
  );
}
