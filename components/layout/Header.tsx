'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bike, MapPin, Battery, Zap, Server, DollarSign, Building2 } from 'lucide-react';
import { useBrand } from '@/contexts/BrandContext';
import { useSimulation } from '@/contexts/SimulationContext';
import SimulationControls from '@/components/ui/SimulationControls';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import ConnectionIndicator from '@/components/ui/ConnectionIndicator';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/fleet', label: 'Fleet', icon: Bike },
    { href: '/stations', label: 'Stations', icon: MapPin },
    { href: '/batteries', label: 'Batteries', icon: Battery },
    { href: '/energy', label: 'Energy', icon: Zap },
    { href: '/cabinets', label: 'Cabinets', icon: Server, isNew: true },
    { href: '/revenue', label: 'Revenue', icon: DollarSign, isNew: true },
    { href: '/operators', label: 'Operators', icon: Building2, isNew: true },
];

export default function Header() {
    const pathname = usePathname();
    const { currentBrand } = useBrand();
    const { connectionStatus } = useSimulation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-[#1C3D2D] sticky top-0 z-50">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-4 lg:gap-8">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                <Image
                                    src={currentBrand.logo}
                                    alt={currentBrand.name}
                                    width={24}
                                    height={24}
                                    className="rounded"
                                />
                            </div>
                            <span className="font-semibold text-lg text-white">{currentBrand.name}</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive
                                            ? 'bg-white/15 text-white'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                        {item.isNew && (
                                            <span className="text-[10px] bg-emerald-400 text-[#1C3D2D] px-1.5 py-0.5 rounded font-bold">
                                                NEW
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Dark Mode Toggle */}
                        <DarkModeToggle />

                        {/* Connection + Simulation Controls */}
                        <div className="hidden sm:flex items-center gap-2">
                            {connectionStatus !== 'local' && (
                                <ConnectionIndicator status={connectionStatus} showLabel />
                            )}
                            <SimulationControls />
                        </div>

                        {/* User Avatar */}
                        <button className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center text-white font-medium text-sm hover:bg-white/25 transition-colors border border-white/20">
                            JO
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-[#1C3D2D] border-t border-white/10">
                    <div className="max-w-[1800px] mx-auto px-4 py-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-white/15 text-white'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                    {item.isNew && (
                                        <span className="text-[10px] bg-emerald-400 text-[#1C3D2D] px-1.5 py-0.5 rounded font-bold ml-auto">
                                            NEW
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}
