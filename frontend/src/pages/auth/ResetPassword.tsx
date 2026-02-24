import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ArtisticBackground } from './ArtisticBackground';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const queryEmail = searchParams.get('email');
        if (queryEmail) {
            setEmail(queryEmail);
        }
    }, [searchParams]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !otp || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setIsLoading(true);

        try {
            await api.post('auth/reset-password', { email, code: otp, newPassword: password });

            setIsSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error: any) {
            console.error('Reset password failed', error);
            setError(error.response?.data?.message || 'Failed to reset password. Invalid OTP or request expired.');
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
                    </motion.div>
                </div>

                <div className="relative z-10 flex gap-4 text-sm font-medium text-gray-500 flex-col">
                    <span>Vendor Portal access only.</span>
                    <div className="flex gap-4 pointer-events-auto">
                        <span>© 2026 Market Airian</span>
                        <span>•</span>
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>

            {/* Right: Reset Password Form */}
            <div className="flex flex-col justify-center p-6 md:p-16 lg:p-24 bg-white relative min-h-screen lg:min-h-0 shadow-[rgba(17,_17,_26,_0.05)_0px_0px_16px] overflow-y-auto">
                <Link to="/" className="absolute top-8 right-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors group">
                    Back to Home <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <div className="w-full max-w-sm mx-auto space-y-8 my-auto py-12">
                    {!isSuccess ? (
                        <>
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "4rem" }}
                                    transition={{ delay: 0.1, duration: 0.4, ease: "circOut" }}
                                    className="h-1 bg-primary mb-6 rounded-full"
                                />
                                <h1 className="text-4xl font-heading font-bold text-gray-900">
                                    Create New Password
                                </h1>
                                <p className="text-gray-500 text-lg">
                                    Your new password must be securely chosen.
                                </p>
                            </div>

                            <form onSubmit={handleResetPassword} className="space-y-6">
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
                                                onChange={(e) => setEmail(e.target.value)}
                                                type="email"
                                                autoComplete="email"
                                                readOnly={!!searchParams.get('email')}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="uppercase text-xs font-bold tracking-wider text-gray-500 block mb-2">
                                            6-Digit OTP <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="w-full h-12 text-2xl tracking-widest border-b-2 border-gray-200 focus:border-slate-900 outline-none bg-transparent transition-colors placeholder:text-gray-300 placeholder:tracking-normal"
                                                placeholder="Enter OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                type="text"
                                                maxLength={6}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="uppercase text-xs font-bold tracking-wider text-gray-500 block mb-2">
                                            New Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="w-full h-12 text-lg border-b-2 border-gray-200 focus:border-slate-900 outline-none bg-transparent transition-colors placeholder:text-gray-300 pr-10"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                type={showPassword ? 'text' : 'password'}
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

                                    <div>
                                        <label className="uppercase text-xs font-bold tracking-wider text-gray-500 block mb-2">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="w-full h-12 text-lg border-b-2 border-gray-200 focus:border-slate-900 outline-none bg-transparent transition-colors placeholder:text-gray-300 pr-10"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
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
                                        className="w-full h-14 text-lg bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgb(0,0,0,39%)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-0.5"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Resetting...</>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6 flex flex-col items-center pt-8"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-heading font-bold text-gray-900">Password Reset</h2>
                            <p className="text-gray-500 text-lg">
                                Your password has been successfully reset. Redirecting to login...
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
