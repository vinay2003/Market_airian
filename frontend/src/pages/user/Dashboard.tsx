import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Heart } from 'lucide-react';

export default function UserDashboard() {
    const { user, logout } = useAuth();
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events/my-events');
                setEvents(res.data);
            } catch (err) {
                console.error("Failed to fetch events", err);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="bg-black text-white h-8 w-8 rounded flex items-center justify-center font-bold">M</div>
                    <span className="font-bold text-xl">MarketFly</span>
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" onClick={logout}>Logout</Button>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Hello, {(user as any)?.firstName || 'User'}!</h1>
                        <p className="text-gray-500">Find the perfect vendors for your next event.</p>
                    </div>
                </div>

                <Tabs defaultValue="recommended" className="w-full">
                    <TabsList>
                        <TabsTrigger value="recommended">Recommended</TabsTrigger>
                        <TabsTrigger value="events">My Events</TabsTrigger>
                        <TabsTrigger value="saved">Saved Vendors</TabsTrigger>
                    </TabsList>

                    <TabsContent value="recommended" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Mock Recommendations */}
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="h-40 bg-gray-200 w-full animate-pulse" />
                                    <CardContent className="p-4">
                                        <h3 className="font-bold text-lg">Amazing Vendor {i}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <MapPin className="h-3 w-3" /> Mumbai
                                        </p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <Badge variant="secondary">Wedding</Badge>
                                            <Button size="sm" variant="outline">View</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="events" className="mt-6">
                        {events.length === 0 ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>No Upcoming Events</CardTitle>
                                    <CardDescription>You haven't booked any vendors yet.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-40 flex items-center justify-center">
                                    <Button>Browse Vendors</Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <Card key={event.id}>
                                        <CardContent className="p-6 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-lg">{event.title}</h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" /> {new Date(event.date).toLocaleDateString()}
                                                    <span className="text-gray-300">|</span>
                                                    With {event.vendor?.businessName || 'Vendor'}
                                                </p>
                                            </div>
                                            <Badge className={
                                                event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    event.status === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }>
                                                {event.status}
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="saved" className="mt-6">
                        <div className="text-center text-gray-500 py-12">
                            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>You haven't saved any vendors yet.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
