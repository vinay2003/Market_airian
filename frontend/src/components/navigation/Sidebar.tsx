import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Calendar,
    Package,
    Image,
    Settings,
    LogOut,
    Heart,
    ShoppingBag,
    User,
    Store
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const pathname = location.pathname;

    const vendorRoutes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/vendor/dashboard",
            pattern: "/vendor/dashboard"
        },
        {
            label: "Bookings",
            icon: Calendar,
            href: "/vendor/bookings",
            pattern: "/vendor/bookings"
        },
        {
            label: "Packages",
            icon: Package,
            href: "/vendor/packages",
            pattern: "/vendor/packages"
        },
        {
            label: "Gallery",
            icon: Image,
            href: "/vendor/gallery",
            pattern: "/vendor/gallery"
        },
        {
            label: "Profile",
            icon: Store,
            href: "/vendor/profile",
            pattern: "/vendor/profile"
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/vendor/settings",
            pattern: "/vendor/settings"
        },
    ];

    const userRoutes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/user/dashboard",
            pattern: "/user/dashboard"
        },
        {
            label: "My Bookings",
            icon: ShoppingBag,
            href: "/user/bookings",
            pattern: "/user/bookings"
        },
        {
            label: "Favorites",
            icon: Heart,
            href: "/user/favorites",
            pattern: "/user/favorites"
        },
        {
            label: "Profile",
            icon: User,
            href: "/user/profile",
            pattern: "/user/profile"
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/user/settings",
            pattern: "/user/settings"
        },
    ];

    const routes = user?.role === 'vendor' ? vendorRoutes : userRoutes;

    return (
        <div className={cn("pb-12 w-64 border-r bg-card h-screen fixed left-0 top-0 hidden md:block", className)}>
            <div className="space-y-4 py-4 h-full flex flex-col">
                <div className="px-4 py-2 flex-none">
                    <h2 className="mb-2 px-2 text-xl font-heading font-bold tracking-tight text-primary">
                        Market Airian
                    </h2>
                    <p className="px-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        {user?.role === 'vendor' ? 'Vendor Portal' : 'User Portal'}
                    </p>
                </div>
                <ScrollAreaStub className="px-3 py-2 flex-1">
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Link key={route.href} to={route.href}>
                                <Button
                                    variant={pathname.startsWith(route.pattern) ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-2",
                                        pathname.startsWith(route.pattern) && "font-semibold text-primary bg-primary/10"
                                    )}
                                >
                                    <route.icon className="h-4 w-4" />
                                    {route.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </ScrollAreaStub>
            </div>
            <div className="absolute bottom-4 left-0 w-full px-3">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}

// Simple fallback for ScrollArea since we might not have it installed
function ScrollAreaStub({ className, children }: any) {
    return <div className={cn("overflow-auto", className)}>{children}</div>;
}
