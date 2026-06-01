'use client';

import { useState } from 'react';
import { Server, Thermometer, Cpu, Wifi, WifiOff, Zap, ArrowUpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import KPICard from '@/components/ui/KPICard';
import DemoTip from '@/components/ui/DemoTip';

interface SlotData {
    id: number;
    status: 'charging' | 'ready' | 'empty' | 'fault';
    batteryId: string | null;
    charge: number | null;
    cellTemp: number | null;
    chargeRate: number | null;
    voltage: number | null;
    timeToFull: number | null;
}

interface CabinetData {
    id: string;
    stationName: string;
    model: string;
    firmware: string;
    latestFirmware: string;
    status: 'online' | 'degraded' | 'offline';
    uptime: number;
    ambientTemp: number;
    internalTemp: number;
    coolingMode: 'active' | 'passive' | 'off';
    powerDraw: number;
    maxPower: number;
    lastOtaUpdate: string;
    slots: SlotData[];
}

const cabinets: CabinetData[] = [
    {
        id: 'CAB-001',
        stationName: 'Yaba Central',
        model: 'SwapCab Pro 10',
        firmware: 'v2.4.1',
        latestFirmware: 'v2.4.1',
        status: 'online',
        uptime: 99.7,
        ambientTemp: 34,
        internalTemp: 28,
        coolingMode: 'active',
        powerDraw: 3.2,
        maxPower: 5.0,
        lastOtaUpdate: '2026-05-28',
        slots: [
            { id: 1, status: 'ready', batteryId: 'BAT-1847', charge: 98, cellTemp: 27, chargeRate: 0, voltage: 54.2, timeToFull: null },
            { id: 2, status: 'charging', batteryId: 'BAT-2341', charge: 67, cellTemp: 32, chargeRate: 0.8, voltage: 51.8, timeToFull: 42 },
            { id: 3, status: 'charging', batteryId: 'BAT-0987', charge: 45, cellTemp: 35, chargeRate: 1.2, voltage: 49.6, timeToFull: 68 },
            { id: 4, status: 'ready', batteryId: 'BAT-3421', charge: 91, cellTemp: 26, chargeRate: 0, voltage: 53.8, timeToFull: null },
            { id: 5, status: 'charging', batteryId: 'BAT-4521', charge: 82, cellTemp: 30, chargeRate: 0.5, voltage: 52.9, timeToFull: 22 },
            { id: 6, status: 'ready', batteryId: 'BAT-5678', charge: 95, cellTemp: 25, chargeRate: 0, voltage: 54.0, timeToFull: null },
            { id: 7, status: 'ready', batteryId: 'BAT-6789', charge: 89, cellTemp: 27, chargeRate: 0, voltage: 53.4, timeToFull: null },
            { id: 8, status: 'charging', batteryId: 'BAT-7890', charge: 38, cellTemp: 36, chargeRate: 1.4, voltage: 48.2, timeToFull: 78 },
            { id: 9, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
            { id: 10, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
        ],
    },
    {
        id: 'CAB-002',
        stationName: 'Ikeja Mall',
        model: 'SwapCab Pro 10',
        firmware: 'v2.3.8',
        latestFirmware: 'v2.4.1',
        status: 'online',
        uptime: 98.2,
        ambientTemp: 32,
        internalTemp: 26,
        coolingMode: 'passive',
        powerDraw: 2.8,
        maxPower: 5.0,
        lastOtaUpdate: '2026-05-15',
        slots: [
            { id: 1, status: 'ready', batteryId: 'BAT-8901', charge: 92, cellTemp: 25, chargeRate: 0, voltage: 53.6, timeToFull: null },
            { id: 2, status: 'charging', batteryId: 'BAT-9012', charge: 56, cellTemp: 33, chargeRate: 1.0, voltage: 50.4, timeToFull: 55 },
            { id: 3, status: 'ready', batteryId: 'BAT-0123', charge: 88, cellTemp: 24, chargeRate: 0, voltage: 53.2, timeToFull: null },
            { id: 4, status: 'charging', batteryId: 'BAT-1234', charge: 71, cellTemp: 31, chargeRate: 0.7, voltage: 52.1, timeToFull: 38 },
            { id: 5, status: 'ready', batteryId: 'BAT-2345', charge: 96, cellTemp: 23, chargeRate: 0, voltage: 54.1, timeToFull: null },
            { id: 6, status: 'fault', batteryId: 'BAT-3456', charge: 34, cellTemp: 44, chargeRate: 0, voltage: 47.8, timeToFull: null },
            { id: 7, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
            { id: 8, status: 'charging', batteryId: 'BAT-4567', charge: 63, cellTemp: 30, chargeRate: 0.9, voltage: 51.2, timeToFull: 47 },
            { id: 9, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
            { id: 10, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
        ],
    },
    {
        id: 'CAB-003',
        stationName: 'VI Junction',
        model: 'SwapCab Pro 10',
        firmware: 'v2.4.1',
        latestFirmware: 'v2.4.1',
        status: 'degraded',
        uptime: 94.5,
        ambientTemp: 37,
        internalTemp: 34,
        coolingMode: 'active',
        powerDraw: 1.4,
        maxPower: 5.0,
        lastOtaUpdate: '2026-05-28',
        slots: [
            { id: 1, status: 'ready', batteryId: 'BAT-5679', charge: 89, cellTemp: 32, chargeRate: 0, voltage: 53.4, timeToFull: null },
            { id: 2, status: 'charging', batteryId: 'BAT-6790', charge: 72, cellTemp: 38, chargeRate: 0.4, voltage: 52.1, timeToFull: 85 },
            { id: 3, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
            { id: 4, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
            { id: 5, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
            { id: 6, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
            { id: 7, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
            { id: 8, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
            { id: 9, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
            { id: 10, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
        ],
    },
    {
        id: 'CAB-004',
        stationName: 'Surulere',
        model: 'SwapCab Pro 10',
        firmware: 'v2.4.1',
        latestFirmware: 'v2.4.1',
        status: 'online',
        uptime: 99.2,
        ambientTemp: 31,
        internalTemp: 25,
        coolingMode: 'passive',
        powerDraw: 4.1,
        maxPower: 5.0,
        lastOtaUpdate: '2026-05-28',
        slots: [
            { id: 1, status: 'ready', batteryId: 'BAT-7001', charge: 95, cellTemp: 24, chargeRate: 0, voltage: 54.0, timeToFull: null },
            { id: 2, status: 'ready', batteryId: 'BAT-7002', charge: 92, cellTemp: 23, chargeRate: 0, voltage: 53.7, timeToFull: null },
            { id: 3, status: 'ready', batteryId: 'BAT-7003', charge: 88, cellTemp: 24, chargeRate: 0, voltage: 53.2, timeToFull: null },
            { id: 4, status: 'charging', batteryId: 'BAT-7004', charge: 74, cellTemp: 29, chargeRate: 0.6, voltage: 52.3, timeToFull: 33 },
            { id: 5, status: 'ready', batteryId: 'BAT-7005', charge: 91, cellTemp: 23, chargeRate: 0, voltage: 53.6, timeToFull: null },
            { id: 6, status: 'ready', batteryId: 'BAT-7006', charge: 87, cellTemp: 25, chargeRate: 0, voltage: 53.1, timeToFull: null },
            { id: 7, status: 'charging', batteryId: 'BAT-7007', charge: 59, cellTemp: 31, chargeRate: 1.1, voltage: 50.8, timeToFull: 52 },
            { id: 8, status: 'ready', batteryId: 'BAT-7008', charge: 94, cellTemp: 24, chargeRate: 0, voltage: 53.9, timeToFull: null },
            { id: 9, status: 'ready', batteryId: 'BAT-7009', charge: 89, cellTemp: 23, chargeRate: 0, voltage: 53.4, timeToFull: null },
            { id: 10, status: 'ready', batteryId: 'BAT-7010', charge: 93, cellTemp: 24, chargeRate: 0, voltage: 53.8, timeToFull: null },
        ],
    },
    {
        id: 'CAB-005',
        stationName: 'Maryland',
        model: 'SwapCab Pro 10',
        firmware: 'v2.3.8',
        latestFirmware: 'v2.4.1',
        status: 'online',
        uptime: 98.9,
        ambientTemp: 33,
        internalTemp: 27,
        coolingMode: 'active',
        powerDraw: 3.6,
        maxPower: 5.0,
        lastOtaUpdate: '2026-05-15',
        slots: [
            { id: 1, status: 'ready', batteryId: 'BAT-8001', charge: 94, cellTemp: 26, chargeRate: 0, voltage: 53.9, timeToFull: null },
            { id: 2, status: 'charging', batteryId: 'BAT-8002', charge: 51, cellTemp: 33, chargeRate: 1.1, voltage: 50.2, timeToFull: 61 },
            { id: 3, status: 'ready', batteryId: 'BAT-8003', charge: 89, cellTemp: 25, chargeRate: 0, voltage: 53.4, timeToFull: null },
            { id: 4, status: 'ready', batteryId: 'BAT-8004', charge: 82, cellTemp: 26, chargeRate: 0, voltage: 52.8, timeToFull: null },
            { id: 5, status: 'charging', batteryId: 'BAT-8005', charge: 43, cellTemp: 34, chargeRate: 1.3, voltage: 49.4, timeToFull: 72 },
            { id: 6, status: 'ready', batteryId: 'BAT-8006', charge: 91, cellTemp: 25, chargeRate: 0, voltage: 53.6, timeToFull: null },
            { id: 7, status: 'ready', batteryId: 'BAT-8007', charge: 85, cellTemp: 26, chargeRate: 0, voltage: 53.0, timeToFull: null },
            { id: 8, status: 'charging', batteryId: 'BAT-8008', charge: 38, cellTemp: 35, chargeRate: 1.4, voltage: 48.6, timeToFull: 78 },
            { id: 9, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
            { id: 10, status: 'empty', batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null },
        ],
    },
    {
        id: 'CAB-006',
        stationName: 'Lekki Phase 1',
        model: 'SwapCab Pro 10',
        firmware: 'v2.4.1',
        latestFirmware: 'v2.4.1',
        status: 'offline',
        uptime: 0,
        ambientTemp: 35,
        internalTemp: 35,
        coolingMode: 'off',
        powerDraw: 0,
        maxPower: 5.0,
        lastOtaUpdate: '2026-05-28',
        slots: Array.from({ length: 10 }, (_, i) => ({
            id: i + 1, status: 'empty' as const, batteryId: null, charge: null, cellTemp: null, chargeRate: null, voltage: null, timeToFull: null,
        })),
    },
];

const cabinetSummary = {
    totalCabinets: 6,
    online: 4,
    degraded: 1,
    offline: 1,
    avgUptime: 97.8,
    slotsTotal: 60,
    slotsOccupied: 38,
    activeFaults: 2,
    pendingOta: 2,
};

function SlotCell({ slot }: { slot: SlotData }) {
    const bgColor = {
        ready: 'bg-emerald-500/20 border-emerald-500/40',
        charging: 'bg-blue-500/20 border-blue-500/40',
        empty: 'bg-gray-100 border-gray-200',
        fault: 'bg-red-500/20 border-red-500/40',
    }[slot.status];

    const statusLabel = {
        ready: 'Ready',
        charging: 'Charging',
        empty: 'Empty',
        fault: 'Fault',
    }[slot.status];

    return (
        <div className={`border rounded-lg p-3 ${bgColor} transition-all hover:shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-500">Slot {slot.id}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    slot.status === 'ready' ? 'bg-emerald-100 text-emerald-700' :
                    slot.status === 'charging' ? 'bg-blue-100 text-blue-700' :
                    slot.status === 'fault' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-500'
                }`}>{statusLabel}</span>
            </div>
            {slot.batteryId ? (
                <div className="space-y-1.5">
                    <p className="text-xs font-mono font-medium text-gray-900">{slot.batteryId}</p>
                    <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${
                                    slot.charge! >= 80 ? 'bg-emerald-500' :
                                    slot.charge! >= 50 ? 'bg-blue-500' :
                                    slot.charge! >= 20 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${slot.charge}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-medium text-gray-600">{slot.charge}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-500">
                        <span className="flex items-center gap-0.5">
                            <Thermometer className="w-2.5 h-2.5" />
                            {slot.cellTemp}&deg;C
                        </span>
                        <span className="flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" />
                            {slot.voltage}V
                        </span>
                    </div>
                    {slot.status === 'charging' && slot.timeToFull && (
                        <p className="text-[10px] text-blue-600 font-medium">{slot.chargeRate}A &middot; {slot.timeToFull}min to full</p>
                    )}
                    {slot.status === 'fault' && (
                        <p className="text-[10px] text-red-600 font-medium">Thermal limit exceeded</p>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-center h-12">
                    <span className="text-xs text-gray-400">No battery</span>
                </div>
            )}
        </div>
    );
}

export default function CabinetsPage() {
    const [expandedCabinet, setExpandedCabinet] = useState<string | null>('CAB-001');

    return (
        <MainLayout>
            <DemoTip message="This is your hardware-level view. Each slot shows real-time cell temperature, charge rate, and voltage. The thermal management system adapts charge rates to protect battery lifespan in Lagos heat." />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Cabinet Control</h1>
                    <p className="text-sm text-gray-500 mt-1">Slot-level monitoring, thermal management, and OTA updates</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <Server className="w-5 h-5 text-blue-600" />
                    <div>
                        <p className="text-sm font-bold text-blue-700">{cabinetSummary.online}/{cabinetSummary.totalCabinets} Online</p>
                        <p className="text-xs text-blue-600">{cabinetSummary.avgUptime}% avg uptime</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KPICard
                    icon={<Server className="w-5 h-5" />}
                    value={cabinetSummary.totalCabinets}
                    label="Total Cabinets"
                    subtitle={`${cabinetSummary.slotsTotal} slots`}
                    status="good"
                />
                <KPICard
                    icon={<Thermometer className="w-5 h-5" />}
                    value={`${cabinetSummary.activeFaults}`}
                    label="Active Faults"
                    subtitle="Thermal events"
                    status={cabinetSummary.activeFaults > 0 ? 'critical' : 'good'}
                />
                <KPICard
                    icon={<ArrowUpCircle className="w-5 h-5" />}
                    value={cabinetSummary.pendingOta}
                    label="Pending OTA Updates"
                    subtitle="Firmware available"
                    status="warning"
                />
                <KPICard
                    icon={<Cpu className="w-5 h-5" />}
                    value={`${Math.round((cabinetSummary.slotsOccupied / cabinetSummary.slotsTotal) * 100)}%`}
                    label="Slot Utilization"
                    subtitle={`${cabinetSummary.slotsOccupied}/${cabinetSummary.slotsTotal} occupied`}
                    status="good"
                />
            </div>

            <div className="space-y-4">
                {cabinets.map((cabinet) => (
                    <div key={cabinet.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <button
                            onClick={() => setExpandedCabinet(expandedCabinet === cabinet.id ? null : cabinet.id)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${
                                    cabinet.status === 'online' ? 'bg-emerald-500' :
                                    cabinet.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'
                                }`} />
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900">{cabinet.stationName}</h3>
                                    <p className="text-xs text-gray-500">{cabinet.id} &middot; {cabinet.model} &middot; FW {cabinet.firmware}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Thermometer className="w-3.5 h-3.5" />
                                        {cabinet.internalTemp}&deg;C internal
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Zap className="w-3.5 h-3.5" />
                                        {cabinet.powerDraw}/{cabinet.maxPower} kW
                                    </span>
                                    <span className="flex items-center gap-1">
                                        {cabinet.status === 'online' ? <Wifi className="w-3.5 h-3.5 text-emerald-500" /> : <WifiOff className="w-3.5 h-3.5 text-amber-500" />}
                                        {cabinet.uptime}% uptime
                                    </span>
                                </div>
                                {cabinet.firmware !== cabinet.latestFirmware && (
                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-medium">
                                        Update Available
                                    </span>
                                )}
                                {expandedCabinet === cabinet.id ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </button>

                        {expandedCabinet === cabinet.id && (
                            <div className="px-6 pb-6 border-t border-gray-100">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 mb-4 border-b border-gray-50">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Cooling</p>
                                        <p className="text-sm font-medium text-gray-900 capitalize">{cabinet.coolingMode}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Ambient Temp</p>
                                        <p className="text-sm font-medium text-gray-900">{cabinet.ambientTemp}&deg;C</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Power Draw</p>
                                        <p className="text-sm font-medium text-gray-900">{cabinet.powerDraw} kW</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Last OTA</p>
                                        <p className="text-sm font-medium text-gray-900">{cabinet.lastOtaUpdate}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {cabinet.slots.map((slot) => (
                                        <SlotCell key={slot.id} slot={slot} />
                                    ))}
                                </div>

                                {cabinet.status === 'degraded' && (
                                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <p className="text-sm text-amber-800 font-medium">Thermal throttling active</p>
                                        <p className="text-xs text-amber-600 mt-1">Ambient temperature ({cabinet.ambientTemp}&deg;C) exceeds threshold. Charge rates reduced to protect cell lifespan. Cooling system at maximum capacity.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </MainLayout>
    );
}
