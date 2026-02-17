import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ChevronRight, User, Building2 } from 'lucide-react';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const location = useLocation();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 20);
    });

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Venues', href: '#venues' },
        { name: 'Services', href: '#services' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'About', href: '#about' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'circOut' }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-3'
                    : 'bg-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group relative z-50">
                        <div className="bg-gradient-to-tr from-primary to-indigo-600 text-white h-10 w-10 rounded-xl flex items-center justify-center font-bold font-heading text-xl shadow-lg shadow-primary/25 transition-transform group-hover:scale-105 duration-300">
                            M
                        </div>
                        <span className={`font-heading font-extrabold text-2xl tracking-tight transition-colors duration-300 ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                            MarketFly
                        </span>
                    </Link>

                    {/* Desktop Nav - Hidden on Tablet/Mobile */}
                    <div className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 shadow-sm">
                        {navLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:bg-white/10 ${scrolled ? 'text-gray-600 hover:text-primary' : 'text-gray-200 hover:text-white'
                                    }`}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop/Tablet Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login">
                            <Button
                                variant="ghost"
                                className={`font-bold transition-colors ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                Log in
                            </Button>
                        </Link>
                        <Link to="/vendor/onboarding">
                            <Button className="bg-white text-indigo-900 hover:bg-gray-50 font-bold shadow-lg shadow-indigo-900/10 rounded-full px-6 transition-all hover:scale-105 active:scale-95 duration-200 border border-gray-100">
                                List Your Business
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle - Visible on Mobile and Tablet (if needed) */}
                    <div className="flex items-center gap-4 lg:hidden">
                        {/* Show 'List Business' icon on mobile top bar for quick access? Optional, usually crowded. 
                            Let's keep it clean but ensure the menu toggle is prominent. 
                        */}
                        <button
                            className={`p-2 rounded-full transition-colors relative z-50 ${mobileMenuOpen ? 'text-gray-900 bg-gray-100' : (scrolled ? 'text-gray-900' : 'text-white')
                                }`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile/Tablet Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-50 shadow-2xl flex flex-col lg:hidden"
                        >
                            <div className="p-6 pt-24 flex-1 overflow-y-auto">
                                <div className="flex flex-col gap-1 mb-8">
                                    {navLinks.map((item, i) => (
                                        <motion.a
                                            key={item.name}
                                            href={item.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.05 }}
                                            className="text-xl font-bold text-gray-800 py-4 border-b border-gray-50 flex items-center justify-between group"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                            <ChevronRight className="text-gray-300 w-5 h-5 group-hover:text-primary transition-colors" />
                                        </motion.a>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full justify-start font-bold h-14 text-base rounded-xl border-gray-200 hover:bg-gray-50 hover:text-primary pl-4">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-600">
                                                <User className="h-4 w-4" />
                                            </div>
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link to="/vendor/onboarding" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-14 text-base rounded-xl shadow-lg shadow-indigo-200 pl-4">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/50 flex items-center justify-center mr-3 text-white">
                                                <Building2 className="h-4 w-4" />
                                            </div>
                                            List Your Business
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-100">
                                <p className="text-xs text-center text-gray-400 font-medium">
                                    © 2024 MarketFly Inc.
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
