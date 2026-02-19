import { useState, useEffect, Suspense, lazy } from 'react';
import { Button } from '@/components/ui/button';
import { Search, MapPin, ArrowRight, Star, Heart, Camera, Music, Utensils, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Gallery = lazy(() => import('@/components/home/Gallery'));
const EarlyBird = lazy(() => import('@/components/home/EarlyBird'));

// --- Typewriter Effect Component ---
const TypewriterEffect = ({ words }: { words: string[] }) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);

    // Blinking cursor
    useEffect(() => {
        const timeout2 = setTimeout(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearTimeout(timeout2);
    }, [blink]);

    // Typing logic
    useEffect(() => {
        if (index === words.length) return;

        if (subIndex === words[index].length + 1 && !reverse) {
            const timeout = setTimeout(() => setReverse(true), 200);
            return () => clearTimeout(timeout);
        }

        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, Math.max(reverse ? 75 : subIndex === words[index].length ? 1000 : 150, parseInt((Math.random() * 350).toString())));

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words]);

    return (
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500">
            {`${words[index].substring(0, subIndex)}${blink ? "|" : " "}`}
        </span>
    );
};




const CATEGORIES = [
    { name: 'Venues', icon: Home, color: 'bg-rose-100 text-rose-600', image: '/images/WhatsApp%20Image%202026-02-10%20at%2022.00.07.jpeg' },
    { name: 'Photography', icon: Camera, color: 'bg-blue-100 text-blue-600', image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=2938&auto=format&fit=crop' },
    { name: 'Catering', icon: Utensils, color: 'bg-orange-100 text-orange-600', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2938&auto=format&fit=crop' },
    { name: 'Entertainment', icon: Music, color: 'bg-purple-100 text-purple-600', image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2938&auto=format&fit=crop' },
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
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/WhatsApp Image 2026-02-10 at 21.59.51.jpeg"
                        alt="Background"
                        className="h-full w-full object-cover brightness-[0.4]"
                        loading="eager"
                        decoding="async"
                    />
                    <div className="absolute" />
                </div>

                <div className="container px-4 md:px-6 relative z-20 text-center text-white space-y-8">
                    <div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-4 tracking-tight drop-shadow-xl">
                            Create Unforgettable <br className="hidden md:block" />
                            <TypewriterEffect words={["Weddings", "Parties", "Events", "Moments"]} />
                        </h1>
                        <p className="max-w-[700px] mx-auto text-lg md:text-xl text-gray-200 drop-shadow-md">
                            Discover and book the best vendors for your wedding, corporate event, or private party.
                        </p>
                    </div>

                    {/* Search Bar - Responsive Optimization */}
                    <div
                        className="
                            w-full max-w-3xl mx-auto
                            bg-white/10 backdrop-blur-2xl
                            p-3 md:p-2
                            rounded-[2rem] md:rounded-full
                            border border-white/30
                            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                            flex flex-col md:flex-row
                            gap-3 md:gap-0
                            ring-1 ring-white/20
                            relative z-20
                        "
                    >
                        {/* Service Input */}
                        <div className="
                            flex-1 flex items-center px-4 h-14 md:h-16
                            bg-black/20 md:bg-transparent
                            rounded-2xl md:rounded-l-full md:rounded-r-none
                            border border-white/10 md:border-none
                            focus-within:bg-black/40 md:focus-within:bg-white/10
                        ">
                            <Search className="text-white/70 w-5 h-5 mr-3 shrink-0" />
                            <input
                                type="text"
                                placeholder="Service (e.g. Photography)"
                                className="
                                    bg-transparent border-none outline-none
                                    text-white placeholder:text-white/60
                                    w-full h-full text-base font-medium
                                "
                            />
                        </div>

                        {/* Divider for Desktop */}
                        <div className="hidden md:block w-px h-10 bg-white/20 self-center mx-2" />

                        {/* City Input */}
                        <div className="
                            flex-1 flex items-center px-4 h-14 md:h-16
                            bg-black/20 md:bg-transparent
                            rounded-2xl md:rounded-none
                            border border-white/10 md:border-none
                            focus-within:bg-black/40 md:focus-within:bg-white/10
                        ">
                            <MapPin className="text-white/70 w-5 h-5 mr-3 shrink-0" />
                            <input
                                type="text"
                                placeholder="City (e.g. Mumbai)"
                                className="
                                    bg-transparent border-none outline-none
                                    text-white placeholder:text-white/60
                                    w-full h-full text-base font-medium
                                "
                            />
                        </div>

                        {/* Search Button */}
                        <div className="p-1">
                            <Button
                                size="lg"
                                className="
                                    w-full md:w-auto
                                    h-14 md:h-14
                                    px-8
                                    rounded-xl md:rounded-full
                                    text-lg font-bold tracking-wide
                                    text-white
                                    bg-gradient-to-r from-amber-500 to-orange-600
                                    hover:from-amber-600 hover:to-orange-700
                                    shadow-lg hover:shadow-amber-500/40
                                    active:scale-95
                                    border border-white/10
                                "
                            >
                                Search
                            </Button>
                        </div>
                    </div>


                    {/* Quick Tags */}
                    <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-300">
                        <span>Popular:</span>
                        {['Wedding Photography', 'Banquet Halls', 'Makeup Artists', 'DJs'].map((tag) => (
                            <button key={tag} className="hover:text-white underline decoration-dotted underline-offset-4 decoration-gray-500">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </section >

            {/* Categories Section */}
            <section className="section-padding container px-4 md:px-6 space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 text-center md:text-left">
                    <div className="space-y-2 w-full md:w-auto">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Explore by Category</h2>
                        <p className="text-muted-foreground text-lg">Find exactly what you need for your event.</p>
                    </div>
                    <Link to="/vendors">
                        <Button variant="ghost" className="group hidden md:inline-flex">
                            View All Categories <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CATEGORIES.map((cat, i) => (
                        <div
                            key={cat.name}
                            className="group relative h-64 md:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
                            <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <div className={`inline-flex p-3 rounded-full mb-3 backdrop-blur-md ${cat.color} bg-white/95 shadow-lg`}>
                                    <cat.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-1">{cat.name}</h3>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Explore {cat.name} &rarr;
                                </p>
                            </div>
                        </div>
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
            <section className="section-padding bg-muted/30">
                <div className="container px-4 md:px-6 space-y-12">
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Vendors</h2>
                            <p className="text-muted-foreground text-lg mt-2">Top-rated professionals loved by our customers.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {FEATURED_VENDORS.map((vendor, i) => (
                            <div
                                key={vendor.id}
                                className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-border/50"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={vendor.image}
                                        alt={vendor.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0" />
                                    <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white active:scale-95">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm text-foreground">
                                        {vendor.category}
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="font-bold text-xl group-hover:text-primary line-clamp-1">{vendor.name}</h3>
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
                                            <Button size="sm" className="rounded-full px-4 group-hover:bg-primary group-hover:text-primary-foreground">
                                                View Profile
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* How It Works Section */}
            < section className="section-padding bg-white" >
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Simple Process</span>
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-gray-900">How MarketFly Works</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">Planning your dream event has never been easier. Follow these simple steps.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>

                        {[
                            {
                                step: "01",
                                title: "Discover",
                                desc: "Browse thousands of top-rated vendors with transparent pricing and reviews.",
                                icon: Search,
                                color: "bg-blue-100 text-blue-600"
                            },
                            {
                                step: "02",
                                title: "Connect",
                                desc: "Chat directly with vendors, get quotes, and check availability instantly.",
                                icon: Heart, // Using Heart as a placeholder for 'Connect/Chat' vibe
                                color: "bg-purple-100 text-purple-600"
                            },
                            {
                                step: "03",
                                title: "Book",
                                desc: "Secure your date with a small deposit and enjoy a stress-free event.",
                                icon: Star, // Using Star for 'Success/Book'
                                color: "bg-green-100 text-green-600"
                            }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="relative flex flex-col items-center text-center space-y-6"
                            >
                                <div className={`w-24 h-24 rounded-full ${item.color} flex items-center justify-center shadow-xl relative z-10 group`}>
                                    <item.icon className="w-10 h-10" />
                                    <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full border-4 border-white">
                                        {item.step}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >



            {/* Early Bird Offer Section */}
            <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading Offer...</div>}>
                <EarlyBird />
            </Suspense>

            {/* Gallery Section */}
            {/* Gallery Section */}
            <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading Gallery...</div>}>
                <Gallery />
            </Suspense>
        </div >
    );
}
