'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import InventoryBar from '@/components/ui/InventoryBar';
import DemoTip from '@/components/ui/DemoTip';
import { stations, formatNaira, Station, hourlyPattern } from '@/data/mockData';

export default function StationsPage() {
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);

    return (
        <MainLayout>
            {/* Demo Tip */}
            <DemoTip message="Your station hardware customers can monitor ALL their locations from one dashboard. Remote management included." />
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Station Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor and manage swap stations</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary">Map View</button>
                    <button className="btn btn-primary">+ Add Station</button>
                </div>
            </div>

            {/* Station Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stations.map((station) => (
                    <div
                        key={station.id}
                        className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${station.status === 'offline' ? 'opacity-75' : ''
                            }`}
                        onClick={() => setSelectedStation(station)}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <StatusBadge status={station.status} />
                                <h3 className="font-semibold text-gray-900">{station.name}</h3>
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className="mb-4">
                            <InventoryBar
                                current={station.availableBatteries}
                                total={station.totalSlots}
                            />
                        </div>

                        {/* Stats */}
                        {station.status !== 'offline' ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Today</span>
                                    <span className="font-medium text-gray-900">{station.swapsToday} swaps</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Revenue</span>
                                    <span className="font-medium text-gray-900">{formatNaira(station.revenueToday)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Power</span>
                                    <span className="font-medium text-gray-900 flex items-center gap-1">
                                        {station.powerSystem.type === 'solar' || station.powerSystem.type === 'hybrid' ? '☀️' : '🔌'}
                                        {station.powerSystem.type.charAt(0).toUpperCase() + station.powerSystem.type.slice(1)}
                                        <span className="text-xs text-gray-500">({station.powerSystem.storagePercent}%)</span>
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-red-600 font-medium">Station Offline</p>
                                <p className="text-xs text-gray-500 mt-1">Last seen 15 mins ago</p>
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            {station.status === 'low_inventory' ? (
                                <button className="w-full btn bg-yellow-500 text-white hover:bg-yellow-600">
                                    Restock Now
                                </button>
                            ) : station.status === 'offline' ? (
                                <button className="w-full btn bg-red-500 text-white hover:bg-red-600">
                                    Troubleshoot
                                </button>
                            ) : (
                                <button className="w-full btn btn-secondary">View Details</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Station Detail Modal */}
            {selectedStation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">{selectedStation.name} Station</h2>
                            <button
                                onClick={() => setSelectedStation(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Station Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">📍</span>
                                        <span className="text-gray-700">{selectedStation.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">🕐</span>
                                        <span className="text-gray-700">{selectedStation.operatingHours}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">📞</span>
                                        <span className="text-gray-700">{selectedStation.hostName} ({selectedStation.hostPhone})</span>
                                    </div>
                                </div>

                                {/* Power System */}
                                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        {selectedStation.powerSystem.type === 'solar' || selectedStation.powerSystem.type === 'hybrid' ? '☀️' : '⚡'}
                                        Power System
                                    </h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Type</span>
                                            <span className="font-medium text-gray-900">
                                                {selectedStation.powerSystem.type.charAt(0).toUpperCase() + selectedStation.powerSystem.type.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Storage</span>
                                            <span className="font-medium text-gray-900">
                                                {selectedStation.powerSystem.storageLevel} kWh ({selectedStation.powerSystem.storagePercent}%)
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Grid Status</span>
                                            <span className={`font-medium ${selectedStation.powerSystem.gridStatus === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                                                {selectedStation.powerSystem.gridStatus === 'online' ? '✓ Online' : '✗ Offline'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Running On</span>
                                            <span className="font-medium text-gray-900 capitalize">
                                                {selectedStation.powerSystem.operatingOn}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Battery Inventory */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Battery Inventory</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {selectedStation.slots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`rounded-lg p-3 text-center ${slot.charge !== null
                                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'
                                                : 'bg-gray-50 border border-gray-200'
                                                }`}
                                        >
                                            <p className="text-xs text-gray-500 mb-1">Slot {slot.id}</p>
                                            {slot.charge !== null ? (
                                                <>
                                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                                                        <div
                                                            className={`h-full rounded-full ${slot.charge > 70
                                                                ? 'bg-green-500'
                                                                : slot.charge > 30
                                                                    ? 'bg-yellow-500'
                                                                    : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${slot.charge}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">{slot.charge}%</p>
                                                </>
                                            ) : (
                                                <p className="text-xs text-gray-400">Empty</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance Grid */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Performance Today</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Swaps</span>
                                            <span className="font-medium text-gray-900">{selectedStation.swapsToday}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Revenue</span>
                                            <span className="font-medium text-gray-900">{formatNaira(selectedStation.revenueToday)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Avg Wait Time</span>
                                            <span className="font-medium text-gray-900">2.3 min</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Peak Hour</span>
                                            <span className="font-medium text-gray-900">{selectedStation.peakHour}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">This Week</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Total Swaps</span>
                                            <span className="font-medium text-gray-900">1,247</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Revenue</span>
                                            <span className="font-medium text-gray-900">₦623.5K</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Utilization</span>
                                            <span className="font-medium text-gray-900">78%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hourly Pattern */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Hourly Swap Pattern</h3>
                                <div className="flex items-end gap-1 h-16">
                                    {hourlyPattern.map((hour, i) => {
                                        const maxSwaps = Math.max(...hourlyPattern.map((h) => h.swaps));
                                        const height = (hour.swaps / maxSwaps) * 100;
                                        return (
                                            <div
                                                key={i}
                                                className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t transition-all hover:from-green-600 hover:to-emerald-500"
                                                style={{ height: `${height}%` }}
                                                title={`${hour.hour}: ${hour.swaps} swaps`}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>6AM</span>
                                    <span>12PM</span>
                                    <span>6PM</span>
                                    <span>9PM</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button className="flex-1 btn btn-secondary">Request Restock</button>
                                <button className="flex-1 btn btn-secondary">View History</button>
                                <button className="flex-1 btn btn-primary">Edit Station</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
