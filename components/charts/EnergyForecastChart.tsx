'use client';

import { ComposedChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { energyForecast24h, energyForecastSummary } from '@/data/mockData';

export default function EnergyForecastChart() {
    const nowIndex = 0; // Current hour is index 0 in our forecast

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <span>🤖</span>
                        AI Energy Forecast — Next 24 Hours
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Solar generation, demand, and charging predictions</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        {energyForecastSummary.solarAvailability}% Solar Availability
                    </span>
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={energyForecast24h}
                        margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="hour"
                            tick={{ fontSize: 10, fill: '#6B7280' }}
                            tickLine={false}
                            axisLine={{ stroke: '#E5E7EB' }}
                            interval={2}
                        />
                        <YAxis
                            yAxisId="left"
                            tick={{ fontSize: 10, fill: '#6B7280' }}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'Watts / Demand', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#9CA3AF' }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 10, fill: '#6B7280' }}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                            label={{ value: 'Storage %', angle: 90, position: 'insideRight', fontSize: 10, fill: '#9CA3AF' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                fontSize: '12px'
                            }}
                            formatter={(value: number | undefined, name: string | undefined) => {
                                if (value === undefined || name === undefined) return ['', ''];
                                const labels: Record<string, string> = {
                                    solarPrediction: '☀️ Solar Generation',
                                    demandPrediction: '📈 Predicted Demand',
                                    chargingPlan: '🔋 Charging Plan',
                                    storageLevel: '🔋 Storage Level'
                                };
                                const unit = name === 'storageLevel' ? '%' : 'W';
                                return [`${Math.round(value)}${unit}`, labels[name] || name];
                            }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: '11px' }}
                            formatter={(value) => {
                                const labels: Record<string, string> = {
                                    solarPrediction: '☀️ Solar',
                                    demandPrediction: '📈 Demand',
                                    chargingPlan: '🔋 Charging',
                                    storageLevel: '🔋 Storage %'
                                };
                                return labels[value] || value;
                            }}
                        />
                        <ReferenceLine x={energyForecast24h[nowIndex]?.hour} stroke="#8B5CF6" strokeDasharray="5 5" label={{ value: 'Now', fontSize: 10, fill: '#8B5CF6' }} />

                        {/* Solar Generation - Yellow Area */}
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="solarPrediction"
                            stroke="#F59E0B"
                            fill="#FEF3C7"
                            fillOpacity={0.8}
                            strokeWidth={2}
                        />

                        {/* Demand - Blue Line */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="demandPrediction"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={false}
                        />

                        {/* Charging Plan - Green Bars */}
                        <Bar
                            yAxisId="left"
                            dataKey="chargingPlan"
                            fill="#10B981"
                            fillOpacity={0.6}
                            radius={[2, 2, 0, 0]}
                        />

                        {/* Storage Level - Orange Line */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="storageLevel"
                            stroke="#F97316"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* AI Insight Box */}
            <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold text-purple-700">🤖 Forecast Summary:</span>{' '}
                    Tomorrow will have {energyForecastSummary.solarAvailability}% solar availability with {energyForecastSummary.cloudCover}.
                    Morning rush demand expected at {energyForecastSummary.morningRushDemand} swaps ({energyForecastSummary.rushAboveAverage}% above average — Monday effect).
                    AI has scheduled aggressive charging {energyForecastSummary.chargingWindow} to build reserves.
                    Evening rush should be fully served from stored solar.
                    {energyForecastSummary.gridBackupNeeded ? 'Grid backup may be needed.' : 'Grid backup unlikely to be needed.'}
                </p>
            </div>

            {/* Scenario Cards */}
            <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                    <p className="text-xs font-medium text-green-700 mb-1">Best Case</p>
                    <p className="text-sm text-gray-700">{energyForecastSummary.bestCase}</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                    <p className="text-xs font-medium text-blue-700 mb-1">Expected</p>
                    <p className="text-sm text-gray-700">{energyForecastSummary.expected}</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
                    <p className="text-xs font-medium text-yellow-700 mb-1">Worst Case</p>
                    <p className="text-sm text-gray-700">{energyForecastSummary.worstCase}</p>
                </div>
            </div>
        </div>
    );
}
