import { ReactNode } from 'react';

interface KPICardProps {
    icon: ReactNode;
    value: number | string;
    label: string;
    subtitle?: string;
    trend?: string;
    trendDirection?: 'up' | 'down';
    status?: 'good' | 'warning' | 'critical';
}

export default function KPICard({
    icon,
    value,
    label,
    subtitle,
    trend,
    trendDirection,
    status = 'good',
}: KPICardProps) {
    const iconBgColors = {
        good: 'bg-emerald-50 text-emerald-600',
        warning: 'bg-amber-50 text-amber-600',
        critical: 'bg-red-50 text-red-600',
    };

    const trendStyles = {
        up: 'bg-emerald-100 text-emerald-700',
        down: 'bg-red-100 text-red-700',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </span>
                        {trend && trendDirection && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${trendStyles[trendDirection]}`}>
                                {trendDirection === 'up' ? '↑' : '↓'} {trend}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgColors[status]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
