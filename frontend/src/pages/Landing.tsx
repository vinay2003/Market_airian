import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Zap, TrendingUp, Users } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground overflow-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary text-white h-8 w-8 rounded-lg flex items-center justify-center font-bold font-heading">M</div>
                        <span className="font-heading font-bold text-xl tracking-tight">MarketFly</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="hidden sm:inline-flex hover:bg-primary/10 hover:text-primary">Log in</Button>
                        </Link>
                        <Link to="/vendor/onboarding">
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full px-6">
                                Become a Vendor
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 animate-float" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '1s' }} />
                </div>

                <div className="max-w-7xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium border border-secondary/20">
                            <Star className="h-3 w-3 fill-current" />
                            <span>The #1 Event Marketplace</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                            Plan your perfect event <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                with confidence.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Connect with top-rated photographers, caterers, and decorators.
                            Verified reviews, transparent pricing, and seamless booking.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/login">
                            <Button size="lg" className="rounded-full h-12 px-8 text-lg bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black">
                                Find Vendors
                            </Button>
                        </Link>
                        <Link to="/vendor/onboarding">
                            <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-lg border-2 hover:bg-gray-50/50">
                                List Your Services <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-gray-100 dark:border-gray-800 mt-12"
                    >
                        {[
                            { label: 'Active Vendors', value: '2k+' },
                            { label: 'Events Planned', value: '15k+' },
                            { label: 'Cities', value: '12' },
                            { label: 'Avg Rating', value: '4.9' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-3xl font-heading font-bold text-gray-900 dark:text-white">{stat.value}</div>
                                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-2">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold">Why choose MarketFly?</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Everything you need to scale your event business or plan your dream occasion.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: 'Verified Professionals', desc: 'Every vendor undergoes a strict background check and quality assessment.' },
                            { icon: Zap, title: 'Instant Booking', desc: 'Real-time availability and instant confirmation for your peace of mind.' },
                            { icon: TrendingUp, title: 'Growth Tools', desc: 'Powerful analytics and marketing tools for vendors to scale their business.' },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 mix-blend-overlay" />
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold">Ready to get started?</h2>
                        <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">Join thousands of event planners and vendors transforming the industry today.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link to="/login">
                                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 border-0 rounded-full h-12 px-8 font-semibold">
                                    Get Started Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500">
                © 2026 MarketFly Inc. All rights reserved.
            </footer>
        </div>
    );
}
