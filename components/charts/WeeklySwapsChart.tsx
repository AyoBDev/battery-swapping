'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { weeklySwaps, formatNaira } from '@/data/mockData';

export default function WeeklySwapsChart() {
    const totalSwaps = weeklySwaps.reduce((sum, day) => sum + day.swaps, 0);
    const totalRevenue = weeklySwaps.reduce((sum, day) => sum + day.revenue, 0);

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span>📊</span>
                    Swaps This Week
                </h3>
            </div>

            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklySwaps} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                            formatter={(value: number | undefined) => [(value ?? 0).toLocaleString(), 'Swaps']}
                        />
                        <Bar
                            dataKey="swaps"
                            fill="#10B981"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-500">Total Swaps</p>
                    <p className="text-lg font-semibold text-gray-900">{totalSwaps.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNaira(totalRevenue)}</p>
                </div>
            </div>
        </div>
    );
}
