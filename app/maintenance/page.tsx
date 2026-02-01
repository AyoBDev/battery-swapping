'use client';

import MainLayout from '@/components/layout/MainLayout';
import KPICard from '@/components/ui/KPICard';
import AIAlertCard from '@/components/ui/AIAlertCard';
import DemoTip from '@/components/ui/DemoTip';
import {
    aiAlerts,
    maintenanceStats,
    maintenanceSchedule,
    preventedFailures,
    maintenanceSavings,
    formatNaira
} from '@/data/mockData';

export default function MaintenancePage() {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const getTaskTypeIcon = (type: string) => {
        switch (type) {
            case 'battery_replacement': return '🔋';
            case 'station_inspection': return '🔍';
            case 'module_replacement': return '🔧';
            case 'software_update': return '💻';
            default: return '📋';
        }
    };

    const getTaskTypeName = (type: string) => {
        switch (type) {
            case 'battery_replacement': return 'Battery Replacement';
            case 'station_inspection': return 'Station Inspection';
            case 'module_replacement': return 'Module Replacement';
            case 'software_update': return 'Software Update';
            default: return type;
        }
    };

    return (
        <MainLayout>
            {/* Demo Tip */}
            <DemoTip message="14 failures prevented — this is the ROI story. AI catches problems before they cost you money." />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Predictive Maintenance</h1>
                    <p className="text-sm text-gray-500 mt-1">AI-detected issues and scheduled maintenance</p>
                </div>
                <button className="btn btn-primary">+ Schedule Task</button>
            </div>

            {/* Maintenance KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KPICard
                    icon="⚠️"
                    value={maintenanceStats.openAlerts}
                    label="Open Alerts"
                    subtitle={`${aiAlerts.filter(a => a.type === 'critical').length} critical`}
                    status={aiAlerts.filter(a => a.type === 'critical').length > 0 ? 'warning' : 'good'}
                />
                <KPICard
                    icon="📅"
                    value={maintenanceStats.scheduledThisWeek}
                    label="Scheduled This Week"
                    status="good"
                />
                <KPICard
                    icon="🛡️"
                    value={maintenanceStats.preventedFailures}
                    label="Failures Prevented"
                    subtitle="This month"
                    status="good"
                />
                <KPICard
                    icon="💰"
                    value={formatNaira(maintenanceStats.maintenanceCostsMTD)}
                    label="Maintenance Costs MTD"
                    subtitle={`Budget: ${formatNaira(maintenanceStats.budget)}`}
                    status={maintenanceStats.maintenanceCostsMTD < maintenanceStats.budget ? 'good' : 'warning'}
                />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* AI-Detected Issues */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span>🤖</span>
                            AI-Detected Issues
                        </h3>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                            {aiAlerts.length} Active
                        </span>
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {aiAlerts.map((alert) => (
                            <AIAlertCard
                                key={alert.id}
                                type={alert.type}
                                asset={alert.asset}
                                title={alert.title}
                                issue={alert.issue}
                                evidence={alert.evidence}
                                risk={alert.risk}
                                recommendation={alert.recommendation}
                                timeline={alert.timeline}
                                timestamp={alert.timestamp}
                                actionLabel={alert.actionLabel}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Maintenance Schedule */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">📅 Maintenance Schedule</h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {maintenanceSchedule.slice(0, 5).map((task) => (
                                <div key={task.id} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                                            {getTaskTypeIcon(task.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h4 className="font-medium text-gray-900 text-sm truncate">
                                                    {getTaskTypeName(task.type)}
                                                </h4>
                                                <span className="text-xs text-gray-500 flex-shrink-0">
                                                    {formatDate(task.date)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mb-1">{task.description}</p>
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span>📍 {task.location}</span>
                                                <span>⏱️ {task.estimatedDuration}</span>
                                            </div>
                                            {task.partsNeeded && (
                                                <p className="text-xs text-blue-600 mt-1">Parts: {task.partsNeeded}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                                View Full Schedule →
                            </button>
                        </div>
                    </div>

                    {/* Failure Prevention Stats */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span>🛡️</span>
                            Failure Prevention Rate
                        </h3>
                        <div className="text-center mb-4">
                            <p className="text-4xl font-bold text-green-600">{maintenanceStats.preventedFailures}</p>
                            <p className="text-sm text-gray-600">failures prevented this month</p>
                        </div>
                        <div className="space-y-2">
                            {preventedFailures.map((item, i) => (
                                <div key={i} className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
                                    <span className="text-sm text-gray-700">{item.type}</span>
                                    <span className="font-bold text-green-600">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cost Savings */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span>💰</span>
                            Cost Savings from AI
                        </h3>
                        <div className="text-center mb-4">
                            <p className="text-3xl font-bold text-purple-600">{formatNaira(maintenanceSavings.total)}</p>
                            <p className="text-sm text-gray-600">estimated savings this month</p>
                        </div>
                        <div className="space-y-2">
                            {maintenanceSavings.breakdown.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{item.category}</span>
                                    <span className="font-medium text-gray-900">{formatNaira(item.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
