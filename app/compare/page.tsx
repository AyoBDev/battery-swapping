'use client';

import { useState } from 'react';
import { ArrowRight, X, Check, AlertTriangle, Clock, DollarSign, Battery, MapPin, Calculator, BarChart3 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { formatNaira } from '@/data/mockData';

// --- Overview Tab Data ---

const beforeProblems = [
    {
        title: 'No visibility into battery health',
        detail: 'Operators discover dead batteries only when riders complain',
        icon: Battery,
    },
    {
        title: 'Manual inventory tracking',
        detail: 'Station agents count batteries by hand, report via WhatsApp',
        icon: AlertTriangle,
    },
    {
        title: '45-minute average swap time',
        detail: 'Riders queue at wrong stations, no real-time availability data',
        icon: Clock,
    },
    {
        title: 'Revenue leakage',
        detail: 'No per-swap tracking, settlement disputes between operators',
        icon: DollarSign,
    },
    {
        title: 'No station coordination',
        detail: 'Each station is an island — no load balancing or routing',
        icon: MapPin,
    },
];

const afterBenefits = [
    {
        title: 'Predictive battery replacement',
        detail: 'AI flags degrading batteries 3 weeks before failure',
        icon: Battery,
    },
    {
        title: 'Real-time inventory dashboard',
        detail: 'Live battery counts, charge levels, and swap history per station',
        icon: AlertTriangle,
    },
    {
        title: '< 3 minute swap time',
        detail: 'Riders routed to nearest station with charged batteries available',
        icon: Clock,
    },
    {
        title: 'Per-swap revenue tracking',
        detail: 'Automatic settlement, usage reports, and operator payouts',
        icon: DollarSign,
    },
    {
        title: 'Network-wide optimization',
        detail: 'Load balancing, surge detection, and proactive redistribution',
        icon: MapPin,
    },
];

const metrics = [
    { label: 'Swap Time', before: '45 min', after: '< 3 min', improvement: '93%' },
    { label: 'Battery Downtime', before: '18%', after: '3%', improvement: '83%' },
    { label: 'Revenue Captured', before: '~60%', after: '99%', improvement: '65%' },
    { label: 'Fleet Utilization', before: '55%', after: '89%', improvement: '62%' },
    { label: 'Station Uptime', before: '72%', after: '97%', improvement: '35%' },
];

// --- Calculator Constants ---

const VEHICLE_PRESETS = {
    okada: { label: 'Okada (Motorcycle)', kmPerLiter: 45, dailyKm: 80, maintenanceMonthly: 15000 },
    keke: { label: 'Keke (Tricycle)', kmPerLiter: 25, dailyKm: 60, maintenanceMonthly: 25000 },
    lastMile: { label: 'Last-Mile Van', kmPerLiter: 10, dailyKm: 100, maintenanceMonthly: 45000 },
};

const EV_SWAP_COST = 200; // ₦ per swap
const EV_RANGE_PER_SWAP = 55; // km per full battery
const EV_MAINTENANCE_MONTHLY = 3000; // ₦ (minimal — brake pads, tires only)
const DEFAULT_PETROL_PRICE = 700; // ₦ per liter

export default function ComparePage() {
    const [tab, setTab] = useState<'overview' | 'calculator'>('overview');

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        ICE vs EV — The Numbers
                    </h1>
                    <p className="text-gray-500 mt-2 max-w-xl mx-auto">
                        See how battery swapping compares to petrol for your fleet
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <button
                        onClick={() => setTab('overview')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'overview' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Overview
                    </button>
                    <button
                        onClick={() => setTab('calculator')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'calculator' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <Calculator className="w-4 h-4" />
                        Cost Calculator
                    </button>
                </div>

                {tab === 'overview' && <OverviewTab />}
                {tab === 'calculator' && <CalculatorTab />}
            </div>
        </MainLayout>
    );
}

// --- Overview Tab ---

function OverviewTab() {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                    <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                        <h2 className="font-semibold text-red-900 flex items-center gap-2">
                            <X className="w-5 h-5 text-red-500" />
                            Without SwapOS
                        </h2>
                        <p className="text-sm text-red-700 mt-1">Manual, fragmented, reactive</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {beforeProblems.map((item) => (
                            <div key={item.title} className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-4 h-4 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                    <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                        <h2 className="font-semibold text-green-900 flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            With SwapOS
                        </h2>
                        <p className="text-sm text-green-700 mt-1">Automated, unified, predictive</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {afterBenefits.map((item) => (
                            <div key={item.title} className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Key Metrics Comparison</h3>
                    <p className="text-sm text-gray-500 mt-1">Based on pilot data from 5 stations in Lagos</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Metric</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-red-500 uppercase tracking-wider">Before</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"></th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-green-600 uppercase tracking-wider">After</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Improvement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.map((m) => (
                                <tr key={m.label} className="border-b border-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.label}</td>
                                    <td className="px-6 py-4 text-sm text-red-600 font-medium">{m.before}</td>
                                    <td className="px-4 py-4 text-center">
                                        <ArrowRight className="w-4 h-4 text-gray-300 mx-auto" />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-green-600 font-medium">{m.after}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">
                                            +{m.improvement}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-center">
                <a
                    href="/partner"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                    Become a Partner
                    <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-xs text-gray-500 mt-2">See SwapOS with your brand in 60 seconds</p>
            </div>
        </>
    );
}

// --- Calculator Tab ---

function CalculatorTab() {
    const [vehicleType, setVehicleType] = useState<keyof typeof VEHICLE_PRESETS>('okada');
    const [fleetSize, setFleetSize] = useState(10);
    const [dailyKm, setDailyKm] = useState(VEHICLE_PRESETS.okada.dailyKm);
    const [petrolPrice, setPetrolPrice] = useState(DEFAULT_PETROL_PRICE);
    const [kmPerLiter, setKmPerLiter] = useState(VEHICLE_PRESETS.okada.kmPerLiter);

    const handlePresetChange = (type: keyof typeof VEHICLE_PRESETS) => {
        setVehicleType(type);
        setDailyKm(VEHICLE_PRESETS[type].dailyKm);
        setKmPerLiter(VEHICLE_PRESETS[type].kmPerLiter);
    };

    // ICE calculations
    const dailyFuelLiters = dailyKm / kmPerLiter;
    const dailyFuelCost = dailyFuelLiters * petrolPrice;
    const monthlyFuelCost = dailyFuelCost * 26; // 26 working days
    const monthlyMaintenanceICE = VEHICLE_PRESETS[vehicleType].maintenanceMonthly;
    const monthlyTotalICE = monthlyFuelCost + monthlyMaintenanceICE;
    const fleetMonthlyICE = monthlyTotalICE * fleetSize;

    // EV calculations
    const dailySwaps = Math.ceil(dailyKm / EV_RANGE_PER_SWAP);
    const dailySwapCost = dailySwaps * EV_SWAP_COST;
    const monthlySwapCost = dailySwapCost * 26;
    const monthlyMaintenanceEV = EV_MAINTENANCE_MONTHLY;
    const monthlyTotalEV = monthlySwapCost + monthlyMaintenanceEV;
    const fleetMonthlyEV = monthlyTotalEV * fleetSize;

    // Savings
    const monthlySavingsPerVehicle = monthlyTotalICE - monthlyTotalEV;
    const monthlySavingsFleet = fleetMonthlyICE - fleetMonthlyEV;
    const yearlySavingsFleet = monthlySavingsFleet * 12;
    const savingsPercent = Math.round((monthlySavingsPerVehicle / monthlyTotalICE) * 100);

    // Uptime comparison
    const iceFuelingMinutesDaily = 25; // average time lost to fueling queues
    const evSwapMinutesDaily = dailySwaps * 3;
    const uptimeGainMinutes = iceFuelingMinutesDaily - evSwapMinutesDaily;
    const uptimeGainHoursMonthly = Math.round((uptimeGainMinutes * 26) / 60);

    // CO2 (approx 2.3 kg CO2 per liter of petrol)
    const monthlyCO2Saved = Math.round(dailyFuelLiters * 26 * 2.3 * fleetSize);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Your Fleet</h3>

                <div className="space-y-5">
                    {/* Vehicle Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                        <div className="space-y-2">
                            {(Object.entries(VEHICLE_PRESETS) as [keyof typeof VEHICLE_PRESETS, typeof VEHICLE_PRESETS[keyof typeof VEHICLE_PRESETS]][]).map(([key, preset]) => (
                                <button
                                    key={key}
                                    onClick={() => handlePresetChange(key)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border ${vehicleType === key
                                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fleet Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Fleet Size
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={500}
                            value={fleetSize}
                            onChange={(e) => setFleetSize(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">{fleetSize} vehicle{fleetSize > 1 ? 's' : ''}</p>
                    </div>

                    {/* Daily KM */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Daily Distance (km per vehicle)
                        </label>
                        <input
                            type="range"
                            min={20}
                            max={200}
                            step={5}
                            value={dailyKm}
                            onChange={(e) => setDailyKm(parseInt(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>20 km</span>
                            <span className="font-medium text-gray-900">{dailyKm} km</span>
                            <span>200 km</span>
                        </div>
                    </div>

                    {/* Petrol Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Petrol Price (₦/liter)
                        </label>
                        <input
                            type="number"
                            min={100}
                            max={2000}
                            value={petrolPrice}
                            onChange={(e) => setPetrolPrice(Math.max(100, parseInt(e.target.value) || 100))}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">Current Lagos average: ~₦700/L</p>
                    </div>

                    {/* Fuel Efficiency */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Fuel Efficiency (km/liter)
                        </label>
                        <input
                            type="number"
                            min={5}
                            max={80}
                            value={kmPerLiter}
                            onChange={(e) => setKmPerLiter(Math.max(5, parseInt(e.target.value) || 5))}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                        />
                    </div>
                </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
                {/* Headline Savings */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Monthly Savings</p>
                            <p className="text-2xl font-bold text-green-700">{formatNaira(monthlySavingsFleet)}</p>
                            <p className="text-xs text-gray-500">entire fleet</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Yearly Savings</p>
                            <p className="text-2xl font-bold text-green-700">{formatNaira(yearlySavingsFleet)}</p>
                            <p className="text-xs text-gray-500">{fleetSize} vehicles × 12 months</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Cost Reduction</p>
                            <p className="text-2xl font-bold text-green-700">{savingsPercent}%</p>
                            <p className="text-xs text-gray-500">per vehicle</p>
                        </div>
                    </div>
                </div>

                {/* Side by side cost breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* ICE Costs */}
                    <div className="bg-white rounded-xl shadow-sm border border-red-100 p-5">
                        <h4 className="font-medium text-red-900 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            Petrol (ICE) — Monthly
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Fuel ({dailyFuelLiters.toFixed(1)} L/day × 26 days)</span>
                                <span className="font-medium text-gray-900">{formatNaira(monthlyFuelCost)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Maintenance (oil, engine, etc.)</span>
                                <span className="font-medium text-gray-900">{formatNaira(monthlyMaintenanceICE)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-red-100">
                                <span className="font-medium text-gray-900">Total per vehicle</span>
                                <span className="font-bold text-red-600">{formatNaira(monthlyTotalICE)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Fleet total ({fleetSize} vehicles)</span>
                                <span className="font-medium">{formatNaira(fleetMonthlyICE)}</span>
                            </div>
                        </div>
                    </div>

                    {/* EV Costs */}
                    <div className="bg-white rounded-xl shadow-sm border border-green-100 p-5">
                        <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Battery Swap (EV) — Monthly
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Swaps ({dailySwaps}/day × ₦{EV_SWAP_COST} × 26 days)</span>
                                <span className="font-medium text-gray-900">{formatNaira(monthlySwapCost)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Maintenance (brakes, tires only)</span>
                                <span className="font-medium text-gray-900">{formatNaira(monthlyMaintenanceEV)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-green-100">
                                <span className="font-medium text-gray-900">Total per vehicle</span>
                                <span className="font-bold text-green-600">{formatNaira(monthlyTotalEV)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Fleet total ({fleetSize} vehicles)</span>
                                <span className="font-medium">{formatNaira(fleetMonthlyEV)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Benefits */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <h4 className="font-medium text-gray-900 mb-3">Beyond Fuel Savings</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-1">Extra Uptime</p>
                            <p className="text-lg font-bold text-blue-700">+{uptimeGainHoursMonthly} hrs/mo</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {iceFuelingMinutesDaily} min fueling → {evSwapMinutesDaily} min swapping daily
                            </p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-1">Price Stability</p>
                            <p className="text-lg font-bold text-amber-700">Fixed ₦{EV_SWAP_COST}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                No more petrol price surprises or scarcity queues
                            </p>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-1">CO₂ Reduction</p>
                            <p className="text-lg font-bold text-emerald-700">{monthlyCO2Saved.toLocaleString()} kg/mo</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Fleet-wide carbon savings
                            </p>
                        </div>
                    </div>
                </div>

                {/* Assumptions */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500">
                        <span className="font-medium text-gray-700">Assumptions:</span>{' '}
                        26 working days/month. EV range {EV_RANGE_PER_SWAP} km per swap at ₦{EV_SWAP_COST}/swap.
                        ICE maintenance includes oil changes, spark plugs, engine servicing.
                        EV maintenance covers brake pads and tires only (no engine).
                        Calculations exclude vehicle purchase/conversion cost.
                    </p>
                </div>

                {/* CTA */}
                <div className="text-center pt-2">
                    <a
                        href="/partner"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Calculate for My Fleet
                        <ArrowRight className="w-4 h-4" />
                    </a>
                    <p className="text-xs text-gray-500 mt-2">Talk to us about your specific fleet economics</p>
                </div>
            </div>
        </div>
    );
}
