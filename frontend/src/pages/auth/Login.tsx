import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, Loader2, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { ArtisticBackground } from './ArtisticBackground';


export default function Login() {
    const [step, setStep] = useState<'role' | 'phone' | 'otp'>('role');
    const [role, setRole] = useState<'user' | 'vendor' | 'admin'>('user');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        if (phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            await api.post('/auth/send-otp', { phone });
            // API sends OTP. Move to OTP step.
            setStep('otp');
        } catch (error) {
            console.error('Failed to send OTP', error);
            setError('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length < 6) {
            setError('Please enter the 6-digit code');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/verify', { phone, otp, role });
            const { accessToken, user } = response.data;
            login(accessToken, user);

            if (user.role === 'vendor') {
                navigate('/vendor/dashboard');
            } else if (user.role === 'user') {
                navigate('/user/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed', error);
            setError('Invalid OTP or login failed.');
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

                <div className="relative z-10 flex gap-4 text-sm font-medium text-gray-500 pointer-events-auto">
                    <span>© 2026 Market Airian</span>
                    <span>•</span>
                    <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex flex-col justify-center p-6 md:p-16 lg:p-24 bg-white relative min-h-screen lg:min-h-0">
                <Link to="/" className="absolute top-8 right-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors group">
                    Back to Home <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <div className="w-full max-w-sm mx-auto space-y-12">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "4rem" }}
                            transition={{ delay: 0.1, duration: 0.4, ease: "circOut" }}
                            className="h-1 bg-primary mb-8 rounded-full"
                        />
                        <AnimatedHeading text={step === 'role' ? 'Get Started' : (step === 'phone' ? 'Verify Identity' : 'Enter Code')} />
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-500 text-lg"
                        >
                            {step === 'role' ? 'Select your account type to begin.' : (step === 'phone' ? 'Enter your mobile number for a secure code.' : `We sent a code to +91 ${phone}`)}
                        </motion.p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 'role' && (
                            <motion.div
                                key="role"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <RoleCard
                                    title="Plan an Event"
                                    description="I want to hire vendors"
                                    active={role === 'user'}
                                    onClick={() => setRole('user')}
                                    delay={0}
                                />
                                <RoleCard
                                    title="List My Business"
                                    description="I am a service provider"
                                    active={role === 'vendor'}
                                    onClick={() => setRole('vendor')}
                                    delay={0.1}
                                />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="pt-8"
                                >
                                    <MagneticButton onClick={() => setStep('phone')} className="w-full h-14 text-lg bg-slate-900 text-white rounded-full">
                                        Continue <ArrowRight className="ml-2 h-5 w-5" />
                                    </MagneticButton>
                                </motion.div>
                            </motion.div>
                        )}

                        {step === 'phone' && (
                            <motion.div
                                key="phone"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <label className="uppercase text-xs font-bold tracking-wider text-gray-500">
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>
                                    <AnimatedInput
                                        placeholder="98765 43210"
                                        value={phone}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setPhone(val);
                                            setError('');
                                        }}
                                        type="tel"
                                        autoFocus
                                        error={error}
                                    />
                                </div>

                                <div className="flex flex-col gap-4 pt-4">
                                    <MagneticButton onClick={handleSendOtp} disabled={isLoading} className="w-full h-14 text-lg bg-slate-900 text-white rounded-full">
                                        {isLoading ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                                        ) : (
                                            'Get OTP'
                                        )}
                                    </MagneticButton>

                                    <Button
                                        variant="ghost"
                                        className="w-full hover:bg-gray-50 text-gray-500"
                                        onClick={() => {
                                            setStep('role');
                                            setError('');
                                        }}
                                        disabled={isLoading}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'otp' && (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <label className="uppercase text-xs font-bold tracking-wider text-gray-500">
                                        Enter OTP <span className="text-red-500">*</span>
                                    </label>
                                    <AnimatedInput
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setOtp(val);
                                            setError('');
                                        }}
                                        type="tel"
                                        autoFocus
                                        error={error}
                                    />
                                </div>

                                <div className="flex flex-col gap-4 pt-4">
                                    <MagneticButton onClick={handleVerifyOtp} disabled={isLoading} className="w-full h-14 text-lg bg-slate-900 text-white rounded-full">
                                        {isLoading ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
                                        ) : (
                                            'Login'
                                        )}
                                    </MagneticButton>

                                    <Button
                                        variant="ghost"
                                        className="w-full hover:bg-gray-50 text-gray-500"
                                        onClick={() => {
                                            setStep('phone');
                                            setError('');
                                        }}
                                        disabled={isLoading}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Change Phone
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// --- Components ---

function AnimatedHeading({ text }: { text: string }) {
    return (
        <h1 className="text-4xl font-heading font-bold text-gray-900 overflow-hidden">
            <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
                className="inline-block"
            >
                {text}
            </motion.span>
        </h1>
    );
}

function RoleCard({ title, description, active, onClick, delay }: { title: string, description: string, active: boolean, onClick: () => void, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-pointer relative p-6 border transition-all duration-300 rounded-xl overflow-hidden ${active
                ? 'border-slate-900 bg-slate-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
        >
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <h3 className={`font-heading font-bold text-xl mb-1 ${active ? 'text-slate-900' : 'text-gray-600'}`}>
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
                <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all duration-300 ${active ? 'border-slate-900 bg-slate-900 text-white scale-110' : 'border-gray-300'
                    }`}>
                    {active && <motion.div layoutId="active-dot" className="h-2 w-2 bg-white rounded-full" />}
                </div>
            </div>
        </motion.div>
    );
}

function AnimatedInput({ value, onChange, placeholder, type, autoFocus, error }: any) {
    const [focused, setFocused] = useState(false);

    return (
        <div className="relative">
            <input
                className="w-full h-14 text-2xl font-serif bg-transparent border-none outline-none placeholder:text-gray-300 text-gray-900 p-0"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                autoFocus={autoFocus}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            {/* Base Border */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200" />

            {/* Animated SVG Border */}
            <svg className="absolute bottom-[-2px] left-0 w-full h-[4px] overflow-visible pointer-events-none">
                <motion.path
                    d={`M0,2 L${window.innerWidth},2`} // Approximation, driven by CSS width
                    stroke="#0f172a"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: focused ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="w-full"
                />
            </svg>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-0 text-sm text-red-500 font-medium"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}

function MagneticButton({ children, onClick, className, disabled }: any) {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((clientX - centerX) * 0.35); // Magnetic strength
        y.set((clientY - centerY) * 0.35);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            onClick={onClick}
            disabled={disabled}
            className={`${className} relative overflow-hidden flex items-center justify-center`}
            style={{ x: mouseX, y: mouseY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="relative z-10 flex items-center">{children}</span>
        </motion.button>
    );
}
