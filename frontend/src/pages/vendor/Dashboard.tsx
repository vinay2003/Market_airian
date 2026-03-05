import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MetricCard } from '@/components/shared/MetricCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    IndianRupee,
    CalendarCheck,
    Package,
    Eye,
    Plus,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

interface DashboardStats {
    totalRevenue: number;
    revenueTrend: number;
    activeBookings: number;
    pendingBookings: number;
    activePackages: number;
    draftPackages: number;
    profileViews: number;
    profileViewsTrend: number;
    recentBookings: any;
}

export default function VendorDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/vendors/dashboard');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const bookings = stats?.recentBookings || [
        { id: 1, user: { firstName: 'Vihaan', lastName: 'Bansal' }, title: 'Wedding Photography', date: '2026-10-24T00:00:00.000Z', status: 'requested' },
        { id: 2, user: { firstName: 'Vihaan', lastName: 'Bansal' }, title: 'Wedding Photography', date: '2026-10-24T00:00:00.000Z', status: 'requested' },
        { id: 3, user: { firstName: 'Vihaan', lastName: 'Bansal' }, title: 'Wedding Photography', date: '2026-10-24T00:00:00.000Z', status: 'requested' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.firstName || 'Vendor'}. Here's what's happening today.
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Link to="/vendor/bookings" className="flex-1 md:flex-none">
                        <Button variant="outline" className="w-full md:w-auto">View Bookings</Button>
                    </Link>
                    <Link to="/vendor/packages?create=true" className="flex-1 md:flex-none">
                        <Button className="w-full md:w-auto">
                            <Plus className="mr-2 h-4 w-4" /> Create Package
                        </Button>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            title="Total Revenue"
                            value={`₹${stats?.totalRevenue.toLocaleString() || '12,450'}`}
                            icon={IndianRupee}
                            trend={{ value: stats?.revenueTrend || 12, isPositive: true }}
                            description="from last month"
                        />
                        <MetricCard
                            title="Active Bookings"
                            value={(stats?.activeBookings || 4).toString()}
                            icon={CalendarCheck}
                            description={`${stats?.pendingBookings || 2} pending approval`}
                        />
                        <MetricCard
                            title="Active Packages"
                            value={(stats?.activePackages || 3).toString()}
                            icon={Package}
                            description={`${stats?.draftPackages || 1} draft package`}
                        />
                        <MetricCard
                            title="Profile Views"
                            value={(stats?.profileViews || 1240).toLocaleString()}
                            icon={Eye}
                            trend={{ value: stats?.profileViewsTrend || 8, isPositive: true }}
                            description="in the last 30 days"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Recent Bookings</CardTitle>
                                <CardDescription>
                                    You have {stats?.pendingBookings || 2} pending booking requests.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {bookings.map((b: any, i: number) => {
                                        const initials = b.user?.firstName ? `${b.user.firstName.charAt(0)}${b.user.lastName ? b.user.lastName.charAt(0) : ''}` : 'VB';
                                        const name = b.user?.firstName ? `${b.user.firstName} ${b.user.lastName || ''}` : 'Vihaan Bansal';
                                        const date = b.date ? new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 24, 2026';

                                        return (
                                            <div key={b.id || i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{name}</p>
                                                        <p className="text-xs text-muted-foreground">{b.title || 'Wedding Photography'} • {date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${b.status === 'confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}>
                                                        {b.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                                    </span>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Manage your store efficiently.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-2">
                                <Link to="/vendor/profile">
                                    <Button variant="outline" className="w-full justify-start h-auto py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="font-semibold">Update Profile</span>
                                            <span className="text-xs text-muted-foreground font-normal">Edit bio, contact info, and branding.</span>
                                        </div>
                                    </Button>
                                </Link>
                                <Link to="/vendor/gallery">
                                    <Button variant="outline" className="w-full justify-start h-auto py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="font-semibold">Manage Gallery</span>
                                            <span className="text-xs text-muted-foreground font-normal">Upload new photos of your work.</span>
                                        </div>
                                    </Button>
                                </Link>
                                <Link to="/vendor/packages">
                                    <Button variant="outline" className="w-full justify-start h-auto py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="font-semibold">Edit Packages</span>
                                            <span className="text-xs text-muted-foreground font-normal">Update prices and deliverables.</span>
                                        </div>
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
