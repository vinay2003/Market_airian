import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Navbar } from '@/components/navigation/Navbar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';

export function DashboardLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-muted/20">
            <Sidebar className={`transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 z-50' : '-translate-x-full'}`} />

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">
                <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />

                <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                    <Breadcrumbs />
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
