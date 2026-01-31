// Mock data for SwapOS Fleet Manager Dashboard

// ECOSYSTEM-LEVEL DATA (Platform-wide stats)
export const ecosystemStats = {
  totalPartners: 5,
  totalStations: 87,
  totalBatteries: 2340,
  dailySwaps: 12450,
  monthlyGrowth: {
    partners: 2,
    stations: 12,
    batteries: 340,
  },
};

// CUSTOMER-LEVEL DATA (What one partner sees)
export const fleetStats = {
  totalBikes: 247,
  activeBikes: 182,
  idleBikes: 65,
  totalBatteries: 312,
  healthyBatteries: 293,
  batteryHealthPercent: 94,
  totalStations: 18,
  onlineStations: 16,
  swapsToday: 1847,
  swapsYesterday: 1502,
  revenueToday: 923500,
  revenueThisWeek: 6420000,
  swapsTrendPercent: 23,
  bikesTrendPercent: 12,
};

export interface PowerSystem {
  type: 'solar' | 'grid' | 'hybrid';
  solarGenerating: boolean;
  solarOutput: string;
  storageCapacity: number;
  storageLevel: number;
  storagePercent: number;
  gridStatus: 'online' | 'offline';
  operatingOn: 'solar' | 'grid' | 'battery';
}

export interface Station {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  status: 'online' | 'low_inventory' | 'offline';
  totalSlots: number;
  availableBatteries: number;
  chargingBatteries: number;
  emptySlots: number;
  swapsToday: number;
  revenueToday: number;
  peakHour: string;
  hostName: string;
  hostPhone: string;
  operatingHours: string;
  slots: { id: number; charge: number | null; health: number | null }[];
  powerSystem: PowerSystem;
}

export const stations: Station[] = [
  {
    id: 'STN-001',
    name: 'Yaba Central',
    address: '15 Herbert Macaulay Way, Yaba, Lagos',
    coordinates: { lat: 6.5095, lng: 3.3711 },
    status: 'online',
    totalSlots: 10,
    availableBatteries: 8,
    chargingBatteries: 2,
    emptySlots: 0,
    swapsToday: 187,
    revenueToday: 93500,
    peakHour: '8-9 AM',
    hostName: 'Mama Titi',
    hostPhone: '+234 802 XXX XXXX',
    operatingHours: '6:00 AM - 10:00 PM',
    slots: [
      { id: 1, charge: 98, health: 95 },
      { id: 2, charge: 91, health: 92 },
      { id: 3, charge: 85, health: 88 },
      { id: 4, charge: 89, health: 94 },
      { id: 5, charge: 67, health: 85 },
      { id: 6, charge: 82, health: 90 },
      { id: 7, charge: 74, health: 87 },
      { id: 8, charge: 45, health: 91 },
      { id: 9, charge: null, health: null },
      { id: 10, charge: null, health: null },
    ],
    powerSystem: {
      type: 'solar',
      solarGenerating: true,
      solarOutput: '82%',
      storageCapacity: 10,
      storageLevel: 8.2,
      storagePercent: 82,
      gridStatus: 'offline',
      operatingOn: 'solar',
    },
  },
  {
    id: 'STN-002',
    name: 'Ikeja Mall',
    address: 'Alausa, Ikeja, Lagos',
    coordinates: { lat: 6.6018, lng: 3.3515 },
    status: 'online',
    totalSlots: 10,
    availableBatteries: 6,
    chargingBatteries: 3,
    emptySlots: 1,
    swapsToday: 156,
    revenueToday: 78000,
    peakHour: '12-1 PM',
    hostName: 'Mr. Okonkwo',
    hostPhone: '+234 803 XXX XXXX',
    operatingHours: '8:00 AM - 9:00 PM',
    slots: [
      { id: 1, charge: 92, health: 94 },
      { id: 2, charge: 88, health: 91 },
      { id: 3, charge: 76, health: 89 },
      { id: 4, charge: 81, health: 93 },
      { id: 5, charge: 55, health: 86 },
      { id: 6, charge: 34, health: 88 },
      { id: 7, charge: null, health: null },
      { id: 8, charge: null, health: null },
      { id: 9, charge: null, health: null },
      { id: 10, charge: null, health: null },
    ],
    powerSystem: {
      type: 'grid',
      solarGenerating: false,
      solarOutput: '0%',
      storageCapacity: 10,
      storageLevel: 7.8,
      storagePercent: 78,
      gridStatus: 'online',
      operatingOn: 'grid',
    },
  },
  {
    id: 'STN-003',
    name: 'VI Junction',
    address: 'Akin Adesola, Victoria Island, Lagos',
    coordinates: { lat: 6.4281, lng: 3.4219 },
    status: 'low_inventory',
    totalSlots: 10,
    availableBatteries: 2,
    chargingBatteries: 1,
    emptySlots: 7,
    swapsToday: 134,
    revenueToday: 67000,
    peakHour: '5-6 PM',
    hostName: 'Eko Hotels',
    hostPhone: '+234 804 XXX XXXX',
    operatingHours: '24 hours',
    slots: [
      { id: 1, charge: 89, health: 92 },
      { id: 2, charge: 72, health: 88 },
      { id: 3, charge: null, health: null },
      { id: 4, charge: null, health: null },
      { id: 5, charge: null, health: null },
      { id: 6, charge: null, health: null },
      { id: 7, charge: null, health: null },
      { id: 8, charge: null, health: null },
      { id: 9, charge: null, health: null },
      { id: 10, charge: null, health: null },
    ],
    powerSystem: {
      type: 'solar',
      solarGenerating: true,
      solarOutput: '45%',
      storageCapacity: 10,
      storageLevel: 4.5,
      storagePercent: 45,
      gridStatus: 'offline',
      operatingOn: 'battery',
    },
  },
  {
    id: 'STN-004',
    name: 'Surulere',
    address: 'Adeniran Ogunsanya, Surulere, Lagos',
    coordinates: { lat: 6.4969, lng: 3.3574 },
    status: 'online',
    totalSlots: 10,
    availableBatteries: 10,
    chargingBatteries: 0,
    emptySlots: 0,
    swapsToday: 98,
    revenueToday: 49000,
    peakHour: '7-8 AM',
    hostName: 'Baba Suwe',
    hostPhone: '+234 805 XXX XXXX',
    operatingHours: '6:00 AM - 9:00 PM',
    slots: [
      { id: 1, charge: 95, health: 96 },
      { id: 2, charge: 92, health: 94 },
      { id: 3, charge: 88, health: 91 },
      { id: 4, charge: 91, health: 93 },
      { id: 5, charge: 87, health: 89 },
      { id: 6, charge: 94, health: 95 },
      { id: 7, charge: 89, health: 92 },
      { id: 8, charge: 86, health: 88 },
      { id: 9, charge: 93, health: 94 },
      { id: 10, charge: 90, health: 91 },
    ],
    powerSystem: {
      type: 'grid',
      solarGenerating: false,
      solarOutput: '0%',
      storageCapacity: 10,
      storageLevel: 9.2,
      storagePercent: 92,
      gridStatus: 'online',
      operatingOn: 'grid',
    },
  },
  {
    id: 'STN-005',
    name: 'Maryland',
    address: 'Ikorodu Road, Maryland, Lagos',
    coordinates: { lat: 6.5703, lng: 3.3636 },
    status: 'online',
    totalSlots: 10,
    availableBatteries: 8,
    chargingBatteries: 1,
    emptySlots: 1,
    swapsToday: 87,
    revenueToday: 43500,
    peakHour: '8-9 AM',
    hostName: 'Mrs. Adeyemi',
    hostPhone: '+234 806 XXX XXXX',
    operatingHours: '6:00 AM - 10:00 PM',
    slots: [
      { id: 1, charge: 94, health: 95 },
      { id: 2, charge: 89, health: 92 },
      { id: 3, charge: 82, health: 88 },
      { id: 4, charge: 87, health: 91 },
      { id: 5, charge: 79, health: 85 },
      { id: 6, charge: 91, health: 93 },
      { id: 7, charge: 85, health: 89 },
      { id: 8, charge: 38, health: 87 },
      { id: 9, charge: null, health: null },
      { id: 10, charge: null, health: null },
    ],
    powerSystem: {
      type: 'solar',
      solarGenerating: true,
      solarOutput: '100%',
      storageCapacity: 10,
      storageLevel: 10,
      storagePercent: 100,
      gridStatus: 'online',
      operatingOn: 'solar',
    },
  },
  {
    id: 'STN-006',
    name: 'Lekki Phase 1',
    address: 'Admiralty Way, Lekki Phase 1, Lagos',
    coordinates: { lat: 6.4412, lng: 3.4763 },
    status: 'offline',
    totalSlots: 10,
    availableBatteries: 0,
    chargingBatteries: 0,
    emptySlots: 10,
    swapsToday: 0,
    revenueToday: 0,
    peakHour: 'N/A',
    hostName: 'Lekki Gardens',
    hostPhone: '+234 807 XXX XXXX',
    operatingHours: '7:00 AM - 9:00 PM',
    slots: Array(10).fill(null).map((_, i) => ({ id: i + 1, charge: null, health: null })),
    powerSystem: {
      type: 'hybrid',
      solarGenerating: false,
      solarOutput: '0%',
      storageCapacity: 10,
      storageLevel: 0,
      storagePercent: 0,
      gridStatus: 'offline',
      operatingOn: 'battery',
    },
  },
];

export interface Bike {
  id: string;
  status: 'active' | 'idle' | 'maintenance';
  rider: { name: string; phone: string } | null;
  currentBattery: { id: string; charge: number; health: number } | null;
  location: { name: string; coordinates: { lat: number; lng: number } };
  lastSeen: Date;
  swapsToday: number;
  distanceToday: number;
  deliveriesToday: number;
}

export const bikes: Bike[] = [
  {
    id: 'BK-0234',
    status: 'active',
    rider: { name: 'Chidi Abubakar', phone: '+234 801 XXX XXXX' },
    currentBattery: { id: 'BAT-1847', charge: 78, health: 96 },
    location: { name: 'Yaba', coordinates: { lat: 6.5095, lng: 3.3711 } },
    lastSeen: new Date(),
    swapsToday: 6,
    distanceToday: 127,
    deliveriesToday: 14,
  },
  {
    id: 'BK-0891',
    status: 'active',
    rider: { name: 'Emeka Okafor', phone: '+234 802 XXX XXXX' },
    currentBattery: { id: 'BAT-2341', charge: 45, health: 92 },
    location: { name: 'Ikeja', coordinates: { lat: 6.6018, lng: 3.3515 } },
    lastSeen: new Date(Date.now() - 2 * 60000),
    swapsToday: 4,
    distanceToday: 89,
    deliveriesToday: 11,
  },
  {
    id: 'BK-0122',
    status: 'idle',
    rider: null,
    currentBattery: { id: 'BAT-0987', charge: 92, health: 98 },
    location: { name: 'Station 3', coordinates: { lat: 6.4281, lng: 3.4219 } },
    lastSeen: new Date(Date.now() - 60 * 60000),
    swapsToday: 2,
    distanceToday: 34,
    deliveriesToday: 5,
  },
  {
    id: 'BK-0445',
    status: 'active',
    rider: { name: 'Tunde Bakare', phone: '+234 803 XXX XXXX' },
    currentBattery: { id: 'BAT-3421', charge: 12, health: 89 },
    location: { name: 'VI', coordinates: { lat: 6.4281, lng: 3.4219 } },
    lastSeen: new Date(),
    swapsToday: 8,
    distanceToday: 156,
    deliveriesToday: 19,
  },
  {
    id: 'BK-0667',
    status: 'maintenance',
    rider: null,
    currentBattery: null,
    location: { name: 'Depot', coordinates: { lat: 6.5244, lng: 3.3792 } },
    lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60000),
    swapsToday: 0,
    distanceToday: 0,
    deliveriesToday: 0,
  },
  {
    id: 'BK-0789',
    status: 'active',
    rider: { name: 'Adebayo Salami', phone: '+234 804 XXX XXXX' },
    currentBattery: { id: 'BAT-4521', charge: 67, health: 94 },
    location: { name: 'Surulere', coordinates: { lat: 6.4969, lng: 3.3574 } },
    lastSeen: new Date(Date.now() - 5 * 60000),
    swapsToday: 5,
    distanceToday: 98,
    deliveriesToday: 12,
  },
  {
    id: 'BK-0321',
    status: 'active',
    rider: { name: 'Kola Adeniji', phone: '+234 805 XXX XXXX' },
    currentBattery: { id: 'BAT-5678', charge: 34, health: 91 },
    location: { name: 'Lekki', coordinates: { lat: 6.4412, lng: 3.4763 } },
    lastSeen: new Date(Date.now() - 1 * 60000),
    swapsToday: 7,
    distanceToday: 143,
    deliveriesToday: 16,
  },
  {
    id: 'BK-0543',
    status: 'idle',
    rider: null,
    currentBattery: { id: 'BAT-6789', charge: 88, health: 97 },
    location: { name: 'Maryland', coordinates: { lat: 6.5703, lng: 3.3636 } },
    lastSeen: new Date(Date.now() - 30 * 60000),
    swapsToday: 3,
    distanceToday: 56,
    deliveriesToday: 7,
  },
  {
    id: 'BK-0876',
    status: 'active',
    rider: { name: 'Femi Adewale', phone: '+234 806 XXX XXXX' },
    currentBattery: { id: 'BAT-7890', charge: 56, health: 93 },
    location: { name: 'Yaba', coordinates: { lat: 6.5123, lng: 3.3745 } },
    lastSeen: new Date(),
    swapsToday: 9,
    distanceToday: 178,
    deliveriesToday: 21,
  },
  {
    id: 'BK-0999',
    status: 'active',
    rider: { name: 'Oluwatobi Ige', phone: '+234 807 XXX XXXX' },
    currentBattery: { id: 'BAT-8901', charge: 81, health: 95 },
    location: { name: 'Ikeja', coordinates: { lat: 6.5987, lng: 3.3489 } },
    lastSeen: new Date(Date.now() - 3 * 60000),
    swapsToday: 4,
    distanceToday: 72,
    deliveriesToday: 9,
  },
];

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  stationId?: string;
  batteryId?: string;
  bikeId?: string;
}

export const alerts: Alert[] = [
  {
    id: 'ALT-001',
    type: 'critical',
    title: 'Station Ikeja - Low Stock',
    message: 'Only 2 batteries left',
    timestamp: new Date(Date.now() - 5 * 60000),
    stationId: 'STN-002',
  },
  {
    id: 'ALT-002',
    type: 'warning',
    title: 'Battery #B-0847 - Health Degraded',
    message: 'Degraded to 72%',
    timestamp: new Date(Date.now() - 15 * 60000),
    batteryId: 'BAT-0847',
  },
  {
    id: 'ALT-003',
    type: 'warning',
    title: 'Station Lekki - Offline',
    message: 'Last seen 15 mins ago',
    timestamp: new Date(Date.now() - 15 * 60000),
    stationId: 'STN-006',
  },
  {
    id: 'ALT-004',
    type: 'info',
    title: 'New Rider Registered',
    message: 'Adekunle Johnson joined the fleet',
    timestamp: new Date(Date.now() - 45 * 60000),
  },
  {
    id: 'ALT-005',
    type: 'warning',
    title: 'High Demand Predicted',
    message: 'Yaba station may need extra inventory tomorrow',
    timestamp: new Date(Date.now() - 60 * 60000),
    stationId: 'STN-001',
  },
];

export const weeklySwaps = [
  { day: 'Mon', swaps: 1654, revenue: 827000 },
  { day: 'Tue', swaps: 1823, revenue: 911500 },
  { day: 'Wed', swaps: 1987, revenue: 993500 },
  { day: 'Thu', swaps: 1756, revenue: 878000 },
  { day: 'Fri', swaps: 2134, revenue: 1067000 },
  { day: 'Sat', swaps: 2245, revenue: 1122500 },
  { day: 'Sun', swaps: 1248, revenue: 624000 },
];

export const hourlyPattern = [
  { hour: '6AM', swaps: 45 },
  { hour: '7AM', swaps: 78 },
  { hour: '8AM', swaps: 134 },
  { hour: '9AM', swaps: 112 },
  { hour: '10AM', swaps: 89 },
  { hour: '11AM', swaps: 76 },
  { hour: '12PM', swaps: 98 },
  { hour: '1PM', swaps: 87 },
  { hour: '2PM', swaps: 76 },
  { hour: '3PM', swaps: 89 },
  { hour: '4PM', swaps: 112 },
  { hour: '5PM', swaps: 145 },
  { hour: '6PM', swaps: 123 },
  { hour: '7PM', swaps: 98 },
  { hour: '8PM', swaps: 67 },
  { hour: '9PM', swaps: 45 },
];

export const batteryHealthDistribution = [
  { label: 'Excellent (>90%)', value: 67, color: '#10B981' },
  { label: 'Good (70-90%)', value: 24, color: '#3B82F6' },
  { label: 'Fair (50-70%)', value: 7, color: '#F59E0B' },
  { label: 'Replace (<50%)', value: 2, color: '#EF4444' },
];

export const stationSwaps = [
  { name: 'Yaba', swaps: 2341 },
  { name: 'Ikeja', swaps: 1987 },
  { name: 'VI', swaps: 1654 },
  { name: 'Surulere', swaps: 1234 },
  { name: 'Maryland', swaps: 1098 },
  { name: 'Others', swaps: 4533 },
];

export const topStationsToday = [
  { rank: 1, name: 'Yaba Central', swaps: 187 },
  { rank: 2, name: 'Ikeja Mall', swaps: 156 },
  { rank: 3, name: 'VI Junction', swaps: 134 },
  { rank: 4, name: 'Surulere', swaps: 98 },
  { rank: 5, name: 'Maryland', swaps: 87 },
];

export const aiInsights = [
  '💡 Peak demand is shifting earlier - consider opening Yaba at 5AM',
  '💡 VI station has 23% higher swap rate but lower inventory',
  '💡 Weekend revenue is 34% higher than weekdays',
];

// Helper function to format currency
export const formatNaira = (amount: number): string => {
  if (amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `₦${(amount / 1000).toFixed(1)}K`;
  }
  return `₦${amount.toLocaleString()}`;
};

// Helper to format time ago
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
};

// Battery lifecycle data for Battery Health page
export interface BatteryDetail {
  id: string;
  health: number;
  cycles: number;
  status: 'excellent' | 'good' | 'fair' | 'replace';
  issue: string | null;
  currentLocation: string;
  lastSwap: Date;
  installedDate: Date;
  avgDailyCycles: number;
}

export const batteryDetails: BatteryDetail[] = [
  {
    id: 'BAT-0847',
    health: 48,
    cycles: 1247,
    status: 'replace',
    issue: 'Capacity Loss',
    currentLocation: 'Station 3 (VI Junction)',
    lastSwap: new Date(Date.now() - 2 * 60 * 60000),
    installedDate: new Date('2024-03-15'),
    avgDailyCycles: 2.8,
  },
  {
    id: 'BAT-0391',
    health: 52,
    cycles: 1189,
    status: 'replace',
    issue: 'Degradation',
    currentLocation: 'Station 1 (Yaba Central)',
    lastSwap: new Date(Date.now() - 5 * 60 * 60000),
    installedDate: new Date('2024-04-02'),
    avgDailyCycles: 2.5,
  },
  {
    id: 'BAT-0622',
    health: 61,
    cycles: 987,
    status: 'fair',
    issue: 'Cell Imbalance',
    currentLocation: 'In Transit',
    lastSwap: new Date(Date.now() - 1 * 60 * 60000),
    installedDate: new Date('2024-05-10'),
    avgDailyCycles: 2.3,
  },
  {
    id: 'BAT-1104',
    health: 68,
    cycles: 856,
    status: 'fair',
    issue: 'High Temp Events',
    currentLocation: 'Station 5 (Maryland)',
    lastSwap: new Date(Date.now() - 3 * 60 * 60000),
    installedDate: new Date('2024-06-01'),
    avgDailyCycles: 2.1,
  },
  {
    id: 'BAT-0789',
    health: 69,
    cycles: 912,
    status: 'fair',
    issue: 'Capacity Loss',
    currentLocation: 'Station 2 (Ikeja Mall)',
    lastSwap: new Date(Date.now() - 45 * 60000),
    installedDate: new Date('2024-05-20'),
    avgDailyCycles: 2.4,
  },
  {
    id: 'BAT-0445',
    health: 71,
    cycles: 823,
    status: 'good',
    issue: 'Degradation',
    currentLocation: 'Station 4 (Surulere)',
    lastSwap: new Date(Date.now() - 4 * 60 * 60000),
    installedDate: new Date('2024-06-15'),
    avgDailyCycles: 2.0,
  },
  {
    id: 'BAT-0102',
    health: 82,
    cycles: 1847,
    status: 'good',
    issue: null,
    currentLocation: 'Station 1 (Yaba Central)',
    lastSwap: new Date(Date.now() - 30 * 60000),
    installedDate: new Date('2023-11-20'),
    avgDailyCycles: 2.1,
  },
  {
    id: 'BAT-1523',
    health: 95,
    cycles: 234,
    status: 'excellent',
    issue: null,
    currentLocation: 'Station 2 (Ikeja Mall)',
    lastSwap: new Date(Date.now() - 15 * 60000),
    installedDate: new Date('2025-10-05'),
    avgDailyCycles: 1.8,
  },
];

export const replacementForecast = {
  thisMonth: 6,
  nextMonth: 8,
  in3Months: 14,
  estimatedCost: 3200000, // Naira
};

export const batteryLifecycleStats = {
  averageLifespan: 1200, // cycles
  avgDailyCycles: 2.4,
  topPerformer: { id: 'BAT-0102', cycles: 1847, health: 82 },
  worstPerformer: { id: 'BAT-0847', cycles: 1247, health: 48 },
  aiInsight: 'Batteries at Station 3 degrade 15% faster — investigate charging patterns or temperature.',
};

// ============================
// AI ALERTS DATA (Enhanced)
// ============================
export interface AIAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  asset: string;
  assetType: 'battery' | 'station' | 'rider' | 'system';
  title: string;
  issue: string;
  evidence: string;
  risk: string;
  recommendation: string;
  timeline: 'Immediate' | 'This week' | 'Monitor';
  timestamp: Date;
  actionLabel?: string;
}

export const aiAlerts: AIAlert[] = [
  {
    id: 'AI-001',
    type: 'critical',
    asset: 'BAT-0847',
    assetType: 'battery',
    title: 'Cell Imbalance Detected',
    issue: 'Cell imbalance detected — potential thermal event risk',
    evidence: 'Cell 3 voltage 0.2V lower than cells 1,2,4. Imbalance growing over last 5 cycles.',
    risk: 'Continued use may cause thermal event. Potential safety hazard.',
    recommendation: 'Remove from service immediately. Do not charge. Schedule for inspection.',
    timeline: 'Immediate',
    timestamp: new Date(Date.now() - 5 * 60000),
    actionLabel: 'Remove from Service',
  },
  {
    id: 'AI-002',
    type: 'critical',
    asset: 'BAT-0391',
    assetType: 'battery',
    title: 'Rapid Capacity Degradation',
    issue: 'Capacity dropped 12% in last 30 cycles — abnormal degradation pattern',
    evidence: 'Capacity loss rate 4x higher than expected. Last 30 cycles show accelerating decline.',
    risk: 'Battery may fail during operation within 1-2 weeks if not addressed.',
    recommendation: 'Replace battery immediately. Send for root cause analysis.',
    timeline: 'Immediate',
    timestamp: new Date(Date.now() - 12 * 60000),
    actionLabel: 'Replace Now',
  },
  {
    id: 'AI-003',
    type: 'warning',
    asset: 'Station 3 (VI Junction)',
    assetType: 'station',
    title: 'Charging System Anomaly',
    issue: 'Batteries at this station degrading 15% faster than network average',
    evidence: '8 batteries primarily charged at Station 3 show accelerated capacity loss. Pattern emerged over 6 weeks.',
    risk: 'Premature battery replacement. Estimated ₦400,000 additional costs if not addressed.',
    recommendation: 'Inspect charging modules. Check voltage calibration. Possible module replacement needed.',
    timeline: 'This week',
    timestamp: new Date(Date.now() - 30 * 60000),
    actionLabel: 'Schedule Inspection',
  },
  {
    id: 'AI-004',
    type: 'warning',
    asset: 'VI Junction',
    assetType: 'station',
    title: 'Low Stock Predicted',
    issue: 'Low stock predicted in 45 minutes based on current demand pattern',
    evidence: 'Current inventory 2/10. Historical demand at this hour: 8 swaps/hour. Time to stockout: ~45 minutes.',
    risk: 'Riders unable to swap. Lost revenue ~₦4,000/hour. Customer dissatisfaction.',
    recommendation: 'Dispatch 6 batteries from Ikeja Station (8 available, 15 min drive).',
    timeline: 'Immediate',
    timestamp: new Date(Date.now() - 8 * 60000),
    actionLabel: 'Dispatch Batteries',
  },
  {
    id: 'AI-005',
    type: 'warning',
    asset: 'BAT-0622',
    assetType: 'battery',
    title: 'Cell Imbalance Early Warning',
    issue: 'Cell imbalance developing — early intervention recommended',
    evidence: 'Cell 2 showing 0.05V variance from mean. Trending upward over last 15 cycles.',
    risk: 'Will require replacement in ~6 weeks if imbalance continues.',
    recommendation: 'Flag for enhanced monitoring. Schedule recalibration cycle.',
    timeline: 'This week',
    timestamp: new Date(Date.now() - 45 * 60000),
    actionLabel: 'Monitor',
  },
  {
    id: 'AI-006',
    type: 'warning',
    asset: 'Rider #447',
    assetType: 'rider',
    title: 'High Battery Temperatures',
    issue: 'Consistently high battery temperatures on return from this rider',
    evidence: 'Batteries returned by this rider average 42°C vs network average 34°C. Pattern over 3 weeks.',
    risk: 'Accelerated degradation of batteries used by this rider.',
    recommendation: 'Contact rider. Check bike ventilation. Possible riding behavior issue.',
    timeline: 'This week',
    timestamp: new Date(Date.now() - 60 * 60000),
    actionLabel: 'Contact Rider',
  },
  {
    id: 'AI-007',
    type: 'info',
    asset: 'Yaba Central',
    assetType: 'station',
    title: 'Peak Demand Forecast',
    issue: 'Tomorrow\'s peak demand predicted at 8-9 AM — 14% above average',
    evidence: 'Monday effect detected. Historical data shows 14% higher demand on Mondays at this station.',
    risk: 'Potential stockout during morning rush if not pre-stocked.',
    recommendation: 'Pre-stock 4 extra batteries tonight. Prioritize fully charged units.',
    timeline: 'This week',
    timestamp: new Date(Date.now() - 90 * 60000),
    actionLabel: 'Pre-stock',
  },
  {
    id: 'AI-008',
    type: 'info',
    asset: 'Network',
    assetType: 'system',
    title: 'Solar Generation Forecast',
    issue: 'Tomorrow afternoon: 30% cloud cover expected',
    evidence: 'Weather API indicates cloud cover 2-5 PM. Solar generation will drop to ~60% capacity.',
    risk: 'Reduced solar self-sufficiency. May need grid backup at 2 stations.',
    recommendation: 'AI has scheduled aggressive morning charging to build storage reserves.',
    timeline: 'Monitor',
    timestamp: new Date(Date.now() - 120 * 60000),
    actionLabel: 'View Forecast',
  },
  {
    id: 'AI-009',
    type: 'info',
    asset: 'Fleet',
    assetType: 'system',
    title: 'Battery Fleet Optimization',
    issue: '6 batteries approaching end of optimal life — replacement planning recommended',
    evidence: 'AI predicts 6 batteries will reach 50% health within 30 days at current usage rates.',
    risk: 'Unplanned replacements may cause service disruptions.',
    recommendation: 'Budget ₦510,000 for replacements. Schedule staggered replacement to maintain capacity.',
    timeline: 'This week',
    timestamp: new Date(Date.now() - 180 * 60000),
    actionLabel: 'Plan Replacements',
  },
];

// ============================
// ENERGY DATA
// ============================
export const energyStats = {
  solarGenerationToday: 48.7, // kWh
  solarGenerationYesterday: 52.3,
  gridUsageToday: 6.2, // kWh
  totalConsumptionToday: 54.9,
  solarSelfSufficiency: 89, // percentage
  energyCostToday: 4200, // Naira
  petrolEquivalentCost: 28500, // What it would cost with petrol generators
  savingsToday: 24300,
  co2SavedToday: 38.4, // kg
};

export const weeklyEnergyData = [
  { day: 'Mon', solar: 45.2, grid: 8.1, storage: 3.2 },
  { day: 'Tue', solar: 52.1, grid: 4.5, storage: 2.8 },
  { day: 'Wed', solar: 48.9, grid: 6.3, storage: 3.5 },
  { day: 'Thu', solar: 51.4, grid: 5.2, storage: 2.1 },
  { day: 'Fri', solar: 47.8, grid: 7.8, storage: 4.2 },
  { day: 'Sat', solar: 53.2, grid: 3.9, storage: 2.4 },
  { day: 'Sun', solar: 49.6, grid: 5.6, storage: 3.1 },
];

// 24-hour energy forecast data
export const energyForecast24h = Array.from({ length: 24 }, (_, i) => {
  const hour = (new Date().getHours() + i) % 24;
  const isSunny = hour >= 6 && hour <= 18;
  const isPeak = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);

  return {
    hour: `${hour.toString().padStart(2, '0')}:00`,
    hourIndex: i,
    solarPrediction: isSunny ? Math.round(40 + Math.sin((hour - 6) / 12 * Math.PI) * 60 + Math.random() * 10) : 0,
    demandPrediction: 20 + (isPeak ? 40 : 15) + Math.random() * 10,
    chargingPlan: isSunny && !isPeak ? 30 + Math.random() * 20 : isPeak ? 5 : 10,
    storageLevel: 60 + Math.sin(i / 6) * 25 + Math.random() * 5,
  };
});

export const energyForecastSummary = {
  solarAvailability: 85, // percentage
  cloudCover: '2-4 PM brief cloud cover',
  morningRushDemand: 156, // expected swaps
  rushAboveAverage: 8, // percentage above normal
  chargingWindow: '10 AM - 2 PM',
  gridBackupNeeded: false,
  bestCase: '100% solar day if clouds clear',
  expected: '89% solar, 11% storage',
  worstCase: 'Grid needed if clouds persist past 5 PM',
};

// Station-level energy status
export const stationEnergyStatus = [
  { stationName: 'Yaba Central', solarOutput: 1240, storageLevel: 82, gridStatus: 'offline', aiStatus: 'Charging' },
  { stationName: 'Ikeja Mall', solarOutput: 0, storageLevel: 78, gridStatus: 'online', aiStatus: 'Grid Mode' },
  { stationName: 'VI Junction', solarOutput: 680, storageLevel: 45, gridStatus: 'offline', aiStatus: 'Conserving' },
  { stationName: 'Surulere', solarOutput: 0, storageLevel: 92, gridStatus: 'online', aiStatus: 'Peak Ready' },
  { stationName: 'Maryland', solarOutput: 1480, storageLevel: 100, gridStatus: 'online', aiStatus: 'Full Capacity' },
  { stationName: 'Lekki Phase 1', solarOutput: 0, storageLevel: 0, gridStatus: 'offline', aiStatus: 'Offline' },
];

// ============================
// EXPANDED BATTERY FLEET (50 batteries)
// ============================
export interface BatteryFleet {
  id: string;
  health: number;
  cycles: number;
  status: 'healthy' | 'watch' | 'replace' | 'anomaly';
  issue: string | null;
  currentLocation: string;
  predictedRemainingLife: { cycles: number; weeks: number };
  installedDate: Date;
  lastSwap: Date;
}

const generateBatteryFleet = (): BatteryFleet[] => {
  const locations = ['Yaba Central', 'Ikeja Mall', 'VI Junction', 'Surulere', 'Maryland', 'In Transit', 'Depot'];
  const issues = ['Capacity Loss', 'Cell Imbalance', 'Thermal Events', 'Charging Anomaly', 'High Resistance'];

  const batteries: BatteryFleet[] = [];

  // 35 Healthy batteries (75-100% health)
  for (let i = 0; i < 35; i++) {
    const health = 75 + Math.random() * 25;
    const cycles = Math.round(100 + Math.random() * 800);
    batteries.push({
      id: `BAT-${String(1000 + i).padStart(4, '0')}`,
      health: Math.round(health),
      cycles,
      status: 'healthy',
      issue: null,
      currentLocation: locations[Math.floor(Math.random() * 5)],
      predictedRemainingLife: { cycles: Math.round(1200 - cycles), weeks: Math.round((1200 - cycles) / (2.4 * 7)) },
      installedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      lastSwap: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    });
  }

  // 8 Watch list batteries (60-75% health)
  for (let i = 0; i < 8; i++) {
    const health = 60 + Math.random() * 15;
    const cycles = Math.round(800 + Math.random() * 300);
    batteries.push({
      id: `BAT-${String(1035 + i).padStart(4, '0')}`,
      health: Math.round(health),
      cycles,
      status: 'watch',
      issue: Math.random() > 0.5 ? issues[Math.floor(Math.random() * 2)] : null,
      currentLocation: locations[Math.floor(Math.random() * 5)],
      predictedRemainingLife: { cycles: Math.round(400 - (cycles - 800)), weeks: Math.round((400 - (cycles - 800)) / (2.4 * 7)) },
      installedDate: new Date(Date.now() - (180 + Math.random() * 180) * 24 * 60 * 60 * 1000),
      lastSwap: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000),
    });
  }

  // 4 Replace soon batteries (below 60% health)
  for (let i = 0; i < 4; i++) {
    const health = 40 + Math.random() * 20;
    const cycles = Math.round(1000 + Math.random() * 300);
    batteries.push({
      id: `BAT-${String(1043 + i).padStart(4, '0')}`,
      health: Math.round(health),
      cycles,
      status: 'replace',
      issue: issues[Math.floor(Math.random() * issues.length)],
      currentLocation: locations[Math.floor(Math.random() * 5)],
      predictedRemainingLife: { cycles: Math.round(50 + Math.random() * 100), weeks: Math.round((50 + Math.random() * 100) / (2.4 * 7)) },
      installedDate: new Date(Date.now() - (300 + Math.random() * 100) * 24 * 60 * 60 * 1000),
      lastSwap: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000),
    });
  }

  // 3 Anomaly batteries (unexpected issues regardless of age)
  for (let i = 0; i < 3; i++) {
    const health = 50 + Math.random() * 30;
    const cycles = Math.round(200 + Math.random() * 600);
    batteries.push({
      id: `BAT-${String(1047 + i).padStart(4, '0')}`,
      health: Math.round(health),
      cycles,
      status: 'anomaly',
      issue: issues[Math.floor(Math.random() * issues.length)],
      currentLocation: locations[Math.floor(Math.random() * 5)],
      predictedRemainingLife: { cycles: 0, weeks: 0 },
      installedDate: new Date(Date.now() - Math.random() * 200 * 24 * 60 * 60 * 1000),
      lastSwap: new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000),
    });
  }

  return batteries;
};

export const batteryFleet = generateBatteryFleet();

// Battery fleet summary
export const batteryFleetSummary = {
  total: 50,
  healthy: 35,
  healthyPercent: 70,
  watch: 8,
  watchPercent: 16,
  replace: 4,
  replacePercent: 8,
  anomaly: 3,
  anomalyPercent: 6,
  avgLifespan: 1180,
  topPerformer: { id: 'BAT-0102', cycles: 1847, health: 82 },
};

// ============================
// MAINTENANCE DATA
// ============================
export const maintenanceStats = {
  openAlerts: 8,
  scheduledThisWeek: 12,
  preventedFailures: 14,
  maintenanceCostsMTD: 890000, // Naira
  budget: 1200000,
};

export const preventedFailures = [
  { type: 'Battery removed before failure', count: 6 },
  { type: 'Charging anomaly corrected', count: 3 },
  { type: 'Low stock resolved before impact', count: 2 },
  { type: 'Cell imbalance caught early', count: 3 },
];

export const maintenanceSavings = {
  total: 1200000, // Naira
  breakdown: [
    { category: 'Emergency repair costs avoided', amount: 400000 },
    { category: 'Battery life extension', amount: 350000 },
    { category: 'Downtime revenue saved', amount: 280000 },
    { category: 'Customer compensation avoided', amount: 170000 },
  ],
};

export interface MaintenanceTask {
  id: string;
  date: Date;
  type: 'battery_replacement' | 'station_inspection' | 'module_replacement' | 'software_update';
  location: string;
  description: string;
  partsNeeded: string | null;
  assignedTo: string;
  estimatedDuration: string;
  status: 'scheduled' | 'in_progress' | 'completed';
}

export const maintenanceSchedule: MaintenanceTask[] = [
  {
    id: 'MT-001',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    type: 'battery_replacement',
    location: 'Yaba Central',
    description: 'Replace BAT-0847 and BAT-0391',
    partsNeeded: '2x 60V batteries',
    assignedTo: 'Chukwu Emmanuel',
    estimatedDuration: '30 min',
    status: 'scheduled',
  },
  {
    id: 'MT-002',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    type: 'station_inspection',
    location: 'VI Junction',
    description: 'Investigate charging system anomaly',
    partsNeeded: null,
    assignedTo: 'Adebayo Femi',
    estimatedDuration: '2 hours',
    status: 'scheduled',
  },
  {
    id: 'MT-003',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    type: 'module_replacement',
    location: 'VI Junction',
    description: 'Replace charging module #3',
    partsNeeded: '1x charging module v2.1',
    assignedTo: 'Adebayo Femi',
    estimatedDuration: '1 hour',
    status: 'scheduled',
  },
  {
    id: 'MT-004',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    type: 'battery_replacement',
    location: 'Ikeja Mall',
    description: 'Replace BAT-1043 and BAT-1044',
    partsNeeded: '2x 60V batteries',
    assignedTo: 'Chukwu Emmanuel',
    estimatedDuration: '30 min',
    status: 'scheduled',
  },
  {
    id: 'MT-005',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    type: 'software_update',
    location: 'All Stations',
    description: 'Deploy firmware v3.2.1',
    partsNeeded: null,
    assignedTo: 'System',
    estimatedDuration: '15 min each',
    status: 'scheduled',
  },
  {
    id: 'MT-006',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    type: 'station_inspection',
    location: 'Lekki Phase 1',
    description: 'Diagnose offline status',
    partsNeeded: null,
    assignedTo: 'Adebayo Femi',
    estimatedDuration: '3 hours',
    status: 'scheduled',
  },
];

// Enhanced replacement forecast with AI comparison
export const aiReplacementForecast = {
  thisMonth: { count: 6, cost: 510000 },
  nextMonth: { count: 8, cost: 680000 },
  month3: { count: 4, cost: 340000 },
  scheduledReplacement: 24, // If using time-based (every 12 months)
  aiOptimizedReplacement: 18,
  savings: { batteries: 6, cost: 510000 },
};
