import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';

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

export default function BookingsManager() {
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/events/my-events');
                const formatted = res.data.map((event: any) => {
                    const eventDate = new Date(event.date);

                    let pStatus: BookingStatus = 'pending';
                    if (event.status === 'confirmed') pStatus = 'accepted';
                    if (event.status === 'cancelled') pStatus = 'rejected';
                    if (event.status === 'completed') pStatus = 'completed';

                    return {
                        id: event.id,
                        customerName: event.user ? `${event.user.firstName || ''} ${event.user.lastName || ''}`.trim() || 'Guest Customer' : 'Unknown Customer',
                        date: eventDate.toISOString(),
                        time: eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        package: event.title || 'Custom booking',
                        price: event.price || '0', // fallback if price is unused
                        status: pStatus,
                        notes: event.description || '',
                        requestedAt: event.createdAt
                    };
                });
                setBookings(formatted);
            } catch (err) {
                console.error("Failed to fetch bookings", err);
                toast({
                    title: "Error loading bookings",
                    description: "Please check your connection or try again later.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [toast]);

    const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
        try {
            // Map our UI status to the Backend EventStatus
            let backendStatus = 'requested';
            if (newStatus === 'accepted') backendStatus = 'confirmed';
            if (newStatus === 'rejected') backendStatus = 'cancelled';
            if (newStatus === 'completed') backendStatus = 'completed';

            await api.patch(`/events/${id}/status`, { status: backendStatus });

            setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
            toast({
                title: `Booking ${newStatus === 'accepted' ? 'Accepted' : 'Updated'}`,
                description: `Customer has been notified.`
            });
        } catch (error) {
            toast({
                title: "Failed to update booking",
                description: "An error occurred while updating status.",
                variant: "destructive"
            });
        }
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
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const BookingCard = ({ booking }: { booking: Booking }) => {
        const initials = booking.customerName.charAt(0).toUpperCase() || '?';

        return (
            <Card className="mb-4 overflow-hidden shadow-sm">
                <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                        <div className="p-6 flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-lg">{booking.customerName}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(booking.date).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                            <span className="mx-1">•</span>
                                            <Clock className="h-4 w-4" />
                                            {booking.time}
                                        </div>
                                    </div>
                                </div>
                                <Badge variant="secondary" className={`capitalize ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm mt-4">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Requirements</p>
                                    <p className="font-medium">{booking.package}</p>
                                </div>
                            </div>

                            {booking.notes && (
                                <div className="bg-muted/50 p-3 rounded-md text-sm mt-4">
                                    <p className="font-medium mb-1 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-primary" /> Note from Customer:
                                    </p>
                                    <p className="text-muted-foreground">{booking.notes}</p>
                                </div>
                            )}
                        </div>

                        {booking.status === 'pending' && (
                            <div className="bg-gray-50 md:w-48 p-4 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l">
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm"
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
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
                    <p className="text-muted-foreground mt-1">Manage your incoming requests and schedule.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pending" className="relative">
                            Pending
                            <span className="ml-1.5 inline-flex items-center justify-center bg-primary/20 text-primary h-5 w-5 rounded-full text-[10px] font-medium">
                                {bookings.filter(b => b.status === 'pending').length}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="accepted">Upcoming</TabsTrigger>
                        <TabsTrigger value="completed">Past</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4 mt-6">
                        {bookings.length > 0 ? (
                            bookings.map(b => <BookingCard key={b.id} booking={b} />)
                        ) : (
                            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20">
                                <p className="text-muted-foreground">You don't have any bookings yet.</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="pending" className="space-y-4 mt-6">
                        {bookings.filter(b => b.status === 'pending').length > 0 ? (
                            bookings.filter(b => b.status === 'pending').map(b => <BookingCard key={b.id} booking={b} />)
                        ) : (
                            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                                No pending requests at the moment.
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="accepted" className="space-y-4 mt-6">
                        {bookings.filter(b => b.status === 'accepted').length > 0 ? (
                            bookings.filter(b => b.status === 'accepted').map(b => <BookingCard key={b.id} booking={b} />)
                        ) : (
                            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                                No upcoming bookings found.
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="completed" className="space-y-4 mt-6">
                        {bookings.filter(b => ['completed', 'rejected'].includes(b.status)).length > 0 ? (
                            bookings.filter(b => ['completed', 'rejected'].includes(b.status)).map(b => <BookingCard key={b.id} booking={b} />)
                        ) : (
                            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                                No past or cancelled bookings to show.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            )}

            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Decline Booking Request</DialogTitle>
                        <DialogDescription>
                            Let the customer know why you cannot accept this booking. They will be notified via email or SMS.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Reason for declining (e.g., date unavailable, outside service area)..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmReject}>Confirm Decline</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
