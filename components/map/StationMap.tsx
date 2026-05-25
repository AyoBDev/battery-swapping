'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

import { stations, formatNaira, Station } from '@/data/mockData';
import { useSimulation } from '@/contexts/SimulationContext';
import 'leaflet/dist/leaflet.css';

interface StationMapProps {
    onStationClick?: (station: Station) => void;
}

export default function StationMap({ onStationClick }: StationMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [L, setL] = useState<typeof import('leaflet') | null>(null);
    const { state } = useSimulation();

    useEffect(() => {
        setIsMounted(true);
        import('leaflet').then((leaflet) => {
            setL(leaflet.default);
        });
    }, []);

    if (!isMounted || !L) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading map...</div>
            </div>
        );
    }

    // Custom marker icons
    const createIcon = (status: string) => {
        const colors = {
            online: '#10B981',
            low_inventory: '#F59E0B',
            offline: '#EF4444',
        };
        const color = colors[status as keyof typeof colors] || colors.online;

        return L.divIcon({
            className: 'custom-marker',
            html: `
        <div style="
          width: 28px;
          height: 28px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -28],
        });
    };

    const createRiderIcon = (batteryLevel: number, status: string) => {
        const batteryColor = batteryLevel > 50 ? '#10B981' : batteryLevel > 20 ? '#F59E0B' : '#EF4444';
        const isSwapping = status === 'swapping';

        return L.divIcon({
            className: 'rider-marker',
            html: `
        <div style="
          width: 24px;
          height: 24px;
          background: ${isSwapping ? '#8B5CF6' : '#3B82F6'};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
        <div style="
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 3px;
          background: ${batteryColor};
          border-radius: 2px;
        "></div>
      `,
            iconSize: [28, 34],
            iconAnchor: [14, 34],
            popupAnchor: [0, -34],
        });
    };

    // Lagos center coordinates
    const lagosCenter: [number, number] = [6.5244, 3.3792];

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden h-[400px]">
            <MapContainer
                center={lagosCenter}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {stations.map((station) => (
                    <Marker
                        key={station.id}
                        position={[station.coordinates.lat, station.coordinates.lng]}
                        icon={createIcon(station.status)}
                        eventHandlers={{
                            click: () => onStationClick?.(station),
                        }}
                    >
                        <Popup>
                            <div className="p-2 min-w-[180px]">
                                <h3 className="font-semibold text-gray-900 text-sm">{station.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{station.address}</p>
                                <div className="mt-3 space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Batteries:</span>
                                        <span className="font-medium">{station.availableBatteries}/{station.totalSlots}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Swaps Today:</span>
                                        <span className="font-medium">{station.swapsToday}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Revenue:</span>
                                        <span className="font-medium">{formatNaira(station.revenueToday)}</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Animated Rider Markers */}
                {state.riders.map((rider) => (
                    <Marker
                        key={rider.id}
                        position={[rider.lat, rider.lng]}
                        icon={createRiderIcon(rider.batteryLevel, rider.status)}
                    >
                        <Popup>
                            <div className="p-2 min-w-[160px]">
                                <h3 className="font-semibold text-gray-900 text-sm">{rider.name}</h3>
                                <div className="mt-2 space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Battery:</span>
                                        <span className={`font-medium ${rider.batteryLevel > 50 ? 'text-green-600' : rider.batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {rider.batteryLevel}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="font-medium capitalize">{rider.status}</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
