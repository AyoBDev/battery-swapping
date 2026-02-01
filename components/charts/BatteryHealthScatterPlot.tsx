'use client';

import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, Cell } from 'recharts';
import { batteryFleet, batteryFleetSummary, BatteryFleet } from '@/data/mockData';

interface BatteryHealthScatterPlotProps {
    onBatteryClick?: (battery: BatteryFleet) => void;
}

export default function BatteryHealthScatterPlot({ onBatteryClick }: BatteryHealthScatterPlotProps) {
    const [filter, setFilter] = useState<'all' | 'healthy' | 'watch' | 'replace' | 'anomaly'>('all');

    const filteredData = filter === 'all'
        ? batteryFleet
        : batteryFleet.filter(b => b.status === filter);

    const getColor = (status: string) => {
        switch (status) {
            case 'healthy': return '#10B981';
            case 'watch': return '#F59E0B';
            case 'replace': return '#EF4444';
            case 'anomaly': return '#8B5CF6';
            default: return '#6B7280';
        }
    };

    // Expected degradation curve points (rough linear approximation)
    const expectedCurve = [
        { cycles: 0, health: 100 },
        { cycles: 300, health: 92 },
        { cycles: 600, health: 82 },
        { cycles: 900, health: 70 },
        { cycles: 1200, health: 55 },
        { cycles: 1500, health: 40 },
    ];

    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: BatteryFleet }> }) => {
        if (active && payload && payload.length) {
            const battery = payload[0].payload;
            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
                    <p className="font-bold text-gray-900">{battery.id}</p>
                    <div className="mt-1 space-y-1">
                        <p className="text-gray-600">Health: <span className="font-medium">{battery.health}%</span></p>
                        <p className="text-gray-600">Cycles: <span className="font-medium">{battery.cycles.toLocaleString()}</span></p>
                        <p className="text-gray-600">Status: <span className={`font-medium capitalize ${battery.status === 'healthy' ? 'text-green-600' :
                            battery.status === 'watch' ? 'text-yellow-600' :
                                battery.status === 'replace' ? 'text-red-600' : 'text-purple-600'
                            }`}>{battery.status}</span></p>
                        {battery.issue && (
                            <p className="text-gray-600">Issue: <span className="font-medium text-red-600">{battery.issue}</span></p>
                        )}
                        <p className="text-gray-600">Location: <span className="font-medium">{battery.currentLocation}</span></p>
                        <p className="text-gray-600">Predicted Life: <span className="font-medium">{battery.predictedRemainingLife.weeks} weeks</span></p>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">Click for details →</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <span>🤖</span>
                        Battery Fleet Health — AI Monitored
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Each dot represents one battery. Click to view details.</p>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 mb-4">
                {(['all', 'healthy', 'watch', 'replace', 'anomaly'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === f
                            ? f === 'healthy' ? 'bg-green-600 text-white' :
                                f === 'watch' ? 'bg-yellow-500 text-white' :
                                    f === 'replace' ? 'bg-red-600 text-white' :
                                        f === 'anomaly' ? 'bg-purple-600 text-white' :
                                            'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {f === 'all' ? `All (${batteryFleet.length})` :
                            f === 'healthy' ? `Healthy (${batteryFleetSummary.healthy})` :
                                f === 'watch' ? `Watch (${batteryFleetSummary.watch})` :
                                    f === 'replace' ? `Replace (${batteryFleetSummary.replace})` :
                                        `Anomalies (${batteryFleetSummary.anomaly})`}
                    </button>
                ))}
            </div>

            {/* Scatter Plot */}
            <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            type="number"
                            dataKey="cycles"
                            name="Cycles"
                            domain={[0, 1600]}
                            tick={{ fontSize: 11, fill: '#6B7280' }}
                            tickLine={false}
                            axisLine={{ stroke: '#E5E7EB' }}
                            label={{ value: 'Charge Cycles', position: 'bottom', offset: -5, fontSize: 11, fill: '#9CA3AF' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="health"
                            name="Health"
                            domain={[0, 100]}
                            tick={{ fontSize: 11, fill: '#6B7280' }}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'Health %', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#9CA3AF' }}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {/* Expected degradation reference line */}
                        <Scatter
                            data={expectedCurve.map(p => ({ x: p.cycles, y: p.health }))}
                            line={{ stroke: '#D1D5DB', strokeWidth: 4, strokeOpacity: 0.6 }}
                            shape={() => null}
                            isAnimationActive={false}
                        />

                        {/* Battery scatter points */}
                        <Scatter
                            data={filteredData}
                            onClick={(data) => onBatteryClick?.(data.payload)}
                            cursor="pointer"
                        >
                            {filteredData.map((battery, index) => (
                                <Cell
                                    key={index}
                                    fill={getColor(battery.status)}
                                    stroke={battery.status === 'anomaly' ? '#8B5CF6' : 'transparent'}
                                    strokeWidth={battery.status === 'anomaly' ? 2 : 0}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-600">Healthy</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-xs text-gray-600">Watch</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs text-gray-600">Replace</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500 ring-2 ring-purple-300" />
                    <span className="text-xs text-gray-600">Anomaly</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-2 rounded bg-gray-300" />
                    <span className="text-xs text-gray-600">Expected Curve</span>
                </div>
            </div>

            {/* Key Insight */}
            <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold text-purple-700">🤖 Fleet Health Summary:</span>{' '}
                    {batteryFleetSummary.healthyPercent}% of batteries are degrading normally.
                    {batteryFleetSummary.replace} batteries flagged for replacement within 30 days.
                    {batteryFleetSummary.anomaly} batteries showing anomalous degradation — Station 3 charging system under investigation.
                    Average battery lifespan: {batteryFleetSummary.avgLifespan} cycles.
                    Top performer: {batteryFleetSummary.topPerformer.id} at {batteryFleetSummary.topPerformer.cycles} cycles with {batteryFleetSummary.topPerformer.health}% health.
                </p>
            </div>
        </div>
    );
}
