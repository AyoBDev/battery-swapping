'use client';

import { useBrand } from '@/contexts/BrandContext';
import Image from 'next/image';

export default function BrandSelector() {
    const { currentBrand, setCurrentBrand, brands } = useBrand();

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-700">Preview Branding:</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Click to see how the platform looks with different branding
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {brands.map((brand) => (
                        <button
                            key={brand.id}
                            onClick={() => setCurrentBrand(brand)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${currentBrand.id === brand.id
                                    ? 'border-indigo-500 bg-white shadow-sm'
                                    : 'border-transparent bg-white/50 hover:bg-white hover:border-gray-200'
                                }`}
                        >
                            <div className="relative">
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    width={24}
                                    height={24}
                                    className="rounded"
                                />
                                {currentBrand.id === brand.id && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white" />
                                )}
                            </div>
                            <span className={`text-sm font-medium ${currentBrand.id === brand.id ? 'text-gray-900' : 'text-gray-600'
                                }`}>
                                {brand.name}
                            </span>
                            {brand.id === 'swapos' && (
                                <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                                    Demo
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
