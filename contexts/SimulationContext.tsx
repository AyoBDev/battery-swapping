'use client';

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';
import {
  SimulationState,
  RiderPosition,
  SwapEvent,
  SimulationAlert,
  createInitialState,
  simulateTick,
} from '@/lib/simulation-engine';

interface SimulationContextType {
  state: SimulationState;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const TICK_INTERVAL_MS = 2000;

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimulationState>(createInitialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setState(prev => ({ ...prev, isRunning: true }));
    intervalRef.current = setInterval(() => {
      setState(prev => simulateTick(prev));
    }, TICK_INTERVAL_MS);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    stop();
    setState(createInitialState());
  }, [stop]);

  return (
    <SimulationContext.Provider value={{ state, start, stop, reset }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
