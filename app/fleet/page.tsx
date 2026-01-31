'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import { bikes, formatTimeAgo, Bike } from '@/data/mockData';

export default function FleetPage() {
    const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const activeBikes = bikes.filter((b) => b.status === 'active').length;
    const idleBikes = bikes.filter((b) => b.status === 'idle').length;
    const maintenanceBikes = bikes.filter((b) => b.status === 'maintenance').length;

    const filteredBikes = bikes.filter((bike) => {
        const matchesSearch =
            bike.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bike.rider?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bike.location.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || bike.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <MainLayout>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Track and manage your bike fleet</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary">Export</button>
                    <button className="btn btn-primary">+ Add Bike</button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🏍️</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{bikes.length}</p>
                        <p className="text-sm text-gray-500">All Bikes</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🟢</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{activeBikes}</p>
                        <p className="text-sm text-gray-500">On Trip</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">⏸️</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{idleBikes + maintenanceBikes}</p>
                        <p className="text-sm text-gray-500">Idle / Maintenance</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex gap-6">
                {/* Table Section */}
                <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Filters */}
                    <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search bikes, riders, or locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="idle">Idle</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Bike ID
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Rider
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Battery
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Last Seen
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBikes.map((bike) => (
                                    <tr
                                        key={bike.id}
                                        onClick={() => setSelectedBike(bike)}
                                        className={`border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selectedBike?.id === bike.id ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-gray-900">{bike.id}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-gray-700">{bike.rider?.name || '—'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={bike.status} size="sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            {bike.currentBattery ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${bike.currentBattery.charge > 50
                                                                    ? 'bg-green-500'
                                                                    : bike.currentBattery.charge > 20
                                                                        ? 'bg-yellow-500'
                                                                        : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${bike.currentBattery.charge}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-600">{bike.currentBattery.charge}%</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-gray-700">{bike.location.name}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-gray-500">{formatTimeAgo(bike.lastSeen)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing 1-{filteredBikes.length} of {bikes.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                                ← Prev
                            </button>
                            <button className="px-3 py-1 text-sm bg-gray-900 text-white rounded-lg">1</button>
                            <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
                            <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                                Next →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Detail Panel */}
                {selectedBike && (
                    <div className="w-80 bg-white rounded-xl shadow-sm p-6 h-fit">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => setSelectedBike(null)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                ← Back
                            </button>
                            <span className="font-semibold text-gray-900">{selectedBike.id}</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                                <StatusBadge status={selectedBike.status} />
                            </div>

                            {selectedBike.rider && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Rider</p>
                                    <p className="font-medium text-gray-900">{selectedBike.rider.name}</p>
                                    <p className="text-sm text-gray-500">{selectedBike.rider.phone}</p>
                                </div>
                            )}

                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Current Battery</p>
                                {selectedBike.currentBattery ? (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-sm font-medium text-gray-900">ID: {selectedBike.currentBattery.id}</p>
                                        <div className="mt-2 space-y-2">
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-500">Charge</span>
                                                    <span className="font-medium">{selectedBike.currentBattery.charge}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-green-500 rounded-full"
                                                        style={{ width: `${selectedBike.currentBattery.charge}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Health</span>
                                                <span className="font-medium">{selectedBike.currentBattery.health}%</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Est. Range</span>
                                                <span className="font-medium">
                                                    {Math.round((selectedBike.currentBattery.charge / 100) * 55)} km
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">No battery installed</p>
                                )}
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Today&apos;s Activity</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Swaps completed</span>
                                        <span className="font-medium text-gray-900">{selectedBike.swapsToday}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Distance traveled</span>
                                        <span className="font-medium text-gray-900">{selectedBike.distanceToday} km</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Deliveries</span>
                                        <span className="font-medium text-gray-900">{selectedBike.deliveriesToday}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full btn btn-secondary mt-4">View Full History</button>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
