'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionIndicatorProps {
    status: 'connected' | 'disconnected' | 'connecting';
    showLabel?: boolean;
}

export default function ConnectionIndicator({ status, showLabel = false }: ConnectionIndicatorProps) {
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        if (status === 'connecting') {
            const interval = setInterval(() => setPulse(p => !p), 500);
            return () => clearInterval(interval);
        }
        setPulse(false);
    }, [status]);

    const config = {
        connected: {
            dotColor: 'bg-green-400',
            textColor: 'text-green-400',
            label: 'Live',
            Icon: Wifi,
        },
        disconnected: {
            dotColor: 'bg-gray-500',
            textColor: 'text-gray-500',
            label: 'Local',
            Icon: WifiOff,
        },
        connecting: {
            dotColor: pulse ? 'bg-yellow-400' : 'bg-yellow-600',
            textColor: 'text-yellow-400',
            label: 'Connecting',
            Icon: Wifi,
        },
    }[status];

    return (
        <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
            {showLabel && (
                <span className={`text-xs font-medium ${config.textColor}`}>
                    {config.label}
                </span>
            )}
        </div>
    );
}
