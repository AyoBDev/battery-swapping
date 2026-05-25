export default function RiderLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-900 text-white max-w-md mx-auto relative overflow-hidden">
            {children}
        </div>
    );
}
