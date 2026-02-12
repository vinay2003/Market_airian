import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const packages = [
    {
        title: "Royal Wedding Package",
        vendor: "Elegant Events Co.",
        price: "₹1,50,000",
        rating: 4.9,
        location: "Mumbai",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
        tags: ["Photography", "Decor", "Catering"]
    },
    {
        title: "Sunset Beach Party",
        vendor: "Goa Vibes",
        price: "₹80,000",
        rating: 4.8,
        location: "Goa",
        image: "https://images.unsplash.com/photo-1639945506968-3dea2042c861?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VkZGluZyUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
        tags: ["Music", "Drinks", "Venue"]
    },
    {
        title: "Corporate Gala Dinner",
        vendor: "Elite Planners",
        price: "₹2,00,000",
        rating: 5.0,
        location: "Delhi",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop",
        tags: ["Full Service", "Premium"]
    }
];

export default function FeaturedShowcase() {
    return (
        <section className="py-24 bg-white relative" id="venues">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-2"
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900">Trending Packages</h2>
                        <p className="text-gray-500 max-w-xl">Curated selection of the most popular packages loved by our community.</p>
                    </motion.div>
                    <Button variant="outline" className="rounded-full border-2 hover:bg-gray-50">
                        View All Packages <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

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
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3 flex gap-1.5">
                                    {pkg.tags.map((tag, j) => (
                                        <Badge key={j} className="bg-white/90 text-gray-900 backdrop-blur-sm shadow-sm hover:bg-white text-[10px] px-2 py-0.5">{tag}</Badge>
                                    ))}
                                </div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 text-xs font-bold shadow-sm">
                                    <Star className="h-3 w-3 text-primary fill-primary" /> {pkg.rating}
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
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
