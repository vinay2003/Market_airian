import { Suspense, lazy } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    ArrowRight, ShieldCheck, Clock, BadgePercent, MapPin,
    Tag, CheckCircle2, Building2, Package, Users, Gift,
    Palette, UtensilsCrossed, Camera, Music2, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND } from '@/lib/constants';

const EarlyBird = lazy(() => import('@/components/home/EarlyBird'));
const Gallery = lazy(() => import('@/components/home/Gallery'));

// ─── Data ────────────────────────────────────────────────────────────────────

const WHY_US = [
    {
        icon: ShieldCheck,
        color: 'bg-green-100 text-green-600',
        title: 'Verified Vendors',
        body: 'We only work with trusted vendors who meet our strict quality standards. From decoration to photography, each partner is thoroughly vetted for reliability and excellence — so your celebrations are always in the best hands.',
    },
    {
        icon: Clock,
        color: 'bg-blue-100 text-blue-600',
        title: 'Save Time',
        body: 'With our one-stop solution, comparing and booking vendors becomes a breeze. No more endless calls and quotations — just simple, effective service at your fingertips. Use filters, reviews, and our smart recommendation engine to finalize bookings in minutes, not hours.',
    },
    {
        icon: BadgePercent,
        color: 'bg-amber-100 text-amber-600',
        title: 'Budget-Friendly Packages',
        body: 'Our packages are designed to fit every budget. Whether it\'s an intimate birthday party or a lavish wedding, we provide customized solutions without compromising on quality.',
    },
];

const EVENT_TYPES = [
    'Birthday Party',
    'Theme Wedding',
    'Anniversary',
    'Baby Shower',
    'Events',
    'Private Celebration',
];

const SERVICES = [
    { icon: Building2, label: 'Venue Booking' },
    { icon: Package, label: 'Ready-to-Book Packages' },
    { icon: Users, label: 'Vendor & Planner Matching' },
    { icon: Gift, label: 'Gifting & Return Hampers' },
    { icon: Palette, label: 'Decoration & Theme Planning' },
    { icon: UtensilsCrossed, label: 'Catering & Cake' },
    { icon: Camera, label: 'Photography & Videography' },
    { icon: Music2, label: 'Entertainment' },
    { icon: Sparkles, label: 'Makeup & Grooming' },
];


const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.55, ease: 'easeOut' as const },
    }),
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Landing() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="relative min-h-[90vh] md:min-h-[88vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
                {/* Background image */}
                <div className="absolute inset-0">
                    <img
                        src="/images/WhatsApp Image 2026-02-10 at 21.59.51.jpeg"
                        alt="Celebration event background"
                        className="h-full w-full object-cover brightness-[0.38]"
                        loading="eager"
                        decoding="async"
                    />
                    {/* Gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                </div>

                <div className="container px-4 md:px-6 relative z-20 text-center text-white max-w-4xl mx-auto space-y-8">
                    {/* Pill badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-full text-sm font-medium"
                    >
                        <Sparkles className="w-4 h-4 text-amber-300" aria-hidden="true" />
                        Bihar&apos;s Premier Event Marketplace
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-[1.1] tracking-tight drop-shadow-xl"
                    >
                        Your Celebration,{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400">
                            Our Expertise
                        </span>
                    </motion.h1>

                    {/* Sub-headline */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed drop-shadow-md"
                    >
                        Seamlessly plan weddings, parties, and every joyful moment with {BRAND.name}&apos;s
                        trusted vendors and exclusive packages.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.45 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link to="/vendors">
                            <Button
                                size="lg"
                                className="h-14 px-10 text-lg font-bold rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
                            >
                                Get Started
                            </Button>
                        </Link>
                        <Link to="/register-vendor">
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-10 text-lg font-bold rounded-full border-2 border-white/70 text-white bg-white/10 hover:bg-white/20 hover:border-white backdrop-blur-sm transition-all"
                            >
                                List Your Business <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                            </Button>
                        </Link>
                    </motion.div>


                </div>
            </section>

            {/* ── About Short Version ───────────────────────────────────── */}
            <section className="section-padding bg-slate-50 border-b border-gray-100" id="about-short">
                <div className="max-w-7xl mx-auto container-padding text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
                            About Us
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-gray-900 leading-tight">
                            Smart Event Services Marketplace
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
                            <strong className="font-semibold text-gray-900">Airion Solutions</strong> is a smart wedding & event services marketplace connecting users with verified vendors across India. We empower local businesses with affordable marketing tools while making event planning simple, transparent, and profitable.
                        </p>
                        <div className="pt-6">
                            <Link to="/about">
                                <Button size="lg" variant="outline" className="rounded-full px-8 hover:bg-primary hover:text-white border-2 hover:border-primary transition-all">
                                    Read Our Full Story <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Why Choose Us ────────────────────────────────────────── */}
            <section className="section-padding bg-white" id="why-us">
                <div className="max-w-7xl mx-auto container-padding">
                    <div className="text-center mb-12 space-y-3">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Why Airion</span>
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-gray-900">
                            Everything You Need, In One Place
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            We make event planning effortless, affordable, and unforgettable.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {WHY_US.map((item, i) => (
                            <motion.div
                                key={item.title}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-primary/20 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
                            >
                                <div className={`inline-flex p-4 rounded-2xl mb-6 ${item.color} transition-transform group-hover:scale-110 duration-300`}>
                                    <item.icon className="w-7 h-7" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Event Types / Packages ───────────────────────────────── */}
            <section className="section-padding bg-secondary/20" id="events">
                <div className="max-w-7xl mx-auto container-padding">
                    <div className="text-center mb-12 space-y-3">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Occasions</span>
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-gray-900">
                            Budget-Friendly Packages for Every Occasion
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Customized solutions for every celebration — without compromise.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
                        {EVENT_TYPES.map((type, i) => (
                            <motion.div
                                key={type}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                            >
                                <Link to="/vendors">
                                    <div className="flex items-center gap-2 bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 px-5 py-3 rounded-full cursor-pointer group">
                                        <CheckCircle2 className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" aria-hidden="true" />
                                        <span className="font-semibold text-gray-700 group-hover:text-primary transition-colors">{type}</span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/vendors">
                            <Button variant="outline" className="rounded-full border-2 px-8 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                View All Packages <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Local & Reliable + Exclusive Offers ─────────────────── */}
            <section className="section-padding bg-white" id="features">
                <div className="max-w-7xl mx-auto container-padding">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Local & Reliable */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex p-4 rounded-2xl bg-rose-100 text-rose-600">
                                <MapPin className="w-7 h-7" aria-hidden="true" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900">
                                Local &amp; Reliable
                            </h2>
                            <p className="text-gray-500 text-lg leading-relaxed">
                                We source vendors from your local area to ensure convenience, cost-effectiveness,
                                and faster service. Our network includes top-rated professionals based on real
                                customer feedback and performance ratings.
                            </p>
                            <Link to="/vendors">
                                <Button className="rounded-full px-8 mt-2">
                                    Find Local Vendors <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Exclusive Offers */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white rounded-3xl p-8 md:p-10 space-y-6 relative overflow-hidden shadow-2xl"
                        >
                            {/* Decorative blobs */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl" aria-hidden="true" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl" aria-hidden="true" />

                            <div className="relative z-10 space-y-6">
                                <div className="inline-flex p-4 rounded-2xl bg-yellow-400/20 text-yellow-300">
                                    <Tag className="w-7 h-7" aria-hidden="true" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold font-heading">
                                    Exclusive Offers
                                </h2>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    We partner with our vendors to bring you deals you won&apos;t find elsewhere.
                                    Avail early bird discounts, festival specials, cashback rewards, and more on
                                    every celebration you book through us.
                                </p>
                                <Link to="/register-vendor">
                                    <Button className="bg-yellow-400 text-indigo-900 hover:bg-yellow-300 font-bold rounded-full px-8">
                                        Secure Your Spot <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── What We Do ───────────────────────────────────────────── */}
            <section className="section-padding bg-gray-50" id="services">
                <div className="max-w-7xl mx-auto container-padding">
                    <div className="text-center mb-12 space-y-3">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Our Services</span>
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-gray-900">
                            What We Do
                        </h2>
                        <p className="text-gray-500 max-w-3xl mx-auto text-lg">
                            Whether it&apos;s a wedding, birthday, anniversary, baby shower, corporate event, or
                            spiritual gathering, we connect you with the right services, trusted vendors, and
                            beautiful venues across Bihar.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
                        {SERVICES.map((s, i) => (
                            <motion.div
                                key={s.label}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                className="group flex flex-col items-center text-center gap-3 bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <s.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" aria-hidden="true" />
                                </div>
                                <span className="font-semibold text-gray-800 text-sm leading-tight">{s.label}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/vendors">
                            <Button size="lg" className="rounded-full px-10 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                Explore All Services <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Gallery ──────────────────────────────────────────────── */}
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted-foreground">Loading Gallery…</div>}>
                <Gallery />
            </Suspense>

            {/* ── Early Bird Offer ─────────────────────────────────────── */}
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted-foreground">Loading Offer…</div>}>
                <EarlyBird />
            </Suspense>
        </div>
    );
}
