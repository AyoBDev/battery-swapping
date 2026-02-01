'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useBrand } from '@/contexts/BrandContext';

const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/fleet', label: 'Fleet', icon: '🏍️' },
    { href: '/stations', label: 'Stations', icon: '📍' },
    { href: '/batteries', label: 'Batteries', icon: '🔋' },
    { href: '/energy', label: 'Energy', icon: '⚡', isNew: true },
    { href: '/maintenance', label: 'Maintenance', icon: '🔧', isNew: true },
];

export default function Header() {
    const pathname = usePathname();
    const { currentBrand } = useBrand();
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
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive
                                            ? 'bg-white/15 text-white'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-xs">{item.icon}</span>
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
                        {/* Fleet Selector - hidden on mobile */}
                        <select className="hidden sm:block bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer">
                            <option className="text-gray-900">Lagos Fleet</option>
                            <option className="text-gray-900">Kigali Fleet</option>
                            <option className="text-gray-900">Nairobi Fleet</option>
                        </select>

                        {/* Live Indicator */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-400/30">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                            </span>
                            <span className="text-xs font-medium text-emerald-300">Live</span>
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
                                    <span className="text-lg">{item.icon}</span>
                                    {item.label}
                                    {item.isNew && (
                                        <span className="text-[10px] bg-emerald-400 text-[#1C3D2D] px-1.5 py-0.5 rounded font-bold ml-auto">
                                            NEW
                                        </span>
                                    )}
                                </Link>
                            );
                        })}

                        {/* Mobile Fleet Selector */}
                        <div className="pt-2 border-t border-white/10">
                            <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/30">
                                <option className="text-gray-900">Lagos Fleet</option>
                                <option className="text-gray-900">Kigali Fleet</option>
                                <option className="text-gray-900">Nairobi Fleet</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
