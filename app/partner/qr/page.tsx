'use client';

import { QRCodeSVG } from 'qrcode.react';

const PARTNER_URL = typeof window !== 'undefined'
    ? `${window.location.origin}/partner`
    : 'https://swapos.app/partner';

export default function PartnerQRPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
            <div className="text-center max-w-sm">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#1C3D2D] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">S</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">SwapOS</span>
                </div>

                {/* QR Code */}
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 inline-block mb-6">
                    <QRCodeSVG
                        value={PARTNER_URL}
                        size={240}
                        level="M"
                        bgColor="#ffffff"
                        fgColor="#1C3D2D"
                    />
                </div>

                {/* CTA */}
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                    Join the Battery Swapping Network
                </h1>
                <p className="text-gray-500 text-sm mb-4">
                    Scan to become an early partner
                </p>

                {/* URL fallback */}
                <p className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-2 rounded-lg">
                    {PARTNER_URL}
                </p>
            </div>
        </div>
    );
}
