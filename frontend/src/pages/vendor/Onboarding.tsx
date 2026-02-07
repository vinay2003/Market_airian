import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, CheckCircle, ArrowRight, ArrowLeft, Building2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorOnboarding() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        businessName: '', businessType: 'individual', city: '', address: '', description: '', gstNumber: '', yearsInBusiness: '',
        acquisitionChannels: '', eventVolume: '', avgBookingPrice: '', packagesOffered: '', challenges: '', platformInterest: '', preferredPricing: '',
    });

    const [logo, setLogo] = useState<File | null>(null);

    const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.id]: e.target.value });
    const handleSelectChange = (field: string, value: string) => setFormData({ ...formData, [field]: value });
    const handleFileChange = (e: any) => { if (e.target.files?.[0]) setLogo(e.target.files[0]); };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...formData,
                yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : 0,
                acquisitionChannels: formData.acquisitionChannels.split(',').map(s => s.trim()),
            };

            // 1. Save Profile
            const response = await api.post('/vendors/profile', payload);
            const { accessToken, user } = response.data;

            // 2. Upload Logo (if selected)
            if (logo) {
                try {
                    const logoData = new FormData();
                    logoData.append('file', logo);
                    await api.post('/vendors/upload-logo', logoData, { headers: { 'Content-Type': 'multipart/form-data' } });
                } catch (uploadError) {
                    console.error("Logo upload failed", uploadError);
                    alert("Profile saved, but logo upload failed. You can upload it later from your dashboard.");
                }
            }

            // 3. Update Auth Context if new token received (role upgrade)
            if (accessToken) {
                // We use the existing login function to update context
                // You might need to import login from context above if not already destructured
                // const { login } = useAuth(); -> check if login is available
                // Assuming login is available from useAuth()
                login(accessToken, user);
            }

            navigate('/vendor/dashboard');
        } catch (error: any) {
            console.error('Onboarding failed', error);
            if (error.response?.status === 401) {
                alert("Account role update required. Please log in again to access Vendor features.");
                logout();
                navigate('/login');
            } else {
                alert('Failed to save profile. Please check your internet connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const variants = {
        enter: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 100 : -100, opacity: 0 }),
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter your first name" className="h-11" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter your last name" className="h-11" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@company.com" className="h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone Verified</Label>
                                        <Input value={user?.phone || ''} disabled className="bg-gray-50 border-green-200 text-green-700 font-medium" />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Business Name</Label>
                                        <Input id="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="e.g. Royal Weddings" className="h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Business Description</Label>
                                        <Input id="description" value={formData.description} onChange={handleInputChange} placeholder="Tell us about your services..." className="h-11" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Type</Label>
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
                                            <Label>Years Exp.</Label>
                                            <Input id="yearsInBusiness" type="number" value={formData.yearsInBusiness} onChange={handleInputChange} placeholder="0" className="h-11" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>GST Number (Optional)</Label>
                                        <Input id="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="GSTIN..." className="h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="Shop 12, Main St..." className="h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Input id="city" value={formData.city} onChange={handleInputChange} placeholder="Operating City" className="h-11" />
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Monthly Events</Label>
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
                                            <Label>Avg Price</Label>
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
                                        <Label>Acquisition Channels</Label>
                                        <Input id="acquisitionChannels" value={formData.acquisitionChannels} onChange={handleInputChange} placeholder="How do clients find you?" className="h-11" />
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
                                                <p className="font-semibold text-lg">{logo ? logo.name : "Upload Logo"}</p>
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
                        <Button onClick={() => setStep(s => Math.min(4, s + 1))} className="bg-black hover:bg-gray-800 text-white rounded-full px-6">
                            Next Step <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-lg shadow-primary/25">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Complete Setup
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
