'use client';

import { useState } from 'react';
import { Monitor, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

export default function SplitScreenPage() {
    const [riderExpanded, setRiderExpanded] = useState(false);

    return (
        <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">SwapOS — Live Demo</span>
                    <span className="text-xs text-gray-500">|</span>
                    <span className="text-xs text-green-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Simulation Running
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setRiderExpanded(!riderExpanded)}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
                        title={riderExpanded ? 'Collapse rider view' : 'Expand rider view'}
                    >
                        {riderExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Split Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Dashboard Panel */}
                <div className={`transition-all duration-300 ${riderExpanded ? 'w-1/2' : 'w-2/3'} border-r border-gray-800`}>
                    <div className="h-full flex flex-col">
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 border-b border-gray-800">
                            <Monitor className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs font-medium text-gray-300">Fleet Dashboard</span>
                        </div>
                        <div className="flex-1">
                            <iframe
                                src="/"
                                className="w-full h-full border-0"
                                title="Fleet Dashboard"
                            />
                        </div>
                    </div>
                </div>

                {/* Rider Panel */}
                <div className={`transition-all duration-300 ${riderExpanded ? 'w-1/2' : 'w-1/3'}`}>
                    <div className="h-full flex flex-col">
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 border-b border-gray-800">
                            <Smartphone className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-xs font-medium text-gray-300">Rider App</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-gray-950 p-4">
                            {/* Phone frame */}
                            <div className="w-full max-w-[375px] h-full max-h-[812px] rounded-[2.5rem] border-4 border-gray-700 overflow-hidden shadow-2xl shadow-black/50 relative">
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-700 rounded-b-2xl z-10" />
                                <iframe
                                    src="/rider"
                                    className="w-full h-full border-0"
                                    title="Rider App"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
