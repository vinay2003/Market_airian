import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle, Mail, Phone } from 'lucide-react';

export default function VendorPublicProfile() {
    const { id } = useParams<{ id: string }>();
    const [vendor, setVendor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const res = await api.get(`/vendors/public/${id}`);
                setVendor(res.data);
            } catch (err) {
                console.error("Failed to fetch vendor", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchVendor();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!vendor) return <div className="min-h-screen flex items-center justify-center">Vendor not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner Area */}
            <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                {vendor.bannerUrl && (
                    <img src={vendor.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-50" />
                )}
                <div className="absolute -bottom-16 left-8 md:left-20 flex items-end">
                    <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg border-4 border-white">
                        {vendor.logoUrl ? (
                            <img src={vendor.logoUrl} alt="Logo" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
                                {vendor.businessName?.[0] || 'V'}
                            </div>
                        )}
                    </div>
                    <div className="mb-4 ml-4">
                        <h1 className="text-3xl font-bold text-white drop-shadow-md flex items-center gap-2">
                            {vendor.businessName || 'Unnamed Vendor'}
                            <CheckCircle className="h-6 w-6 text-blue-400 fill-white" />
                        </h1>
                        <p className="text-blue-100 flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {vendor.city || 'Location N/A'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 pt-20 pb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="md:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {vendor.description || "No description provided yet."}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Services & Pricing</h2>
                        <div className="flex gap-4 flex-wrap">
                            {vendor.businessType && <Badge variant="secondary" className="text-md py-1 px-3 capitalize">{vendor.businessType}</Badge>}
                            {vendor.eventVolume && <Badge variant="outline" className="text-md py-1 px-3">{vendor.eventVolume} Events/Month</Badge>}
                            {vendor.avgBookingPrice && <Badge variant="outline" className="text-md py-1 px-3">Avg Price: {vendor.avgBookingPrice}</Badge>}
                        </div>
                    </section>

                    {vendor.packagesOffered && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Packages</h2>
                            <Card>
                                <CardContent className="p-4">
                                    <p className="whitespace-pre-wrap text-gray-600">{vendor.packagesOffered}</p>
                                </CardContent>
                            </Card>
                        </section>
                    )}
                </div>

                {/* Right Column: Contact & CTA */}
                <div className="space-y-6">
                    <Card className="sticky top-8">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-xl font-bold">Contact Vendor</h3>
                            <p className="text-sm text-gray-500">Interested in their services? Get in touch.</p>

                            <div className="space-y-2">
                                {vendor.user?.email && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Mail className="h-4 w-4" /> {vendor.user.email}
                                    </div>
                                )}
                                {vendor.user?.phone && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone className="h-4 w-4" /> {vendor.user.phone}
                                    </div>
                                )}
                            </div>

                            <Button className="w-full bg-black text-white hover:bg-gray-800">
                                Request Quote
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
