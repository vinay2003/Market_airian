import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin } from 'lucide-react';

type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

const MOCK_USER_BOOKINGS = [
    {
        id: '1',
        vendorName: 'Luxe Moments Photography',
        vendorImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=200',
        date: '2024-11-15',
        time: '10:00 AM',
        package: 'Gold Wedding Package',
        price: '50000',
        status: 'pending' as BookingStatus,
        location: 'Mumbai, India'
    },
    {
        id: '2',
        vendorName: 'Royal Palace Gardens',
        vendorImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb490e?q=80&w=200',
        date: '2024-12-20',
        time: '06:00 PM',
        package: 'Banquet Hall Rental',
        price: '200000',
        status: 'accepted' as BookingStatus,
        location: 'Udaipur, India'
    }
];

export default function UserBookings() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
                <p className="text-muted-foreground">Track the status of your event requests.</p>
            </div>

            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All Requests</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-6">
                    {MOCK_USER_BOOKINGS.map(booking => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                </TabsContent>
                <TabsContent value="upcoming" className="space-y-4 mt-6">
                    {MOCK_USER_BOOKINGS.filter(b => b.status === 'accepted').map(booking => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                </TabsContent>
                <TabsContent value="pending" className="space-y-4 mt-6">
                    {MOCK_USER_BOOKINGS.filter(b => b.status === 'pending').map(booking => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function BookingCard({ booking }: { booking: any }) {
    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0 flex flex-col md:flex-row">
                <div className="w-full md:w-48 h-32 md:h-auto relative">
                    <img src={booking.vendorImage} alt={booking.vendorName} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                        <div>
                            <h3 className="font-semibold text-lg">{booking.vendorName}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <MapPin className="h-4 w-4" /> {booking.location}
                            </div>
                        </div>
                        <Badge variant="secondary" className={getStatusColor(booking.status)}>
                            {booking.status.toUpperCase()}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.time}</span>
                        </div>
                        <div className="col-span-2 font-medium">
                            {booking.package} (₹{parseInt(booking.price).toLocaleString()})
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        {booking.status === 'accepted' && (
                            <Button size="sm">Pay Now</Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
