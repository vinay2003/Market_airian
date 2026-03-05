import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

interface PackageDisplay {
    title: string;
    vendor: string;
    price: string;
    rating: number;
    location: string;
    image: string;
    tags: string[];
    vendorId: string;
}

export default function FeaturedShowcase() {
    const [packages, setPackages] = useState<PackageDisplay[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await api.get('vendors/public?page=1&limit=6');
                const vendors = res.data.data || [];

                const allPackages: PackageDisplay[] = [];
                vendors.forEach((v: any) => {
                    if (v.packages && v.packages.length > 0) {
                        v.packages.slice(0, 1).forEach((p: any) => {
                            allPackages.push({
                                title: p.name,
                                vendor: v.businessName || 'Elite Vendor',
                                price: `₹${Number(p.price).toLocaleString()}`,
                                rating: 4.8 + (Math.random() * 0.2),
                                location: v.city || 'India',
                                image: (p.images && p.images.length > 0) ? p.images[0] : (v.bannerUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop'),
                                tags: p.features?.slice(0, 3) || v.serviceCategories?.slice(0, 3) || [],
                                vendorId: v.id
                            });
                        });
                    }
                });
                setPackages(allPackages.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch featured packages", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);
    return (
        <section className="section-padding bg-white relative" id="venues">
            <div className="max-w-7xl mx-auto container-padding">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4 md:gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-2 text-center md:text-left w-full md:w-auto"
                    >
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900">Trending Packages</h2>
                        <p className="text-gray-500 max-w-xl text-sm md:text-base">Curated selection of the most popular packages loved by our community.</p>
                    </motion.div>
                    <Link to="/vendors">
                        <Button variant="outline" className="hidden md:flex rounded-full border-2 hover:bg-gray-50">
                            View All Packages <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {packages.map((pkg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                                >
                                    <Link to={`/vendor/${pkg.vendorId}`}>
                                        <div className="h-48 overflow-hidden relative">
                                            <img
                                                src={pkg.image}
                                                alt={pkg.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                                                {pkg.tags.map((tag, j) => (
                                                    <Badge key={j} className="bg-white/90 text-gray-900 backdrop-blur-sm shadow-sm hover:bg-white text-[10px] px-2 py-0.5">{tag}</Badge>
                                                ))}
                                            </div>
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 text-xs font-bold shadow-sm">
                                                <Star className="h-3 w-3 text-primary fill-primary" /> {pkg.rating.toFixed(1)}
                                            </div>
                                        </div>

                                        <div className="p-4 space-y-3">
                                            <div>
                                                <div className="text-[10px] text-primary font-bold uppercase tracking-wider mb-0.5">{pkg.vendor}</div>
                                                <h3 className="text-lg font-heading font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">{pkg.title}</h3>
                                            </div>

                                            <div className="flex items-center text-gray-500 text-xs">
                                                <MapPin className="h-3 w-3 mr-1" /> {pkg.location}
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <div className="text-xl font-bold text-gray-900">{pkg.price}</div>
                                                <Button size="sm" className="rounded-full bg-gray-900 text-white hover:bg-primary transition-colors px-4 h-8 text-xs">
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {packages.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                No featured packages available.
                            </div>
                        )}

                        <div className="mt-8 flex justify-center md:hidden">
                            <Link to="/vendors" className="w-full">
                                <Button variant="outline" className="rounded-full border-2 hover:bg-gray-50 w-full">
                                    View All Packages <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
