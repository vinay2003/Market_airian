import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8 md:pt-24 md:pb-12">
            <div className="max-w-7xl mx-auto container-padding">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-white text-gray-900 h-8 w-8 rounded-lg flex items-center justify-center font-bold font-heading">M</div>
                            <span className="font-heading font-bold text-xl tracking-tight">MarketFly</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Elevating celebrations with curated vendors and seamless planning tools.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="bg-white/10 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold text-lg mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-bold text-lg mb-6">Support</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/vendors" className="hover:text-primary transition-colors">Vendor Guidelines</Link></li>
                        </ul>
                    </div>

                    <div className="sm:col-span-2 md:col-span-1">
                        <h4 className="font-heading font-bold text-lg mb-6">Stay Updated</h4>
                        <p className="text-gray-400 mb-4 text-sm">Subscribe to our newsletter for the latest trends.</p>
                        <div className="flex gap-2">
                            <Input placeholder="Email address" className="bg-white/10 border-white/10 text-white placeholder:text-gray-500 focus:ring-primary" />
                            <Button className="bg-primary hover:bg-primary-600 text-white">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 text-center md:text-left">
                    <p>&copy; 2026 MarketFly Inc. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> in India
                    </p>
                </div>
            </div>
        </footer>
    );
}
