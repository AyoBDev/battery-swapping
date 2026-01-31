'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import KPICard from '@/components/ui/KPICard';
import DemoTip from '@/components/ui/DemoTip';
import EnergyForecastChart from '@/components/charts/EnergyForecastChart';
import EnergyFlowDiagram from '@/components/charts/EnergyFlowDiagram';
import { energyStats, stationEnergyStatus, formatNaira } from '@/data/mockData';

export default function EnergyPage() {
    const [stationsCount, setStationsCount] = useState(6);
    const [avgSwapsPerDay, setAvgSwapsPerDay] = useState(200);
    const [gridCost, setGridCost] = useState(150);
    const [solarCapacity, setSolarCapacity] = useState(5);

    // Calculate savings
    const monthlyGeneration = solarCapacity * 30 * 4.5; // kWh (assuming 4.5 hours peak sun)
    const monthlySavings = monthlyGeneration * gridCost;
    const co2Reduction = monthlyGeneration * 0.85; // kg
    const paybackYears = (solarCapacity * 850000) / (monthlySavings * 12); // Assuming ₦850k per kW

    return (
        <MainLayout>
            {/* Demo Tip */}
            <DemoTip message="This forecast is the key demo for solar partners — AI is planning tomorrow's charging schedule based on weather and demand predictions." />

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Energy Management</h1>
                    <p className="text-sm text-gray-500 mt-1">AI-optimized solar energy and grid management</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                    <span className="text-xl">☀️</span>
                    <div>
                        <p className="text-sm font-bold text-green-700">{energyStats.solarSelfSufficiency}% Solar Self-Sufficiency</p>
                        <p className="text-xs text-green-600">AI optimizing in real-time</p>
                    </div>
                </div>
            </div>

            {/* Energy KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KPICard
                    icon="☀️"
                    value={`${energyStats.solarGenerationToday} kWh`}
                    label="Solar Generation Today"
                    trend={energyStats.solarGenerationToday >= energyStats.solarGenerationYesterday ? '↑' : '↓'}
                    trendDirection={energyStats.solarGenerationToday >= energyStats.solarGenerationYesterday ? 'up' : 'down'}
                    subtitle={`vs ${energyStats.solarGenerationYesterday} kWh yesterday`}
                    status="good"
                />
                <KPICard
                    icon="🔌"
                    value={`${energyStats.gridUsageToday} kWh`}
                    label="Grid Usage Today"
                    subtitle={`${Math.round((energyStats.gridUsageToday / energyStats.totalConsumptionToday) * 100)}% of total`}
                    status={energyStats.gridUsageToday > 10 ? 'warning' : 'good'}
                />
                <KPICard
                    icon="🌱"
                    value={`${energyStats.solarSelfSufficiency}%`}
                    label="Solar Self-Sufficiency"
                    subtitle="Target: 85%+"
                    status="good"
                />
                <KPICard
                    icon="💰"
                    value={formatNaira(energyStats.energyCostToday)}
                    label="Energy Cost Today"
                    subtitle={`Petrol equiv: ${formatNaira(energyStats.petrolEquivalentCost)}`}
                    trend={`${formatNaira(energyStats.savingsToday)} saved`}
                    trendDirection="up"
                    status="good"
                />
            </div>

            {/* 24-Hour Forecast Chart */}
            <div className="mb-6">
                <EnergyForecastChart />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Station Energy Status Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Station-by-Station Energy</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Station</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Solar</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Storage</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grid</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">AI Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stationEnergyStatus.map((station, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-gray-900">{station.stationName}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={station.solarOutput > 0 ? 'text-yellow-600 font-medium' : 'text-gray-400'}>
                                                {station.solarOutput > 0 ? `${station.solarOutput}W` : '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${station.storageLevel > 50 ? 'bg-green-500' :
                                                                station.storageLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${station.storageLevel}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600">{station.storageLevel}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={station.gridStatus === 'online' ? 'text-green-600' : 'text-red-600'}>
                                                {station.gridStatus === 'online' ? '✓' : '✗'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-medium px-2 py-1 rounded ${station.aiStatus === 'Charging' ? 'bg-green-100 text-green-700' :
                                                    station.aiStatus === 'Conserving' ? 'bg-yellow-100 text-yellow-700' :
                                                        station.aiStatus === 'Peak Ready' ? 'bg-blue-100 text-blue-700' :
                                                            station.aiStatus === 'Grid Mode' ? 'bg-gray-100 text-gray-700' :
                                                                station.aiStatus === 'Full Capacity' ? 'bg-purple-100 text-purple-700' :
                                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {station.aiStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Energy Savings Calculator */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">💰 Energy Savings Calculator</h3>
                    <p className="text-sm text-gray-500 mb-4">Estimate your ROI with SwapOS solar optimization</p>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Stations</label>
                            <input
                                type="number"
                                value={stationsCount}
                                onChange={(e) => setStationsCount(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Avg Swaps per Day (total)</label>
                            <input
                                type="number"
                                value={avgSwapsPerDay}
                                onChange={(e) => setAvgSwapsPerDay(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Grid Cost (₦/kWh)</label>
                            <input
                                type="number"
                                value={gridCost}
                                onChange={(e) => setGridCost(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Solar Capacity (kW per station)</label>
                            <input
                                type="number"
                                value={solarCapacity}
                                onChange={(e) => setSolarCapacity(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Monthly Solar Generation</span>
                            <span className="font-bold text-gray-900">{(monthlyGeneration * stationsCount).toLocaleString()} kWh</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Monthly Grid Savings</span>
                            <span className="font-bold text-green-600">{formatNaira(monthlySavings * stationsCount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">CO2 Reduction</span>
                            <span className="font-bold text-gray-900">{(co2Reduction * stationsCount).toFixed(0)} kg/month</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-green-200">
                            <span className="text-sm text-gray-600">Estimated Payback Period</span>
                            <span className="font-bold text-green-700">{paybackYears.toFixed(1)} years</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sample Energy Flow Diagram */}
            <EnergyFlowDiagram
                solarOutput={1240}
                storageLevel={82}
                storageCapacity={10}
                consumption={340}
                gridStatus="offline"
                currentSource="solar"
                aiOptimizationText="AI is currently prioritizing charging in slots 3, 5, and 7. These batteries are predicted to be needed during evening rush (5-7 PM). Slots 1 and 2 are full and reserved. Charging paused on slots 8-10 to conserve storage for overnight."
            />
        </MainLayout>
    );
}
