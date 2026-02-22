import { motion, type Variants } from 'framer-motion';
import { Target, Flag, CheckCircle, TrendingUp, Users, HeartHandshake } from 'lucide-react';
import { BRAND } from '@/lib/constants';

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
    }),
};

export default function About() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden pt-24">

            {/* ── Header Section ─────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-primary/5 py-20 px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold tracking-wide"
                    >
                        Who We Are
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-gray-900"
                    >
                        Transforming How India Plans Celebrations
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        {BRAND.name} is a next-generation event and wedding services marketplace. We connect vendors, venues, service providers, and customers on one powerful digital platform — making event planning simple, transparent, and profitable.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-lg text-gray-600 font-medium"
                    >
                        We are not just a listing platform. We are a growth ecosystem for the event industry.
                    </motion.p>
                </div>
            </section>

            {/* ── Mission & Vision ───────────────────────────────────────── */}
            <section className="section-padding bg-white">
                <div className="max-w-6xl mx-auto container-padding">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-10 hover:shadow-xl transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
                                <Flag className="w-7 h-7" />
                            </div>
                            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">Our Vision</h2>
                            <p className="text-gray-600 text-lg mb-6">
                                To become India’s most trusted and innovative event services marketplace — starting from Bihar and expanding nationwide.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Digitize local vendors',
                                    'Bring transparency to event planning',
                                    'Create equal opportunities for small & large businesses',
                                    'Offer smart, affordable marketing solutions'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-10 hover:shadow-xl transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                                <Target className="w-7 h-7" />
                            </div>
                            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-gray-600 text-lg mb-6">
                                To build a thriving marketplace that empowers businesses to grow and helps users create unforgettable experiences.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Build a freemium marketplace to help vendors scale',
                                    'Provide high-quality leads instead of random inquiries',
                                    'Offer marketing, branding, and analytics tools to vendors',
                                    'Deliver seamless booking experiences for users'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Focus & Core Services ──────────────────────────────────── */}
            <section className="section-padding bg-secondary/10">
                <div className="max-w-7xl mx-auto container-padding">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Our Expertise</span>
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-gray-900">
                            What {BRAND.name} Focuses On
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: HeartHandshake,
                                title: "Regional Market Strength",
                                desc: "Starting from Bihar, we understand local traditions, budgets, and vendor challenges."
                            },
                            {
                                icon: TrendingUp,
                                title: "Vendor Growth Tools",
                                desc: "Lead dashboards, analytics, booking management, and EMI options for customers."
                            },
                            {
                                icon: Users,
                                title: "All Occasions Platform",
                                desc: "From weddings and birthdays to corporate events, religious festivals, and baby showers."
                            },
                            {
                                icon: Target,
                                title: "Affordable Subscriptions",
                                desc: "Low-cost advertising plus a freemium entry model for vendors of all sizes."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center"
                            >
                                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Commitment ─────────────────────────────────────────────── */}
            <section className="section-padding bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white relative flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]" />

                <div className="relative z-10 max-w-4xl mx-auto container-padding text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">Our Commitment</h2>
                        <div className="space-y-4 text-xl md:text-2xl font-light text-gray-200">
                            <p>Every celebration deserves perfection.</p>
                            <p>Every vendor deserves visibility.</p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/20">
                            <p className="text-lg md:text-xl font-medium text-white max-w-2xl mx-auto leading-relaxed">
                                We are building more than a platform — <br />
                                We are building an ecosystem that powers dreams, businesses, and celebrations.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
