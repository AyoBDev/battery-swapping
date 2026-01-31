'use client';

interface EnergyFlowDiagramProps {
    solarOutput: number; // watts
    storageLevel: number; // percentage
    storageCapacity: number; // kWh
    consumption: number; // watts
    gridStatus: 'online' | 'offline';
    currentSource: 'solar' | 'grid' | 'battery';
    aiOptimizationText?: string;
}

export default function EnergyFlowDiagram({
    solarOutput,
    storageLevel,
    storageCapacity,
    consumption,
    gridStatus,
    currentSource,
    aiOptimizationText,
}: EnergyFlowDiagramProps) {
    const storageKwh = (storageLevel / 100) * storageCapacity;
    const backupHours = consumption > 0 ? Math.round((storageKwh * 1000) / consumption) : 0;

    return (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>⚡</span>
                Energy System — AI Optimized
            </h4>

            {/* Flow Diagram */}
            <div className="flex items-center justify-between gap-4 mb-6">
                {/* Solar Panel */}
                <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${solarOutput > 0 ? 'bg-yellow-400 shadow-lg shadow-yellow-200' : 'bg-gray-200'
                        }`}>
                        ☀️
                    </div>
                    <p className="text-xs text-gray-600 mt-2 font-medium">Solar</p>
                    <p className={`text-sm font-bold ${solarOutput > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                        {solarOutput > 0 ? `${solarOutput}W` : 'Night'}
                    </p>
                </div>

                {/* Arrow 1 */}
                <div className="flex-1 flex items-center">
                    <div className={`h-1 flex-1 rounded ${solarOutput > 0 ? 'bg-yellow-400' : 'bg-gray-200'}`}>
                        {solarOutput > 0 && (
                            <div className="h-full w-4 bg-yellow-500 rounded animate-pulse" />
                        )}
                    </div>
                    <span className={`text-lg ${solarOutput > 0 ? 'text-yellow-500' : 'text-gray-300'}`}>→</span>
                </div>

                {/* Storage Battery */}
                <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl relative overflow-hidden ${storageLevel > 50 ? 'bg-green-400 shadow-lg shadow-green-200' :
                            storageLevel > 20 ? 'bg-yellow-400 shadow-lg shadow-yellow-200' :
                                'bg-red-400 shadow-lg shadow-red-200'
                        }`}>
                        🔋
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-black/10"
                            style={{ height: `${100 - storageLevel}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-600 mt-2 font-medium">Storage</p>
                    <p className="text-sm font-bold text-gray-700">
                        {storageKwh.toFixed(1)} kWh
                    </p>
                    <p className="text-xs text-gray-500">{storageLevel}%</p>
                </div>

                {/* Arrow 2 */}
                <div className="flex-1 flex items-center">
                    <div className={`h-1 flex-1 rounded ${currentSource !== 'grid' ? 'bg-green-400' : 'bg-gray-200'}`}>
                        {currentSource !== 'grid' && (
                            <div className="h-full w-4 bg-green-500 rounded animate-pulse" />
                        )}
                    </div>
                    <span className={`text-lg ${currentSource !== 'grid' ? 'text-green-500' : 'text-gray-300'}`}>→</span>
                </div>

                {/* Swap Station */}
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl bg-blue-400 shadow-lg shadow-blue-200">
                        🔌
                    </div>
                    <p className="text-xs text-gray-600 mt-2 font-medium">Station</p>
                    <p className="text-sm font-bold text-blue-600">{consumption}W</p>
                </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Solar Status</p>
                    <p className="text-sm font-semibold text-gray-900">
                        {solarOutput > 0 ? (
                            <span className="text-yellow-600">☀️ Generating {solarOutput}W</span>
                        ) : (
                            <span className="text-gray-400">🌙 Night / Cloudy</span>
                        )}
                    </p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Storage Status</p>
                    <p className="text-sm font-semibold text-gray-900">
                        {storageLevel}% — ~{backupHours}h backup
                    </p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Grid Status</p>
                    <p className="text-sm font-semibold">
                        {gridStatus === 'online' ? (
                            <span className="text-green-600">✓ Available</span>
                        ) : (
                            <span className="text-red-600">✗ Offline (NEPA)</span>
                        )}
                    </p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Currently Operating On</p>
                    <p className="text-sm font-semibold text-gray-900 capitalize">
                        {currentSource === 'solar' && '☀️ Solar'}
                        {currentSource === 'grid' && '🔌 Grid'}
                        {currentSource === 'battery' && '🔋 Battery Storage'}
                    </p>
                </div>
            </div>

            {/* AI Optimization Status */}
            {aiOptimizationText && (
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                    <p className="text-xs font-medium text-purple-700 mb-1">🤖 AI Optimization Status</p>
                    <p className="text-sm text-gray-700">{aiOptimizationText}</p>
                </div>
            )}
        </div>
    );
}
