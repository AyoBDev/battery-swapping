'use client';

import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import {
  SimulationState,
  createInitialState,
  simulateTick,
} from '@/lib/simulation-engine';
import { createWebSocketClient } from '@/lib/websocket';

type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'local';
type Role = 'leader' | 'follower';

interface SimulationContextType {
  state: SimulationState;
  start: () => void;
  stop: () => void;
  reset: () => void;
  connectionStatus: ConnectionStatus;
  role: Role;
  connect: (url: string, role: Role) => void;
  disconnect: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const TICK_INTERVAL_MS = 2000;

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimulationState>(createInitialState);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('local');
  const [role, setRole] = useState<Role>('leader');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wsRef = useRef<ReturnType<typeof createWebSocketClient> | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setState(prev => ({ ...prev, isRunning: true }));
    intervalRef.current = setInterval(() => {
      setState(prev => {
        const next = simulateTick(prev);
        if (wsRef.current && role === 'leader') {
          wsRef.current.send({ type: 'state', payload: next });
        }
        return next;
      });
    }, TICK_INTERVAL_MS);
  }, [role]);

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

  const connect = useCallback((url: string, connectRole: Role) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    setRole(connectRole);
    const client = createWebSocketClient(url);
    wsRef.current = client;

    client.onStatus((status) => {
      setConnectionStatus(status);
    });

    client.onMessage((data) => {
      const msg = data as { type: string; payload?: SimulationState };
      if (msg.type === 'state' && msg.payload && connectRole === 'follower') {
        setState(msg.payload);
      }
    });

    // Join default room
    client.send({ type: 'join', room: 'demo' });
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionStatus('local');
    setRole('leader');
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <SimulationContext.Provider value={{ state, start, stop, reset, connectionStatus, role, connect, disconnect }}>
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
