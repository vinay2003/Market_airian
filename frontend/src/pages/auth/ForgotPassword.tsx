import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2, ArrowUpRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ArtisticBackground } from './ArtisticBackground';
import { BRAND } from '@/lib/constants';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSendResetLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your registered email address.');
            return;
        }

        setIsLoading(true);

        try {
            await api.post('auth/forgot-password', { email });
            setIsSuccess(true);
        } catch (error: any) {
            console.error('Forgot password failed', error);
            setError('Failed to send reset link. Please try again.');
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
                        <span>© {BRAND.year} {BRAND.fullName}</span>
                        <span>•</span>
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>

            {/* Right: Forgot Password Form */}
            <div className="flex flex-col justify-center p-6 md:p-16 lg:p-24 bg-white relative min-h-screen lg:min-h-0 shadow-[rgba(17,_17,_26,_0.05)_0px_0px_16px]">
                <Link to="/" className="absolute top-8 right-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors group">
                    Back to Home <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <div className="w-full max-w-sm mx-auto space-y-10">
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
                                    Reset Password
                                </h1>
                                <p className="text-gray-500 text-lg">
                                    Enter your email and we'll send you an OTP to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSendResetLink} className="space-y-6">
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
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                                        ) : (
                                            'Send Reset OTP'
                                        )}
                                    </button>

                                    <Link
                                        to="/login"
                                        className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-slate-900 transition-colors mt-4 p-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" /> Back to Login
                                    </Link>
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
                            <h2 className="text-3xl font-heading font-bold text-gray-900">Check your email</h2>
                            <p className="text-gray-500 text-lg">
                                We've sent password reset instructions to <br />
                                <span className="font-medium text-gray-900">{email}</span>
                            </p>

                            <div className="pt-8 w-full">
                                <Link to={`/reset-password?email=${encodeURIComponent(email)}`} className="w-full h-14 text-lg border-2 border-slate-900 text-slate-900 rounded-full font-medium hover:bg-slate-50 transition-colors flex items-center justify-center">
                                    Enter OTP & Reset
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
