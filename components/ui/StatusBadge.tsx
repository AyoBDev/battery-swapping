interface StatusBadgeProps {
    status: 'online' | 'active' | 'idle' | 'warning' | 'low_inventory' | 'offline' | 'critical' | 'maintenance';
    size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const statusConfig = {
        online: { label: 'Online', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
        active: { label: 'Active', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
        idle: { label: 'Idle', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
        warning: { label: 'Warning', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
        low_inventory: { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
        offline: { label: 'Offline', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
        critical: { label: 'Critical', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
        maintenance: { label: 'Maint', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' },
    };

    const config = statusConfig[status];
    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.color} ${sizeClasses}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {config.label}
        </span>
    );
}
