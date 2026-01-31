interface InventoryBarProps {
    current: number;
    total: number;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function InventoryBar({
    current,
    total,
    showLabel = true,
    size = 'md'
}: InventoryBarProps) {
    const percentage = total > 0 ? (current / total) * 100 : 0;

    let barColor = 'bg-green-500';
    if (percentage <= 20) {
        barColor = 'bg-red-500';
    } else if (percentage <= 40) {
        barColor = 'bg-yellow-500';
    }

    const sizeClasses = {
        sm: 'h-1.5',
        md: 'h-2',
        lg: 'h-3',
    };

    return (
        <div className="w-full">
            <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
                <div
                    className={`${barColor} ${sizeClasses[size]} rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600">{current}/{total} batteries</span>
                    {percentage <= 30 && (
                        <span className="text-xs text-yellow-600 font-medium">⚠️</span>
                    )}
                </div>
            )}
        </div>
    );
}
