// --- Vehicle Presets ---

export const VEHICLE_PRESETS = {
  okada: { label: 'Okada (Motorcycle)', kmPerLiter: 45, dailyKm: 80, maintenanceMonthly: 15000, avgSpeedKmh: 17 },
  keke: { label: 'Keke (Tricycle)', kmPerLiter: 25, dailyKm: 60, maintenanceMonthly: 25000, avgSpeedKmh: 13 },
  lastMile: { label: 'Last-Mile Van', kmPerLiter: 10, dailyKm: 100, maintenanceMonthly: 45000, avgSpeedKmh: 22 },
} as const;

export type VehicleType = keyof typeof VEHICLE_PRESETS;

// --- Constants ---

export const EV_SWAP_COST = 200; // ₦ per swap
export const EV_RANGE_PER_SWAP = 55; // km per full battery
export const EV_MAINTENANCE_MONTHLY = 3000; // ₦ (minimal — brake pads, tires only)
export const DEFAULT_PETROL_PRICE = 1533; // ₦ per liter
export const WORKING_DAYS = 26;
export const ICE_FUELING_MINUTES_DAILY = 25;
export const CO2_PER_LITER = 2.3; // kg CO2 per liter of petrol

// --- Types ---

export type CalculationInput = {
  vehicleType: VehicleType;
  dailyKm: number;
  petrolPrice: number;
  fleetSize: number;
};

export type CalculationResult = {
  // ICE
  dailyFuelLiters: number;
  dailyFuelCost: number;
  monthlyFuelCost: number;
  monthlyMaintenanceICE: number;
  monthlyTotalICE: number;
  fleetMonthlyICE: number;
  // EV
  dailySwaps: number;
  dailySwapCost: number;
  monthlySwapCost: number;
  monthlyMaintenanceEV: number;
  monthlyTotalEV: number;
  fleetMonthlyEV: number;
  // Savings
  monthlySavingsPerVehicle: number;
  monthlySavingsFleet: number;
  yearlySavingsFleet: number;
  savingsPercent: number;
  // Uptime
  iceFuelingMinutesDaily: number;
  evSwapMinutesDaily: number;
  uptimeGainMinutes: number;
  uptimeGainHoursMonthly: number;
  // CO2
  monthlyCO2Saved: number;
};

// --- Calculator Function ---

export function calculate(input: CalculationInput): CalculationResult {
  const { vehicleType, dailyKm, petrolPrice, fleetSize } = input;
  const preset = VEHICLE_PRESETS[vehicleType];

  // ICE calculations
  const dailyFuelLiters = dailyKm / preset.kmPerLiter;
  const dailyFuelCost = dailyFuelLiters * petrolPrice;
  const monthlyFuelCost = dailyFuelCost * WORKING_DAYS;
  const monthlyMaintenanceICE = preset.maintenanceMonthly;
  const monthlyTotalICE = monthlyFuelCost + monthlyMaintenanceICE;
  const fleetMonthlyICE = monthlyTotalICE * fleetSize;

  // EV calculations
  const dailySwaps = Math.ceil(dailyKm / EV_RANGE_PER_SWAP);
  const dailySwapCost = dailySwaps * EV_SWAP_COST;
  const monthlySwapCost = dailySwapCost * WORKING_DAYS;
  const monthlyMaintenanceEV = EV_MAINTENANCE_MONTHLY;
  const monthlyTotalEV = monthlySwapCost + monthlyMaintenanceEV;
  const fleetMonthlyEV = monthlyTotalEV * fleetSize;

  // Savings
  const monthlySavingsPerVehicle = monthlyTotalICE - monthlyTotalEV;
  const monthlySavingsFleet = fleetMonthlyICE - fleetMonthlyEV;
  const yearlySavingsFleet = monthlySavingsFleet * 12;
  const savingsPercent = Math.round((monthlySavingsPerVehicle / monthlyTotalICE) * 100);

  // Uptime
  const iceFuelingMinutesDaily = ICE_FUELING_MINUTES_DAILY;
  const evSwapMinutesDaily = dailySwaps * 3;
  const uptimeGainMinutes = iceFuelingMinutesDaily - evSwapMinutesDaily;
  const uptimeGainHoursMonthly = Math.round((uptimeGainMinutes * WORKING_DAYS) / 60);

  // CO2
  const monthlyCO2Saved = Math.round(dailyFuelLiters * WORKING_DAYS * CO2_PER_LITER * fleetSize);

  return {
    dailyFuelLiters,
    dailyFuelCost,
    monthlyFuelCost,
    monthlyMaintenanceICE,
    monthlyTotalICE,
    fleetMonthlyICE,
    dailySwaps,
    dailySwapCost,
    monthlySwapCost,
    monthlyMaintenanceEV,
    monthlyTotalEV,
    fleetMonthlyEV,
    monthlySavingsPerVehicle,
    monthlySavingsFleet,
    yearlySavingsFleet,
    savingsPercent,
    iceFuelingMinutesDaily,
    evSwapMinutesDaily,
    uptimeGainMinutes,
    uptimeGainHoursMonthly,
    monthlyCO2Saved,
  };
}

// --- Utility ---

export function hoursToKm(hours: number, vehicleType: VehicleType): number {
  return hours * VEHICLE_PRESETS[vehicleType].avgSpeedKmh;
}
