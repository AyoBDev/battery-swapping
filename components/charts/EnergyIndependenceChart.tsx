'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { weeklyEnergyData, energyStats } from '@/data/mockData';

export default function EnergyIndependenceChart() {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900">Energy Independence This Week</h3>
                    <p className="text-sm text-gray-500 mt-1">Solar vs Grid vs Storage usage</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                    <span className="text-lg">☀️</span>
                    <span className="text-sm font-bold text-green-700">{energyStats.solarSelfSufficiency}% Solar</span>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={weeklyEnergyData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="day"
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            tickLine={false}
                            axisLine={{ stroke: '#E5E7EB' }}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            tickLine={false}
                            axisLine={false}
                            unit=" kWh"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            formatter={(value: number, name: string) => [
                                `${value.toFixed(1)} kWh`,
                                name === 'solar' ? '☀️ Solar' : name === 'grid' ? '🔌 Grid' : '🔋 Storage'
                            ]}
                        />
                        <Legend
                            formatter={(value) => (
                                value === 'solar' ? '☀️ Solar' : value === 'grid' ? '🔌 Grid' : '🔋 Storage'
                            )}
                        />
                        <Area
                            type="monotone"
                            dataKey="solar"
                            stackId="1"
                            stroke="#10B981"
                            fill="#10B981"
                            fillOpacity={0.6}
                        />
                        <Area
                            type="monotone"
                            dataKey="storage"
                            stackId="1"
                            stroke="#F59E0B"
                            fill="#F59E0B"
                            fillOpacity={0.6}
                        />
                        <Area
                            type="monotone"
                            dataKey="grid"
                            stackId="1"
                            stroke="#6B7280"
                            fill="#6B7280"
                            fillOpacity={0.6}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                    <p className="text-xl font-bold text-green-600">{energyStats.solarGenerationToday} kWh</p>
                    <p className="text-xs text-gray-500">Solar Today</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-gray-600">{energyStats.gridUsageToday} kWh</p>
                    <p className="text-xs text-gray-500">Grid Today</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-green-700">₦{(energyStats.savingsToday / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-gray-500">Saved vs Petrol</p>
                </div>
            </div>
        </div>
    );
}
