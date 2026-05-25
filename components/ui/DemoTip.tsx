'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface DemoTipProps {
    message: string;
}

export default function DemoTip({ message }: DemoTipProps) {
    const [dismissed, setDismissed] = useState(false);
    const { isPresentation } = useTheme();

    if (dismissed || !isPresentation) return null;

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800 font-medium">{message}</p>
            </div>
            <button
                onClick={() => setDismissed(true)}
                className="text-amber-600 hover:text-amber-800 text-sm font-medium ml-4"
            >
                Dismiss
            </button>
        </div>
    );
}
