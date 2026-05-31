import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SwapOS Rider',
    description: 'Battery swap rider interface',
};

export default function RiderLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0b1326] text-white max-w-md mx-auto relative overflow-hidden font-sans">
            {children}
        </div>
    );
}
