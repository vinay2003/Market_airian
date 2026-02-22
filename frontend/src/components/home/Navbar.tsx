import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ChevronRight, User, Building2 } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const location = useLocation();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setScrolled(latest > 20);
    });

    const isHomePage = location.pathname === '/';
    const isScrolledStyle = scrolled || !isHomePage;

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
    const toggleMobileMenu = useCallback(() => setMobileMenuOpen((prev) => !prev), []);

    const navLinks = [
        { name: 'Venues', href: '/#venues' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'About', href: '/about' },
        { name: 'Legal', href: '/legal' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'circOut' }}
                aria-label="Main navigation"
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolledStyle
                    ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-3'
                    : 'bg-transparent py-5'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group relative z-50" aria-label={`${BRAND.name} — Home`}>
                        <div className="bg-gradient-to-tr from-primary to-indigo-600 text-white h-10 w-10 rounded-xl flex items-center justify-center font-bold font-heading text-xl shadow-lg shadow-primary/25 transition-transform group-hover:scale-105 duration-300" aria-hidden="true">
                            A
                        </div>
                        <span className={`font-heading font-extrabold text-2xl tracking-tight transition-colors duration-300 ${isScrolledStyle ? 'text-gray-900' : 'text-white'}`}>
                            {BRAND.name}
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className={`hidden lg:flex items-center gap-1 backdrop-blur-md px-2 py-1.5 rounded-full border shadow-sm ${isScrolledStyle ? 'bg-gray-100/50 border-gray-200' : 'bg-white/10 border-white/10'
                        }`} aria-label="Site links">
                        {navLinks.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${isScrolledStyle
                                    ? 'text-gray-600 hover:text-primary hover:bg-gray-200/50'
                                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop/Tablet Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login">
                            <Button
                                variant="ghost"
                                className={`font-bold transition-colors ${isScrolledStyle ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
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

                    {/* Mobile Menu Toggle */}
                    <div className="flex items-center gap-4 lg:hidden">
                        <button
                            className={`p-2 rounded-full transition-colors relative z-50 ${mobileMenuOpen ? 'text-gray-900 bg-gray-100' : (isScrolledStyle ? 'text-gray-900' : 'text-white')
                                }`}
                            onClick={toggleMobileMenu}
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={closeMobileMenu}
                            aria-hidden="true"
                        />
                        <motion.div
                            id="mobile-menu"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Navigation menu"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[85%] max-w-[340px] bg-white/95 backdrop-blur-2xl z-50 shadow-2xl flex flex-col lg:hidden border-l border-white/20"
                        >
                            <div className="absolute top-4 right-4 z-50">
                                <button
                                    className="p-2 rounded-full text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors"
                                    onClick={closeMobileMenu}
                                    aria-label="Close menu"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 pt-20 flex-1 overflow-y-auto">
                                <nav className="flex flex-col gap-2 mb-10" aria-label="Mobile navigation">
                                    {navLinks.map((item, i) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.05 }}
                                        >
                                            <Link
                                                to={item.href}
                                                className="text-xl font-bold text-gray-800 py-3.5 px-4 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/10 flex items-center justify-between group w-full text-left transition-all"
                                                onClick={closeMobileMenu}
                                            >
                                                {item.name}
                                                <ChevronRight className="text-gray-300 w-5 h-5 group-hover:text-primary group-hover:translate-x-1 transition-all" aria-hidden="true" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                <div className="space-y-4 px-2">
                                    <Link to="/login" onClick={closeMobileMenu}>
                                        <Button variant="outline" className="w-full justify-start font-bold h-14 text-base rounded-2xl border-gray-200 bg-white hover:border-primary hover:text-primary pl-4 transition-all">
                                            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center mr-3 text-gray-600 shadow-sm" aria-hidden="true">
                                                <User className="h-4 w-4" />
                                            </div>
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link to="/vendor/onboarding" onClick={closeMobileMenu}>
                                        <Button className="w-full justify-start bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold h-14 text-base rounded-2xl shadow-xl shadow-indigo-600/20 pl-4 transition-all hover:scale-[1.02]">
                                            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3 text-white" aria-hidden="true">
                                                <Building2 className="h-4 w-4" />
                                            </div>
                                            List Your Business
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50/50 border-t border-gray-100 backdrop-blur-md">
                                <p className="text-xs text-center text-gray-400 font-medium">
                                    © {BRAND.year} {BRAND.fullName}
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
