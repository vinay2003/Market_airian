import { Outlet } from 'react-router-dom';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col font-sans w-full">
            <Navbar />
            <main className="flex-1 w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
