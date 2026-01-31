'use client';

import { useState } from 'react';

interface DemoTipProps {
    message: string;
}

export default function DemoTip({ message }: DemoTipProps) {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    return (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="text-xl">💡</span>
                <p className="text-sm text-amber-800 font-medium">{message}</p>
            </div>
            <button
                onClick={() => setDismissed(true)}
                className="text-amber-600 hover:text-amber-800 text-sm font-medium"
            >
                Dismiss
            </button>
        </div>
    );
}
