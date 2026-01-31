'use client';

import { topStationsToday } from '@/data/mockData';

export default function TopStationsCard() {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span>🏆</span>
                    Top Stations Today
                </h3>
            </div>

            <div className="space-y-3">
                {topStationsToday.map((station) => (
                    <div
                        key={station.rank}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                        <div className="flex items-center gap-3">
                            <span className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${station.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                    station.rank === 2 ? 'bg-gray-100 text-gray-600' :
                                        station.rank === 3 ? 'bg-orange-100 text-orange-700' :
                                            'bg-gray-50 text-gray-500'}
              `}>
                                {station.rank}
                            </span>
                            <span className="text-sm font-medium text-gray-900">{station.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{station.swaps} swaps</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
