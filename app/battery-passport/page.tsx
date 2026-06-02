'use client';

import { useState } from 'react';
import { Shield, ShieldCheck, ShieldAlert, Lock, Unlock, ArrowRightLeft, Thermometer, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import KPICard from '@/components/ui/KPICard';
import DemoTip from '@/components/ui/DemoTip';
import { formatNaira } from '@/data/mockData';

type PoolMode = 'closed' | 'shared' | 'hybrid';
type TrustGrade = 'A' | 'B' | 'C' | 'F';

interface BatteryPassport {
    id: string;
    owner: string;
    pool: PoolMode;
    soh: number;
    cycles: number;
    trustGrade: TrustGrade;
    thermalEvents: number;
    lastThermalEvent: string | null;
    currentLocation: string;
    custodyChain: { operator: string; from: string; to: string; daysHeld: number }[];
    gateCheckStatus: 'passed' | 'flagged' | 'quarantined';
    lastGateCheck: string;
    cellBalanceVariance: number;
    internalResistance: number;
    dispensable: boolean;
    returnRouting: string | null;
}

interface PoolConfig {
    operator: string;
    mode: PoolMode;
    batteryCount: number;
    minSohThreshold: number;
    rejectThermalEvents: boolean;
    thermalEventWindow: number;
    allowNetworkFallback: boolean;
}

const poolConfigs: PoolConfig[] = [
    { operator: 'MaxGo Logistics', mode: 'hybrid', batteryCount: 120, minSohThreshold: 80, rejectThermalEvents: true, thermalEventWindow: 7, allowNetworkFallback: true },
    { operator: 'GreenRide Delivery', mode: 'shared', batteryCount: 85, minSohThreshold: 75, rejectThermalEvents: false, thermalEventWindow: 0, allowNetworkFallback: true },
    { operator: 'QuickDash', mode: 'closed', batteryCount: 45, minSohThreshold: 85, rejectThermalEvents: true, thermalEventWindow: 14, allowNetworkFallback: false },
    { operator: 'EcoFleet', mode: 'shared', batteryCount: 30, minSohThreshold: 70, rejectThermalEvents: false, thermalEventWindow: 0, allowNetworkFallback: true },
];

const batteries: BatteryPassport[] = [
    {
        id: 'BAT-1847',
        owner: 'MaxGo Logistics',
        pool: 'hybrid',
        soh: 94,
        cycles: 312,
        trustGrade: 'A',
        thermalEvents: 0,
        lastThermalEvent: null,
        currentLocation: 'Yaba Central - Slot 1',
        custodyChain: [
            { operator: 'MaxGo Logistics', from: '2026-05-01', to: '2026-05-28', daysHeld: 27 },
            { operator: 'GreenRide Delivery', from: '2026-05-28', to: '2026-06-01', daysHeld: 4 },
        ],
        gateCheckStatus: 'passed',
        lastGateCheck: '2026-06-01 14:23',
        cellBalanceVariance: 0.02,
        internalResistance: 12.4,
        dispensable: true,
        returnRouting: null,
    },
    {
        id: 'BAT-2341',
        owner: 'MaxGo Logistics',
        pool: 'hybrid',
        soh: 87,
        cycles: 489,
        trustGrade: 'B',
        thermalEvents: 2,
        lastThermalEvent: '2026-05-20',
        currentLocation: 'Ikeja Mall - Slot 4',
        custodyChain: [
            { operator: 'MaxGo Logistics', from: '2026-04-01', to: '2026-05-15', daysHeld: 44 },
            { operator: 'EcoFleet', from: '2026-05-15', to: '2026-05-25', daysHeld: 10 },
            { operator: 'MaxGo Logistics', from: '2026-05-25', to: '2026-06-01', daysHeld: 7 },
        ],
        gateCheckStatus: 'passed',
        lastGateCheck: '2026-06-01 11:45',
        cellBalanceVariance: 0.05,
        internalResistance: 14.8,
        dispensable: true,
        returnRouting: 'Routing to MaxGo station (Yaba)',
    },
    {
        id: 'BAT-3456',
        owner: 'GreenRide Delivery',
        pool: 'shared',
        soh: 62,
        cycles: 876,
        trustGrade: 'C',
        thermalEvents: 8,
        lastThermalEvent: '2026-05-30',
        currentLocation: 'Ikeja Mall - Slot 6',
        custodyChain: [
            { operator: 'GreenRide Delivery', from: '2026-01-01', to: '2026-04-15', daysHeld: 105 },
            { operator: 'QuickDash', from: '2026-04-15', to: '2026-04-18', daysHeld: 3 },
            { operator: 'GreenRide Delivery', from: '2026-04-18', to: '2026-06-01', daysHeld: 44 },
        ],
        gateCheckStatus: 'flagged',
        lastGateCheck: '2026-06-01 09:12',
        cellBalanceVariance: 0.12,
        internalResistance: 22.1,
        dispensable: false,
        returnRouting: null,
    },
    {
        id: 'BAT-7890',
        owner: 'QuickDash',
        pool: 'closed',
        soh: 91,
        cycles: 245,
        trustGrade: 'A',
        thermalEvents: 0,
        lastThermalEvent: null,
        currentLocation: 'Surulere - Slot 3',
        custodyChain: [
            { operator: 'QuickDash', from: '2026-02-01', to: '2026-06-01', daysHeld: 121 },
        ],
        gateCheckStatus: 'passed',
        lastGateCheck: '2026-06-01 13:55',
        cellBalanceVariance: 0.01,
        internalResistance: 11.2,
        dispensable: true,
        returnRouting: null,
    },
    {
        id: 'BAT-0847',
        owner: 'MaxGo Logistics',
        pool: 'hybrid',
        soh: 48,
        cycles: 1247,
        trustGrade: 'F',
        thermalEvents: 14,
        lastThermalEvent: '2026-05-31',
        currentLocation: 'VI Junction - Quarantine',
        custodyChain: [
            { operator: 'MaxGo Logistics', from: '2024-03-15', to: '2026-03-01', daysHeld: 717 },
            { operator: 'EcoFleet', from: '2026-03-01', to: '2026-05-31', daysHeld: 91 },
        ],
        gateCheckStatus: 'quarantined',
        lastGateCheck: '2026-05-31 22:10',
        cellBalanceVariance: 0.21,
        internalResistance: 34.7,
        dispensable: false,
        returnRouting: null,
    },
    {
        id: 'BAT-5678',
        owner: 'EcoFleet',
        pool: 'shared',
        soh: 89,
        cycles: 398,
        trustGrade: 'A',
        thermalEvents: 1,
        lastThermalEvent: '2026-04-12',
        currentLocation: 'Yaba Central - Slot 6',
        custodyChain: [
            { operator: 'EcoFleet', from: '2026-01-15', to: '2026-05-10', daysHeld: 115 },
            { operator: 'MaxGo Logistics', from: '2026-05-10', to: '2026-06-01', daysHeld: 22 },
        ],
        gateCheckStatus: 'passed',
        lastGateCheck: '2026-06-01 15:02',
        cellBalanceVariance: 0.03,
        internalResistance: 13.1,
        dispensable: true,
        returnRouting: null,
    },
];

const networkStats = {
    totalBatteries: 280,
    sharedPool: 115,
    closedPools: 45,
    hybridPools: 120,
    gateChecksPassed: 2341,
    gateChecksFlagged: 23,
    quarantined: 4,
    pendingSettlement: 847000,
    avgTrustScore: 88,
    crossOperatorSwaps: 342,
};

function TrustBadge({ grade }: { grade: TrustGrade }) {
    const config = {
        A: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'A — Excellent' },
        B: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'B — Good' },
        C: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'C — Fair' },
        F: { bg: 'bg-red-100', text: 'text-red-700', label: 'F — Fail' },
    }[grade];

    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
}

function GateStatusBadge({ status }: { status: 'passed' | 'flagged' | 'quarantined' }) {
    const config = {
        passed: { icon: CheckCircle, bg: 'text-emerald-600', label: 'Passed' },
        flagged: { icon: AlertTriangle, bg: 'text-amber-600', label: 'Flagged' },
        quarantined: { icon: ShieldAlert, bg: 'text-red-600', label: 'Quarantined' },
    }[status];
    const Icon = config.icon;

    return (
        <span className={`flex items-center gap-1 text-xs font-medium ${config.bg}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
}

export default function BatteryPassportPage() {
    const [selectedBattery, setSelectedBattery] = useState<BatteryPassport | null>(batteries[0]);
    const [activeTab, setActiveTab] = useState<'passports' | 'pools' | 'settlement'>('passports');

    return (
        <MainLayout>
            <DemoTip message="This solves the multi-operator trust problem. Each battery has a passport with full lifecycle history. The cabinet runs a gate check before dispensing — if it fails, the battery stays locked. Operators set their own thresholds. No bad battery ever reaches a rider." />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Battery Passport & Trust</h1>
                    <p className="text-sm text-gray-500 mt-1">Lifecycle tracking, gate checks, pool management, and cross-operator settlement</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                        <p className="text-sm font-bold text-emerald-700">{networkStats.avgTrustScore}% Network Trust</p>
                        <p className="text-xs text-emerald-600">{networkStats.quarantined} quarantined</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KPICard
                    icon={<Shield className="w-5 h-5" />}
                    value={networkStats.gateChecksPassed}
                    label="Gate Checks Passed"
                    subtitle="Last 30 days"
                    status="good"
                />
                <KPICard
                    icon={<AlertTriangle className="w-5 h-5" />}
                    value={networkStats.gateChecksFlagged}
                    label="Flagged (Held)"
                    subtitle="Not dispensed"
                    status={networkStats.gateChecksFlagged > 20 ? 'warning' : 'good'}
                />
                <KPICard
                    icon={<ArrowRightLeft className="w-5 h-5" />}
                    value={networkStats.crossOperatorSwaps}
                    label="Cross-Operator Swaps"
                    subtitle="This month"
                    status="good"
                />
                <KPICard
                    icon={<Activity className="w-5 h-5" />}
                    value={formatNaira(networkStats.pendingSettlement)}
                    label="Pending Settlement"
                    subtitle="Health delta reconciliation"
                    status="good"
                />
            </div>

            <div className="flex items-center gap-2 mb-6">
                {(['passports', 'pools', 'settlement'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === tab
                                ? 'bg-[#1C3D2D] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {tab === 'passports' ? 'Battery Passports' : tab === 'pools' ? 'Pool Management' : 'Settlement'}
                    </button>
                ))}
            </div>

            {activeTab === 'passports' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-2">
                        {batteries.map((bat) => (
                            <button
                                key={bat.id}
                                onClick={() => setSelectedBattery(bat)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${
                                    selectedBattery?.id === bat.id
                                        ? 'border-[#1C3D2D] bg-[#1C3D2D]/5'
                                        : 'border-gray-100 bg-white hover:border-gray-200'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-mono font-medium text-sm text-gray-900">{bat.id}</span>
                                    <TrustBadge grade={bat.trustGrade} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{bat.owner}</span>
                                    <GateStatusBadge status={bat.gateCheckStatus} />
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                                    <span>SOH {bat.soh}%</span>
                                    <span>{bat.cycles} cycles</span>
                                    <span className="flex items-center gap-0.5">
                                        {bat.pool === 'closed' ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                                        {bat.pool}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="lg:col-span-2">
                        {selectedBattery && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 font-mono">{selectedBattery.id}</h3>
                                        <p className="text-sm text-gray-500">Owned by {selectedBattery.owner}</p>
                                    </div>
                                    <TrustBadge grade={selectedBattery.trustGrade} />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400">SOH</p>
                                        <p className={`text-lg font-bold ${selectedBattery.soh >= 80 ? 'text-emerald-600' : selectedBattery.soh >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{selectedBattery.soh}%</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400">Cycles</p>
                                        <p className="text-lg font-bold text-gray-900">{selectedBattery.cycles}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400">Thermal Events</p>
                                        <p className={`text-lg font-bold ${selectedBattery.thermalEvents === 0 ? 'text-emerald-600' : selectedBattery.thermalEvents <= 3 ? 'text-amber-600' : 'text-red-600'}`}>{selectedBattery.thermalEvents}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400">Pool Mode</p>
                                        <p className="text-lg font-bold text-gray-900 capitalize flex items-center gap-1">
                                            {selectedBattery.pool === 'closed' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                            {selectedBattery.pool}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Last Gate Check</h4>
                                    <div className="p-3 border border-gray-100 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <GateStatusBadge status={selectedBattery.gateCheckStatus} />
                                            <span className="text-xs text-gray-400">{selectedBattery.lastGateCheck}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 text-xs">
                                            <div>
                                                <span className="text-gray-500">Cell Variance</span>
                                                <p className={`font-medium ${selectedBattery.cellBalanceVariance <= 0.05 ? 'text-emerald-600' : selectedBattery.cellBalanceVariance <= 0.1 ? 'text-amber-600' : 'text-red-600'}`}>{selectedBattery.cellBalanceVariance}V</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Internal Resistance</span>
                                                <p className={`font-medium ${selectedBattery.internalResistance <= 15 ? 'text-emerald-600' : selectedBattery.internalResistance <= 25 ? 'text-amber-600' : 'text-red-600'}`}>{selectedBattery.internalResistance}m&#8486;</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Dispensable</span>
                                                <p className={`font-medium ${selectedBattery.dispensable ? 'text-emerald-600' : 'text-red-600'}`}>{selectedBattery.dispensable ? 'Yes' : 'Blocked'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedBattery.returnRouting && (
                                    <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800 font-medium flex items-center gap-2">
                                            <ArrowRightLeft className="w-4 h-4" />
                                            {selectedBattery.returnRouting}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">Next rider heading to that station will carry this battery home</p>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Custody Chain</h4>
                                    <div className="space-y-2">
                                        {selectedBattery.custodyChain.map((entry, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                                                <div className="w-6 h-6 bg-[#1C3D2D] rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{entry.operator}</p>
                                                    <p className="text-[10px] text-gray-500">{entry.from} → {entry.to} ({entry.daysHeld} days)</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'pools' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Unlock className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-semibold text-gray-900">Shared Pool</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{networkStats.sharedPool}</p>
                            <p className="text-xs text-gray-500">Any rider can use. Settlement on health delta.</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <ArrowRightLeft className="w-4 h-4 text-purple-500" />
                                <span className="text-sm font-semibold text-gray-900">Hybrid Pool</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{networkStats.hybridPools}</p>
                            <p className="text-xs text-gray-500">Prefer own stations. Network fallback if needed.</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Lock className="w-4 h-4 text-orange-500" />
                                <span className="text-sm font-semibold text-gray-900">Closed Pool</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{networkStats.closedPools}</p>
                            <p className="text-xs text-gray-500">Only dispenses to own riders. Full control.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Operator Pool Configuration</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-xs font-medium text-gray-500 pb-3">Operator</th>
                                        <th className="text-center text-xs font-medium text-gray-500 pb-3">Mode</th>
                                        <th className="text-center text-xs font-medium text-gray-500 pb-3">Batteries</th>
                                        <th className="text-center text-xs font-medium text-gray-500 pb-3">Min SOH</th>
                                        <th className="text-center text-xs font-medium text-gray-500 pb-3">Reject Thermal</th>
                                        <th className="text-center text-xs font-medium text-gray-500 pb-3">Network Fallback</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {poolConfigs.map((config) => (
                                        <tr key={config.operator} className="border-b border-gray-50">
                                            <td className="py-3 font-medium text-gray-900">{config.operator}</td>
                                            <td className="py-3 text-center">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                    config.mode === 'closed' ? 'bg-orange-100 text-orange-700' :
                                                    config.mode === 'hybrid' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>{config.mode}</span>
                                            </td>
                                            <td className="py-3 text-center text-gray-900">{config.batteryCount}</td>
                                            <td className="py-3 text-center text-gray-900">{config.minSohThreshold}%</td>
                                            <td className="py-3 text-center">
                                                {config.rejectThermalEvents ? (
                                                    <span className="text-xs text-red-600">Yes ({config.thermalEventWindow}d)</span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">No</span>
                                                )}
                                            </td>
                                            <td className="py-3 text-center">
                                                {config.allowNetworkFallback ? (
                                                    <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                                                ) : (
                                                    <span className="text-xs text-gray-400">Disabled</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">How It Works</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Shield className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">Gate Check</h4>
                                <p className="text-xs text-gray-500">Every battery is tested on return. Cell balance, resistance, temperature. Fail = quarantine.</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Lock className="w-6 h-6 text-blue-600" />
                                </div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">Pool Rules</h4>
                                <p className="text-xs text-gray-500">Each operator sets their threshold. The cabinet enforces it. Below threshold = stays locked.</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <ArrowRightLeft className="w-6 h-6 text-purple-600" />
                                </div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">Smart Routing</h4>
                                <p className="text-xs text-gray-500">Batteries away from home get prioritized for return via the next rider heading that direction.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'settlement' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Cross-Operator Settlement (June 2026)</h3>
                        <p className="text-xs text-gray-500 mb-4">When a rider uses a battery owned by another operator, the health delta is tracked. Monthly net settlement ensures fair compensation.</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-xs font-medium text-gray-500 pb-3">Transaction</th>
                                        <th className="text-center text-xs font-medium text-gray-500 pb-3">Battery</th>
                                        <th className="text-center text-xs font-medium text-gray-500 pb-3">SOH In</th>
                                        <th className="text-center text-xs font-medium text-gray-500 pb-3">SOH Out</th>
                                        <th className="text-center text-xs font-medium text-gray-500 pb-3">Delta</th>
                                        <th className="text-right text-xs font-medium text-gray-500 pb-3">Settlement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-50">
                                        <td className="py-3">
                                            <p className="font-medium text-gray-900">GreenRide used MaxGo battery</p>
                                            <p className="text-[10px] text-gray-500">May 28 — Jun 1 (4 days)</p>
                                        </td>
                                        <td className="py-3 text-center font-mono text-xs">BAT-1847</td>
                                        <td className="py-3 text-center text-emerald-600">95%</td>
                                        <td className="py-3 text-center text-emerald-600">94%</td>
                                        <td className="py-3 text-center text-amber-600">-1%</td>
                                        <td className="py-3 text-right text-gray-900">{formatNaira(12000)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-50">
                                        <td className="py-3">
                                            <p className="font-medium text-gray-900">EcoFleet used MaxGo battery</p>
                                            <p className="text-[10px] text-gray-500">May 15 — May 25 (10 days)</p>
                                        </td>
                                        <td className="py-3 text-center font-mono text-xs">BAT-2341</td>
                                        <td className="py-3 text-center text-emerald-600">89%</td>
                                        <td className="py-3 text-center text-amber-600">87%</td>
                                        <td className="py-3 text-center text-amber-600">-2%</td>
                                        <td className="py-3 text-right text-gray-900">{formatNaira(24000)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-50">
                                        <td className="py-3">
                                            <p className="font-medium text-gray-900">MaxGo used EcoFleet battery</p>
                                            <p className="text-[10px] text-gray-500">May 10 — Jun 1 (22 days)</p>
                                        </td>
                                        <td className="py-3 text-center font-mono text-xs">BAT-5678</td>
                                        <td className="py-3 text-center text-emerald-600">91%</td>
                                        <td className="py-3 text-center text-emerald-600">89%</td>
                                        <td className="py-3 text-center text-amber-600">-2%</td>
                                        <td className="py-3 text-right text-gray-900">{formatNaira(24000)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-50">
                                        <td className="py-3">
                                            <p className="font-medium text-gray-900">EcoFleet used MaxGo battery</p>
                                            <p className="text-[10px] text-gray-500">Mar 1 — May 31 (91 days)</p>
                                        </td>
                                        <td className="py-3 text-center font-mono text-xs">BAT-0847</td>
                                        <td className="py-3 text-center text-amber-600">63%</td>
                                        <td className="py-3 text-center text-red-600">48%</td>
                                        <td className="py-3 text-center text-red-600">-15%</td>
                                        <td className="py-3 text-right font-bold text-red-600">{formatNaira(787000)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Net Settlement Summary</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">EcoFleet owes MaxGo</p>
                                    <p className="text-lg font-bold text-red-600">{formatNaira(811000)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">MaxGo owes EcoFleet</p>
                                    <p className="text-lg font-bold text-amber-600">{formatNaira(24000)}</p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500">Net: EcoFleet pays MaxGo</p>
                                <p className="text-xl font-bold text-gray-900">{formatNaira(787000)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
