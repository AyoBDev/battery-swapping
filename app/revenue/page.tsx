'use client';

import { DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight, CreditCard, Repeat } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import KPICard from '@/components/ui/KPICard';
import DemoTip from '@/components/ui/DemoTip';
import { formatNaira } from '@/data/mockData';

const revenueStats = {
    totalRevenueToday: 923500,
    totalRevenueWeek: 6420000,
    totalRevenueMonth: 27850000,
    revenueGrowth: 18.4,
    avgRevenuePerSwap: 500,
    swapsToday: 1847,
    activeSubscribers: 214,
    subscriberGrowth: 12,
    arpu: 42000,
    churnRate: 3.2,
    energyCostPerSwap: 85,
    grossMarginPerSwap: 415,
    grossMarginPercent: 83,
};

const revenueBreakdown = [
    { source: 'Pay-per-swap', amount: 553500, percent: 60, swaps: 1107 },
    { source: 'Daily subscription', amount: 231000, percent: 25, swaps: 462 },
    { source: 'Weekly subscription', amount: 92400, percent: 10, swaps: 185 },
    { source: 'Monthly subscription', amount: 46600, percent: 5, swaps: 93 },
];

const operatorSplits = [
    { operator: 'MaxGo Logistics', stations: 3, swapsToday: 687, revenue: 343500, split: 70, payout: 240450 },
    { operator: 'GreenRide Delivery', stations: 2, swapsToday: 534, revenue: 267000, split: 65, payout: 173550 },
    { operator: 'QuickDash', stations: 1, swapsToday: 412, revenue: 206000, split: 75, payout: 154500 },
    { operator: 'EcoFleet', stations: 1, swapsToday: 214, revenue: 107000, split: 70, payout: 74900 },
];

const weeklyRevenue = [
    { day: 'Mon', revenue: 827000, cost: 142000 },
    { day: 'Tue', revenue: 911500, cost: 148000 },
    { day: 'Wed', revenue: 993500, cost: 156000 },
    { day: 'Thu', revenue: 878000, cost: 139000 },
    { day: 'Fri', revenue: 1067000, cost: 167000 },
    { day: 'Sat', revenue: 1122500, cost: 172000 },
    { day: 'Sun', revenue: 624000, cost: 98000 },
];

const subscriptionTiers = [
    { name: 'Pay-per-swap', price: 500, riders: 0, description: 'No commitment' },
    { name: 'Daily Pass', price: 1500, riders: 89, description: 'Unlimited swaps/day' },
    { name: 'Weekly Pass', price: 7500, riders: 72, description: 'Up to 4 swaps/day' },
    { name: 'Monthly BaaS', price: 25000, riders: 53, description: 'Battery-as-a-Service' },
];

const maxRevenue = Math.max(...weeklyRevenue.map(d => d.revenue));

export default function RevenuePage() {
    return (
        <MainLayout>
            <DemoTip message="This proves the BaaS economics. Show investors: ₦500 per swap, 83% gross margin, and the subscription model that turns capex into predictable opex for fleet operators." />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Revenue & Billing</h1>
                    <p className="text-sm text-gray-500 mt-1">BaaS economics, operator splits, and subscription performance</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <div>
                        <p className="text-sm font-bold text-emerald-700">+{revenueStats.revenueGrowth}% MoM</p>
                        <p className="text-xs text-emerald-600">Revenue growing</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KPICard
                    icon={<DollarSign className="w-5 h-5" />}
                    value={formatNaira(revenueStats.totalRevenueMonth)}
                    label="Monthly Revenue"
                    trend={`+${revenueStats.revenueGrowth}%`}
                    trendDirection="up"
                    status="good"
                />
                <KPICard
                    icon={<Repeat className="w-5 h-5" />}
                    value={formatNaira(revenueStats.avgRevenuePerSwap)}
                    label="Revenue per Swap"
                    subtitle={`${formatNaira(revenueStats.energyCostPerSwap)} energy cost`}
                    status="good"
                />
                <KPICard
                    icon={<Users className="w-5 h-5" />}
                    value={revenueStats.activeSubscribers}
                    label="Active Subscribers"
                    trend={`+${revenueStats.subscriberGrowth} this week`}
                    trendDirection="up"
                    status="good"
                />
                <KPICard
                    icon={<CreditCard className="w-5 h-5" />}
                    value={`${revenueStats.grossMarginPercent}%`}
                    label="Gross Margin"
                    subtitle={`${formatNaira(revenueStats.grossMarginPerSwap)}/swap`}
                    status="good"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Weekly Revenue vs Energy Cost</h3>
                    <div className="space-y-3">
                        {weeklyRevenue.map((day) => (
                            <div key={day.day} className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 w-8">{day.day}</span>
                                <div className="flex-1 flex items-center gap-1">
                                    <div
                                        className="h-6 bg-emerald-500 rounded-l"
                                        style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                                    />
                                    <div
                                        className="h-6 bg-red-300 rounded-r"
                                        style={{ width: `${(day.cost / maxRevenue) * 100}%` }}
                                    />
                                </div>
                                <div className="text-right w-24">
                                    <p className="text-xs font-medium text-gray-900">{formatNaira(day.revenue)}</p>
                                    <p className="text-[10px] text-red-500">-{formatNaira(day.cost)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="w-3 h-3 bg-emerald-500 rounded" /> Swap Revenue
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="w-3 h-3 bg-red-300 rounded" /> Energy Cost
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                    <div className="space-y-4">
                        {revenueBreakdown.map((item) => (
                            <div key={item.source}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-700">{item.source}</span>
                                    <span className="text-sm font-medium text-gray-900">{formatNaira(item.amount)}</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${item.percent}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-0.5">{item.swaps} swaps &middot; {item.percent}%</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Operator Revenue Splits</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-xs font-medium text-gray-500 pb-3">Operator</th>
                                    <th className="text-right text-xs font-medium text-gray-500 pb-3">Revenue</th>
                                    <th className="text-right text-xs font-medium text-gray-500 pb-3">Split</th>
                                    <th className="text-right text-xs font-medium text-gray-500 pb-3">Payout</th>
                                </tr>
                            </thead>
                            <tbody>
                                {operatorSplits.map((op) => (
                                    <tr key={op.operator} className="border-b border-gray-50">
                                        <td className="py-3">
                                            <p className="font-medium text-gray-900">{op.operator}</p>
                                            <p className="text-[10px] text-gray-500">{op.stations} stations &middot; {op.swapsToday} swaps today</p>
                                        </td>
                                        <td className="text-right text-gray-900">{formatNaira(op.revenue)}</td>
                                        <td className="text-right">
                                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{op.split}%</span>
                                        </td>
                                        <td className="text-right font-medium text-emerald-700">{formatNaira(op.payout)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Subscription Tiers</h3>
                    <div className="space-y-3">
                        {subscriptionTiers.map((tier) => (
                            <div key={tier.name} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-emerald-200 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{tier.name}</p>
                                    <p className="text-xs text-gray-500">{tier.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">{formatNaira(tier.price)}</p>
                                    {tier.riders > 0 && (
                                        <p className="text-[10px] text-emerald-600 flex items-center justify-end gap-0.5">
                                            <ArrowUpRight className="w-3 h-3" />
                                            {tier.riders} riders
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500">Monthly ARPU</span>
                            <span className="text-sm font-bold text-gray-900">{formatNaira(revenueStats.arpu)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Churn Rate</span>
                            <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                {revenueStats.churnRate}%
                                <ArrowDownRight className="w-3 h-3 text-emerald-500" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
