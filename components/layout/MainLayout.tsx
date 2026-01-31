import Header from './Header';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <Header />
            <main className="max-w-[1800px] mx-auto px-6 py-6">
                {children}
            </main>
        </div>
    );
}
