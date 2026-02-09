import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, CheckCircle, Mail, Phone, Calendar, Star, ShieldCheck, Image as ImageIcon, Box } from 'lucide-react';
import { motion } from 'framer-motion';

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

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-primary font-medium">Loading Profile...</div></div>;
    if (!vendor) return <div className="min-h-screen flex items-center justify-center text-red-500">Vendor not found</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Hero Section with Parallax-like effect */}
            <div className="relative h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10" />
                {vendor.bannerUrl ? (
                    <img src={vendor.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900" />
                )}

                <div className="absolute bottom-0 left-0 w-full z-20 container mx-auto px-4 pb-8 flex items-end gap-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white shrink-0"
                    >
                        {vendor.logoUrl ? (
                            <img src={vendor.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                                {vendor.businessName?.[0] || 'V'}
                            </div>
                        )}
                    </motion.div>

                    <div className="mb-2 text-white drop-shadow-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-white border-white/40 bg-white/10 backdrop-blur-sm uppercase tracking-wider text-[10px]">
                                {vendor.businessType || 'Vendor'}
                            </Badge>
                            <div className="flex items-center text-yellow-400 text-sm">
                                <Star fill="currentColor" className="w-4 h-4" />
                                <span className="ml-1 font-medium text-white">4.9</span>
                                <span className="ml-1 text-white/80">(24 reviews)</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-heading font-bold flex items-center gap-3">
                            {vendor.businessName}
                            <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-blue-400 fill-white" />
                        </h1>
                        <p className="text-lg text-white/90 flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4" /> {vendor.city} {vendor.landmark && `• ${vendor.landmark}`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                            <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-3 text-base">Overview</TabsTrigger>
                            <TabsTrigger value="packages" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-3 text-base">Packages</TabsTrigger>
                            <TabsTrigger value="gallery" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-3 text-base">Gallery</TabsTrigger>
                            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-3 text-base">Reviews</TabsTrigger>
                        </TabsList>

                        <div className="mt-6">
                            <TabsContent value="overview" className="space-y-8">
                                <section>
                                    <h2 className="text-2xl font-bold mb-4 font-heading">About</h2>
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        {vendor.description || "No specific description available. Contact the vendor for more details."}
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                        <div className="bg-white p-4 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm">
                                            <Calendar className="h-8 w-8 text-primary mb-2 opacity-80" />
                                            <span className="text-2xl font-bold">{vendor.yearsInBusiness || 0}+</span>
                                            <span className="text-xs text-gray-500 uppercase tracking-wide">Years Exp</span>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm">
                                            <CheckCircle className="h-8 w-8 text-green-500 mb-2 opacity-80" />
                                            <span className="text-2xl font-bold">{vendor.eventVolume || '10+'}</span>
                                            <span className="text-xs text-gray-500 uppercase tracking-wide">Events/Mo</span>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm">
                                            <ShieldCheck className="h-8 w-8 text-blue-500 mb-2 opacity-80" />
                                            <span className="text-md font-bold truncate w-full">{vendor.gstNumber ? 'Verified' : 'Registered'}</span>
                                            <span className="text-xs text-gray-500 uppercase tracking-wide">Status</span>
                                        </div>
                                    </div>
                                </section>

                                {vendor.serviceCategories && vendor.serviceCategories.length > 0 && (
                                    <section>
                                        <h2 className="text-xl font-bold mb-4 font-heading">Specialties</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {vendor.serviceCategories.map((cat: string) => (
                                                <Badge key={cat} variant="secondary" className="text-sm px-4 py-1.5">{cat}</Badge>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </TabsContent>

                            <TabsContent value="packages" className="space-y-6">
                                {vendor.packages && vendor.packages.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {vendor.packages.map((pkg: any) => (
                                            <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                                                <div className="h-48 bg-gray-100 relative">
                                                    {pkg.images && pkg.images.length > 0 ? (
                                                        <img src={pkg.images[0]} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <Box className="h-12 w-12 opacity-20" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-2 right-2">
                                                        <Badge className="bg-white text-black hover:bg-white">{pkg.price ? `₹${pkg.price.toLocaleString()}` : 'Custom Price'}</Badge>
                                                    </div>
                                                </div>
                                                <CardHeader>
                                                    <CardTitle>{pkg.name}</CardTitle>
                                                    <CardDescription>{pkg.description}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        {pkg.features && Array.isArray(pkg.features) && pkg.features.slice(0, 3).map((feat: string, i: number) => (
                                                            <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                                                <span>{feat}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <Button variant="outline" className="w-full mt-4">View Details</Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                                        <Box className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500">No packages listed yet.</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="gallery">
                                {vendor.gallery && vendor.gallery.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {vendor.gallery.map((item: any) => (
                                            <div key={item.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 group cursor-pointer relative">
                                                <img src={item.url} alt="Gallery Item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                                        <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500">No images in gallery yet.</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="reviews">
                                <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                                    <div className="flex justify-center mb-2">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-6 w-6 text-gray-200" />)}
                                    </div>
                                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Sticky Contact Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="border-t-4 border-t-primary shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Interested in {vendor.businessName}?</CardTitle>
                                <CardDescription>Contact them to get a quote for your event.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                    {vendor.avgBookingPrice && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Avg. Price</span>
                                            <span className="font-semibold text-gray-900 capitalize">{vendor.avgBookingPrice} Range</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Location</span>
                                        <span className="font-semibold text-gray-900">{vendor.city}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    {vendor.user?.email && (
                                        <a href={`mailto:${vendor.user.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-md">
                                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <span className="truncate">{vendor.user.email}</span>
                                        </a>
                                    )}
                                    {vendor.user?.phone && (
                                        <a href={`tel:${vendor.user.phone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-md">
                                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                                <Phone className="h-4 w-4" />
                                            </div>
                                            <span>{vendor.user.phone}</span>
                                        </a>
                                    )}
                                </div>

                                <Button className="w-full bg-black text-white hover:bg-gray-800 h-12 text-lg shadow-lg shadow-primary/20">
                                    Request Quote
                                </Button>
                                <p className="text-xs text-center text-gray-400">Response time: Usually within 24h</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
