import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, User, Store } from 'lucide-react';

export default function Login() {
    const [step, setStep] = useState<'role' | 'phone'>('role');
    const [role, setRole] = useState<'user' | 'vendor' | 'admin'>('user');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (phone.length < 10) return;
        setIsLoading(true);
        try {
            // Mock login for now or replace with actual verify endpoint
            const response = await api.post('/auth/login', { phone, role });
            const { accessToken, user } = response.data;
            login(accessToken, user);

            if (user.role === 'vendor') {
                navigate('/vendor/onboarding');
            } else if (user.role === 'user') {
                navigate('/user/onboarding');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login failed', error);
            // Demo fallback if backend fails (REMOVE IN PROD)
            if (import.meta.env.DEV) {
                login('demo-token', { role, id: '1', phone });
                if (role === 'vendor') navigate('/vendor/onboarding');
                else navigate('/user/onboarding');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Decorative Image */}
            <div className="hidden lg:block relative overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
                <img
                    src="https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=1974&auto=format&fit=crop"
                    alt="Celebration"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />

                <div className="absolute bottom-20 left-12 right-12 text-white z-30 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8"
                    >
                        <Sparkles className="h-8 w-8 text-primary" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-5xl font-heading font-bold leading-tight"
                    >
                        Turn moments into <br />
                        <span className="text-primary italic">memories.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="text-gray-300 text-lg max-w-md"
                    >
                        Join the most curated community of event professionals and planners.
                    </motion.p>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex items-center justify-center p-8 bg-background relative">
                <Link to="/" className="absolute top-8 right-8 text-sm font-medium hover:text-primary transition-colors">
                    Back to Home
                </Link>

                <div className="w-full max-w-[400px] space-y-8">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-4">
                            <div className="font-heading font-bold text-xl">M</div>
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">
                            {step === 'role' ? 'Welcome Back' : 'Enter Phone Details'}
                        </h1>
                        <p className="text-gray-500">
                            {step === 'role' ? 'Choose your account type to continue.' : 'We will send you a 6-digit code.'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 'role' && (
                            <motion.div
                                key="role"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid gap-4"
                            >
                                <div
                                    onClick={() => setRole('user')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${role === 'user' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">Plan an Event</div>
                                        <div className="text-sm text-gray-500">I want to hire vendors</div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setRole('vendor')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${role === 'vendor' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${role === 'vendor' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        <Store className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">List My Business</div>
                                        <div className="text-sm text-gray-500">I am a service provider</div>
                                    </div>
                                </div>

                                <Button size="lg" className="w-full mt-4 rounded-full" onClick={() => setStep('phone')}>
                                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 'phone' && (
                            <motion.div
                                key="phone"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input
                                        placeholder="98765 43210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="h-12 text-lg"
                                        type="tel"
                                    />
                                </div>
                                <Button size="lg" className="w-full rounded-full" onClick={handleLogin} disabled={phone.length < 10 || isLoading}>
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </Button>
                                <Button variant="ghost" className="w-full" onClick={() => setStep('role')}>Back</Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
