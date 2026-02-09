import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    LayoutDashboard,
    Briefcase,
    Image as ImageIcon,
    Users,
    Settings,
    LogOut,
    Menu,
    Store,
    Bell,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface VendorLayoutProps {
    children: React.ReactNode;
}

export default function VendorLayout({ children }: VendorLayoutProps) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { label: 'Overview', icon: LayoutDashboard, path: '/vendor/dashboard' },
        { label: 'Services & Packages', icon: Briefcase, path: '/vendor/services' },
        { label: 'Gallery', icon: ImageIcon, path: '/vendor/gallery' },
        { label: 'Leads & Inquiries', icon: Users, path: '/vendor/leads' },
        { label: 'Profile Settings', icon: Store, path: '/vendor/profile' },
        { label: 'Account Settings', icon: Settings, path: '/vendor/settings' },
    ];

    const isActive = (path: string) => {
        if (path === '/vendor/dashboard' && location.pathname === '/vendor/dashboard') return true;
        if (path !== '/vendor/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`fixed md:sticky top-0 h-screen w-72 bg-white border-r border-gray-100 z-50 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                <div className="p-6 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
                        <div>
                            <h2 className="font-heading font-bold text-lg tracking-tight">MarketFly</h2>
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Vendor Portal</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(item.path) ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-50">
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Users className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-medium">Monthly Views</div>
                                <div className="text-sm font-bold text-gray-900">1,240</div>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[70%]" />
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-heading font-bold text-gray-900 md:hidden">My Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-primary transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                        </Button>

                        <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="pl-2 pr-1 h-auto py-1.5 rounded-full hover:bg-gray-50">
                                    <div className="flex items-center gap-3 text-left">
                                        <Avatar className="h-8 w-8 border border-gray-200">
                                            <AvatarImage src={user?.avatar} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {user?.firstName?.[0] || 'V'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden sm:block">
                                            <div className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.firstName}</div>
                                            <div className="text-xs text-gray-500 font-medium">Vendor Account</div>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem onClick={() => navigate('/vendor/profile')}>Profile</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/vendor/settings')}>Settings</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={logout}>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
