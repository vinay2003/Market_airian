import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowUpRight, ArrowLeft, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ChevronsUpDown, Building2 } from 'lucide-react';
import { ArtisticBackground } from '../auth/ArtisticBackground';
import { BRAND } from '@/lib/constants';

// ─── Shared label style (matches Login/ForgotPassword) ────────────────────────
const LABEL = 'uppercase text-xs font-bold tracking-wider text-gray-500 block mb-2';
const INPUT = 'w-full h-12 text-base border-b-2 border-gray-200 focus:border-slate-900 outline-none bg-transparent transition-colors placeholder:text-gray-300';

const SERVICE_CATEGORIES = [
    'Photographer', 'Videographer', 'Makeup Artist', 'Venue',
    'Planner', 'Decorator', 'Caterer', 'Mehendi Artist', 'DJ/Entertainment', 'Other',
];

const STEPS = [
    { label: 'Account Info' },
    { label: 'Business Details' },
    { label: 'Service Profile' },
];

export default function VendorOnboarding() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [statusMsg, setMsg] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        password: '', confirmPassword: '',
        businessName: '', businessType: 'individual',
        country: '', state: '', city: '', locality: '', plotNo: '', pincode: '', landmark: '',
        description: '', gstNumber: '', yearsInBusiness: '',
        serviceCategories: [] as string[],
        acquisitionChannels: '', eventVolume: '', avgBookingPrice: '',
        packagesOffered: '', challenges: '', platformInterest: '', preferredPricing: '',
    });

    const set = (field: string, value: string | string[]) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const onInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        set(e.target.id, e.target.value);

    const validate = (s: number): string => {
        if (s === 1) {
            if (!form.firstName.trim()) return 'First Name is required.';
            if (!form.lastName.trim()) return 'Last Name is required.';
            if (!form.email.trim()) return 'Email is required.';
            if (form.phone.length < 10) return 'Valid 10-digit phone number is required.';
            if (form.password.length < 8) return 'Password must be at least 8 characters.';
            if (form.password !== form.confirmPassword) return 'Passwords do not match.';
        }
        if (s === 2) {
            if (!form.businessName.trim()) return 'Business Name is required.';
            if (!form.description.trim()) return 'Business Description is required.';
            if (!form.country) return 'Country is required.';
            if (!form.state.trim()) return 'State is required.';
            if (!form.city.trim()) return 'City is required.';
            if (!form.pincode.trim()) return 'Pincode is required.';
            if (!form.plotNo.trim()) return 'Street/Plot No. is required.';
        }
        if (s === 3) {
            if (form.serviceCategories.length === 0) return 'Select at least one service category.';
            if (!form.avgBookingPrice) return 'Select an average booking price range.';
        }
        return '';
    };

    const handleNext = () => {
        const err = validate(step);
        if (err) { setError(err); return; }
        setError('');
        setStep(s => Math.min(3, s + 1));
    };

    const handleSubmit = async () => {
        const err = validate(3);
        if (err) { setError(err); return; }
        setLoading(true);
        setMsg('Creating your account…');
        setError('');
        try {
            const authRes = await api.post('/auth/register-vendor', {
                email: form.email, password: form.password, phone: form.phone,
                businessName: form.businessName, category: form.serviceCategories[0] || 'Other', city: form.city,
            });
            const { accessToken, vendor } = authRes.data;
            if (accessToken) login(accessToken, vendor);

            setMsg('Saving your profile…');
            await api.post('/vendors/profile', {
                ...form,
                yearsInBusiness: form.yearsInBusiness ? parseInt(form.yearsInBusiness) : 0,
                acquisitionChannels: form.acquisitionChannels
                    ? form.acquisitionChannels.split(',').map(s => s.trim())
                    : [],
                address: `${form.plotNo}, ${form.locality}, ${form.city}, ${form.state}, ${form.pincode}, ${form.country}`,
            }, { headers: { Authorization: `Bearer ${accessToken}` } });

            setMsg('Success! Redirecting…');
            setTimeout(() => navigate('/vendor/dashboard'), 1000);
        } catch (e: any) {
            setError(e.response?.data?.message || 'Registration failed. Please check your inputs.');
        } finally {
            setLoading(false);
            setMsg('');
        }
    };

    const slideVariants = {
        enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d: number) => ({ x: d < 0 ? 40 : -40, opacity: 0 }),
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#faf9f6] text-[#1a1a1a] font-sans selection:bg-primary/20">

            {/* ── Left: Artistic Canvas (identical to Login) ─────────── */}
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
                            Join a curated community of creators, planners, and visionaries — and bring your business to thousands of event seekers.
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

            {/* ── Right: Multi-step Form ─────────────────────────────── */}
            <div className="flex flex-col justify-center p-6 md:p-16 lg:p-12 xl:p-20 bg-white relative min-h-screen lg:min-h-0 shadow-[rgba(17,17,26,0.05)_0px_0px_16px] overflow-y-auto">
                <Link
                    to="/"
                    className="absolute top-8 right-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors group"
                >
                    Back to Home <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <div className="w-full max-w-md mx-auto space-y-8 py-12 lg:py-0">

                    {/* Header */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '4rem' }}
                            transition={{ delay: 0.1, duration: 0.4, ease: 'circOut' }}
                            className="h-1 bg-primary mb-6 rounded-full"
                        />
                        <h1 className="text-4xl font-heading font-bold text-gray-900">
                            List Your Business
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Join {BRAND.name} and reach thousands of event planners.
                        </p>
                    </div>

                    {/* Step pills */}
                    <div className="flex items-center gap-1">
                        {STEPS.map((s, i) => {
                            const num = i + 1;
                            return (
                                <div key={s.label} className="flex items-center gap-1 flex-1 min-w-0">
                                    <div className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${step === num ? 'text-slate-900' : step > num ? 'text-primary' : 'text-gray-300'}`}>
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 transition-colors ${step === num ? 'border-slate-900 bg-slate-900 text-white' : step > num ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-300'}`}>
                                            {step > num ? <Check className="w-2.5 h-2.5" aria-hidden="true" /> : num}
                                        </span>
                                        <span className="hidden sm:block truncate">{s.label}</span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className={`flex-1 h-px mx-2 transition-colors ${step > num ? 'bg-primary' : 'bg-gray-200'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Sliding form steps */}
                    <AnimatePresence mode="wait" custom={1}>
                        <motion.div
                            key={step}
                            custom={1}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="space-y-6"
                        >
                            {/* ── Step 1: Account Info ─────────────────── */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={LABEL}>First Name <span className="text-red-500">*</span></label>
                                            <input id="firstName" className={INPUT} value={form.firstName} onChange={onInput} placeholder="Rahul" />
                                        </div>
                                        <div>
                                            <label className={LABEL}>Last Name <span className="text-red-500">*</span></label>
                                            <input id="lastName" className={INPUT} value={form.lastName} onChange={onInput} placeholder="Sharma" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={LABEL}>Email Address <span className="text-red-500">*</span></label>
                                        <input id="email" type="email" className={INPUT} value={form.email} onChange={onInput} placeholder="you@company.com" autoComplete="email" />
                                    </div>
                                    <div>
                                        <label className={LABEL}>Phone Number <span className="text-red-500">*</span></label>
                                        <input id="phone" type="tel" className={INPUT} value={form.phone} onChange={onInput} placeholder="9876543210" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={LABEL}>Password <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <input id="password" type={showPwd ? 'text' : 'password'} className={`${INPUT} pr-10`} value={form.password} onChange={onInput} placeholder="Min. 8 chars" />
                                                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2" aria-label={showPwd ? 'Hide password' : 'Show password'}>
                                                    {showPwd ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className={LABEL}>Confirm <span className="text-red-500">*</span></label>
                                            <input id="confirmPassword" type={showPwd ? 'text' : 'password'} className={INPUT} value={form.confirmPassword} onChange={onInput} placeholder="••••••••" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 2: Business Details ──────────────── */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className={LABEL}>Business Name <span className="text-red-500">*</span></label>
                                        <input id="businessName" className={INPUT} value={form.businessName} onChange={onInput} placeholder="e.g. Royal Weddings Studio" />
                                    </div>
                                    <div>
                                        <label className={LABEL}>Business Description <span className="text-red-500">*</span></label>
                                        <textarea
                                            id="description"
                                            value={form.description}
                                            onChange={onInput}
                                            placeholder="What services do you offer? What makes you stand out?"
                                            rows={2}
                                            className="w-full text-base border-b-2 border-gray-200 focus:border-slate-900 outline-none bg-transparent transition-colors placeholder:text-gray-300 resize-none pt-2"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={LABEL}>Business Type</label>
                                            <Select onValueChange={v => set('businessType', v)} defaultValue={form.businessType}>
                                                <SelectTrigger className="h-12 border-0 border-b-2 border-gray-200 focus:border-slate-900 rounded-none px-0 bg-transparent text-base">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="individual">Freelancer</SelectItem>
                                                    <SelectItem value="company">Company</SelectItem>
                                                    <SelectItem value="agency">Agency</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className={LABEL}>Years of Exp.</label>
                                            <input id="yearsInBusiness" type="number" className={INPUT} value={form.yearsInBusiness} onChange={onInput} placeholder="e.g. 3" />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="pt-2">
                                        <p className="uppercase text-xs font-bold tracking-wider text-gray-400 flex items-center gap-1.5 mb-4">
                                            <Building2 className="w-3.5 h-3.5" aria-hidden="true" /> Business Address
                                        </p>
                                        <div className="space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className={LABEL}>Country <span className="text-red-500">*</span></label>
                                                    <Select onValueChange={v => set('country', v)} defaultValue={form.country}>
                                                        <SelectTrigger className="h-12 border-0 border-b-2 border-gray-200 focus:border-slate-900 rounded-none px-0 bg-transparent text-base">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="India">India</SelectItem>
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className={LABEL}>State/UT <span className="text-red-500">*</span></label>
                                                    <input id="state" className={INPUT} value={form.state} onChange={onInput} placeholder="Bihar" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className={LABEL}>City <span className="text-red-500">*</span></label>
                                                    <input id="city" className={INPUT} value={form.city} onChange={onInput} placeholder="Patna" />
                                                </div>
                                                <div>
                                                    <label className={LABEL}>Pincode <span className="text-red-500">*</span></label>
                                                    <input id="pincode" className={INPUT} value={form.pincode} onChange={onInput} placeholder="800001" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className={LABEL}>Plot / Street <span className="text-red-500">*</span></label>
                                                    <input id="plotNo" className={INPUT} value={form.plotNo} onChange={onInput} placeholder="Plot No, Street" />
                                                </div>
                                                <div>
                                                    <label className={LABEL}>GST Number</label>
                                                    <input id="gstNumber" className={INPUT} value={form.gstNumber} onChange={onInput} placeholder="GSTIN (optional)" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 3: Service Profile ───────────────── */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className={LABEL}>Service Categories <span className="text-red-500">*</span></label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="w-full flex items-center justify-between border-b-2 border-gray-200 hover:border-slate-900 transition-colors py-3 text-base bg-transparent outline-none focus:border-slate-900">
                                                    {form.serviceCategories.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {form.serviceCategories.map(c => (
                                                                <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-300">Select categories…</span>
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search category…" />
                                                    <CommandList>
                                                        <CommandEmpty>No category found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {SERVICE_CATEGORIES.map(cat => (
                                                                <CommandItem key={cat} value={cat} onSelect={() => {
                                                                    const current = form.serviceCategories;
                                                                    set('serviceCategories', current.includes(cat)
                                                                        ? current.filter(c => c !== cat)
                                                                        : [...current, cat]);
                                                                }}>
                                                                    <Check className={`mr-2 h-4 w-4 ${form.serviceCategories.includes(cat) ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
                                                                    {cat}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={LABEL}>Monthly Events <span className="text-red-500">*</span></label>
                                            <Select onValueChange={v => set('eventVolume', v)} defaultValue={form.eventVolume}>
                                                <SelectTrigger className="h-12 border-0 border-b-2 border-gray-200 focus:border-slate-900 rounded-none px-0 bg-transparent text-base">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0-5">0–5 events</SelectItem>
                                                    <SelectItem value="6-20">6–20 events</SelectItem>
                                                    <SelectItem value="21+">21+ events</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className={LABEL}>Avg. Price <span className="text-red-500">*</span></label>
                                            <Select onValueChange={v => set('avgBookingPrice', v)} defaultValue={form.avgBookingPrice}>
                                                <SelectTrigger className="h-12 border-0 border-b-2 border-gray-200 focus:border-slate-900 rounded-none px-0 bg-transparent text-base">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Budget (&lt;₹25k)</SelectItem>
                                                    <SelectItem value="medium">Standard (₹25k–1L)</SelectItem>
                                                    <SelectItem value="high">Premium (&gt;₹1L)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-400 leading-relaxed border-t pt-4">
                                        By clicking "Create Account" you agree to {BRAND.fullName}'s Terms of Service and Privacy Policy.
                                        Your profile will go live after a quick review.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Error */}
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-500 font-medium"
                        >
                            {error}
                        </motion.p>
                    )}

                    {/* Navigation */}
                    <div className="flex flex-col gap-4 pt-4">
                        <div className="flex flex-col-reverse sm:flex-row gap-4 w-full">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={() => { setStep(s => s - 1); setError(''); }}
                                    disabled={loading}
                                    className="sm:flex-1 w-full h-14 text-lg bg-gray-100/80 text-gray-700 border border-gray-200 rounded-full font-medium hover:bg-gray-200 hover:text-gray-900 transition-all flex items-center justify-center disabled:opacity-50 active:scale-[0.98]"
                                >
                                    <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" /> Back
                                </button>
                            ) : (
                                <div className="hidden sm:block sm:flex-1" />
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="sm:flex-1 w-full h-14 text-lg bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:scale-[0.98]"
                                >
                                    Continue <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="sm:flex-1 w-full h-14 text-lg bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" /> {statusMsg || 'Creating account…'}</>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            )}
                        </div>

                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-slate-900 hover:text-primary transition-colors underline-offset-4 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
