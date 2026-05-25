'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PartnerSignup() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    role: '',
    email: '',
    challenge: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      router.push('/partner/wizard');
    }, 600);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Brand Bar */}
      <div className="bg-[#1C3D2D] px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-white text-lg">SwapOS</span>
          <span className="ml-auto text-xs text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded-full">
            Early Partner Program
          </span>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Value Prop */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Join the Battery Swapping Network
          </h1>
          <p className="text-gray-600 mb-8">
            Early partners shape what we build. Get priority access to the interoperability platform.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C3D2D]/30 focus:border-[#1C3D2D] text-gray-900"
                placeholder="Chidi Abubakar"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                value={form.company}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C3D2D]/30 focus:border-[#1C3D2D] text-gray-900"
                placeholder="EnergyX Nigeria"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C3D2D]/30 focus:border-[#1C3D2D] text-gray-900 bg-white"
              >
                <option value="">Select your role</option>
                <option value="fleet_operator">Fleet Operator</option>
                <option value="station_manager">Station Manager</option>
                <option value="hardware_oem">Hardware OEM</option>
                <option value="mobility_platform">Mobility Platform</option>
                <option value="investor">Investor</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C3D2D]/30 focus:border-[#1C3D2D] text-gray-900"
                placeholder="chidi@energyx.ng"
              />
            </div>

            <div>
              <label htmlFor="challenge" className="block text-sm font-medium text-gray-700 mb-1.5">
                Biggest battery ops challenge?
              </label>
              <textarea
                id="challenge"
                name="challenge"
                rows={3}
                value={form.challenge}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C3D2D]/30 focus:border-[#1C3D2D] text-gray-900 resize-none"
                placeholder="e.g. Station stockouts during peak hours, no visibility into battery health..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#1C3D2D] text-white font-semibold rounded-xl hover:bg-[#2a5440] transition-colors disabled:opacity-60 min-h-[44px]"
            >
              {submitting ? 'Joining...' : 'Join Early Partner Program'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            By joining, you agree to receive updates about SwapOS. No spam, ever.
          </p>
        </div>
      </div>
    </div>
  );
}
