import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4 border-b border-gray-100' : 'bg-transparent py-6'}`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary text-white h-10 w-10 rounded-xl flex items-center justify-center font-bold font-heading text-xl shadow-lg shadow-primary/25 transition-transform group-hover:scale-105 duration-300">M</div>
                    <span className={`font-heading font-extrabold text-2xl tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>MarketFly</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {['Venues', 'Services', 'Gallery', 'About'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-gray-700 hover:text-primary transition-colors uppercase tracking-wide">
                            {item}
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link to="/login">
                        <Button variant="ghost" className="hover:bg-primary/5 hover:text-primary font-bold text-gray-700">Log in</Button>
                    </Link>
                    <Link to="/vendor/onboarding">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/25 rounded-full px-6 transition-all hover:scale-105 active:scale-95 duration-200">
                            List Your Business
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-4 shadow-xl"
                >
                    {['Venues', 'Services', 'Gallery', 'About'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm font-bold text-gray-700 py-2" onClick={() => setMobileMenuOpen(false)}>
                            {item}
                        </a>
                    ))}
                    <div className="pt-4 flex flex-col gap-3">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full justify-center font-bold">Log in</Button>
                        </Link>
                        <Link to="/vendor/onboarding" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold">List Your Business</Button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
