import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowUpRight } from 'lucide-react';
import { ArtisticBackground } from './ArtisticBackground';
import { BRAND } from '@/lib/constants';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('auth/login', { email, password });
            // Assume response data contains: { accessToken, vendor }
            const { accessToken, vendor } = response.data;
            login(accessToken, vendor);
            navigate('/vendor/dashboard');
        } catch (error: any) {
            console.error('Login failed', error);
            setError(error.response?.data?.message || 'Invalid email or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#faf9f6] text-[#1a1a1a] font-sans selection:bg-primary/20">
            {/* Left: Artistic Canvas */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-[#f4f1ea]">
                <ArtisticBackground />

                <div className="relative z-10 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                    >
                        <h2 className="text-6xl font-heading font-bold leading-tight tracking-tighter mb-6">
                            Where <span className="italic font-serif text-primary">moments</span> <br />
                            become art.
                        </h2>
                        <p className="text-lg text-gray-600 max-w-md leading-relaxed">
                            Join a curated community of creators, planners, and visionaries designed to elevate every celebration.
                        </p>
                    </motion.div>
                </div>

                <div className="relative z-10 flex gap-4 text-sm font-medium text-gray-500 flex-col">
                    <span>Vendor Portal access only.</span>
                    <div className="flex gap-4 pointer-events-auto">
                        <span>© {BRAND.year} {BRAND.fullName}</span>
                        <span>•</span>
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex flex-col justify-center p-6 md:p-16 lg:p-24 bg-white relative min-h-screen lg:min-h-0 shadow-[rgba(17,_17,_26,_0.05)_0px_0px_16px]">
                <Link to="/" className="absolute top-8 right-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors group">
                    Back to Home <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <div className="w-full max-w-md mx-auto space-y-10">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "4rem" }}
                            transition={{ delay: 0.1, duration: 0.4, ease: "circOut" }}
                            className="h-1 bg-primary mb-6 rounded-full"
                        />
                        <h1 className="text-4xl font-heading font-bold text-gray-900">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Login to manage your vendor business.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="uppercase text-xs font-bold tracking-wider text-gray-500 block mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full h-12 text-lg border-b-2 border-gray-200 focus:border-slate-900 outline-none bg-transparent transition-colors placeholder:text-gray-300"
                                        placeholder="vendor@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError('');
                                        }}
                                        type="email"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="uppercase text-xs font-bold tracking-wider text-gray-500 block mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full h-12 text-lg border-b-2 border-gray-200 focus:border-slate-900 outline-none bg-transparent transition-colors placeholder:text-gray-300 pr-10"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 focus:ring-opacity-25 transition-colors cursor-pointer"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-slate-900 hover:text-primary transition-colors hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-500 font-medium"
                            >
                                {error}
                            </motion.p>
                        )}

                        <div className="flex flex-col gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 text-lg bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging in...</>
                                ) : (
                                    'Sign In'
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-500 mt-4">
                                Don't have a vendor account?{' '}
                                <Link to="/register-vendor" className="font-semibold text-slate-900 hover:text-primary transition-colors underline-offset-4 hover:underline">
                                    Register now
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
