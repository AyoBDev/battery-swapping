'use client';

import { useState } from 'react';

const PALETTES = [
  { name: 'Ocean Blue', primary: '#3B82F6', secondary: '#10B981', accent: '#8B5CF6' },
  { name: 'Sunset Red', primary: '#DC2626', secondary: '#FCD34D', accent: '#F97316' },
  { name: 'Solar Gold', primary: '#F59E0B', secondary: '#10B981', accent: '#06B6D4' },
  { name: 'Forest Green', primary: '#059669', secondary: '#34D399', accent: '#6EE7B7' },
  { name: 'Electric Purple', primary: '#7C3AED', secondary: '#A78BFA', accent: '#C4B5FD' },
  { name: 'Midnight Navy', primary: '#1E3A5F', secondary: '#3B82F6', accent: '#93C5FD' },
];

export default function PartnerWizard() {
  const [brandName, setBrandName] = useState('');
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Brand Bar */}
      <div className="bg-[#1C3D2D] px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-white text-lg">SwapOS</span>
          <span className="ml-auto text-xs text-white/70">Partner Preview</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">See Your Brand on SwapOS</h1>
        <p className="text-gray-600 mb-8">Customize the platform preview with your brand identity.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Brand Name
              </label>
              <input
                id="brandName"
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Your Company Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C3D2D]/30 focus:border-[#1C3D2D] text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Palette
              </label>
              <div className="grid grid-cols-2 gap-3">
                {PALETTES.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => setSelectedPalette(palette)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      selectedPalette.name === palette.name
                        ? 'border-[#1C3D2D] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.primary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.secondary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.accent }} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            {/* Preview Header */}
            <div className="px-6 py-4" style={{ backgroundColor: selectedPalette.primary }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {brandName ? brandName[0].toUpperCase() : 'Y'}
                  </span>
                </div>
                <span className="font-semibold text-white">
                  {brandName || 'Your Company'} Fleet Manager
                </span>
              </div>
            </div>

            {/* Preview KPIs */}
            <div className="p-6">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Your Operations</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Active Bikes', value: '127' },
                  { label: 'Batteries', value: '284' },
                  { label: 'Stations', value: '8' },
                  { label: 'Revenue Today', value: '₦2.4M' },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-lg font-bold text-gray-900">{kpi.value}</p>
                    <p className="text-xs text-gray-500">{kpi.label}</p>
                  </div>
                ))}
              </div>

              {/* Preview Alert */}
              <div className="mt-4 p-3 rounded-lg border border-amber-200 bg-amber-50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-gray-700">Prediction</span>
                </div>
                <p className="text-xs text-gray-700">
                  Station Yaba-Central predicted to run low on charged batteries by 4 PM. Recommend pre-staging 5 batteries from Ikeja hub.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
