import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, User, Calendar, MapPin, MessageSquare, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function LeadDashboard() {
    // Mock Data
    const [leads] = useState([
        { id: 1, name: "Priya Sharma", type: "Wedding Photography", date: "2024-12-15", location: "Mumbai", status: "new", budget: "1.5L" },
        { id: 2, name: "Rahul Verma", type: "Pre-wedding Shoot", date: "2024-11-20", location: "Pune", status: "contacted", budget: "50k" },
        { id: 3, name: "Amit & Neha", type: "Engagement", date: "2024-10-05", location: "Delhi", status: "booked", budget: "75k" },
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
            case 'contacted': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
            case 'booked': return 'bg-green-100 text-green-700 hover:bg-green-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Leads & Inquiries</h2>
                    <p className="text-gray-500">Track and manage your potential clients.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input placeholder="Search name or phone..." className="pl-9 w-[250px]" />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
                <Card className="bg-blue-50 border-blue-100">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-blue-900">Total Inquiries</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-blue-700">24</div></CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-900">Booked</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-700">8</div></CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-100">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-orange-900">Pending</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-orange-700">5</div></CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-100">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-purple-900">Conversion Rate</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-purple-700">33%</div></CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All Leads</TabsTrigger>
                    <TabsTrigger value="new">New</TabsTrigger>
                    <TabsTrigger value="contacted">In Progress</TabsTrigger>
                    <TabsTrigger value="booked">Booked</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                    {leads.map((lead) => (
                        <Card key={lead.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{lead.name}</h3>
                                            <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {lead.date}</span>
                                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {lead.location}</span>
                                            </div>
                                            <div className="mt-2 text-sm font-medium text-primary bg-primary/5 inline-block px-2 py-0.5 rounded">
                                                Looking for: {lead.type} (Budget: {lead.budget})
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:items-end gap-2">
                                        <Badge variant="outline" className={`${getStatusColor(lead.status)} border-0 px-3 capitalize`}>
                                            {lead.status}
                                        </Badge>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" variant="outline" className="gap-2"><Phone className="h-3 w-3" /> Call</Button>
                                            <Button size="sm" className="gap-2"><MessageSquare className="h-3 w-3" /> Chat</Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
