import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';

import { Search, MapPin, ArrowRight, Star, Heart, Camera, Music, Utensils, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Gallery from '@/components/home/Gallery';

const CATEGORIES = [
    { name: 'Venues', icon: Home, color: 'bg-rose-100 text-rose-600', image: '/images/WhatsApp Image 2026-02-10 at 22.00.07.jpeg' },
    { name: 'Photography', icon: Camera, color: 'bg-blue-100 text-blue-600', image: '/images/WhatsApp Image 2026-02-10 at 22.00.08.jpeg' },
    { name: 'Catering', icon: Utensils, color: 'bg-orange-100 text-orange-600', image: '/images/WhatsApp Image 2026-02-10 at 22.00.09.jpeg' },
    { name: 'Entertainment', icon: Music, color: 'bg-purple-100 text-purple-600', image: '/images/WhatsApp Image 2026-02-10 at 22.00.10.jpeg' },
];

const FEATURED_VENDORS = [
    {
        id: '1',
        name: 'Luxe Moments Photography',
        category: 'Photography',
        rating: 4.9,
        reviews: 124,
        image: '/images/WhatsApp Image 2026-02-10 at 22.00.11.jpeg',
        location: 'Mumbai, India',
        price: 'From ₹45,000'
    },
    {
        id: '2',
        name: 'Royal Palace Gardens',
        category: 'Venue',
        rating: 4.8,
        reviews: 89,
        image: '/images/WhatsApp Image 2026-02-10 at 22.00.14.jpeg',
        location: 'Udaipur, India',
        price: 'From ₹2,00,000'
    },
    {
        id: '3',
        name: 'Gourmet Delights Catering',
        category: 'Catering',
        rating: 5.0,
        reviews: 56,
        image: '/images/WhatsApp Image 2026-02-10 at 22.00.16.jpeg',
        location: 'Delhi, India',
        price: 'From ₹1,200/plate'
    }
];

export default function Landing() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">

            {/* Hero Section */}
            <section ref={targetRef} className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/WhatsApp Image 2026-02-10 at 21.59.51.jpeg"
                        alt="Background"
                        className="h-full w-full object-cover brightness-[0.4]"
                    />
                    <div className="absolute" />
                </div>

                <motion.div
                    style={{ opacity, scale, y }}
                    className="container px-4 md:px-6 relative z-10 text-center text-white space-y-8"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-4 tracking-tight">
                            Create Unforgettable <br className="hidden md:block" />
                            <span className="text-primary-foreground bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-amber-500">
                                Moments
                            </span>
                        </h1>
                        <p className="max-w-[700px] mx-auto text-lg md:text-xl text-gray-200">
                            Discover and book the best vendors for your wedding, corporate event, or private party.
                        </p>
                    </motion.div>

                    {/* Search Bar - Responsive Optimization */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-3 md:p-2 rounded-3xl md:rounded-full border border-white/20 shadow-2xl flex flex-col md:flex-row gap-3 md:gap-2"
                    >
                        <div className="flex-1 flex items-center px-4 h-14 bg-white/5 md:bg-transparent rounded-2xl md:rounded-none border border-white/5 md:border-none focus-within:bg-white/10 transition-colors">
                            <Search className="text-gray-300 w-5 h-5 mr-3 shrink-0" />
                            <input
                                type="text"
                                placeholder="Service (e.g. Photography)"
                                className="bg-transparent border-none outline-none text-white placeholder:text-gray-300/80 w-full h-full text-base"
                            />
                        </div>
                        <div className="flex-1 flex items-center px-4 h-14 md:border-l md:border-white/20 bg-white/5 md:bg-transparent rounded-2xl md:rounded-none border border-white/5 md:border-none focus-within:bg-white/10 transition-colors">
                            <MapPin className="text-gray-300 w-5 h-5 mr-3 shrink-0" />
                            <input
                                type="text"
                                placeholder="City (e.g. Mumbai)"
                                className="bg-transparent border-none outline-none text-white placeholder:text-gray-300/80 w-full h-full text-base"
                            />
                        </div>
                        <Button size="lg" className="rounded-2xl md:rounded-full w-full md:w-auto px-8 h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300">
                            Search
                        </Button>
                    </motion.div>

                    {/* Quick Tags */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-3 text-sm text-gray-300"
                    >
                        <span>Popular:</span>
                        {['Wedding Photography', 'Banquet Halls', 'Makeup Artists', 'DJs'].map((tag) => (
                            <button key={tag} className="hover:text-white underline decoration-dotted underline-offset-4 decoration-gray-500">
                                {tag}
                            </button>
                        ))}
                    </motion.div>
                </motion.div>
            </section >

            {/* Categories Section */}
            <section className="py-16 md:py-24 container px-4 md:px-6 space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 text-center md:text-left">
                    <div className="space-y-2 w-full md:w-auto">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Explore by Category</h2>
                        <p className="text-muted-foreground text-lg">Find exactly what you need for your event.</p>
                    </div>
                    <Link to="/vendors">
                        <Button variant="ghost" className="group hidden md:inline-flex">
                            View All Categories <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CATEGORIES.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative h-64 md:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <div className={`inline-flex p-3 rounded-full mb-3 backdrop-blur-md ${cat.color} bg-white/95 shadow-lg`}>
                                    <cat.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-1">{cat.name}</h3>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    Explore {cat.name} &rarr;
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="md:hidden text-center pt-4">
                    <Link to="/vendors">
                        <Button variant="outline" className="w-full">
                            View All Categories
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Featured Vendors Section */}
            <section className="py-20 bg-muted/30">
                <div className="container px-4 md:px-6 space-y-12">
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Vendors</h2>
                            <p className="text-muted-foreground text-lg mt-2">Top-rated professionals loved by our customers.</p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {FEATURED_VENDORS.map((vendor, i) => (
                            <motion.div
                                key={vendor.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                whileHover={{ y: -5 }}
                                className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={vendor.image}
                                        alt={vendor.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                    <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all text-white hover:scale-110 active:scale-95">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm text-foreground">
                                        {vendor.category}
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="font-bold text-xl group-hover:text-primary transition-colors line-clamp-1">{vendor.name}</h3>
                                            <div className="flex items-center gap-1 text-sm font-medium bg-secondary/50 px-2 py-1 rounded-md shrink-0">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                {vendor.rating}
                                                <span className="text-muted-foreground text-xs ml-0.5">({vendor.reviews})</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2">
                                            <MapPin className="w-4 h-4 shrink-0" />
                                            {vendor.location}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t flex items-center justify-between">
                                        <div className="text-sm">
                                            <span className="text-muted-foreground block text-xs uppercase tracking-wide">Starting from</span>
                                            <p className="font-bold text-primary text-base">{vendor.price}</p>
                                        </div>
                                        <Link to={`/vendor/${vendor.id}`}>
                                            <Button size="sm" className="rounded-full px-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                View Profile
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center pt-8">
                        <Link to="/vendors">
                            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-medium hover:bg-secondary transition-colors">
                                Browse All Vendors
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            < Gallery />
        </div >
    );
}
