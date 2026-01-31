'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Brand {
    id: string;
    name: string;
    displayName: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
}

export const brands: Brand[] = [
    {
        id: 'swapos',
        name: 'SwapOS',
        displayName: 'SwapOS Fleet Manager',
        logo: '/logos/swapos.svg',
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        accentColor: '#8B5CF6',
    },
    {
        id: 'energyx',
        name: 'EnergyX',
        displayName: 'EnergyX Swap Manager',
        logo: '/logos/energyx.svg',
        primaryColor: '#DC2626',
        secondaryColor: '#FCD34D',
        accentColor: '#F97316',
    },
    {
        id: 'solarflow',
        name: 'SolarFlow',
        displayName: 'SolarFlow Mobility',
        logo: '/logos/solarflow.svg',
        primaryColor: '#F59E0B',
        secondaryColor: '#10B981',
        accentColor: '#06B6D4',
    },
];

interface BrandContextType {
    currentBrand: Brand;
    setCurrentBrand: (brand: Brand) => void;
    brands: Brand[];
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
    const [currentBrand, setCurrentBrand] = useState<Brand>(brands[0]);

    // Update CSS variables when brand changes
    useEffect(() => {
        document.documentElement.style.setProperty('--brand-primary', currentBrand.primaryColor);
        document.documentElement.style.setProperty('--brand-secondary', currentBrand.secondaryColor);
        document.documentElement.style.setProperty('--brand-accent', currentBrand.accentColor);
    }, [currentBrand]);

    return (
        <BrandContext.Provider value={{ currentBrand, setCurrentBrand, brands }}>
            {children}
        </BrandContext.Provider>
    );
}

export function useBrand() {
    const context = useContext(BrandContext);
    if (context === undefined) {
        throw new Error('useBrand must be used within a BrandProvider');
    }
    return context;
}
