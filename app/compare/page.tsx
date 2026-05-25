'use client';

import { ArrowRight, X, Check, AlertTriangle, Clock, DollarSign, Battery, MapPin } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

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

export default function ComparePage() {
    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Before & After SwapOS
                    </h1>
                    <p className="text-gray-500 mt-2 max-w-xl mx-auto">
                        How battery swapping operations transform with an intelligent operating system
                    </p>
                </div>

                {/* Side-by-side comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Before */}
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

                    {/* After */}
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

                {/* Metrics comparison table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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

                {/* CTA */}
                <div className="mt-8 text-center">
                    <a
                        href="/partner"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Become a Partner
                        <ArrowRight className="w-4 h-4" />
                    </a>
                    <p className="text-xs text-gray-500 mt-2">See SwapOS with your brand in 60 seconds</p>
                </div>
            </div>
        </MainLayout>
    );
}
