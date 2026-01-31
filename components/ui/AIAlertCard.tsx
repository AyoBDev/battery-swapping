import { formatTimeAgo } from '@/data/mockData';

interface AIAlertCardProps {
    type: 'critical' | 'warning' | 'info';
    asset: string;
    title: string;
    issue: string;
    evidence: string;
    risk: string;
    recommendation: string;
    timeline: 'Immediate' | 'This week' | 'Monitor';
    timestamp: Date;
    actionLabel?: string;
    onAction?: () => void;
    compact?: boolean;
}

export default function AIAlertCard({
    type,
    asset,
    title,
    issue,
    evidence,
    risk,
    recommendation,
    timeline,
    timestamp,
    actionLabel,
    onAction,
    compact = false,
}: AIAlertCardProps) {
    const typeConfig = {
        critical: {
            icon: '🔴',
            borderColor: 'border-l-red-500',
            bgColor: 'bg-red-50',
            badgeColor: 'bg-red-100 text-red-700',
            timelineColor: 'text-red-600',
        },
        warning: {
            icon: '🟡',
            borderColor: 'border-l-yellow-500',
            bgColor: 'bg-yellow-50',
            badgeColor: 'bg-yellow-100 text-yellow-700',
            timelineColor: 'text-yellow-600',
        },
        info: {
            icon: '🔵',
            borderColor: 'border-l-blue-500',
            bgColor: 'bg-blue-50',
            badgeColor: 'bg-blue-100 text-blue-700',
            timelineColor: 'text-blue-600',
        },
    };

    const config = typeConfig[type];

    if (compact) {
        return (
            <div className={`${config.bgColor} border-l-4 ${config.borderColor} rounded-r-lg p-3 hover:shadow-sm transition-shadow`}>
                <div className="flex items-start gap-2">
                    <span className="text-sm flex-shrink-0">{config.icon}</span>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="font-medium text-sm text-gray-900 truncate">{title}</h4>
                            <span className="text-xs text-gray-500 flex-shrink-0">{formatTimeAgo(timestamp)}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{asset} — {issue}</p>
                        <p className="text-xs text-gray-500 mt-1 italic">&quot;{recommendation}&quot;</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${config.bgColor} border-l-4 ${config.borderColor} rounded-r-lg p-4 hover:shadow-md transition-shadow`}>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{config.icon}</span>
                    <div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${config.badgeColor}`}>
                            {type.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">— {asset}</span>
                    </div>
                </div>
                <span className="text-xs text-gray-500">{formatTimeAgo(timestamp)}</span>
            </div>

            {/* Title & Issue */}
            <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-700 mb-3">{issue}</p>

            {/* Details Grid */}
            <div className="space-y-2 mb-4">
                <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Evidence</p>
                    <p className="text-sm text-gray-700">{evidence}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Risk</p>
                    <p className="text-sm text-gray-700">{risk}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Recommendation</p>
                    <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className={`text-sm font-medium ${config.timelineColor}`}>
                    Timeline: {timeline}
                </span>
                {actionLabel && (
                    <button
                        onClick={onAction}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${type === 'critical'
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : type === 'warning'
                                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    );
}
