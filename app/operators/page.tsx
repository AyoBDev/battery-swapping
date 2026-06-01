'use client';

import { useState } from 'react';
import { Building2, MapPin, Battery, Users, TrendingUp, CheckCircle, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import KPICard from '@/components/ui/KPICard';
import DemoTip from '@/components/ui/DemoTip';
import { formatNaira } from '@/data/mockData';

interface Operator {
    id: string;
    name: string;
    type: 'fleet' | 'franchise' | 'independent';
    logo: string;
    stations: number;
    riders: number;
    batteries: number;
    swapsToday: number;
    swapsMonth: number;
    revenueMonth: number;
    revenueGrowth: number;
    slaCompliance: number;
    avgSwapTime: number;
    joinedDate: string;
    status: 'active' | 'onboarding' | 'suspended';
    region: string;
    plan: 'starter' | 'growth' | 'enterprise';
}

const operators: Operator[] = [
    {
        id: 'OP-001',
        name: 'MaxGo Logistics',
        type: 'fleet',
        logo: 'MG',
        stations: 3,
        riders: 89,
        batteries: 120,
        swapsToday: 687,
        swapsMonth: 18540,
        revenueMonth: 9270000,
        revenueGrowth: 24,
        slaCompliance: 98.2,
        avgSwapTime: 8,
        joinedDate: '2025-11-15',
        status: 'active',
        region: 'Lagos Mainland',
        plan: 'enterprise',
    },
    {
        id: 'OP-002',
        name: 'GreenRide Delivery',
        type: 'fleet',
        logo: 'GR',
        stations: 2,
        riders: 67,
        batteries: 85,
        swapsToday: 534,
        swapsMonth: 14420,
        revenueMonth: 7210000,
        revenueGrowth: 18,
        slaCompliance: 96.8,
        avgSwapTime: 9,
        joinedDate: '2025-12-01',
        status: 'active',
        region: 'Lagos Island',
        plan: 'growth',
    },
    {
        id: 'OP-003',
        name: 'QuickDash',
        type: 'franchise',
        logo: 'QD',
        stations: 1,
        riders: 34,
        batteries: 45,
        swapsToday: 412,
        swapsMonth: 11130,
        revenueMonth: 5565000,
        revenueGrowth: 32,
        slaCompliance: 97.5,
        avgSwapTime: 7,
        joinedDate: '2026-01-20',
        status: 'active',
        region: 'Surulere',
        plan: 'growth',
    },
    {
        id: 'OP-004',
        name: 'EcoFleet',
        type: 'independent',
        logo: 'EF',
        stations: 1,
        riders: 21,
        batteries: 30,
        swapsToday: 214,
        swapsMonth: 5780,
        revenueMonth: 2890000,
        revenueGrowth: 45,
        slaCompliance: 94.1,
        avgSwapTime: 11,
        joinedDate: '2026-03-10',
        status: 'active',
        region: 'Ikeja',
        plan: 'starter',
    },
    {
        id: 'OP-005',
        name: 'ZoomRiders',
        type: 'fleet',
        logo: 'ZR',
        stations: 0,
        riders: 0,
        batteries: 0,
        swapsToday: 0,
        swapsMonth: 0,
        revenueMonth: 0,
        revenueGrowth: 0,
        slaCompliance: 0,
        avgSwapTime: 0,
        joinedDate: '2026-05-28',
        status: 'onboarding',
        region: 'Lekki',
        plan: 'enterprise',
    },
];

const platformStats = {
    totalOperators: 5,
    activeOperators: 4,
    totalRiders: 211,
    totalStations: 7,
    platformRevenue: 24935000,
    platformGrowth: 22,
    avgSlaCompliance: 96.7,
    newOperatorsMonth: 1,
};

function OperatorCard({ operator }: { operator: Operator }) {
    const typeLabel = { fleet: 'Fleet Operator', franchise: 'Franchise', independent: 'Independent' }[operator.type];
    const planColors = {
        starter: 'bg-gray-100 text-gray-700',
        growth: 'bg-blue-100 text-blue-700',
        enterprise: 'bg-purple-100 text-purple-700',
    }[operator.plan];

    return (
        <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 ${operator.status === 'onboarding' ? 'opacity-75' : ''}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1C3D2D] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {operator.logo}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{operator.name}</h3>
                        <p className="text-xs text-gray-500">{typeLabel} &middot; {operator.region}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${planColors}`}>
                        {operator.plan}
                    </span>
                    {operator.status === 'active' ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                            <CheckCircle className="w-3 h-3" /> Active
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-[10px] text-amber-600 font-medium">
                            <Clock className="w-3 h-3" /> Onboarding
                        </span>
                    )}
                </div>
            </div>

            {operator.status === 'active' ? (
                <>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400">Stations</p>
                            <p className="text-lg font-bold text-gray-900">{operator.stations}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400">Riders</p>
                            <p className="text-lg font-bold text-gray-900">{operator.riders}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400">Batteries</p>
                            <p className="text-lg font-bold text-gray-900">{operator.batteries}</p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Monthly Revenue</span>
                            <span className="text-sm font-bold text-gray-900">{formatNaira(operator.revenueMonth)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Growth</span>
                            <span className="text-sm font-medium text-emerald-600 flex items-center gap-0.5">
                                <TrendingUp className="w-3 h-3" /> +{operator.revenueGrowth}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">SLA Compliance</span>
                            <span className={`text-sm font-medium ${operator.slaCompliance >= 97 ? 'text-emerald-600' : operator.slaCompliance >= 95 ? 'text-amber-600' : 'text-red-600'}`}>
                                {operator.slaCompliance}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Avg Swap Time</span>
                            <span className="text-sm font-medium text-gray-900">{operator.avgSwapTime}s</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Swaps Today</span>
                            <span className="text-sm font-bold text-gray-900">{operator.swapsToday.toLocaleString()}</span>
                        </div>
                    </div>
                </>
            ) : (
                <div className="py-6 text-center">
                    <p className="text-sm text-gray-500">Setting up infrastructure</p>
                    <p className="text-xs text-gray-400 mt-1">Joined {operator.joinedDate}</p>
                    <div className="mt-4 flex items-center gap-2 justify-center">
                        <div className="h-1.5 flex-1 max-w-32 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full w-1/3 bg-amber-400 rounded-full" />
                        </div>
                        <span className="text-[10px] text-gray-400">33%</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function OperatorsPage() {
    const [filter, setFilter] = useState<'all' | 'fleet' | 'franchise' | 'independent'>('all');

    const filteredOperators = filter === 'all'
        ? operators
        : operators.filter(op => op.type === filter);

    return (
        <MainLayout>
            <DemoTip message="SwapOS is multi-tenant by design. Each operator sees only their own data, but the platform owner sees everything. This is the open-platform moat vs vertically-integrated competitors." />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Operator Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Multi-tenant network: operators, franchises, and fleet partners</p>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <div>
                        <p className="text-sm font-bold text-purple-700">{platformStats.activeOperators} Active Partners</p>
                        <p className="text-xs text-purple-600">+{platformStats.newOperatorsMonth} onboarding</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KPICard
                    icon={<Building2 className="w-5 h-5" />}
                    value={platformStats.totalOperators}
                    label="Total Operators"
                    trend={`+${platformStats.newOperatorsMonth} this month`}
                    trendDirection="up"
                    status="good"
                />
                <KPICard
                    icon={<Users className="w-5 h-5" />}
                    value={platformStats.totalRiders}
                    label="Total Riders"
                    subtitle="Across all operators"
                    status="good"
                />
                <KPICard
                    icon={<DollarSign className="w-5 h-5" />}
                    value={formatNaira(platformStats.platformRevenue)}
                    label="Platform Revenue (MTD)"
                    trend={`+${platformStats.platformGrowth}%`}
                    trendDirection="up"
                    status="good"
                />
                <KPICard
                    icon={<CheckCircle className="w-5 h-5" />}
                    value={`${platformStats.avgSlaCompliance}%`}
                    label="Avg SLA Compliance"
                    subtitle="Target: 97%"
                    status={platformStats.avgSlaCompliance >= 97 ? 'good' : 'warning'}
                />
            </div>

            <div className="flex items-center gap-2 mb-6">
                {(['all', 'fleet', 'franchise', 'independent'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            filter === type
                                ? 'bg-[#1C3D2D] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredOperators.map((operator) => (
                    <OperatorCard key={operator.id} operator={operator} />
                ))}
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Operator Comparison</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-xs font-medium text-gray-500 pb-3">Operator</th>
                                <th className="text-right text-xs font-medium text-gray-500 pb-3">Swaps/Month</th>
                                <th className="text-right text-xs font-medium text-gray-500 pb-3">Revenue</th>
                                <th className="text-right text-xs font-medium text-gray-500 pb-3">SLA</th>
                                <th className="text-right text-xs font-medium text-gray-500 pb-3">Swap Time</th>
                                <th className="text-right text-xs font-medium text-gray-500 pb-3">Growth</th>
                            </tr>
                        </thead>
                        <tbody>
                            {operators.filter(op => op.status === 'active').map((op) => (
                                <tr key={op.id} className="border-b border-gray-50">
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-[#1C3D2D] rounded flex items-center justify-center text-white text-[10px] font-bold">
                                                {op.logo}
                                            </div>
                                            <span className="font-medium text-gray-900">{op.name}</span>
                                        </div>
                                    </td>
                                    <td className="text-right text-gray-900">{op.swapsMonth.toLocaleString()}</td>
                                    <td className="text-right text-gray-900">{formatNaira(op.revenueMonth)}</td>
                                    <td className="text-right">
                                        <span className={`${op.slaCompliance >= 97 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {op.slaCompliance}%
                                        </span>
                                    </td>
                                    <td className="text-right text-gray-900">{op.avgSwapTime}s</td>
                                    <td className="text-right text-emerald-600 font-medium">+{op.revenueGrowth}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}
