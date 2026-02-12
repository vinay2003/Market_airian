import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export function PublicLayout() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <span className="font-heading font-bold text-xl">Market Airian</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link to="/marketplace" className="hover:text-primary transition-colors">Find Vendors</Link>
                        <Link to="/inspiration" className="hover:text-primary transition-colors">Inspiration</Link>
                        <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link to={user.role === 'vendor' ? '/vendor/dashboard' : '/user/dashboard'}>
                                <Button>Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost">Log in</Button>
                                </Link>
                                <Link to="/login">
                                    <Button>Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 pt-16">
                <Outlet />
            </main>

            <footer className="bg-slate-900 text-white py-12">
                <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-heading font-bold text-xl">Market Airian</h3>
                        <p className="text-slate-400 text-sm">Elevating events with curated professionals.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/marketplace" className="hover:text-white">Browse Vendors</Link></li>
                            <li><Link to="/vendor/onboarding" className="hover:text-white">List Your Business</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Contact</h4>
                        <p className="text-sm text-slate-400">support@marketairian.com</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
