import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

interface Booking {
    id: string;
    customerName: string;
    customerAvatar?: string;
    date: string;
    time: string;
    package: string;
    price: string;
    status: BookingStatus;
    notes: string;
    requestedAt: string;
}

const MOCK_BOOKINGS: Booking[] = [
    {
        id: '1',
        customerName: 'Aarav Patel',
        date: '2024-11-15',
        time: '10:00 AM',
        package: 'Gold Wedding Package',
        price: '50000',
        status: 'pending',
        notes: 'We are looking for candid photography mostly.',
        requestedAt: '2024-10-01'
    },
    {
        id: '2',
        customerName: 'Diya Sharma',
        date: '2024-12-20',
        time: '06:00 PM',
        package: 'Basic Photography',
        price: '25000',
        status: 'accepted',
        notes: 'Outdoor reception.',
        requestedAt: '2024-09-28'
    },
    {
        id: '3',
        customerName: 'Rohan Gupta',
        date: '2024-10-10',
        time: '09:00 AM',
        package: 'Premium Video',
        price: '85000',
        status: 'rejected',
        notes: 'Destination wedding in Goa.',
        requestedAt: '2024-09-25'
    }
];

export default function BookingsManager() {
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleStatusChange = (id: string, newStatus: BookingStatus) => {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
        toast({
            title: `Booking ${newStatus === 'accepted' ? 'Accepted' : 'Updated'}`,
            description: `Customer has been notified.`
        });
    };

    const confirmReject = () => {
        if (selectedBooking) {
            handleStatusChange(selectedBooking.id, 'rejected');
            setRejectDialogOpen(false);
            setRejectionReason('');
        }
    };

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
        }
    };

    const BookingCard = ({ booking }: { booking: Booking }) => (
        <Card className="mb-4 overflow-hidden">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarFallback>{booking.customerName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-lg">{booking.customerName}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(booking.date).toLocaleDateString()}
                                        <span className="mx-1">•</span>
                                        <Clock className="h-4 w-4" />
                                        {booking.time}
                                    </div>
                                </div>
                            </div>
                            <Badge variant="secondary" className={getStatusColor(booking.status)}>
                                {booking.status.toUpperCase()}
                            </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm mt-4">
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Package</p>
                                <p className="font-medium">{booking.package}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Price</p>
                                <p className="font-medium">₹{parseInt(booking.price).toLocaleString()}</p>
                            </div>
                        </div>

                        {booking.notes && (
                            <div className="bg-muted/50 p-3 rounded-md text-sm">
                                <p className="font-medium mb-1 flex items-center gap-2">
                                    <MessageSquare className="h-3 w-3" /> Note from Customer:
                                </p>
                                <p className="text-muted-foreground">{booking.notes}</p>
                            </div>
                        )}
                    </div>

                    {booking.status === 'pending' && (
                        <div className="bg-gray-50 md:w-48 p-4 flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l">
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleStatusChange(booking.id, 'accepted')}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" /> Accept
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                onClick={() => {
                                    setSelectedBooking(booking);
                                    setRejectDialogOpen(true);
                                }}
                            >
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
                    <p className="text-muted-foreground">Manage your incoming requests and schedule.</p>
                </div>
            </div>

            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="all">All Bookings</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({bookings.filter(b => b.status === 'pending').length})</TabsTrigger>
                    <TabsTrigger value="accepted">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Past</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-6">
                    {bookings.map(b => <BookingCard key={b.id} booking={b} />)}
                </TabsContent>
                <TabsContent value="pending" className="space-y-4 mt-6">
                    {bookings.filter(b => b.status === 'pending').length > 0 ? (
                        bookings.filter(b => b.status === 'pending').map(b => <BookingCard key={b.id} booking={b} />)
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">No pending requests.</div>
                    )}
                </TabsContent>
                <TabsContent value="accepted" className="space-y-4 mt-6">
                    {bookings.filter(b => b.status === 'accepted').map(b => <BookingCard key={b.id} booking={b} />)}
                </TabsContent>
                <TabsContent value="completed" className="space-y-4 mt-6">
                    {bookings.filter(b => ['completed', 'rejected'].includes(b.status)).map(b => <BookingCard key={b.id} booking={b} />)}
                </TabsContent>
            </Tabs>

            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Booking Request</DialogTitle>
                        <DialogDescription>
                            Let the customer know why you cannot accept this booking.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Reason for rejection (e.g. date unavailable)..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmReject}>Reject Booking</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
