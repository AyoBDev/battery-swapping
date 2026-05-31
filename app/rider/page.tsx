'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Zap, QrCode, Activity, User, Flashlight, ChevronRight, Check } from 'lucide-react';

const RiderMap = dynamic(() => import('@/components/map/RiderMap'), { ssr: false });

type Screen = 'map' | 'navigate' | 'scan' | 'swap' | 'complete' | 'health';

export default function RiderPage() {
    const [screen, setScreen] = useState<Screen>('map');

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 overflow-hidden relative">
                {screen === 'map' && <StationMapScreen onSelectStation={() => setScreen('navigate')} />}
                {screen === 'navigate' && (
                    <NavigateScreen onArrive={() => setScreen('scan')} onBack={() => setScreen('map')} />
                )}
                {screen === 'scan' && <QRScannerScreen onScanned={() => setScreen('swap')} />}
                {screen === 'swap' && <SwapProgressScreen onComplete={() => setScreen('complete')} />}
                {screen === 'complete' && <CompleteScreen onViewHealth={() => setScreen('health')} onDone={() => setScreen('map')} />}
                {screen === 'health' && <BatteryHealthScreen />}
            </div>
            <BottomNav active={screen} onChange={setScreen} />
        </div>
    );
}

function BottomNav({ active, onChange }: { active: Screen; onChange: (s: Screen) => void }) {
    const navItems: { id: Screen; label: string; icon: typeof MapPin }[] = [
        { id: 'map', label: 'MAP', icon: MapPin },
        { id: 'scan', label: 'SWAP', icon: Zap },
        { id: 'health', label: 'STATS', icon: Activity },
    ];

    return (
        <nav className="bg-[#0f1a2e] border-t border-[#1a2744] px-2 py-2 flex items-center justify-around">
            {navItems.map(({ id, label, icon: Icon }) => {
                const isActive = active === id || (id === 'map' && (active === 'navigate' || active === 'complete')) || (id === 'scan' && active === 'swap');
                return (
                    <button
                        key={id}
                        onClick={() => onChange(id)}
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                            isActive ? 'text-[#4be277]' : 'text-gray-500'
                        }`}
                    >
                        <Icon size={20} />
                        <span className="text-[10px] font-medium tracking-wider">{label}</span>
                    </button>
                );
            })}
        </nav>
    );
}

function StationMapScreen({ onSelectStation }: { onSelectStation: () => void }) {
    return (
        <div className="h-full flex flex-col relative">
            {/* Real Leaflet map with dark tiles */}
            <div className="flex-1 relative">
                <RiderMap />

                {/* Header bar with branding */}
                <div className="absolute top-4 left-4 right-4 z-[1000]">
                    <div className="bg-[#0f1a2e]/90 backdrop-blur-md border border-[#1a2744] rounded-xl px-4 py-3 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Zap size={14} className="text-[#4be277]" />
                            <span className="text-xs font-bold text-[#4be277] tracking-wider">SwapOS</span>
                        </div>
                        <div className="flex-1 flex items-center gap-2 ml-2 pl-2 border-l border-[#1a2744]">
                            <MapPin size={14} className="text-gray-500" />
                            <span className="text-sm text-gray-400">Search stations...</span>
                        </div>
                    </div>
                </div>

                {/* Battery warning */}
                <div className="absolute top-20 left-4 right-4 z-[1000]">
                    <div className="bg-red-950/80 backdrop-blur-md border border-red-900/50 rounded-xl px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-900/50 rounded-lg flex items-center justify-center">
                            <Zap size={14} className="text-red-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-red-300">Battery Low — 12%</p>
                            <p className="text-[10px] text-red-400/70">~3 km range remaining</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom station card */}
            <div className="absolute bottom-16 left-4 right-4 z-[1000]">
                <button onClick={onSelectStation} className="w-full text-left bg-[#0f1a2e]/95 backdrop-blur-md border border-[#1a2744] rounded-2xl p-4 active:border-[#4be277]/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#4be277]/10 rounded-lg flex items-center justify-center">
                                <Zap size={18} className="text-[#4be277]" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Yaba Station</p>
                                <p className="text-xs text-gray-400">0.8 km away</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[#4be277] font-bold text-sm">4 batteries</p>
                            <p className="text-xs text-gray-400">available</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-[#4be277] rounded-full" />
                                <span className="text-xs text-gray-400">94% avg charge</span>
                            </div>
                            <span className="text-xs text-gray-500">~1 min wait</span>
                        </div>
                        <div className="bg-[#4be277] text-[#0b1326] text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1">
                            <Navigation size={12} />
                            Directions
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}

function NavigateScreen({ onArrive, onBack }: { onArrive: () => void; onBack: () => void }) {
    return (
        <div className="h-full flex flex-col bg-[#0d1528]">
            {/* Map area with route line */}
            <div className="flex-1 relative">
                <div className="absolute inset-0 opacity-20">
                    <div className="h-full w-full" style={{
                        backgroundImage: 'linear-gradient(rgba(75,226,119,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(75,226,119,0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                {/* Route visualization */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <path
                        d="M 50% 70% Q 45% 50% 40% 30%"
                        stroke="#4be277"
                        strokeWidth="3"
                        strokeDasharray="8 4"
                        fill="none"
                        opacity="0.6"
                    />
                </svg>

                {/* User */}
                <div className="absolute top-[65%] left-[48%]">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
                </div>

                {/* Station destination */}
                <div className="absolute top-[28%] left-[38%] flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#4be277] rounded-full flex items-center justify-center shadow-lg shadow-[#4be277]/30">
                        <Zap size={16} className="text-[#0b1326]" />
                    </div>
                    <div className="mt-2 bg-[#0f1a2e] border border-[#1a2744] rounded-lg px-2 py-1">
                        <span className="text-[10px] font-medium">Yaba Station</span>
                    </div>
                </div>

                {/* ETA card */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-[#0f1a2e]/95 backdrop-blur-md border border-[#1a2744] rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="font-semibold text-sm">Heading to Yaba Station</p>
                                <p className="text-xs text-gray-400">4 batteries ready · Slot 3 reserved</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-[#4be277]">0.8 km</p>
                                <p className="text-[10px] text-gray-500">~2 min ride</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom actions */}
            <div className="p-4 bg-[#0b1326] space-y-3">
                <button
                    onClick={onArrive}
                    className="w-full py-4 bg-[#4be277] text-[#0b1326] font-bold rounded-xl active:bg-[#3dd468] transition-colors"
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

function QRScannerScreen({ onScanned }: { onScanned: () => void }) {
    const [scanning, setScanning] = useState(true);
    const [found, setFound] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setScanning(s => !s), 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFound(true);
            setTimeout(onScanned, 800);
        }, 3000);
        return () => clearTimeout(timeout);
    }, [onScanned]);

    return (
        <div className="h-full flex flex-col bg-[#0b1326] relative">
            {/* Header */}
            <div className="px-4 pt-4 pb-2 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                    <QrCode size={18} className="text-[#4be277]" />
                    <span className="text-sm font-semibold">Scan Station QR</span>
                </div>
                <div className="flex items-center gap-2">
                    <Zap size={12} className="text-[#4be277]" />
                    <span className="text-[10px] font-bold text-[#4be277] tracking-wider">SwapOS</span>
                </div>
            </div>

            {/* Camera viewfinder */}
            <div className="flex-1 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative w-64 h-64">
                    <div className={`absolute inset-0 bg-transparent border-2 rounded-2xl transition-colors duration-300 ${found ? 'border-[#4be277]' : 'border-[#4be277]/30'}`} />

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#4be277] rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#4be277] rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#4be277] rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#4be277] rounded-br-2xl" />

                    {/* Scanning line */}
                    {!found && (
                        <div
                            className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#4be277] to-transparent transition-all duration-[2000ms] ease-in-out"
                            style={{ top: scanning ? '10%' : '90%' }}
                        />
                    )}

                    {/* Found indicator */}
                    {found && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-[#4be277]/20 rounded-full flex items-center justify-center">
                                <Check size={32} className="text-[#4be277]" />
                            </div>
                        </div>
                    )}

                    {/* Center crosshair */}
                    {!found && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6">
                                <div className="absolute top-1/2 left-1/2 w-4 h-[1px] bg-[#4be277]/50 -translate-x-1/2" />
                                <div className="absolute top-1/2 left-1/2 w-[1px] h-4 bg-[#4be277]/50 -translate-y-1/2" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom controls */}
            <div className="px-4 pb-6 pt-4 z-10">
                <div className="text-center mb-4">
                    <p className="text-sm text-gray-300">{found ? 'QR Code Found — Connecting...' : 'Scanning for QR Code'}</p>
                    <p className="text-xs text-gray-500 mt-1">Point camera at station dock QR code</p>
                </div>
                <div className="flex items-center justify-center gap-6">
                    <button className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 bg-[#1a2744] rounded-full flex items-center justify-center">
                            <Flashlight size={18} className="text-gray-400" />
                        </div>
                        <span className="text-[10px] text-gray-500">Flashlight</span>
                    </button>
                    <button onClick={onScanned} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 bg-[#1a2744] rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-400 font-mono">123</span>
                        </div>
                        <span className="text-[10px] text-gray-500">Manual</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function SwapProgressScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [logEntries, setLogEntries] = useState<string[]>([]);
    const logRef = useRef<HTMLDivElement>(null);

    const logs = [
        '> Connecting to Yaba Station — Slot 3...',
        '> SwapOS authentication verified',
        '> Battery slot unlocked',
        '> Waiting for battery insertion...',
        '> Battery detected: BAT-0142',
        '> Running health check...',
        '> Charge level: 94% — Range: 52 km',
        '> Swap authorized — ₦200 charged',
    ];

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                setLogEntries(prev => [...prev, logs[i]]);
                setProgress(Math.min(((i + 1) / logs.length) * 100, 100));
                i++;
                if (i === logs.length) {
                    setTimeout(onComplete, 1500);
                }
            } else {
                clearInterval(interval);
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [onComplete]);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [logEntries]);

    const circumference = 2 * Math.PI * 52;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="h-full flex flex-col bg-[#0b1326] p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Zap size={18} className="text-[#4be277]" />
                    <span className="text-sm font-semibold">Swap in Progress</span>
                </div>
                <span className="text-xs text-gray-500 font-mono">SLOT 3</span>
            </div>

            {/* Progress ring */}
            <div className="flex items-center justify-center mb-6">
                <div className="relative w-36 h-36">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="#1a2744" strokeWidth="6" />
                        <circle
                            cx="60" cy="60" r="52" fill="none"
                            stroke="#4be277" strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-700"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold font-mono">{Math.round(progress)}%</span>
                        <span className="text-[10px] text-[#4be277] tracking-widest mt-1">
                            {progress < 100 ? 'PROCESSING' : 'COMPLETE'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Instruction */}
            <div className="text-center mb-4">
                <p className="text-sm text-gray-300">{progress < 50 ? 'Insert Battery' : progress < 100 ? 'Verifying...' : 'Swap Complete'}</p>
                <p className="text-xs text-gray-500">Yaba Station — Slot 3</p>
            </div>

            {/* System log */}
            <div className="flex-1 bg-[#0a0f1c] border border-[#1a2744] rounded-xl p-3 overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-[#4be277] rounded-full animate-pulse" />
                    <span className="text-[10px] text-gray-500 font-mono tracking-wider">SYSTEM LOG</span>
                </div>
                <div ref={logRef} className="space-y-1 overflow-y-auto max-h-32 font-mono text-xs">
                    {logEntries.map((entry, i) => (
                        <p key={i} className="text-gray-400">
                            <span className="text-gray-600">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>{' '}
                            {entry}
                        </p>
                    ))}
                    {progress < 100 && (
                        <p className="text-[#4be277] animate-pulse">{'> _'}</p>
                    )}
                </div>
            </div>

            {/* Step cards */}
            <div className="mt-4 flex gap-3">
                <div className={`flex-1 border rounded-xl p-3 ${progress >= 50 ? 'border-[#4be277] bg-[#4be277]/5' : 'border-[#1a2744]'}`}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-gray-500">01</span>
                        <span className="text-xs font-medium">INSERT</span>
                    </div>
                    <p className="text-[10px] text-gray-500">Place battery in dock</p>
                </div>
                <div className={`flex-1 border rounded-xl p-3 ${progress >= 100 ? 'border-[#4be277] bg-[#4be277]/5' : 'border-[#1a2744]'}`}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-gray-500">02</span>
                        <span className="text-xs font-medium">RETRIEVE</span>
                    </div>
                    <p className="text-[10px] text-gray-500">Take charged battery</p>
                </div>
            </div>
        </div>
    );
}

function CompleteScreen({ onViewHealth, onDone }: { onViewHealth: () => void; onDone: () => void }) {
    return (
        <div className="h-full flex flex-col bg-[#0b1326] p-4 items-center justify-center">
            {/* Success icon */}
            <div className="w-20 h-20 rounded-full bg-[#4be277]/10 border-2 border-[#4be277] flex items-center justify-center mb-6">
                <Check size={36} className="text-[#4be277]" />
            </div>

            <h2 className="text-xl font-bold mb-1">Swap Complete</h2>
            <p className="text-sm text-gray-400 mb-6">47 seconds · Yaba Station</p>

            {/* New battery status */}
            <div className="w-full bg-[#0f1a2e] border border-[#1a2744] rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400">New Battery</span>
                    <span className="text-xs font-mono text-gray-300">BAT-0142</span>
                </div>
                <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-2xl font-bold text-[#4be277]">94%</span>
                            <span className="text-xs text-gray-500">~52 km range</span>
                        </div>
                        <div className="w-full h-2 bg-[#1a2744] rounded-full overflow-hidden">
                            <div className="h-full bg-[#4be277] rounded-full" style={{ width: '94%' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Swap summary */}
            <div className="w-full bg-[#0f1a2e] border border-[#1a2744] rounded-2xl p-4 mb-6">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Old battery</span>
                        <span className="text-gray-300 font-mono text-xs">BAT-0087 (12%)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">New battery</span>
                        <span className="text-gray-300 font-mono text-xs">BAT-0142 (94%)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Duration</span>
                        <span className="text-gray-300">47 seconds</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#1a2744]">
                        <span className="text-gray-500">Cost</span>
                        <span className="text-[#4be277] font-bold">₦200</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <button
                onClick={onViewHealth}
                className="w-full py-3 bg-[#4be277]/10 border border-[#4be277]/30 text-[#4be277] text-sm font-medium rounded-xl flex items-center justify-center gap-2 mb-3"
            >
                <Activity size={14} />
                View Battery Health
            </button>
            <button
                onClick={onDone}
                className="w-full py-3 text-gray-400 text-sm font-medium"
            >
                Done — Back to Map
            </button>
        </div>
    );
}

function BatteryHealthScreen() {
    const healthPercent = 94;
    const circumference = 2 * Math.PI * 52;
    const strokeDashoffset = circumference - (healthPercent / 100) * circumference;

    return (
        <div className="h-full flex flex-col bg-[#0b1326] p-4 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Activity size={18} className="text-[#4be277]" />
                    <span className="text-sm font-semibold">Battery Health</span>
                </div>
                <span className="text-xs text-gray-500 font-mono">BAT-0142</span>
            </div>

            {/* Health gauge */}
            <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="#1a2744" strokeWidth="8" />
                        <circle
                            cx="60" cy="60" r="52" fill="none"
                            stroke="#4be277" strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">{healthPercent}%</span>
                        <span className="text-[10px] text-[#4be277] tracking-widest mt-1">OPTIMAL</span>
                    </div>
                </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <MetricCard label="Temperature" value="32°C" status="normal" />
                <MetricCard label="Cycles" value="142/800" status="normal" />
                <MetricCard label="Remaining Life" value="3.2 Years" status="normal" />
                <MetricCard label="Voltage" value="51.8V" status="normal" />
            </div>

            {/* EOL estimate */}
            <div className="bg-[#0f1a2e] border border-[#1a2744] rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Estimated EOL</span>
                    <span className="text-xs font-mono text-gray-300">Oct 2027</span>
                </div>
                <div className="mt-2 h-1.5 bg-[#1a2744] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4be277] rounded-full" style={{ width: '18%' }} />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">142 of 800 cycles used</p>
            </div>

            {/* System insight */}
            <div className="bg-[#0a0f1c] border border-[#1a2744] rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-[#4be277] rounded-full" />
                    <span className="text-[10px] text-gray-500 font-mono tracking-wider">SWAPOS INSIGHT</span>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                    Battery performing within expected parameters. Degradation rate: 0.8% per 100 cycles. Health score verified across 142 swap events at 3 stations.
                </p>
            </div>

            {/* Diagnostic button */}
            <button className="w-full py-3 bg-[#4be277]/10 border border-[#4be277]/30 text-[#4be277] text-sm font-medium rounded-xl flex items-center justify-center gap-2">
                <Activity size={14} />
                Run Full Diagnostic
            </button>
        </div>
    );
}

function MetricCard({ label, value, status }: { label: string; value: string; status: 'normal' | 'warning' | 'critical' }) {
    const statusColor = status === 'normal' ? 'text-[#4be277]' : status === 'warning' ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="bg-[#0f1a2e] border border-[#1a2744] rounded-xl p-3">
            <p className="text-[10px] text-gray-500 mb-1">{label}</p>
            <p className={`text-sm font-bold font-mono ${statusColor}`}>{value}</p>
        </div>
    );
}
