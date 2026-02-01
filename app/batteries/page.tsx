'use client';

import MainLayout from '@/components/layout/MainLayout';
import KPICard from '@/components/ui/KPICard';
import DemoTip from '@/components/ui/DemoTip';
import BatteryHealthScatterPlot from '@/components/charts/BatteryHealthScatterPlot';
import {
    batteryFleet,
    batteryFleetSummary,
    aiReplacementForecast,
    batteryLifecycleStats,
    formatNaira,
} from '@/data/mockData';

export default function BatteriesPage() {
    const needsAttention = batteryFleet.filter(b => b.status === 'replace' || b.status === 'anomaly');

    return (
        <MainLayout>
            {/* Demo Tip */}
            <DemoTip message="The scatter plot shows every battery. Click the red or purple dots to show AI catching problems early. This is the key demo for battery manufacturers." />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Battery Health &amp; Lifecycle</h1>
                    <p className="text-sm text-gray-500 mt-1">AI-monitored battery fleet with predictive maintenance</p>
                </div>
                <button className="btn btn-secondary">Export Data</button>
            </div>

            {/* Fleet Health KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KPICard
                    icon="🔋"
                    value={batteryFleetSummary.total}
                    label="Total Batteries"
                    status="good"
                />
                <KPICard
                    icon="✅"
                    value={`${batteryFleetSummary.healthy}`}
                    label="Healthy Batteries"
                    subtitle={`${batteryFleetSummary.healthyPercent}% of fleet`}
                    status="good"
                />
                <KPICard
                    icon="⚠️"
                    value={batteryFleetSummary.watch + batteryFleetSummary.replace}
                    label="Need Attention"
                    subtitle={`${batteryFleetSummary.watch} watch, ${batteryFleetSummary.replace} replace`}
                    status={batteryFleetSummary.replace > 5 ? 'warning' : 'good'}
                />
                <KPICard
                    icon="🤖"
                    value={batteryFleetSummary.anomaly}
                    label="AI Anomalies Detected"
                    subtitle="Unexpected degradation"
                    status={batteryFleetSummary.anomaly > 0 ? 'warning' : 'good'}
                />
            </div>

            {/* Battery Health Scatter Plot */}
            <div className="mb-6">
                <BatteryHealthScatterPlot />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Batteries Needing Attention Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Batteries Needing Attention</h3>
                    </div>
                    <div className="overflow-x-auto max-h-80">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-gray-50">
                                <tr className="border-b border-gray-100">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Health</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Issue</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Predicted</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {needsAttention.map((battery) => (
                                    <tr key={battery.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-gray-900">{battery.id}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${battery.health > 70 ? 'bg-green-500' :
                                                            battery.health > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${battery.health}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600">{battery.health}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs text-gray-600">{battery.issue || '—'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs text-gray-600">
                                                ~{battery.predictedRemainingLife.weeks} weeks
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {battery.status === 'replace' || battery.status === 'anomaly' ? (
                                                <button className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200">
                                                    Replace
                                                </button>
                                            ) : (
                                                <button className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200">
                                                    Monitor
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* AI Replacement Forecast */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span>🤖</span>
                        AI Replacement Forecast
                    </h3>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <span className="text-sm text-gray-700">This Month</span>
                            <div className="text-right">
                                <span className="font-bold text-red-600">{aiReplacementForecast.thisMonth.count} batteries</span>
                                <p className="text-xs text-gray-500">{formatNaira(aiReplacementForecast.thisMonth.cost)}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                            <span className="text-sm text-gray-700">Next Month</span>
                            <div className="text-right">
                                <span className="font-bold text-yellow-600">{aiReplacementForecast.nextMonth.count} batteries</span>
                                <p className="text-xs text-gray-500">{formatNaira(aiReplacementForecast.nextMonth.cost)}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm text-gray-700">Month 3</span>
                            <div className="text-right">
                                <span className="font-bold text-blue-600">{aiReplacementForecast.month3.count} batteries</span>
                                <p className="text-xs text-gray-500">{formatNaira(aiReplacementForecast.month3.cost)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Predictive vs Scheduled Comparison */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Predictive vs Scheduled Replacement</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Time-based (every 12 months):</span>
                                <span className="text-gray-900">{aiReplacementForecast.scheduledReplacement} batteries/quarter</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">AI-optimized:</span>
                                <span className="text-green-600 font-bold">{aiReplacementForecast.aiOptimizedReplacement} batteries/quarter</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-green-200">
                                <span className="text-gray-600">Savings:</span>
                                <span className="text-green-700 font-bold">
                                    {aiReplacementForecast.savings.batteries} batteries ({formatNaira(aiReplacementForecast.savings.cost)})
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            AI predicts actual battery life based on usage patterns, avoiding premature replacement of batteries with remaining useful life.
                        </p>
                    </div>
                </div>
            </div>

            {/* Lifecycle Analytics */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">💡</span>
                    <h3 className="font-semibold text-gray-900">Battery Lifecycle Analytics</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Average Lifespan</p>
                        <p className="text-xl font-bold text-gray-900">{batteryLifecycleStats.averageLifespan} cycles</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Top Performer</p>
                        <p className="text-xl font-bold text-green-600">
                            {batteryLifecycleStats.topPerformer.id}
                        </p>
                        <p className="text-xs text-gray-500">
                            {batteryLifecycleStats.topPerformer.cycles} cycles, still {batteryLifecycleStats.topPerformer.health}% health
                        </p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Worst Performer</p>
                        <p className="text-xl font-bold text-red-600">
                            {batteryLifecycleStats.worstPerformer.id}
                        </p>
                        <p className="text-xs text-gray-500">
                            {batteryLifecycleStats.worstPerformer.cycles} cycles, {batteryLifecycleStats.worstPerformer.health}% health
                        </p>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">🤖 AI Insight:</span> &quot;{batteryLifecycleStats.aiInsight}&quot;
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
