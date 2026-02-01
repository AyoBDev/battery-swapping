'use client';

import MainLayout from '@/components/layout/MainLayout';
import KPICard from '@/components/ui/KPICard';
import AIAlertCard from '@/components/ui/AIAlertCard';
import BrandSelector from '@/components/ui/BrandSelector';
import DemoTip from '@/components/ui/DemoTip';
import WeeklySwapsChart from '@/components/charts/WeeklySwapsChart';
import EnergyIndependenceChart from '@/components/charts/EnergyIndependenceChart';
import StationMap from '@/components/map/StationMap';
import { fleetStats, ecosystemStats, aiAlerts, formatNaira } from '@/data/mockData';
import { useBrand } from '@/contexts/BrandContext';

export default function Dashboard() {
  const { currentBrand } = useBrand();

  return (
    <MainLayout>
      {/* Brand Selector */}
      <BrandSelector />

      {/* Demo Tip */}
      <DemoTip message="Point out the AI Insights feed — this is live intelligence, not a chatbot. AI is embedded throughout the platform." />

      {/* Page Header - Greeting Style */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-sm text-gray-500 mb-1">Good Morning,</p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{currentBrand.displayName}</h1>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1C3D2D] text-white text-sm font-medium rounded-full hover:bg-[#2a5440] transition-colors">
          <span>📊</span>
          Export Data
        </button>
      </div>

      {/* Ecosystem KPIs - Platform-wide */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Ecosystem Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon="🤝"
            value={ecosystemStats.totalPartners}
            label="Partners on Platform"
            trend={`${ecosystemStats.monthlyGrowth.partners} this month`}
            trendDirection="up"
            status="good"
          />
          <KPICard
            icon="📍"
            value={ecosystemStats.totalStations}
            label="Stations Network"
            trend={`${ecosystemStats.monthlyGrowth.stations} new`}
            trendDirection="up"
            status="good"
          />
          <KPICard
            icon="🔋"
            value={ecosystemStats.totalBatteries.toLocaleString()}
            label="Batteries Tracked"
            trend={`${ecosystemStats.monthlyGrowth.batteries}`}
            trendDirection="up"
            status="good"
          />
          <KPICard
            icon="🔄"
            value={ecosystemStats.dailySwaps.toLocaleString()}
            label="Daily Swaps Processed"
            status="good"
          />
        </div>
      </div>

      {/* Customer KPIs - Your Operations */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Your Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon="🏍️"
            value={fleetStats.activeBikes}
            label="Active Bikes"
            subtitle={`${Math.round((fleetStats.activeBikes / fleetStats.totalBikes) * 100)}% of ${fleetStats.totalBikes} total`}
            trend={`${fleetStats.bikesTrendPercent}%`}
            trendDirection="up"
            status="good"
          />
          <KPICard
            icon="🔋"
            value={fleetStats.totalBatteries}
            label="Your Batteries"
            subtitle={`${fleetStats.batteryHealthPercent}% healthy`}
            status="good"
          />
          <KPICard
            icon="📍"
            value={fleetStats.totalStations}
            label="Your Stations"
            subtitle={`${fleetStats.onlineStations} online / ${fleetStats.totalStations - fleetStats.onlineStations} offline`}
            status={fleetStats.onlineStations < fleetStats.totalStations ? 'warning' : 'good'}
          />
          <KPICard
            icon="💰"
            value={formatNaira(fleetStats.revenueToday)}
            label="Revenue Today"
            trend={`${fleetStats.swapsTrendPercent}%`}
            trendDirection="up"
            status="good"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Map - Takes 2 columns */}
        <div className="lg:col-span-2">
          <StationMap />
        </div>

        {/* AI Insights Panel */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center text-base">🤖</span>
              AI Insights
              <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {aiAlerts.filter(a => a.type === 'critical' || a.type === 'warning').length} Active
              </span>
            </h3>
            <a href="/maintenance" className="text-sm text-[#1C3D2D] hover:text-[#2a5440] font-medium">
              View All →
            </a>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {aiAlerts.slice(0, 5).map((alert) => (
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

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklySwapsChart />
        <EnergyIndependenceChart />
      </div>
    </MainLayout>
  );
}
