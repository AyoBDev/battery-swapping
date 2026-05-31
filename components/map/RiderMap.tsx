'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

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

const STATIONS = [
    { id: 'yaba', name: 'Yaba Station', lat: 6.5095, lng: 3.3711, batteries: 4, primary: true },
    { id: 'surulere', name: 'Surulere Hub', lat: 6.4969, lng: 3.3574, batteries: 2, primary: false },
    { id: 'ikeja', name: 'Ikeja Central', lat: 6.6018, lng: 3.3515, batteries: 6, primary: false },
];

const RIDER_LOCATION: [number, number] = [6.5135, 3.3750];

export default function RiderMap() {
    const [isMounted, setIsMounted] = useState(false);
    const [L, setL] = useState<typeof import('leaflet') | null>(null);

    useEffect(() => {
        setIsMounted(true);
        import('leaflet').then((leaflet) => {
            setL(leaflet.default);
        });
    }, []);

    if (!isMounted || !L) {
        return (
            <div className="h-full w-full bg-[#0d1528] flex items-center justify-center">
                <div className="animate-pulse text-gray-500 text-xs font-mono">Loading map...</div>
            </div>
        );
    }

    const stationIcon = (primary: boolean) => L.divIcon({
        className: 'station-marker',
        html: `<div style="
            width: ${primary ? '32px' : '24px'};
            height: ${primary ? '32px' : '24px'};
            background: ${primary ? '#4be277' : 'rgba(75,226,119,0.6)'};
            border: 2px solid rgba(11,19,38,0.8);
            border-radius: 50%;
            box-shadow: 0 0 ${primary ? '12px' : '6px'} rgba(75,226,119,${primary ? '0.4' : '0.2'});
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <svg width="${primary ? '14' : '10'}" height="${primary ? '14' : '10'}" viewBox="0 0 24 24" fill="none" stroke="#0b1326" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
            </svg>
        </div>${primary ? '<div style="width:8px;height:8px;background:#4be277;border-radius:50%;margin:4px auto 0;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>' : ''}`,
        iconSize: primary ? [32, 44] : [24, 24],
        iconAnchor: primary ? [16, 22] : [12, 12],
    });

    const riderIcon = L.divIcon({
        className: 'rider-marker',
        html: `<div style="
            width: 16px;
            height: 16px;
            background: #3b82f6;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(59,130,246,0.5);
        "></div>
        <div style="
            position: absolute;
            top: -2px;
            left: -2px;
            width: 20px;
            height: 20px;
            background: rgba(59,130,246,0.2);
            border-radius: 50%;
            animation: ping 2s cubic-bezier(0,0,0.2,1) infinite;
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });

    return (
        <div className="h-full w-full relative">
            <style jsx global>{`
                .leaflet-container { background: #0d1528 !important; }
                .leaflet-control-attribution { display: none !important; }
                .leaflet-control-zoom { border: none !important; }
                .leaflet-control-zoom a {
                    background: rgba(15,26,46,0.9) !important;
                    color: #4be277 !important;
                    border: 1px solid #1a2744 !important;
                    backdrop-filter: blur(8px);
                }
                .leaflet-control-zoom a:hover {
                    background: rgba(15,26,46,1) !important;
                }
                @keyframes ping {
                    75%, 100% { transform: scale(2); opacity: 0; }
                }
                .station-marker, .rider-marker { background: none !important; border: none !important; }
            `}</style>
            <MapContainer
                center={RIDER_LOCATION}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {STATIONS.map((station) => (
                    <Marker
                        key={station.id}
                        position={[station.lat, station.lng]}
                        icon={stationIcon(station.primary)}
                    />
                ))}
                <Marker
                    position={RIDER_LOCATION}
                    icon={riderIcon}
                />
            </MapContainer>
        </div>
    );
}
