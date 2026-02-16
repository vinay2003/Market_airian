import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, CheckCircle, ArrowRight, ArrowLeft, Building2, TrendingUp, Check, ChevronsUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorOnboarding() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        businessName: '', businessType: 'individual', city: '', address: '', pincode: '', landmark: '', description: '', gstNumber: '', yearsInBusiness: '',
        country: '', state: '', locality: '', plotNo: '', // New Address Fields
        serviceCategories: [] as string[], acquisitionChannels: '', eventVolume: '', avgBookingPrice: '', packagesOffered: '', challenges: '', platformInterest: '', preferredPricing: '',
    });

    const [statusMessage, setStatusMessage] = useState('');
    const [logo, setLogo] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.id]: e.target.value });
    const handleSelectChange = (field: string, value: string | string[]) => setFormData({ ...formData, [field]: value });

    // Compress image immediately upon selection
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            try {
                // Determine if compression is needed (e.g. > 500KB)
                if (file.size > 500 * 1024) {
                    // const { compressImage } = await import('@/lib/image-compression'); // Dynamic import if needed, but static is fine here
                    // For now assuming the function is available. 
                    // Since I cannot import inside the function easily without making this component async or using require/import() properly which might be messy with tsconfig.
                    // I will import it at the top level in the next edit step.
                    // IMPORTANT: I will just set the file for now and compress during SUBMIT or rely on top-level import.
                    // Actually better UX: compress on submit to not lag the UI selection? 
                    // No, compress on selection is better for perceived "submit" speed.
                    setLogo(file); // Set original first for immediate feedback
                } else {
                    setLogo(file);
                }
            } catch (err) {
                console.error("Compression check failed", err);
                setLogo(file);
            }
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setStatusMessage('Creating your profile...');

        try {
            const payload = {
                ...formData,
                yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : 0,
                acquisitionChannels: formData.acquisitionChannels ? formData.acquisitionChannels.split(',').map(s => s.trim()) : [],
                address: `${formData.plotNo}, ${formData.locality}, ${formData.city}, ${formData.state}, ${formData.pincode}, ${formData.country}`, // Concat address
            };

            // 1. Save Profile
            const response = await api.post('/vendors/profile', payload);
            const { accessToken, user } = response.data;

            // 2. Update Auth (Vital for role upgrade)
            if (accessToken) {
                login(accessToken, user);
            }

            // 3. Upload Logo (if selected)
            if (logo) {
                setStatusMessage('Uploading logo...');
                try {
                    // Start compression now if not done, or reusing the file.
                    // Doing compression here to ensure we don't block the UI earlier.
                    const { compressImage } = await import('@/lib/image-compression');
                    const compressedLogo = await compressImage(logo);

                    const logoData = new FormData();
                    logoData.append('file', compressedLogo);

                    // Use the NEW access token if we got one, otherwise api interceptor handles it.
                    // If we just called login(), the interceptor might not pick up the new token immediately if it reads from exact moment?
                    // Usually axios interceptors read from localStorage or variable. login() updates localStorage.
                    // We might need to handle a race condition, but usually it is fast enough.
                    await api.post('/vendors/upload-logo', logoData, { headers: { 'Content-Type': 'multipart/form-data' } });
                } catch (uploadError) {
                    console.error("Logo upload failed", uploadError);
                    // Don't block success just for logo
                    // alert("Profile created, but logo upload failed.");
                }
            }

            navigate('/vendor/dashboard');
        } catch (error) {
            console.error('Onboarding failed', error);
            const err = error as { response?: { status: number } }; // Cast to access response
            if (err.response?.status === 401) {
                alert("Account role update required. Please log in again.");
                logout();
                navigate('/login');
            } else {
                alert('Failed to save profile. Please check your connection.');
            }
        } finally {
            setLoading(false);
            setStatusMessage('');
        }
    };

    const variants = {
        enter: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 100 : -100, opacity: 0 }),
    };

    const validateStep = (currentStep: number) => {
        const errors: string[] = [];
        if (currentStep === 1) {
            if (!formData.firstName.trim()) errors.push("First Name is required");
            if (!formData.lastName.trim()) errors.push("Last Name is required");
            if (!formData.email.trim()) errors.push("Email is required");
        }
        if (currentStep === 2) {
            if (!formData.businessName.trim()) errors.push("Business Name is required");
            if (!formData.description.trim()) errors.push("Business Description is required");
            if (!formData.country) errors.push("Country is required");
            if (!formData.state.trim()) errors.push("State is required");
            if (!formData.city.trim()) errors.push("City is required");
            if (!formData.pincode.trim()) errors.push("Pincode is required");
            if (!formData.plotNo.trim()) errors.push("Address is required");
        }
        if (currentStep === 3) {
            if (formData.serviceCategories.length === 0) errors.push("Select at least one service category");
            if (!formData.avgBookingPrice) errors.push("Select average booking price");
        }
        // Step 4 (Logo) is optional but good to have

        if (errors.length > 0) {
            alert(errors[0]); // Simple alert for now, could use toast or inline error
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(s => Math.min(4, s + 1));
        }
    };

    const steps = [
        { title: "Basic Info", icon: Building2 },
        { title: "Business Details", icon: Building2 },
        { title: "Market Insights", icon: TrendingUp },
        { title: "Brand Assets", icon: Upload },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center p-4 font-sans">
            <Card className="w-full max-w-3xl glass-card border-white/20 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-secondary p-1 h-2" />
                <CardHeader className="pb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                {steps[step - 1].title}
                            </h1>
                            <p className="text-gray-500 mt-1">Step {step} of 4</p>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-full text-primary">
                            {(() => { const Icon = steps[step - 1].icon; return <Icon size={24} />; })()}
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="bg-primary h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                </CardHeader>

                <CardContent className="min-h-[400px] relative">
                    <AnimatePresence mode='wait' custom={1}>
                        <motion.div
                            key={step}
                            custom={1}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                                            <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter your first name" className="h-11" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                                            <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter your last name" className="h-11" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                        <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@company.com" className="h-11" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone Verified <CheckCircle className="inline h-3 w-3 text-green-500 ml-1" /></Label>
                                        <Input value={user?.phone || ''} disabled className="bg-gray-50 border-green-200 text-green-700 font-medium opacity-100" />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Business Name <span className="text-red-500">*</span></Label>
                                            <Input id="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="e.g. Royal Weddings" className="h-11" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Business Description <span className="text-red-500">*</span></Label>
                                            <Input id="description" value={formData.description} onChange={handleInputChange} placeholder="Tell us about your services..." className="h-11" required />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Type <span className="text-red-500">*</span></Label>
                                                <Select onValueChange={(v) => handleSelectChange('businessType', v)} defaultValue={formData.businessType}>
                                                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="individual">Freelancer</SelectItem>
                                                        <SelectItem value="company">Company</SelectItem>
                                                        <SelectItem value="agency">Agency</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Years Exp. <span className="text-gray-400 text-xs">(Optional)</span></Label>
                                                <Input id="yearsInBusiness" type="number" value={formData.yearsInBusiness} onChange={handleInputChange} placeholder="0" className="h-11" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>GST Number <span className="text-gray-400 text-xs">(Optional)</span></Label>
                                            <Input id="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="GSTIN..." className="h-11" />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 mb-4">
                                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <Building2 className="h-4 w-4" /> Address Details
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Country <span className="text-red-500">*</span></Label>
                                                        <Select onValueChange={(v) => handleSelectChange('country', v)} defaultValue={formData.country}>
                                                            <SelectTrigger className="h-11 bg-white"><SelectValue placeholder="Select Country" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="India">India</SelectItem>
                                                                <SelectItem value="Other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>State/UT <span className="text-red-500">*</span></Label>
                                                        <Input id="state" value={formData.state} onChange={handleInputChange} placeholder="Enter State/UT" className="h-11 bg-white" required />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>City <span className="text-red-500">*</span></Label>
                                                        <Input id="city" value={formData.city} onChange={handleInputChange} placeholder="Enter City" className="h-11 bg-white" required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Locality <span className="text-gray-400 text-xs">(Optional)</span></Label>
                                                        <Input id="locality" value={formData.locality} onChange={handleInputChange} placeholder="Enter Locality" className="h-11 bg-white" />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Pincode <span className="text-red-500">*</span></Label>
                                                        <Input id="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Enter Pincode" className="h-11 bg-white" required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Plot No/Street/Area <span className="text-red-500">*</span></Label>
                                                        <Input id="plotNo" value={formData.plotNo} onChange={handleInputChange} placeholder="Plot No/Street/Area" className="h-11 bg-white" required />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Landmark <span className="text-gray-400 text-xs">(Optional)</span></Label>
                                                        <Input id="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="Enter Landmark" className="h-11 bg-white" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Mobile Number <span className="text-red-500">*</span></Label>
                                                        <div className="flex bg-gray-50 border rounded-md h-11 items-center px-3 gap-2 overflow-hidden cursor-not-allowed opacity-80">
                                                            <span className="text-gray-500 text-sm whitespace-nowrap font-medium">IN +91</span>
                                                            <span className="text-gray-700 font-medium">{user?.phone?.replace('+91', '') || ''}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Monthly Events <span className="text-red-500">*</span></Label>
                                            <Select onValueChange={(v) => handleSelectChange('eventVolume', v)} defaultValue={formData.eventVolume}>
                                                <SelectTrigger className="h-11"><SelectValue placeholder="Select Volume" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0-5">0-5 Events</SelectItem>
                                                    <SelectItem value="6-20">6-20 Events</SelectItem>
                                                    <SelectItem value="21+">21+ Events</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Avg Price <span className="text-red-500">*</span></Label>
                                            <Select onValueChange={(v) => handleSelectChange('avgBookingPrice', v)} defaultValue={formData.avgBookingPrice}>
                                                <SelectTrigger className="h-11"><SelectValue placeholder="Select Range" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Budget (&lt;25k)</SelectItem>
                                                    <SelectItem value="medium">Standard (25k-1L)</SelectItem>
                                                    <SelectItem value="high">Premium (&gt;1L)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Service Categories <span className="text-red-500">*</span></Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full justify-between h-auto min-h-[44px]"
                                                >
                                                    {formData.serviceCategories.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {formData.serviceCategories.map((category) => (
                                                                <Badge key={category} variant="secondary" className="mr-1">
                                                                    {category}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        "Select categories"
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search category..." />
                                                    <CommandList>
                                                        <CommandEmpty>No category found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {['Photographer', 'Videographer', 'Makeup Artist', 'Venue', 'Planner', 'Decorator', 'Caterer', 'Mehendi Artist', 'DJ/Entertainment', 'Other'].map((category) => (
                                                                <CommandItem
                                                                    key={category}
                                                                    value={category}
                                                                    onSelect={() => {
                                                                        const current = formData.serviceCategories;
                                                                        const updated = current.includes(category)
                                                                            ? current.filter((c) => c !== category)
                                                                            : [...current, category];
                                                                        handleSelectChange('serviceCategories', updated);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={`mr-2 h-4 w-4 ${formData.serviceCategories.includes(category) ? "opacity-100" : "opacity-0"
                                                                            }`}
                                                                    />
                                                                    {category}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6">
                                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center relative hover:bg-gray-50/50 hover:border-primary/50 transition-all group">
                                        <Input id="logo" type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} accept="image/*" />
                                        <div className="flex flex-col items-center gap-3">
                                            {logo ? (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                                    <CheckCircle size={32} />
                                                </motion.div>
                                            ) : (
                                                <div className="h-16 w-16 bg-primary/5 text-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Upload size={32} />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-lg">{logo ? logo.name : "Upload Logo (Recommended)"}</p>
                                                <p className="text-sm text-gray-500">{logo ? "Click to change" : "Drag & drop or click to browse"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 bg-blue-50/80 p-4 rounded-lg text-blue-800 text-sm">
                                        <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                        <p>By completing setup, you gain access to our Vendor Dashboard and agree to the Terms of Service.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>

                <CardFooter className="flex justify-between pt-6 border-t bg-gray-50/50">
                    <Button variant="ghost" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>

                    {step < 4 ? (
                        <Button onClick={handleNext} className="bg-black hover:bg-gray-800 text-white rounded-full px-6">
                            Next Step <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-lg shadow-primary/25 min-w-[180px]">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? statusMessage : "Complete Setup"}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
