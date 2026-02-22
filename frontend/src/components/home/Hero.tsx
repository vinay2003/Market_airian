import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 md:pt-32 overflow-hidden bg-background">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[50vw] h-full bg-secondary/30 blur-[80px] md:blur-[120px] rounded-l-full translate-x-1/4 animate-float" />
                <div className="absolute bottom-0 left-0 w-[40vw] h-[60vh] bg-primary/10 blur-[60px] md:blur-[100px] rounded-r-full -translate-x-1/4 animate-float" style={{ animationDelay: '2s' }} />

                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-[10%] w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl"
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white shadow-sm border border-gray-100 text-xs md:text-sm font-medium text-gray-600 mb-2 md:mb-4 mx-auto lg:mx-0"
                    >
                        <Star className="h-3 w-3 md:h-4 md:w-4 text-primary fill-primary" aria-hidden="true" />
                        <span>Trusted Vendors. Perfect Events.</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold text-foreground leading-[1.1] tracking-tight"
                    >
                        Celebrate <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-600 italic font-serif">
                            Life's Moments
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 md:px-0"
                    >
                        From intimate weddings to grand galas, connect with curated vendors who bring your vision to life with elegance and ease.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start w-full sm:w-auto px-4 sm:px-0"
                    >
                        <Link to="/login" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto rounded-full h-12 md:h-14 px-8 text-lg bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                                Find Vendors
                            </Button>
                        </Link>
                        <Link to="/vendor/onboarding" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-12 md:h-14 px-8 text-lg border-2 hover:bg-secondary/50 transition-all">
                                For Vendors <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="pt-6 md:pt-8 flex items-center justify-center lg:justify-start gap-4 md:gap-8 text-sm text-gray-500"
                    >
                        <div className="flex -space-x-3" aria-hidden="true">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-gray-200" />
                            ))}
                        </div>
                        <p>Trusted by <span className="font-bold text-gray-900">15,000+</span> planners</p>
                    </motion.div>
                </div>

                {/* Hero Image/Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="relative hidden lg:block h-[600px] xl:h-[700px]"
                >
                    <div className="absolute top-10 right-10 w-full h-full bg-secondary/50 rounded-[3rem] -z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop"
                        alt="Wedding Celebration"
                        className="w-full h-full object-cover rounded-[3rem] shadow-2xl"
                    />

                    {/* Floating Cards */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="absolute bottom-20 -left-12 glass p-4 rounded-2xl flex items-center gap-4 max-w-xs animate-float"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">✨</div>
                        <div>
                            <p className="font-heading font-bold text-gray-900">Best Wedding 2024</p>
                            <p className="text-xs text-gray-500">Awarded to Photography Co.</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
