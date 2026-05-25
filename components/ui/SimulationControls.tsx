'use client';

import { useSimulation } from '@/contexts/SimulationContext';

export default function SimulationControls() {
  const { state, start, stop, reset } = useSimulation();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${state.isRunning ? 'bg-emerald-400' : 'bg-gray-400'}`} />
      <span className="text-xs text-white/70 font-medium">
        {state.isRunning ? 'LIVE' : 'PAUSED'}
      </span>
      {state.isRunning ? (
        <button
          onClick={stop}
          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
        >
          Pause
        </button>
      ) : (
        <button
          onClick={start}
          className="px-2 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 rounded text-emerald-700 transition-colors"
        >
          Start
        </button>
      )}
      <button
        onClick={reset}
        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
      >
        Reset
      </button>
    </div>
  );
}
