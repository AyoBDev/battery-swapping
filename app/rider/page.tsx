'use client';

import { useState } from 'react';
import { MapPin, Navigation, Battery, CheckCircle, ChevronRight, Zap } from 'lucide-react';
type Screen = 'find' | 'navigate' | 'swap' | 'complete';

interface NearbyStation {
    id: string;
    name: string;
    distance: string;
    available: number;
    total: number;
    waitTime: string;
}

const nearbyStations: NearbyStation[] = [
    { id: 'ST-001', name: 'Yaba Station', distance: '0.8 km', available: 4, total: 8, waitTime: '< 1 min' },
    { id: 'ST-002', name: 'Surulere Hub', distance: '1.2 km', available: 2, total: 6, waitTime: '~2 min' },
    { id: 'ST-003', name: 'Ikeja Central', distance: '2.5 km', available: 6, total: 10, waitTime: '< 1 min' },
];

export default function RiderPage() {
    const [screen, setScreen] = useState<Screen>('find');
    const [selectedStation, setSelectedStation] = useState<NearbyStation | null>(null);
    const [batteryLevel] = useState(12);
    const [newBatteryLevel] = useState(94);

    return (
        <div className="h-screen flex flex-col">
            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium">SwapOS Rider</span>
                </div>
                <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400 font-medium">{batteryLevel}%</span>
                </div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto">
                {screen === 'find' && (
                    <FindStationScreen
                        stations={nearbyStations}
                        onSelect={(station) => {
                            setSelectedStation(station);
                            setScreen('navigate');
                        }}
                        batteryLevel={batteryLevel}
                    />
                )}
                {screen === 'navigate' && selectedStation && (
                    <NavigateScreen
                        station={selectedStation}
                        onArrive={() => setScreen('swap')}
                        onBack={() => setScreen('find')}
                    />
                )}
                {screen === 'swap' && selectedStation && (
                    <SwapScreen
                        station={selectedStation}
                        onConfirm={() => setScreen('complete')}
                        onBack={() => setScreen('navigate')}
                    />
                )}
                {screen === 'complete' && (
                    <CompleteScreen
                        newLevel={newBatteryLevel}
                        onDone={() => setScreen('find')}
                    />
                )}
            </div>
        </div>
    );
}

function FindStationScreen({
    stations,
    onSelect,
    batteryLevel,
}: {
    stations: NearbyStation[];
    onSelect: (s: NearbyStation) => void;
    batteryLevel: number;
}) {
    return (
        <div className="p-4 space-y-4">
            {/* Low battery warning */}
            <div className="bg-red-900/30 border border-red-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center">
                        <Battery className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <p className="font-medium text-red-300">Battery Low — {batteryLevel}%</p>
                        <p className="text-sm text-red-400/70">~3 km range remaining</p>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-xl font-bold">Find a Swap Station</h1>
                <p className="text-sm text-gray-400 mt-1">Nearest stations with available batteries</p>
            </div>

            {/* Station List */}
            <div className="space-y-3">
                {stations.map((station) => (
                    <button
                        key={station.id}
                        onClick={() => onSelect(station)}
                        className="w-full bg-gray-800 rounded-xl p-4 flex items-center gap-4 active:bg-gray-700 transition-colors text-left"
                    >
                        <div className="w-10 h-10 rounded-lg bg-green-900/30 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">{station.name}</p>
                            <p className="text-sm text-gray-400">
                                {station.distance} · {station.available}/{station.total} available
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">{station.waitTime}</p>
                            <ChevronRight className="w-4 h-4 text-gray-500 mt-1 ml-auto" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function NavigateScreen({
    station,
    onArrive,
    onBack,
}: {
    station: NearbyStation;
    onArrive: () => void;
    onBack: () => void;
}) {
    return (
        <div className="h-full flex flex-col">
            {/* Map placeholder */}
            <div className="flex-1 bg-gray-800 relative flex items-center justify-center">
                <div className="text-center">
                    <Navigation className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                    <p className="text-lg font-medium">{station.distance} away</p>
                    <p className="text-sm text-gray-400">Heading to {station.name}</p>
                </div>
                {/* Direction indicator */}
                <div className="absolute bottom-6 left-4 right-4 bg-gray-900/90 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{station.name}</p>
                            <p className="text-sm text-gray-400">{station.available} batteries ready</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-blue-400">{station.distance}</p>
                            <p className="text-xs text-gray-500">~2 min ride</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom actions */}
            <div className="p-4 bg-gray-900 space-y-3">
                <button
                    onClick={onArrive}
                    className="w-full py-4 bg-green-600 text-white font-medium rounded-xl active:bg-green-700 transition-colors"
                >
                    I&apos;ve Arrived
                </button>
                <button
                    onClick={onBack}
                    className="w-full py-3 text-gray-400 text-sm font-medium"
                >
                    Choose Different Station
                </button>
            </div>
        </div>
    );
}

function SwapScreen({
    station,
    onConfirm,
    onBack,
}: {
    station: NearbyStation;
    onConfirm: () => void;
    onBack: () => void;
}) {
    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 p-4 flex flex-col items-center justify-center">
                {/* Battery swap animation */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 rounded-full bg-green-900/20 border-2 border-green-500/30 flex items-center justify-center">
                        <Battery className="w-16 h-16 text-green-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">94%</span>
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-2">Ready to Swap</h2>
                <p className="text-gray-400 text-center mb-2">
                    Remove your current battery and insert the charged one from Slot 3
                </p>
                <p className="text-sm text-gray-500">
                    At {station.name}
                </p>
            </div>

            {/* Bottom actions */}
            <div className="p-4 bg-gray-900 space-y-3">
                <button
                    onClick={onConfirm}
                    className="w-full py-4 bg-green-600 text-white font-bold rounded-xl active:bg-green-700 transition-colors text-lg"
                >
                    Confirm Swap Complete
                </button>
                <button
                    onClick={onBack}
                    className="w-full py-3 text-gray-400 text-sm font-medium"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

function CompleteScreen({
    newLevel,
    onDone,
}: {
    newLevel: number;
    onDone: () => void;
}) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6">
            {/* Success icon */}
            <div className="w-20 h-20 rounded-full bg-green-900/30 border-2 border-green-500 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Swap Complete</h2>
            <p className="text-gray-400 text-center mb-8">
                You&apos;re good to go! New battery at {newLevel}%.
            </p>

            {/* New battery status */}
            <div className="w-full bg-gray-800 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">New Battery Level</span>
                    <span className="text-sm font-bold text-green-400">{newLevel}%</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 rounded-full transition-all duration-1000"
                        style={{ width: `${newLevel}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">Estimated range: ~52 km</p>
            </div>

            {/* Trip summary */}
            <div className="w-full bg-gray-800 rounded-xl p-4 mb-8">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Swap Summary</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Old battery returned</span>
                        <span className="text-gray-300">BAT-0087 (12%)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">New battery received</span>
                        <span className="text-gray-300">BAT-0142 (94%)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Swap duration</span>
                        <span className="text-gray-300">47 seconds</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-700">
                        <span className="text-gray-400">Cost</span>
                        <span className="text-green-400 font-medium">₦200</span>
                    </div>
                </div>
            </div>

            <button
                onClick={onDone}
                className="w-full py-4 bg-gray-800 text-white font-medium rounded-xl active:bg-gray-700 transition-colors"
            >
                Done — Back to Riding
            </button>
        </div>
    );
}
