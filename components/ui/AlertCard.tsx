import { formatTimeAgo } from '@/data/mockData';

interface AlertCardProps {
    type: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    onView?: () => void;
    onDismiss?: () => void;
}

export default function AlertCard({
    type,
    title,
    message,
    timestamp,
    onView,
    onDismiss,
}: AlertCardProps) {
    const typeConfig = {
        critical: {
            icon: '🔴',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-800',
        },
        warning: {
            icon: '🟡',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-800',
        },
        info: {
            icon: '🔵',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
        },
    };

    const config = typeConfig[type];

    return (
        <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 hover:shadow-sm transition-shadow`}>
            <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{config.icon}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className={`font-medium text-sm ${config.textColor} truncate`}>{title}</h4>
                        <span className="text-xs text-gray-500 flex-shrink-0">{formatTimeAgo(timestamp)}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{message}</p>
                    {(onView || onDismiss) && (
                        <div className="flex items-center gap-2 mt-2">
                            {onView && (
                                <button
                                    onClick={onView}
                                    className="text-xs font-medium text-gray-700 hover:text-gray-900"
                                >
                                    View
                                </button>
                            )}
                            {onDismiss && (
                                <button
                                    onClick={onDismiss}
                                    className="text-xs font-medium text-gray-500 hover:text-gray-700"
                                >
                                    Dismiss
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
