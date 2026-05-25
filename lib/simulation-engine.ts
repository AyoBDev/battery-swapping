import { stations } from '@/data/mockData';

export interface RiderPosition {
  id: string;
  name: string;
  lat: number;
  lng: number;
  targetStationId: string | null;
  batteryLevel: number;
  status: 'riding' | 'approaching-station' | 'swapping' | 'idle';
}

export interface SwapEvent {
  id: string;
  riderId: string;
  riderName: string;
  stationId: string;
  stationName: string;
  oldBatteryLevel: number;
  newBatteryLevel: number;
  timestamp: Date;
}

export interface SimulationAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  riderId: string;
  riderName: string;
  title: string;
  message: string;
  timestamp: Date;
}

export interface SimulationState {
  riders: RiderPosition[];
  swapEvents: SwapEvent[];
  alerts: SimulationAlert[];
  isRunning: boolean;
  tick: number;
}

const INITIAL_RIDERS: RiderPosition[] = [
  { id: 'R-001', name: 'Chidi Abubakar', lat: 6.5095, lng: 3.3711, targetStationId: null, batteryLevel: 78, status: 'riding' },
  { id: 'R-002', name: 'Emeka Okafor', lat: 6.6018, lng: 3.3515, targetStationId: null, batteryLevel: 45, status: 'riding' },
  { id: 'R-003', name: 'Tunde Bakare', lat: 6.4550, lng: 3.3840, targetStationId: null, batteryLevel: 62, status: 'riding' },
  { id: 'R-004', name: 'Adebayo Salami', lat: 6.5400, lng: 3.3400, targetStationId: null, batteryLevel: 31, status: 'riding' },
  { id: 'R-005', name: 'Ifeanyi Nwosu', lat: 6.4700, lng: 3.4000, targetStationId: null, batteryLevel: 88, status: 'riding' },
];

const BATTERY_DRAIN_PER_TICK = 2;
const LOW_BATTERY_THRESHOLD = 20;
const SWAP_DURATION_TICKS = 3;
const MOVEMENT_SPEED = 0.003;

let swapCounters: Record<string, number> = {};

function findNearestStation(lat: number, lng: number): typeof stations[0] {
  let nearest = stations[0];
  let minDist = Infinity;
  for (const station of stations) {
    if (station.status === 'offline') continue;
    const dist = Math.sqrt(
      Math.pow(station.coordinates.lat - lat, 2) +
      Math.pow(station.coordinates.lng - lng, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = station;
    }
  }
  return nearest;
}

function moveToward(current: number, target: number, speed: number): number {
  const diff = target - current;
  if (Math.abs(diff) < speed) return target;
  return current + Math.sign(diff) * speed;
}

function addRandomDrift(value: number, amount: number): number {
  return value + (Math.random() - 0.5) * amount;
}

export function createInitialState(): SimulationState {
  swapCounters = {};
  return {
    riders: INITIAL_RIDERS.map(r => ({ ...r })),
    swapEvents: [],
    alerts: [],
    isRunning: false,
    tick: 0,
  };
}

export function simulateTick(state: SimulationState): SimulationState {
  const newRiders = state.riders.map(rider => ({ ...rider }));
  const newEvents = [...state.swapEvents];
  const newAlerts = [...state.alerts];

  for (const rider of newRiders) {
    switch (rider.status) {
      case 'riding': {
        rider.batteryLevel = Math.max(0, rider.batteryLevel - BATTERY_DRAIN_PER_TICK);
        rider.lat = addRandomDrift(rider.lat, 0.001);
        rider.lng = addRandomDrift(rider.lng, 0.001);

        if (rider.batteryLevel <= LOW_BATTERY_THRESHOLD && !rider.targetStationId) {
          const nearest = findNearestStation(rider.lat, rider.lng);
          rider.targetStationId = nearest.id;
          rider.status = 'approaching-station';

          newAlerts.push({
            id: `alert-${Date.now()}-${rider.id}`,
            type: rider.batteryLevel <= 10 ? 'critical' : 'warning',
            riderId: rider.id,
            riderName: rider.name,
            title: rider.batteryLevel <= 10 ? 'Critical Battery' : 'Low Battery Alert',
            message: `${rider.name}'s battery at ${rider.batteryLevel}%. Routing to ${nearest.name}.`,
            timestamp: new Date(),
          });
        }
        break;
      }

      case 'approaching-station': {
        const target = stations.find(s => s.id === rider.targetStationId);
        if (!target) { rider.status = 'riding'; break; }

        rider.lat = moveToward(rider.lat, target.coordinates.lat, MOVEMENT_SPEED);
        rider.lng = moveToward(rider.lng, target.coordinates.lng, MOVEMENT_SPEED);
        rider.batteryLevel = Math.max(0, rider.batteryLevel - 1);

        const atStation =
          Math.abs(rider.lat - target.coordinates.lat) < 0.002 &&
          Math.abs(rider.lng - target.coordinates.lng) < 0.002;

        if (atStation) {
          rider.status = 'swapping';
          swapCounters[rider.id] = 0;
        }
        break;
      }

      case 'swapping': {
        swapCounters[rider.id] = (swapCounters[rider.id] || 0) + 1;

        if (swapCounters[rider.id] >= SWAP_DURATION_TICKS) {
          const oldLevel = rider.batteryLevel;
          rider.batteryLevel = 95 + Math.floor(Math.random() * 5);
          rider.status = 'riding';

          const station = stations.find(s => s.id === rider.targetStationId);
          newEvents.push({
            id: `swap-${Date.now()}-${rider.id}`,
            riderId: rider.id,
            riderName: rider.name,
            stationId: rider.targetStationId || '',
            stationName: station?.name || 'Unknown',
            oldBatteryLevel: oldLevel,
            newBatteryLevel: rider.batteryLevel,
            timestamp: new Date(),
          });

          rider.targetStationId = null;
          delete swapCounters[rider.id];
        }
        break;
      }

      case 'idle': {
        if (Math.random() < 0.1) {
          rider.status = 'riding';
          rider.batteryLevel = 70 + Math.floor(Math.random() * 25);
        }
        break;
      }
    }
  }

  return {
    riders: newRiders,
    swapEvents: newEvents.slice(-20),
    alerts: newAlerts.slice(-10),
    isRunning: state.isRunning,
    tick: state.tick + 1,
  };
}
