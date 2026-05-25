'use client';

import Link from 'next/link';
import { Users, MapPin, Battery, RefreshCw, Bike, DollarSign, AlertTriangle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import KPICard from '@/components/ui/KPICard';
import AIAlertCard from '@/components/ui/AIAlertCard';
import BrandSelector from '@/components/ui/BrandSelector';
import WeeklySwapsChart from '@/components/charts/WeeklySwapsChart';
import EnergyIndependenceChart from '@/components/charts/EnergyIndependenceChart';
import StationMap from '@/components/map/StationMap';
import { fleetStats, ecosystemStats, aiAlerts, formatNaira } from '@/data/mockData';
import { useBrand } from '@/contexts/BrandContext';
import { useSimulation } from '@/contexts/SimulationContext';

export default function Dashboard() {
  const { currentBrand } = useBrand();
  const { state } = useSimulation();

  return (
    <MainLayout>
      <BrandSelector />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-gray-500 mb-1">Good Morning,</p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{currentBrand.displayName}</h1>
        </div>
      </div>

      {/* Ecosystem KPIs */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Ecosystem</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={<Users className="w-5 h-5" />}
            value={ecosystemStats.totalPartners}
            label="Partners on Platform"
            trend={`${ecosystemStats.monthlyGrowth.partners} this month`}
            trendDirection="up"
            status="good"
          />
          <KPICard
            icon={<MapPin className="w-5 h-5" />}
            value={ecosystemStats.totalStations}
            label="Stations Network"
            trend={`${ecosystemStats.monthlyGrowth.stations} new`}
            trendDirection="up"
            status="good"
          />
          <KPICard
            icon={<Battery className="w-5 h-5" />}
            value={ecosystemStats.totalBatteries.toLocaleString()}
            label="Batteries Tracked"
            trend={`${ecosystemStats.monthlyGrowth.batteries}`}
            trendDirection="up"
            status="good"
          />
          <KPICard
            icon={<RefreshCw className="w-5 h-5" />}
            value={ecosystemStats.dailySwaps.toLocaleString()}
            label="Daily Swaps"
            status="good"
          />
        </div>
      </div>

      {/* Operations KPIs */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Your Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={<Bike className="w-5 h-5" />}
            value={fleetStats.activeBikes}
            label="Active Bikes"
            subtitle={`${Math.round((fleetStats.activeBikes / fleetStats.totalBikes) * 100)}% of ${fleetStats.totalBikes} total`}
            trend={`${fleetStats.bikesTrendPercent}%`}
            trendDirection="up"
            status="good"
          />
          <KPICard
            icon={<Battery className="w-5 h-5" />}
            value={fleetStats.totalBatteries}
            label="Your Batteries"
            subtitle={`${fleetStats.batteryHealthPercent}% healthy`}
            status="good"
          />
          <KPICard
            icon={<MapPin className="w-5 h-5" />}
            value={fleetStats.totalStations}
            label="Your Stations"
            subtitle={`${fleetStats.onlineStations} online / ${fleetStats.totalStations - fleetStats.onlineStations} offline`}
            status={fleetStats.onlineStations < fleetStats.totalStations ? 'warning' : 'good'}
          />
          <KPICard
            icon={<DollarSign className="w-5 h-5" />}
            value={formatNaira(fleetStats.revenueToday)}
            label="Revenue Today"
            trend={`${fleetStats.swapsTrendPercent}%`}
            trendDirection="up"
            status="good"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <StationMap />
        </div>

        {/* Alerts Panel */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Predictions
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded">
                {aiAlerts.filter(a => a.type === 'critical' || a.type === 'warning').length}
              </span>
            </h3>
            <Link href="/maintenance" className="text-sm text-[#1C3D2D] hover:text-[#2a5440] font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {state.alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${
                  alert.type === 'critical' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${alert.type === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <span className={`text-xs font-semibold ${alert.type === 'critical' ? 'text-red-700' : 'text-yellow-700'}`}>
                    {alert.title}
                  </span>
                  <span className="ml-auto text-[10px] text-gray-400">LIVE</span>
                </div>
                <p className="text-xs text-gray-700">{alert.message}</p>
              </div>
            ))}

            {aiAlerts.slice(0, 4).map((alert) => (
              <AIAlertCard
                key={alert.id}
                type={alert.type}
                asset={alert.asset}
                title={alert.title}
                issue={alert.issue}
                evidence={alert.evidence}
                risk={alert.risk}
                recommendation={alert.recommendation}
                timeline={alert.timeline}
                timestamp={alert.timestamp}
                actionLabel={alert.actionLabel}
                compact={true}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklySwapsChart />
        <EnergyIndependenceChart />
      </div>
    </MainLayout>
  );
}
